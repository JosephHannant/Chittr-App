/*
  Author Joseph Hannant
  This is the screen that deals with updating the logged in users display photo
*/
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';
import AsyncStorage from '@react-native-community/async-storage';

class UpdateDisplayPhoto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: '',
      xAuth: '',
    };
  }
  //This renders the camera on the screen with the view and a button to take the photo
  render() {
    return (
      <View style={styles.pageBase} accessible={true}>
        <Text style={styles.pageHead}>Update Display Photo</Text>

        <RNCamera
          ref={action => {
            this.camera = action;
          }}
          style={styles.photoStyle}
          captureAudio={false}
        />

        <TouchableOpacity
          onPress={this.takePicture.bind(this)}
          style={styles.buttonStyle}
          accessibilityLabel="Change display photo"
          accessibilityHint="Activate button to take a photo to replace the current photo for the account"
          accessibilityRole="button">
          <Text>Take Picture</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Reruns the functions within whenever the screen is loaded and in focus
  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadLoggedUser();
    });
    this.loadLoggedUser();
  }

  // Async to load the credentials of the current logged in user
  async loadLoggedUser() {
    let userId = await AsyncStorage.getItem('userID');
    let formattedUserId = await JSON.parse(userId);
    let xAuth = await AsyncStorage.getItem('xAuth');
    let formattedXAuth = await JSON.parse(xAuth);
    this.setState({
      xAuth: formattedXAuth,
      userID: formattedUserId,
    });
    console.log(
      'Logged user: ' +
        this.state.userID +
        ' with Xauthorization code: ' +
        this.state.xAuth,
    );
  }

  // This takes the photo and uploads it to the server to ammend the users display photo
  takePicture = async () => {
    if (this.state.xAuth !== null) {
      if (this.camera) {
        const settings = {quality: 2, base64: true};
        const data = await this.camera.takePictureAsync(settings);

        console.log('URI of the photo: ' + data.uri);

        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/photo', {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'image/jpeg',
            'X-Authorization': JSON.parse(this.state.xAuth),
          },
        })
          .then(response => {
            this.props.navigation.navigate('UpdateAccount');
            console.log('Photo taken, response code: ' + response.status);
            Alert.alert('Display photo updated');
          })
          .catch(error => {
            console.error('A problem occurred taking the photo: ' + error);
          });
      }
    } else {
      Alert.alert('You are not logged in');
    }
  };
}
//stylesheet to keep a consistent theme across all of the app
const styles = StyleSheet.create({
  pageBase: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 5,
    backgroundColor: '#010101',
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
    alignSelf: 'center',
    fontSize: 30,
  },
  photoStyle: {
    flex: 0,
    padding: 250,
    paddingHorizontal: 5,
    alignSelf: 'center',
    marginBottom: 5,
    elevation: 3,
  },
});

export default UpdateDisplayPhoto;
