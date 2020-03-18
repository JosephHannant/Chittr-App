import React, {Component} from 'react';
import {Text, TextInput, Button, View, Alert, AsyncStorage} from 'react-native';

class ClientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      given_name: '',
      family_name: '',
      email: '',
      password: '',
      userID: '',
      loggedOn: false,
      profileInfo: [],
    };
  }

  asyncID = async id => {
    try {
      await AsyncStorage.setItem('@id', JSON.stringify(id));
    } catch (error) {
      console.log(error);
    }
  };

  logTokenStorage = async token => {
    try {
      await AsyncStorage.setItem('@logintoken', token);
    } catch (e) {
      console.error(e);
    }
  };

  getAsyncId = async () => {
    try {
      const content = await AsyncStorage.getItem('@id');
      if (content != null) {
        this.setState({userID: content});
      }
    } catch (e) {
      console.error(e);
    }
  };

  create = () => {
    let userIn = JSON.stringify({
      given_name: this.state.given_name,
      family_name: this.state.family_name,
      email: this.state.email,
      password: this.state.password,
    });
    console.log(userIn);
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user', {
      method: 'POST',
      body: userIn,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response.status);
        let userIn = response.json();
        // console.log(userIn.status);
        return userIn;
      })
      .then(responseJson => {
        console.log(responseJson.token);
      })
      .catch(error => {
        console.error(error);
      });
  };

  login = () => {
    let userIn = JSON.stringify({
      email: this.state.email,
      password: this.state.password,
    });
    console.log(userIn);
    return fetch('http://10.0.2.2:3333/api/v0.0.5/login', {
      method: 'POST',
      body: userIn,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response.status);
        let userIn = response.json();
        // console.log(res.status);
        return userIn;
      })
      .then(responseJson => {
        console.log(responseJson.token);
        Alert.alert('Successful login');
        this.retrieveUserData(() => {
          this.asyncID(responseJson.id);
          this.logTokenStorage(responseJson.token);
          this.setState({
            loggedOn: true,
          });
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  retrieveUserData(cred) {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID, {
      method: 'GET',
    })
      .then(retrieved => retrieved.json())
      .then(retrievedJson => {
        this.setState(
          {
            profileInfo: retrievedJson,
          },
          () => {
            cred();
          },
        );
      });
    //   .catch(error =>{
    //       console.log(error);
    //   })
  }

  componentDidMount(){
      this.getAsyncId();
  }

  render() {
    if (this.state.loggedOn) {
      return (
        <View>
          <Text>Login Screen </Text>
          <Button title="Login" onPress={this.login} />
        </View>
      );
    } else {
      return (
        <View>
          <Text>Login Screen </Text>

          <Text>Email</Text>
          <TextInput
            value={this.state.email}
            onChangeText={email => this.setState({email})}
            type="emailAddress"
          />
          <Text>Password</Text>
          <TextInput
            value={this.state.password}
            onChangeText={text => this.setState({password: text})}
            secureTextEntry
          />
          <Button title="Login" onPress={this.login} />
        </View>
      );
    }
  }
}

export default ClientProfile;
