import React, {Component} from 'react';
import {
  Image,
  CheckBox,
  PermissionsAndroid,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Text,
  View,
} from 'react-native';
//import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';

class PostChitsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: '',
      xAuth: '',
      chitPack: '',
      photo: null,
      //longitude: null,
      //latitude: null,
      //locationPermission: false,
      //geotag: false,
      validation: '',
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

  render() {
    //const {navigate} = this.props.navigation;

    return (
      <View accessible={true} style={styles.mainView}>
        <TextInput
          style={styles.textStyle}
          //style={styles.textEntry}
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

        <Text>{this.state.validation}</Text>

        {/* <View>
          <CheckBox
            title="Add Geotag"
            value={this.state.geotag}
            onValueChange={() => this.setState({geotag: !this.state.geotag})}
            accessibilityLabel="Add Geotag"
            accessibilityHint="Select this checkbox to add a geotag to your chit"
            accessibilityRole="checkbox"
          />
          <Text>Add Geotag?</Text>
        </View> */}

        <TouchableOpacity
          onPress={() => this.addChit()}
          //style={styles.button}
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
    console.log(
      '[SUCCESS] Loaded data from user ID: ' +
        this.state.userID +
        ' and x-auth: ' +
        this.state.xAuth,
    );
  }

  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadLoggedUser();
    });
    this.loadLoggedUser();
  }

  addChit() {
    var date = Date.parse(new Date());

    if (this.state.chitPack == '') {
      this.setState({
        validation: 'Please type a Chit!',
      });
      console.log('[ERROR] User did not type a chit, displaying error.');
    } else {
      console.log('[DEBUG] Attempting to post chit without geotag.');
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
          if (response.status == 201) {
            Alert.alert('Chit posted, returned to home');
            if (this.state.chitPack.length > 141) {
              console.log(
                '[SUCCESS] Chit added without geotag (limited characters)',
              );
            } else {
              console.log('[SUCCESS] Chit added without geotag');
            }
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

const styles = StyleSheet.create({
  mainView: {
    flex: 1,

    // Set content's vertical alignment.
    //justifyContent: 'center',

    // Set content's horizontal alignment.
    //alignItems: 'center',
    flexDirection: 'column',

    // Set hex color code here.
    backgroundColor: '#101010',

    color: 'white',

    fontSize: 12,
  },

  textStyle: {
    color: 'white',
    //padding: 10,
    marginLeft: 10,
    marginTop: 20,
    marginRight: 10,
    borderColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    height: 200,
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
});
export default PostChitsScreen;
