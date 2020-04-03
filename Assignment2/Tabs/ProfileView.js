import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Avatar} from 'react-native-elements';

class SearchUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      loggedID: '',
      loggedAuth: '',
      profileInfo: [],
    };
  }
  //Runs the specified functions whenever the user navigates to the page
  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadSearchedUser();
      this.loadLoggedUser();
    });
    this.loadSearchedUser();
    this.loadLoggedUser();
  }
  //Function to follow and account
  followAccount() {
    return fetch(
      'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID + '/follow',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': JSON.parse(this.state.loggedAuth),
        },
      },
    )
      .then(response => response.json())
      .then(responsejson => {
        console.log(
          'The user: ' +
            this.state.loggedID +
            ' followed user: ' +
            this.state.userID,
        );
        console.log(this.responsejson);
      })

      .catch(error => {
        console.log(error);
      });
  }
  //Function to unfollow an account
  unfollowAccount() {
    return fetch(
      'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID + '/follow',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': JSON.parse(this.state.loggedAuth),
        },
      },
    )
      .then(response => response.json())
      .then(responsejson => {
        console.log(
          'The user: ' +
            this.state.loggedID +
            ' unfollowed user: ' +
            this.state.userID,
        );
        console.log(this.responsejson);
      })

      .catch(error => {
        console.log(error);
      });
  }
  //Navigation to follower, following and user chits pages
  goToFollowers() {
    this.props.navigation.navigate('UserFollowers');
  }

  goToFollowing() {
    this.props.navigation.navigate('UserFollowing');
  }

  goToUserChits() {
    this.props.navigation.navigate('UserChits');
  }
  //Loads the user that was selected from the serach screen
  async loadSearchedUser() {
    const currentUserId = await AsyncStorage.getItem('searchID');
    const formattedUserId = await JSON.parse(currentUserId);
    this.setState({
      userID: formattedUserId,
    });
    this.getProfile();
    console.log(
      'Searched user credentials loaded, userID: ' +
        this.state.userID +
        ' and x-Auth: ' +
        this.state.xAuth,
    );
  }
  //Loads the current logged in user
  async loadLoggedUser() {
    const currentUserId = await AsyncStorage.getItem('userID');
    const formattedUserId = await JSON.parse(currentUserId);
    const xAuthKey = await AsyncStorage.getItem('xAuth');
    const formattedXAuth = await JSON.parse(xAuthKey);
    this.setState({
      loggedAuth: formattedXAuth,
      loggedID: formattedUserId,
    });
    console.log(
      'Logged user credentials loaded, userID: ' +
        this.state.loggedID +
        ' and x-Auth: ' +
        this.state.loggedAuth,
    );
  }
  //Loads the profile data for the searched user
  getProfile = () => {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          profileInfo: responseJson,
        });
      })
      .catch(error => {
        console.log('Error = ' + error);
      });
  };
  //Renders the screen
  render() {
    return (
      <View style={styles.pageBase}>
        <View style={styles.viewAvatar}>
          <Avatar
            rounded
            size="large"
            source={{
              uri:
                'http://10.0.2.2:3333/api/v0.0.5/user/' +
                this.state.userID +
                '/photo?timestamp=' +
                Date.now(),
            }}
          />
        </View>

        <View>
          <Text style={styles.detailStyle}>
            {this.state.profileInfo.given_name}{' '}
            {this.state.profileInfo.family_name}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => this.followAccount()}
            style={styles.buttonStyle}
            accessibilityLabel="Follow"
            accessibilityHint="Press to follow user"
            accessibilityRole="button">
            <Text>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.unfollowAccount()}
            style={styles.buttonStyle}
            accessibilityLabel="Unfollow"
            accessibilityHint="Press to unfollow user"
            accessibilityRole="button">
            <Text>Unfollow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.goToFollowers()}
            style={styles.buttonStyle}
            accessibilityLabel="View Followers"
            accessibilityHint="Press to view user's followers"
            accessibilityRole="button">
            <Text>View Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.goToFollowing()}
            style={styles.buttonStyle}
            accessibilityLabel="View Following"
            accessibilityHint="Press to view who the user is following"
            accessibilityRole="button">
            <Text>View Following</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.goToUserChits()}
            style={styles.buttonStyle}
            accessibilityLabel="View User Chits"
            accessibilityHint="Press to view user's chits"
            accessibilityRole="button">
            <Text>User Chits</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  inputHead: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default SearchUserScreen;
