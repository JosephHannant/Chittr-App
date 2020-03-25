import React, {Component} from 'react';
import {
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
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

  passManage = text => {
    this.setState({
      password: text,
    });
  };

  emailManage = text => {
    this.setState({
      email: text,
    });
  };
  createNavigator() {
    this.props.navigation.navigate('Create');
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
      //withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': JSON.parse(this.state.xAuth),
      },
    })
      .then(response => {
        console.log(response.status);
        //let res = response.json();
        // console.log(res.status);
        //return res;
      })
      .then(responseJson => {
        Alert.alert('Account created');
      })
      .catch(error => {
        console.error(error);
      });
  };

  login = () => {
    // let userIn = JSON.stringify({
    //   email: this.state.email,
    //   password: this.state.password,
    // });
    //console.log(userIn);
    return fetch('http://10.0.2.2:3333/api/v0.0.5/login', {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status != 200) {
          console.log(response.status);
          //let userIn = response.json();
          console.log('Bad one kiddo');
        }
        return response.json();
      })
      .then(responseJson => {
        this.props.navigation.navigate('Home');
        this.setState({
          userID: JSON.stringify(responseJson.id),
          xAuth: JSON.stringify(responseJson.token),
        });
        console.log('Worked lad');
        this.storeLoggedUser();
        this.getProfile();
        this.setState({
          loggedOn: true,
          firstName: this.state.profileInfo.given_name,
          lastName: this.state.profileInfo.family_name,
        });

        Alert.alert("You're now logged in");
      })
      .catch(error => {
        console.error(error + 'Bad login');
        this.setState({
          validate: 'Wrong one buddy',
        });
      });
  };

  logout = () => {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/logout', {
      method: 'POST',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': JSON.parse(this.state.xAuth),
      },
    })
      .then(response => 'OK')
      .then(responseJson => {
        Alert.alert('You have logged out');
        this.userWipe();
        console.log('Auth = ' + this.xAuth + ', ID = ' + this.userID);
        this.setState({
          loggedOn: false,
        });
      })
      .catch(error => {
        console.log('Error = ' + error);
      });
  };

  getProfile = () => {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          //firstName: responseJson.given_name,
          //lastName: responseJson.family_name,
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
      this.getProfile();
      this.loadLoggedUser();
      if (this.state.userID === null) {
        this.state.loggedOn = false;
      } else {
        this.state.loggedOn = true;
      }
    });
    this.getProfile();
  }

  render() {
    if (this.state.loggedOn) {
      //if (this.state.userID == null) {
      return (
        <View style={styles.mainView} accessible={true}>
          <Text style={styles.pageHead}>Logged in Screen</Text>
          <View style={styles.displayPhotoStyle}>
            <Avatar size="xlarge" rounded />
          </View>

          <Text style={styles.detailStyle}>
            {"User's ID: "}
            {this.state.userID}
            {'\n'}
            {this.state.profileInfo.given_name}{' '}
            {this.state.profileInfo.family_name}
          </Text>
          <TouchableOpacity
            onPress={() => this.logout()}
            style={styles.buttonStyle}
            accessibilityLabel="Logout"
            accessibilityHint="Press the button to logout"
            accessibilityRole="button">
            <Text>Logout</Text>
          </TouchableOpacity>
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
            <Text>Create</Text>
          </TouchableOpacity>
          <Text style={styles.detailStyle}>
            {"User's ID: "}
            {this.state.userID}
            {'\n'}
            {this.state.profileInfo.given_name}{' '}
            {this.state.profileInfo.family_name}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.mainView} accessible={true}>
          <Text style={styles.pageHead}>Login Screen </Text>

          <Text style={styles.inputHead}>Email</Text>
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="white"
            style={styles.textStyle}
            //value={this.state.email}
            //onChangeText={this.emailManage}
            onChangeText={this.emailManage}
            type="emailAddress"
          />
          <Text style={styles.inputHead}>Password</Text>
          <TextInput
            //value={this.state.password}
            placeholder="Account Password"
            placeholderTextColor="white"
            style={styles.textStyle}
            //onChangeText={this.passManage}
            onChangeText={this.passManage}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={() => this.login()}
            style={styles.buttonStyle}
            accessibilityLabel="Login"
            accessibilityHint="Press the button to login"
            accessibilityRole="button">
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.createNavigator()}
            style={styles.buttonStyle}
            accessibilityLabel="Create acount navigation"
            accessibilityHint="Press the button to proceed to the create account screen"
            accessibilityRole="button">
            <Text>Create acount</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  async userWipe() {
    try {
      await AsyncStorage.removeItem('userID');
      await AsyncStorage.removeItem('xAuth');
      console.log('Success logout');
    } catch (error) {
      console.log(error);
    }
  }

  async storeLoggedUser() {
    try {
      await AsyncStorage.setItem('userID', JSON.stringify(this.state.userID));
      await AsyncStorage.setItem('xAuth', JSON.stringify(this.state.xAuth));
      let userIDC = await AsyncStorage.getItem('userID');
      let xAuthC = await AsyncStorage.getItem('xAuth');

      console.log('user = ' + userIDC + ' auth = ' + xAuthC);
    } catch (error) {
      console.log('Error = ' + error);
    }
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
      '[SUCCESS] Loaded data from user ID: ' +
        this.state.userID +
        ' and x-auth: ' +
        this.state.xAuth,
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,

    // Set content's vertical alignment.
    //justifyContent: 'center',

    // Set content's horizontal alignment.
    //alignItems: 'center',
    flexDirection: 'column',

    // Set hex color code here.
    backgroundColor: '#101010',

    color: 'white',

    fontSize: 12,
  },

  displayPhotoStyle: {
    alignSelf: 'center',
    paddingTop: 10,
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
    marginBottom: 20,
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
