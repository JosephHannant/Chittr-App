import React, {Component} from 'react';
import {Text, TextInput, Button, View, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  create = () => {
    let res = JSON.stringify({
      given_name: this.state.given_name,
      family_name: this.state.family_name,
      email: this.state.email,
      password: this.state.password,
    });
    console.log(res);
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user', {
      method: 'POST',
      body: res,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response.status);
        let res = response.json();
        // console.log(res.status);
        return res;
      })
      .then(responseJson => {
        console.log(responseJson.token);
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    return (
      <View>
        <Text>Create Screen </Text>

        <Text>First name</Text>
        <TextInput
          value={this.state.given_name}
          onChangeText={given_name => this.setState({given_name})}
          type="givenName"
        />

        <Text>Last name</Text>
        <TextInput
          value={this.state.family_name}
          onChangeText={family_name => this.setState({family_name})}
          type="familyName"
        />

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
        <Button title="Create" onPress={this.create} />
      </View>
    );
  }
}

export default Create;
