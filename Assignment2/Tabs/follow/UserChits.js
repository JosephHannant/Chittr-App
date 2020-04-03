/*
  Author Joseph Hannant
  This is the screen that displays the selected accounts recent chits
*/
import React, {Component} from 'react';
import {Text, View, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class UserChitPage extends Component {
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
    });
    this.loadSearchedUser();
  }
  //Loads the searched user's credentials
  async loadSearchedUser() {
    const currentUserId = await AsyncStorage.getItem('searchID');
    const formattedUserId = await JSON.parse(currentUserId);
    this.setState({
      userID: formattedUserId,
    });
    this.getProfile();
    console.log(
      '[SUCCESS] Loaded data from user ID: ' +
        this.state.userID +
        ' and x-auth: ' +
        this.state.xAuth,
    );
  }
  //Gets the profile data of the searched user
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
        <View>
          <Text style={styles.detailStyle}>
            {this.state.profileInfo.given_name}{' '}
            {this.state.profileInfo.family_name}
          </Text>
        </View>
        <View>
          <Text style={styles.pageHead}>Chits</Text>
          <FlatList
            data={this.state.profileInfo.recent_chits}
            renderItem={({item}) => (
              <Text style={styles.chitItem}>
                <Text style={styles.chitList}>
                  {item.chit_content}
                  {'\n'}
                </Text>
                <Text style={styles.chitDate}>
                  Date posted {new Date(item.timestamp).toLocaleString()}
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

export default UserChitPage;
