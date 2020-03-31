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

class PostHomeScreen extends Component {
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
    };
  }

  render() {
    return (
      <View accessible={true} style={styles.mainView}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Post')}
          style={styles.buttonStyle}
          accessibilityLabel="Post Chits screen"
          accessibilityHint="Press the button to post the chit"
          accessibilityRole="button">
          <Text>Post chits screen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Cam')}
          style={styles.buttonStyle}
          accessibilityLabel="Create acount navigation"
          accessibilityHint="Press the button to proceed to the create account screen"
          accessibilityRole="button">
          <Text>Camera screen</Text>
        </TouchableOpacity>
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
      'Loaded data from user ID: ' +
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
export default PostHomeScreen;
