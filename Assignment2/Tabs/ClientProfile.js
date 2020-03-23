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

class ClientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      userID: '',
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
        this.setState({
          loggedOn: true,
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

  componentDidMount() {
    //this.getAsyncId();
  }

  render() {
    if (this.state.loggedOn) {
      return (
        <View style={styles.pageLay} accessible={true}>
          <Text style={styles.pageTitle}>Logged in Screen</Text>
          <TouchableOpacity
            onPress={() => this.logout()}
            style={styles.buttons}
            accessibilityLabel="Logout"
            accessibilityHint="Press the button to logout"
            accessibilityRole="button">
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.pageLay} accessible={true}>
          <Text style={styles.pageTitle}>Login Screen </Text>

          <Text>Email</Text>
          <TextInput
            placeholder="Email Address"
            style={styles.inputText}
            //value={this.state.email}
            //onChangeText={this.emailManage}
            onChangeText={this.emailManage}
            type="emailAddress"
          />
          <Text>Password</Text>
          <TextInput
            //value={this.state.password}
            placeholder="Account Password"
            style={styles.inputText}
            //onChangeText={this.passManage}
            onChangeText={this.passManage}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={() => this.login()}
            style={styles.buttons}
            accessibilityLabel="Login"
            accessibilityHint="Press the button to login"
            accessibilityRole="button">
            <Text>Login</Text>
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
}

const styles = StyleSheet.create({
  pageLay: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  buttons: {
    alignItems: 'center',
    backgroundColor: '#0070FF',
    padding: 10,
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 3,
    elevation: 2,
  },
  inputText: {
    alignItems: 'center',
    padding: 10,
    marginLeft: 100,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 100,
    borderColor: '#34495E',
    borderRadius: 5,
    borderWidth: 1.5,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  baseText: {
    alignItems: 'center',
    fontSize: 12,
    marginBottom: 5,
  },
  pageTitle: {
    alignItems: 'center',
    marginLeft: 125,
    fontSize: 30,
    marginBottom: 10,
  },
  errorMessage: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    color: 'red',
  },
});

export default ClientProfile;
