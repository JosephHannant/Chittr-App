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
      chitID: '',
      chitDrafts: [],
      drafter: [],
    };
  }
  //Navigates to the camera screen
  cameraNav = () => {
    this.props.navigation.navigate('Camera');
  };
  //used to ammend the chitPack data to whatever is input into the textbox
  manageChitData = text => {
    this.setState({
      chitPack: text,
    });
  };
  //Function used to find the users current co-ordinates
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
  //Function used to request the users permission to allow the app to access their location
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
  //Renders the screen with the specified format
  render() {
    return (
      <View accessible={true} style={styles.pageBase}>
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
          title="Include location?"
          titleStyle={styles.textStyle}
          value={this.state.chitLocation}
          onValueChange={() =>
            this.setState({chitLocation: !this.state.chitLocation})
          }
          accessibilityLabel="Add location"
          accessibilityHint="Tick this box to have your chit include your location"
          accessibilityRole="checkbox"
        />
        <Text style={styles.chitText}>Include location?</Text>
        <TouchableOpacity
          onPress={() => this.postChit()}
          style={styles.buttonStyle}
          accessibilityLabel="Post Chit"
          accessibilityHint="Press the button to post the chit"
          accessibilityRole="button">
          <Text>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.chitToCamera()}
          style={styles.buttonStyle}
          accessibilityLabel="Post chit and connect to the camera"
          accessibilityHint="Press the button to proceed to post a chit and allow it to be linked to the next photo taken"
          accessibilityRole="button">
          <Text>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          //onPress={() => this.draftSave()}
          onPress={() => this.draftManage()}
          style={styles.buttonStyle}
          accessibilityLabel="Save chit as draft"
          accessibilityHint="Press the button to send the chit to the draft screen to be stored"
          accessibilityRole="button">
          <Text>Save to Drafts</Text>
        </TouchableOpacity>
      </View>
    );
  }
  //Loads the current logged user to determine if they can post a chit and where to post it
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
      'Loaded logged user credentials, userID: ' +
        this.state.userID +
        ' and x-Auth: ' +
        this.state.xAuth,
    );
  }
  //Stores the chit ID to pass to the camera and link the two
  async storeChitID() {
    try {
      await AsyncStorage.setItem('chitID', JSON.stringify(this.state.chitID));
      let chitIDC = await AsyncStorage.getItem('chitID');

      console.log('Chit before sent = ' + chitIDC);
    } catch (error) {
      console.log('Error = ' + error);
    }
  }
  //Stores the draft of the users chit

  async loadCurrentDrafts() {
    const currentDrafts = await AsyncStorage.getItem('chitDrafts');
    this.setState({
      chitDrafts: currentDrafts,
    });
    console.log(
      'Loaded data from drafts: ' + JSON.stringify(this.state.chitDrafts),
    );
  }

  async draftManage() {
    await this.loadCurrentDrafts();
    if (this.state.chitPack !== '') {
      this.setState({
        drafter: this.state.chitDrafts,
      });
      if (this.state.drafter !== null) {
        //console.log('DRaft: ' + JSON.parse(this.chitDrafts));
        this.multiDraft(this.state.drafter);
      } else {
        this.firstDraft();
      }
    } else {
      Alert.alert('No chit was entered');
    }
  }

  async multiDraft(draft) {
    //await this.loadCurrentDrafts();
    console.log('on multi' + draft);
    try {
      let formattedDrafts = JSON.parse(draft);
      console.log('F draft: ' + formattedDrafts);
      await AsyncStorage.removeItem('chitDrafts');
      const addedDraft = [
        {
          chitPack: this.state.chitPack,
        },
      ];
      let updatedDrafts = formattedDrafts.concat(addedDraft);
      await AsyncStorage.setItem('chitDrafts', JSON.stringify(updatedDrafts));
      Alert.alert(
        'Chit was saved to draft, chit details: ' + this.state.chitPack,
      );
    } catch (error) {
      console.log(error);
    }
  }
  //async function to handle the first time a draft is saved
  async firstDraft() {
    try {
      const firstDrafts = [
        {
          chitPack: this.state.chitPack,
        },
      ];
      await AsyncStorage.setItem('chitDrafts', JSON.stringify(firstDrafts));
      Alert.alert(
        'Chit was saved to draft, chit details: ' + this.state.chitPack,
      );
    } catch (error) {}
  }
  //Gets the users profile to display on the chit screen
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
  //Loads the specified functions whenever the user navigates to the page
  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadLoggedUser();
      this.findCoordinates();
    });
    this.loadLoggedUser();
    this.findCoordinates();
  }
  //Used to delay the transition to camera so the store function has time to run
  delayTransition = () => {
    setTimeout(function() {
      //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
      Alert.alert('Go to camera screen to attach a photo to the chit');
    }, 100);
  };
  //Tells the user to go to the camera screen to link a photo
  chitToCamera() {
    this.postChit();
    this.delayTransition();
  }
  //Post chit function to add a chit as the logged in user
  postChit() {
    var date = Date.parse(new Date());
    console.log(date);
    console.log(JSON.stringify(date));
    if (this.state.chitPack.length > 141) {
      Alert.alert('Chit is too long, character limit is 141');
    } else {
      console.log(this.state.chitPack.length);
      if (this.state.chitPack === '') {
        console.log('No chit was input');
      } else {
        if (this.state.chitLocation === true) {
          console.log('Posting chit with the location value');
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
                Alert.alert('Chit has been posted');
                console.log('Chit has location data attached');
                //this.props.navigation.navigate('Home');
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
          console.log('Posting chit without the location value');
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
                Alert.alert('Chit has been posted');
                console.log('Chit does not have location data attached');
                //this.props.navigation.goBack();
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
    fontWeight: 'bold',
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
