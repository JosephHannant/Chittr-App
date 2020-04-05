/*
  Author Joseph Hannant
  This is the screen that deals with the login and logout of a user
*/
import React, {Component} from 'react';
import {
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
      password: '',
      userID: null,
      xAuth: null,
      loggedOn: false,
      profileInfo: [],
    };
  }
  //These get and set the value of the inputs from the text box and store it in a variable
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
  //Navigation to the create screen
  createNavigator = () => {
    this.props.navigation.navigate('Settings');
  };

  //Function for logging in, takes the inputs and passes them into the post request
  //Checks the response on the request and gives an error if the status code isn't 200
  login = () => {
    if (this.state.email !== '') {
      if (this.state.password !== '') {
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
            if (response.status !== 200) {
              console.log(response.status);
              console.log('Incorrect email');
            }
            return response.json();
          })
          .then(responseJson => {
            this.props.navigation.navigate('Home');
            this.setState({
              userID: JSON.stringify(responseJson.id),
              xAuth: JSON.stringify(responseJson.token),
            });
            console.log('Worked');
            this.storeLoggedUser();
            this.getProfile();
            this.setState({
              firstName: this.state.profileInfo.given_name,
              lastName: this.state.profileInfo.family_name,
            });

            Alert.alert("You're now logged in");
          })
          .catch(error => {
            console.error(error + 'Bad login');
          });
      } else {
        Alert.alert('No password entered');
      }
    } else {
      Alert.alert('No email entered');
    }
  };
  //Function which kicks the user off the account when the logout button is pressed
  //posts logout to the server
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
  //gets the details of the logged in user from the server
  getProfile = () => {
    if (this.state.xAuth === null) {
      this.state.loggedOn = false;
    } else {
      this.state.loggedOn = true;
    }
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
  //This loads the logged user details each time the page is loaded to determ,ine what to show the user
  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadLoggedUser();
    });
    this.loadLoggedUser();
  }
  //render using an if statement to check if a users details are loaded to determine what loads
  render() {
    if (this.state.loggedOn === true) {
      console.log(this.state.userID);
      return (
        <View style={styles.pageBase} accessible={true}>
          <Text style={styles.pageHead}>Logged in Screen</Text>
          <View style={styles.displayPhotoStyle}>
            <Avatar
              size="xlarge"
              rounded
              source={{
                uri:
                  'http://10.0.2.2:3333/api/v0.0.5/user/' +
                  this.state.userID +
                  '/photo?timestamp=' +
                  Date.now(),
              }}
            />
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
        </View>
      );
    } else {
      return (
        <View style={styles.pageBase} accessible={true}>
          <Text style={styles.pageHead}>Login Screen </Text>

          <Text style={styles.inputHead}>Email</Text>
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="white"
            style={styles.textStyle}
            onChangeText={this.emailManage}
            type="emailAddress"
          />
          <Text style={styles.inputHead}>Password</Text>
          <TextInput
            placeholder="Account Password"
            placeholderTextColor="white"
            style={styles.textStyle}
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
  //Async to wipe the stored credentials tor estrict access on other parts of the app
  async userWipe() {
    try {
      await AsyncStorage.removeItem('userID');
      await AsyncStorage.removeItem('xAuth');
      console.log('Success logout');
    } catch (error) {
      console.log(error);
    }
  }
  //Stores the data of the current user who has logged in
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
  //Loads the current user from the async storage
  async loadLoggedUser() {
    const currentUserId = await AsyncStorage.getItem('userID');
    const formattedUserId = await JSON.parse(currentUserId);
    const xAuthKey = await AsyncStorage.getItem('xAuth');
    const formattedXAuth = await JSON.parse(xAuthKey);
    this.setState({
      xAuth: formattedXAuth,
      userID: formattedUserId,
    });
    this.getProfile();
    console.log(
      'Loaded logged userID: ' +
        this.state.userID +
        ' and x-auth: ' +
        this.state.xAuth,
    );
  }
}
//CSS styling sheet used throught the app to supply a consistent theme and improve user experience
const styles = StyleSheet.create({
  pageBase: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
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
    color: 'white',
  },
});

export default ClientProfile;
