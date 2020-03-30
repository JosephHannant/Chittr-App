import React, {Component} from 'react';
import {
  CheckBox,
  PermissionsAndroid,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Text,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';

class PostChitsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: '',
      xAuth: '',
      profileInfo: [],
      chitPack: '',
      photo: null,
      longitude: null,
      latitude: null,
      locationPermission: false,
      chitLocation: false,
    };
  }

  cameraNav = () => {
    this.props.navigation.navigate('Camera');
  };
  manageChitData = text => {
    this.setState({
      chitPack: text,
    });
  };
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

  render() {
    return (
      <View accessible={true} style={styles.mainView}>
        <Text style={styles.detailStyle}>
          {'Current user: '}
          {this.state.userID}
          {'\n'}
          {"User's name: "}
          {this.state.profileInfo.given_name}{' '}
          {this.state.profileInfo.family_name}
        </Text>
        <TextInput
          style={styles.textStyle}
          placeholder="Compose a Chit..."
          placeholderTextColor="white"
          onChangeText={this.manageChitData}
          multiline
          numberOfLines={5}
          maxLength={141}
          accessibilityLabel="Chit Content"
          accessibilityHint="Enter chit content here"
          accessibilityRole="keyboardkey"
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
          accessibilityLabel="Post Chit"
          accessibilityHint="Press the button to post the chit"
          accessibilityRole="button">
          <Text>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.cameraNav()}
          style={styles.buttonStyle}
          accessibilityLabel="Create acount navigation"
          accessibilityHint="Press the button to proceed to the create account screen"
          accessibilityRole="button">
          <Text>Camera</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => this.storeChit()}
          //style={styles.button}
          accessibilityLabel="Save to drafts"
          accessibilityHint="Press the button to save the chit to your drafts"
          accessibilityRole="button">
          <Text>Save to Drafts</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          onPress={() => navigate('DraftScreen')}
          //style={styles.button}
          accessibilityLabel="View drafts"
          accessibilityHint="Press the button to view a list of your current drafts"
          accessibilityRole="button">
          <Text>View Drafts</Text>
        </TouchableOpacity> */}
      </View>
    );
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
    this.getProfile();
    console.log(
      'Loaded data from user ID: ' +
        this.state.userID +
        ' and x-auth: ' +
        this.state.xAuth,
    );
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

  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadLoggedUser();
      this.findCoordinates();
    });
    this.loadLoggedUser();
    this.findCoordinates();
  }

  postChit() {
    var date = Date.parse(new Date());
    console.log(date);
    console.log(JSON.stringify(date));
    if (this.state.chitPack.length > 141) {
      Alert.alert('Chit is too long please shorten it');
    } else {
      console.log(this.state.chitPack.length);
      if (this.state.chitPack === '') {
        console.log('No chit was input');
      } else {
        if (this.state.chitLocation === true) {
          console.log('Posting chit with location included');
          return fetch('http://10.0.2.2:3333/api/v0.0.5/chits', {
            method: 'POST',
            body: JSON.stringify({
              chit_content: this.state.chitPack,
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
                this.props.navigation.navigate('Home');
              } else {
                Alert.alert('Failed to post, you are not logged in');
              }
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          console.log('Posting chit without location data');
          return fetch('http://10.0.2.2:3333/api/v0.0.5/chits', {
            method: 'POST',
            body: JSON.stringify({
              chit_content: this.state.chitPack,
              timestamp: date,
            }),
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': JSON.parse(this.state.xAuth),
            },
          })
            .then(response => {
              //console.log(response);
              if (response.status === 201) {
                Alert.alert('Chit posted successfully');
                console.log('No location data was added');
                this.props.navigation.goBack();
              } else {
                Alert.alert('Failed to post, you are not logged in');
              }
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
  mainView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#101010',
    color: 'white',
    fontSize: 12,
  },
  textStyle: {
    color: 'white',
    marginLeft: 10,
    marginTop: 20,
    marginRight: 10,
    borderColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    height: 200,
    fontSize: 12,
  },
  detailStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  chitText: {
    color: 'white',
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
});
export default PostChitsScreen;
