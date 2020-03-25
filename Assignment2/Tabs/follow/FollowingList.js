import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Avatar} from 'react-native-elements';

class SearchUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      followerInfo: [],
      profileInfo: [],
    };
  }
  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadSearchedUser();
    });
    this.loadSearchedUser();
    //this.state.loggedOn = false;
  }
  viewFollowing() {
    return fetch(
      'http://10.0.2.2:3333/api/v0.0.5/user/' +
        this.state.userID +
        '/following',
    )
      .then(response => response.json())
      .then(responsejson => {
        this.setState({
          followerInfo: responsejson,
        });
        console.log('List of followers for: ' + this.state.userID);
        console.log(this.responseJson);
        console.log(this.state.followerInfo);
      })

      .catch(error => {
        console.log(error);
      });
  }

  async loadSearchedUser() {
    const currentUserId = await AsyncStorage.getItem('searchID');
    const formattedUserId = await JSON.parse(currentUserId);
    //const xAuthKey = await AsyncStorage.getItem('xAuth');
    //const formattedXAuth = await JSON.parse(xAuthKey);
    this.setState({
      //xAuth: formattedXAuth,
      userID: formattedUserId,
      //userID: currentUserId,
    });
    this.getProfile();
    console.log(
      '[SUCCESS] Loaded data from user ID: ' +
        this.state.userID +
        ' and x-auth: ' +
        this.state.xAuth,
    );
  }

  getProfile = () => {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          //firstName: responseJson.given_name,
          //lastName: responseJson.family_name,
          profileInfo: responseJson,
        });
        this.viewFollowing();
        //console.log(profileInfo)
      })
      .catch(error => {
        console.log('Error = ' + error);
      });
  };

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.viewAvatar}>
          <Avatar
            rounded
            source={{uri: this.state.photo}}
            onPress={() => this.viewUploadPhoto()}
          />
        </View>

        <View>
          <Text style={styles.detailStyle}>
            {this.state.profileInfo.given_name}{' '}
            {this.state.profileInfo.family_name}
          </Text>
        </View>

        <View>
          <FlatList
            data={this.state.followerInfo}
            //style={styles.chitList}
            renderItem={({item}) => (
              <Text style={styles.chitItem}>
                <Text style={styles.chitList}>
                  {item.given_name} {item.family_name}
                  {'\n'}
                </Text>
              </Text>
            )}
            keyExtractor={({id}, index) => id}
          />
        </View>
      </View>
    );
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
    //color: 'white',
    marginBottom: 5,
  },

  textStyle: {
    color: 'white',
    //padding: 10,
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
    //padding: 10,
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
  inputHead: {
    fontWeight: 'bold',
    //textAlign: 'center',
    color: 'white',
  },
});

export default SearchUserScreen;
