import React, {Component} from 'react';
import {
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Avatar} from 'react-native-elements';

class ClientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      upEmail: '',
      upPassword: '',
      password: '',
      userID: '',
      firstName: '',
      upFirstName: '',
      upLastName: '',
      lastName: '',
      xAuth: '',
      validate: '',
      loggedOn: false,
      profileInfo: [],
    };
  }

  updateDetails = () => {
    console.log(this.state.xAuth);
    let res = JSON.stringify({
      given_name: this.state.upFirstName,
      family_name: this.state.upLastName,
      email: this.state.upEmail,
      password: this.state.upPassword,
    });
    console.log(res);
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID, {
      method: 'PATCH',
      body: res,
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': JSON.parse(this.state.xAuth),
      },
    })
      .then(response => {
        console.log(response.status);
      })
      .then(responseJson => {
        Alert.alert('Account created');
      })
      .catch(error => {
        console.error(error);
      });
  };

  getProfile = () => {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          profileInfo: responseJson,
        });
        console.log(
          'First name is ' +
            this.state.profileInfo.given_name +
            ', Last name is ' +
            this.state.profileInfo.family_name,
        );
      })
      .catch(error => {
        console.log('Error = ' + error);
      });
  };

  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadLoggedUser();
      this.getProfile();
    });
    this.loadLoggedUser();
    this.getProfile();
  }

  render() {
    return (
      <View style={styles.mainView} accessible={true}>
        <Text style={styles.pageHead}>Logged in Screen</Text>
        <View style={styles.displayPhotoStyle}>
          <Avatar size="medium" rounded />
        </View>

        <Text style={styles.detailStyle}>
          {"User's ID: "}
          {this.state.userID}
          {'\n'}
          {this.state.profileInfo.given_name}{' '}
          {this.state.profileInfo.family_name}
        </Text>
        <Text style={styles.pageHead}>Account Update</Text>

        <Text style={styles.inputHead}>First name</Text>
        <TextInput
          style={styles.loggedTextStyle}
          defaultValue={this.state.firstName}
          value={this.state.upFirstName}
          onChangeText={upFirstName => this.setState({upFirstName})}
          type="givenName"
        />

        <Text style={styles.inputHead}>Last name</Text>
        <TextInput
          style={styles.loggedTextStyle}
          defaultValue={this.state.lastName}
          value={this.state.upLastName}
          onChangeText={upLastName => this.setState({upLastName})}
          type="familyName"
        />

        <Text style={styles.inputHead}>Email</Text>
        <TextInput
          style={styles.loggedTextStyle}
          defaultValue={this.state.email}
          value={this.state.upEmail}
          onChangeText={upEmail => this.setState({upEmail})}
          type="emailAddress"
        />
        <Text style={styles.inputHead}>Password</Text>
        <TextInput
          style={styles.loggedTextStyle}
          defaultValue={this.state.password}
          value={this.state.upPassword}
          onChangeText={text => this.setState({upPassword: text})}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={() => this.updateDetails()}
          style={styles.buttonStyle}
          accessibilityLabel="Create acount navigation"
          accessibilityHint="Press the button to proceed to the create account screen"
          accessibilityRole="button">
          <Text>Update</Text>
        </TouchableOpacity>
      </View>
    );
  }
  async loadLoggedUser() {
    const currentUserId = await AsyncStorage.getItem('userID');
    const formattedUserId = await JSON.parse(currentUserId);
    const xAuthKey = await AsyncStorage.getItem('xAuth');
    const formattedXAuth = await JSON.parse(xAuthKey);
    this.setState({
      xAuth: formattedXAuth,
      userID: formattedUserId,
    });
    console.log(
      '[SUCCESS] logged Loaded data from user ID: ' +
        this.state.userID +
        ' and x-auth: ' +
        this.state.xAuth,
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',

    backgroundColor: '#101010',

    color: 'white',

    fontSize: 12,
  },

  displayPhotoStyle: {
    alignSelf: 'center',
  },

  textStyle: {
    color: 'white',
    //padding: 10,
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 20,
    marginRight: 10,
    borderColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    height: 80,
    fontSize: 12,
  },
  loggedTextStyle: {
    color: 'white',
    //padding: 10,
    marginLeft: 10,
    marginTop: 5,
    //marginBottom: 20,
    marginRight: 10,
    borderColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    height: 40,
    fontSize: 12,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3,
    elevation: 2,
    marginTop: 10,
    height: 40,
    color: 'white',
  },
  pageHead: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  detailStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  inputHead: {
    fontWeight: 'bold',
    //textAlign: 'center',
    color: 'white',
  },
});
// const styles = StyleSheet.create({
//   pageLay: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: '#ffffff',
//   },
//   buttons: {
//     alignItems: 'center',
//     backgroundColor: '#0070FF',
//     padding: 10,
//     marginLeft: 100,
//     marginRight: 100,
//     borderRadius: 3,
//     elevation: 2,
//   },
//   inputText: {
//     alignItems: 'center',
//     padding: 10,
//     marginLeft: 100,
//     marginTop: 10,
//     marginBottom: 10,
//     marginRight: 100,
//     borderColor: '#34495E',
//     borderRadius: 5,
//     borderWidth: 1.5,
//     backgroundColor: '#ffffff',
//     elevation: 3,
//   },
//   baseText: {
//     alignItems: 'center',
//     fontSize: 12,
//     marginBottom: 5,
//   },
//   pageTitle: {
//     alignItems: 'center',
//     marginLeft: 125,
//     fontSize: 30,
//     marginBottom: 10,
//   },
//   errorMessage: {
//     marginTop: 10,
//     textAlign: 'center',
//     fontSize: 15,
//     color: 'red',
//   },
// });

export default ClientProfile;
