import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import AsyncStorage from '@react-native-community/async-storage';

class ChittPhoto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: '',
      xAuth: '',
    };
  }

  render() {
    return (
      <View style={styles.mainView} accessible={true}>
        <Text style={styles.pageHead}>Chitt a picture</Text>

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
    console.log('[SUCCESS] ChangePictureScreen Loaded');
    this.loadLoggedUser();
  }

  // Async to load the credentials of the current logged in user
  async loadLoggedUser() {
    let userId = await AsyncStorage.getItem('userID');
    let parsedUserId = await JSON.parse(userId);
    let xAuth = await AsyncStorage.getItem('xAuth');
    let parsedXAuth = await JSON.parse(xAuth);
    this.setState({
      xAuth: parsedXAuth,
      userID: parsedUserId,
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
    if (this.camera) {
      const settings = {quality: 2, base64: true};
      const data = await this.camera.takePictureAsync(settings);

      console.log('URI of the photo: ' + data.uri);

      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/32/photo', {
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
        })
        .catch(error => {
          console.error('A problem occurred taking the photo: ' + error);
        });
    }
  };
}

const styles = StyleSheet.create({
  mainView: {
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
    elevation: 5,
  },
});

export default ChittPhoto;
