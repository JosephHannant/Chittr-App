import React, {Component} from 'react';
import {
  Text,
  TextInput,
  CheckBox,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';

class DraftView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDraft: '',
      xAuth: '',
      userID: '',
      finalChit: '',
      delayedChit: '',
      longitude: null,
      latitude: null,
      locationPermission: false,
      chitLocation: false,
    };
  }
  //Runs the specified functions whenever the user navigates to the page
  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadSelectedDraft();
      this.findCoordinates();
    });
    this.loadSelectedDraft();
    this.findCoordinates();
  }
  //Finds the users co-ordinates
  findCoordinates = () => {
    if (!this.state.locationPermission) {
      this.state.locationPermission = this.requestLocationPermission();
    }

    Geolocation.getCurrentPosition(
      position => {
        const longitude = JSON.stringify(position.coords.longitude);
        const latitude = JSON.stringify(position.coords.latitude);
        this.setState({
          longitude: longitude,
          latitude: latitude,
        });
        console.log('Location data acquired');
      },
      error => {
        Alert.alert(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };
  //Requests the users permission to access their location data
  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Chittr Location Permission',
          message: 'Chittr wants to know your location.',
          buttonNeutral: 'Ask again later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location is enabled');
        return true;
      } else {
        console.log('Location is not enabled');
        return false;
      }
    } catch (error) {
      console.warn(error);
    }
  };
  //Loads the logged user for the posting function
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
      'Loaded data from user ID: ' +
        this.state.userID +
        ' and x-auth: ' +
        this.state.xAuth,
    );
  }
  //Stores the chitID to connect it to the camera
  async storeChitID() {
    try {
      await AsyncStorage.setItem('chitID', JSON.stringify(this.state.chitID));
      let chitIDC = await AsyncStorage.getItem('chitID');

      console.log('Chit before sent = ' + chitIDC);
    } catch (error) {
      console.log('Error = ' + error);
    }
  }
  //Loads the draft data selected on the draft screen
  async loadSelectedDraft() {
    const currentDraft = await AsyncStorage.getItem('selecChit');
    const formattedDraft = await JSON.parse(currentDraft);
    this.setState({
      selectedDraft: formattedDraft,
      finalChit: formattedDraft,
    });
    this.loadLoggedUser();
    console.log('Loaded data from user ID: ' + this.state.selectedDraft);
  }
  //Function to extract the text from the input and place it into the finalChit variable
  viewText = text => {
    this.setState({
      finalChit: text,
    });
  };
  //Prints the draft details
  consoleText = () => {
    console.log(this.state.finalChit);
  };
  //Renders the screen
  render() {
    return (
      <View style={styles.pageBase}>
        <View>
          <TextInput
            style={styles.textStyle}
            onChangeText={this.viewText}
            defaultValue={this.state.selectedDraft}
            multiline
            numberOfLines={5}
            maxLength={141}
          />
          <CheckBox
            center
            title="Add Geotag"
            titleStyle={styles.textStyle}
            value={this.state.chitLocation}
            onValueChange={() =>
              this.setState({chitLocation: !this.state.chitLocation})
            }
            accessibilityLabel="Add Geotag"
            accessibilityHint="Select this checkbox to add a geotag to your chit"
            accessibilityRole="checkbox"
          />
          <Text style={styles.chitText}>Add location?</Text>
          <TouchableOpacity
            onPress={() => this.postChit()}
            style={styles.buttonStyle}
            accessibilityLabel="Follow"
            accessibilityHint="Press to follow user"
            accessibilityRole="button">
            <Text>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            //onPress={() => this.delayTransmition()}
            style={styles.buttonStyle}
            accessibilityLabel="Follow"
            accessibilityHint="Press to follow user"
            accessibilityRole="button">
            <Text>Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  //Posts the drafted chit
  postChit() {
    var date = Date.parse(new Date());
    console.log(date);
    console.log(JSON.stringify(date));
    if (this.state.finalChit.length > 141) {
      Alert.alert('Chit is too long please shorten it');
    } else {
      console.log(this.state.finalChit.length);
      if (this.state.finalChit === '') {
        console.log('No chit was input');
      } else {
        if (this.state.chitLocation === true) {
          console.log('Posting chit with location included');
          return fetch('http://10.0.2.2:3333/api/v0.0.5/chits', {
            method: 'POST',
            body: JSON.stringify({
              chit_content: this.state.finalChit,
              timestamp: date,
              location: {
                longitude: JSON.parse(this.state.longitude),
                latitude: JSON.parse(this.state.latitude),
              },
            }),
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': JSON.parse(this.state.xAuth),
            },
          })
            .then(response => {
              if (response.status === 201) {
                Alert.alert('Chit posted, returned to home');
                console.log('Chit included location data');
              } else {
                Alert.alert('Failed to post, you are not logged in');
              }
              return response.json();
            })
            .then(responseJson => {
              this.setState({
                chitID: JSON.stringify(responseJson.chit_id),
              });
              console.log('Chit ID is: ' + this.state.chitID);
              this.storeChitID();
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          console.log('Posting chit without location data');
          return fetch('http://10.0.2.2:3333/api/v0.0.5/chits', {
            method: 'POST',
            body: JSON.stringify({
              chit_content: this.state.finalChit,
              timestamp: date,
            }),
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': JSON.parse(this.state.xAuth),
            },
          })
            .then(response => {
              console.log(response);
              if (response.status === 201) {
                Alert.alert('Chit posted successfully');
                console.log('No location data was added');
              } else {
                Alert.alert('Failed to post, you are not logged in');
              }
              return response.json();
            })
            .then(responseJson => {
              this.setState({
                chitID: JSON.stringify(responseJson.chit_id),
              });
              console.log('Chit ID is: ' + this.state.chitID);
              this.storeChitID();
            })
            .catch(error => {
              console.error(error);
            });
        }
      }
    }
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
  chitItem: {
    margin: 3,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#DCDCDC',
    elevation: 1,
  },
  chitList: {
    fontSize: 15,
    marginBottom: 5,
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
    fontSize: 16,
  },
  detailStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  chitText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default DraftView;
