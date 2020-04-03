import React, {Component} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {SearchBar, ListItem} from 'react-native-elements';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searchReasults: [],
      query: '',
    };
  }

  //Stores the searched users ID in storage for the view screen
  storeSearchID = async searchedID => {
    try {
      await AsyncStorage.setItem('searchID', JSON.stringify(searchedID));
    } catch (error) {
      console.log(error);
    }
  };

  //Function to search for a users account on the server and display it
  search = async query => {
    if (query !== '') {
      try {
        const response = await fetch(
          'http://10.0.2.2:3333/api/v0.0.5/search_user?q=' + query,
        );
        const responseJson = await response.json();
        this.setState({
          searchResults: responseJson,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setState({
        searchResults: [],
      });
    }
  };
  //Function to link the text to the search
  searchingManage = query => {
    this.setState({
      search: query,
    });
    this.search(query);
  };

  //Navigation to the view profile screen
  profileNav = selectedAcc => {
    console.log(
      'Navigating to user: ' +
        selectedAcc.user_id +
        ' ' +
        selectedAcc.given_name +
        ' ' +
        selectedAcc.family_name,
    );
    this.storeSearchID(selectedAcc.user_id);
    this.props.navigation.navigate('UserProfiles');
  };
  //Renders the screen
  render() {
    return (
      <View style={styles.pageBase}>
        <SearchBar
          noIcon={true}
          placeholder="Search for a user"
          onChangeText={this.searchingManage}
          value={this.state.search}
        />
        <FlatList
          data={this.state.searchResults}
          style={styles.chitList}
          renderItem={({item}) => (
            <ListItem
              title={item.given_name + ' ' + item.family_name}
              subtitle={'Email: ' + item.email + ' User ID: ' + item.user_id}
              bottomDivider
              chevron
              containerStyle={styles.chitList}
              titleStyle={styles.chitText}
              subtitleStyle={styles.chitText}
              onPress={() => this.profileNav(item)}
            />
          )}
          keyExtractor={(item, index) => String(index)}
        />
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

  chitList: {
    backgroundColor: '#101010',
  },
  chitText: {
    color: 'white',
  },
});

export default SearchPage;
