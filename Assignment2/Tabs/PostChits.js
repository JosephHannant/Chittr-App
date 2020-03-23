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
      //longitude: null,
      //latitude: null,
      //locationPermission: false,
      //geotag: false,
      validation: '',
    };
  }

  manageChitData = text => {
    this.setState({
      chitPack: text,
    });
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <View accessible={true}>
        <TextInput
          //style={styles.textEntry}
          placeholder="Compose a Chit..."
          onChangeText={this.manageChitData}
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
          accessibilityLabel="Post Chit"
          accessibilityHint="Press the button to post the chit"
          accessibilityRole="button">
          <Text>Post</Text>
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
          if (this.state.chitPack.length > 141) {
            console.log(
              '[SUCCESS] Chit added without geotag (limited characters)',
            );
          } else {
            console.log('[SUCCESS] Chit added without geotag');
          }
          this.props.navigation.goBack();
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
}
export default PostChitsScreen;
