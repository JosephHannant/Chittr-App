/*
  Author Joseph Hannant
  This is the screen that deals with account creation
*/
import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    };
  }
  //Navigation to the update screen
  updateNav = () => {
    this.props.navigation.navigate('UpdateAccount');
  };
  //Function to create a user account
  create = () => {
    if (this.state.firstName !== '') {
      if (this.state.lastName !== '') {
        if (this.state.email !== '') {
          if (this.state.password !== '') {
            let res = JSON.stringify({
              given_name: this.state.firstName,
              family_name: this.state.lastName,
              email: this.state.email,
              password: this.state.password,
            });
            console.log(res);
            try {
              return fetch('http://10.0.2.2:3333/api/v0.0.5/user', {
                method: 'POST',
                body: res,
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then(response => {
                  console.log(response.status);
                  return response.json();
                })
                .then(() => {
                  Alert.alert('Account created');
                })
                .catch(error => {
                  console.error(error);
                });
            } catch (error) {
              console.log(error);
            }
          } else {
            Alert.alert('No password entered');
          }
        } else {
          Alert.alert('No email entered');
        }
      } else {
        Alert.alert('No last name entered');
      }
    } else {
      Alert.alert('No first name entered');
    }
  };
  //Renders the current screen
  render() {
    return (
      <View style={styles.pageBase}>
        <Text style={styles.pageHead}>Create Screen </Text>

        <Text style={styles.inputHead}>First name</Text>
        <TextInput
          style={styles.textStyle}
          value={this.state.firstName}
          onChangeText={firstName => this.setState({firstName})}
          type="givenName"
        />

        <Text style={styles.inputHead}>Last name</Text>
        <TextInput
          style={styles.textStyle}
          value={this.state.lastName}
          onChangeText={lastName => this.setState({lastName})}
          type="familyName"
        />

        <Text style={styles.inputHead}>Email</Text>
        <TextInput
          style={styles.textStyle}
          value={this.state.email}
          onChangeText={email => this.setState({email})}
          type="emailAddress"
        />
        <Text style={styles.inputHead}>Password</Text>
        <TextInput
          style={styles.textStyle}
          value={this.state.password}
          onChangeText={text => this.setState({password: text})}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={() => this.create()}
          style={styles.buttonStyle}
          accessibilityLabel="Create acount"
          accessibilityHint="Press the button to create your account"
          accessibilityRole="button">
          <Text>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.updateNav()}
          style={styles.buttonStyle}
          accessibilityLabel="Update acount navigation"
          accessibilityHint="Press the button to proceed to the update account screen"
          accessibilityRole="button">
          <Text>Update Existing Account</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
//CSS styling sheet used throught the app to supply a consistent theme and improve user experience
const styles = StyleSheet.create({
  pageBase: {
    flex: 1,
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
    height: 50,
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

export default Create;
