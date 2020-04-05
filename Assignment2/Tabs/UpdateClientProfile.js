/*
  Author Joseph Hannant
  This is the screen that deals with updating the logged in users profile
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

class UpdateClientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upEmail: '',
      upPassword: '',
      userID: '',
      upFirstName: '',
      upLastName: '',
      xAuth: '',
      profileInfo: [],
    };
  }
  //Updates all of the user details and ensures no value is left blank
  updateAll = () => {
    console.log(this.state.xAuth);
    if (this.state.xAuth !== null) {
      if (this.state.upFirstName !== '') {
        if (this.state.upLastName !== '') {
          if (this.state.upEmail !== '') {
            if (this.state.upPassword !== '') {
              let res = JSON.stringify({
                given_name: this.state.upFirstName,
                family_name: this.state.upLastName,
                email: this.state.upEmail,
                password: this.state.upPassword,
              });
              console.log(res);
              return fetch(
                'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID,
                {
                  method: 'PATCH',
                  body: res,
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': JSON.parse(this.state.xAuth),
                  },
                },
              )
                .then(response => {
                  console.log(response.status);
                  if (response.status === 201) {
                    Alert.alert('Uppdate successful');
                  } else {
                    Alert.alert('Problem occurred: ' + response.status);
                  }
                })
                .then(responseJson => {
                  console.log(responseJson);
                })
                .catch(error => {
                  console.error(error);
                });
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
    } else {
      Alert.alert('You are not logged in');
    }
  };
  //Only updates first name
  updateFirstName = () => {
    console.log(this.state.xAuth);
    if (this.state.xAuth !== null) {
      if (this.state.upFirstName !== '') {
        let res = JSON.stringify({
          given_name: this.state.upFirstName,
        });
        console.log(res);
        return fetch(
          'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID,
          {
            method: 'PATCH',
            body: res,
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': JSON.parse(this.state.xAuth),
            },
          },
        )
          .then(response => {
            console.log(response.status);
            if (response.status === 201) {
              Alert.alert('Uppdate successful');
            } else {
              Alert.alert('Problem occurred: ' + response.status);
            }
          })
          .then(responseJson => {
            console.log(responseJson);
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        Alert.alert('No first name entered');
      }
    } else {
      Alert.alert('You are not logged in');
    }
  };
  //Only updates last name
  updateLastName = () => {
    console.log(this.state.xAuth);
    if (this.state.xAuth !== null) {
      if (this.state.upLastName !== '') {
        let res = JSON.stringify({
          family_name: this.state.upLastName,
        });
        console.log(res);
        return fetch(
          'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID,
          {
            method: 'PATCH',
            body: res,
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': JSON.parse(this.state.xAuth),
            },
          },
        )
          .then(response => {
            console.log(response.status);
            if (response.status === 201) {
              Alert.alert('Uppdate successful');
            } else {
              Alert.alert('Problem occurred: ' + response.status);
            }
          })
          .then(responseJson => {
            console.log(responseJson);
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        Alert.alert('No last name entered');
      }
    } else {
      Alert.alert('You are not logged in');
    }
  };
  //Only updates email
  updateEmail = () => {
    console.log(this.state.xAuth);
    if (this.state.xAuth !== null) {
      if (this.state.upEmail !== '') {
        let res = JSON.stringify({
          email: this.state.upEmail,
        });
        console.log(res);
        return fetch(
          'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID,
          {
            method: 'PATCH',
            body: res,
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': JSON.parse(this.state.xAuth),
            },
          },
        )
          .then(response => {
            console.log(response.status);
            if (response.status === 201) {
              Alert.alert('Uppdate successful');
            } else {
              Alert.alert('Problem occurred: ' + response.status);
            }
          })
          .then(responseJson => {
            console.log(responseJson);
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        Alert.alert('No Email entered');
      }
    } else {
      Alert.alert('You are not logged in');
    }
  };
  //Only updates password
  updatePassword = () => {
    console.log(this.state.xAuth);
    if (this.state.xAuth !== null) {
      if (this.state.upPassword !== '') {
        let res = JSON.stringify({
          password: this.state.upPassword,
        });
        console.log(res);
        return fetch(
          'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID,
          {
            method: 'PATCH',
            body: res,
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': JSON.parse(this.state.xAuth),
            },
          },
        )
          .then(response => {
            console.log(response.status);
            if (response.status === 201) {
              Alert.alert('Uppdate successful');
            } else {
              Alert.alert('Problem occurred: ' + response.status);
            }
          })
          .then(responseJson => {
            console.log(responseJson);
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        Alert.alert('No password entered');
      }
    } else {
      Alert.alert('You are not logged in');
    }
  };
  //Navigates to the update display photo page
  updateDPNav = () => {
    this.props.navigation.navigate('UpdateDP');
  };
  //Gets the user details
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
  //Runs the specified functions whenever the user navigates to the page
  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadLoggedUser();
    });
    this.loadLoggedUser();
  }
  //Renders the screen
  render() {
    return (
      <View style={styles.pageBase} accessible={true}>
        <Text style={styles.pageHead}>Update Display Photo</Text>
        <View style={styles.displayPhotoStyle}>
          <Avatar
            size="medium"
            rounded
            onPress={() => this.updateDPNav()}
            source={{
              uri:
                'http://10.0.2.2:3333/api/v0.0.5/user/' +
                this.state.userID +
                '/photo?timestamp=' +
                Date.now(),
            }}
            accessibilityLabel="Go to display photo update"
            accessibilityHint="Press to be navigated to the update display photo page"
            accessibilityRole="imagebutton"
          />
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
          accessibilityLabel="First name entry"
          accessibilityHint="Enter the updated first name here"
          accessibilityRole="keyboardkey"
        />

        <Text style={styles.inputHead}>Last name</Text>
        <TextInput
          style={styles.loggedTextStyle}
          defaultValue={this.state.lastName}
          value={this.state.upLastName}
          onChangeText={upLastName => this.setState({upLastName})}
          type="familyName"
          accessibilityLabel="Last name entry"
          accessibilityHint="Enter the updated last name here"
          accessibilityRole="keyboardkey"
        />

        <Text style={styles.inputHead}>Email</Text>
        <TextInput
          style={styles.loggedTextStyle}
          defaultValue={this.state.email}
          value={this.state.upEmail}
          onChangeText={upEmail => this.setState({upEmail})}
          type="emailAddress"
          accessibilityLabel="Email entry"
          accessibilityHint="Enter the updated email here"
          accessibilityRole="keyboardkey"
        />
        <Text style={styles.inputHead}>Password</Text>
        <TextInput
          style={styles.loggedTextStyle}
          defaultValue={this.state.password}
          value={this.state.upPassword}
          onChangeText={text => this.setState({upPassword: text})}
          secureTextEntry
          accessibilityLabel="Password entry"
          accessibilityHint="Enter the updated password here"
          accessibilityRole="keyboardkey"
        />
        <TouchableOpacity
          onPress={() => this.updateAll()}
          style={styles.buttonStyle}
          accessibilityLabel="Update account"
          accessibilityHint="Press the button to proceed to update all account details"
          accessibilityRole="button">
          <Text>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.updateFirstName()}
          style={styles.buttonStyle}
          accessibilityLabel="Update first name"
          accessibilityHint="Press the button to proceed to update first name details"
          accessibilityRole="button">
          <Text>Update First Name</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.updateLastName()}
          style={styles.buttonStyle}
          accessibilityLabel="Update last name"
          accessibilityHint="Press the button to proceed to update last name details"
          accessibilityRole="button">
          <Text>Update Last Name</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.updateEmail()}
          style={styles.buttonStyle}
          accessibilityLabel="Update email"
          accessibilityHint="Press the button to proceed to update email details"
          accessibilityRole="button">
          <Text>Update Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.updatePassword()}
          style={styles.buttonStyle}
          accessibilityLabel="Update password"
          accessibilityHint="Press the button to proceed to update password details"
          accessibilityRole="button">
          <Text>Update Password</Text>
        </TouchableOpacity>
      </View>
    );
  }
  //Loads the current logged user's credentials
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
      'Loaded credentiaals for the logged user, userID: ' +
        this.state.userID +
        ' and x-Auth: ' +
        this.state.xAuth,
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
    marginTop: 5,
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

export default UpdateClientProfile;
