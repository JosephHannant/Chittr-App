import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {SearchBar, ListItem} from 'react-native-elements';

class SearchUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searchReasults: [],
    };
  }

  //Retrieves ProfileID using AsyncStorage
  storeSearchID = async id => {
    try {
      console.log('ID:', id);
      await AsyncStorage.setItem('searchID', JSON.stringify(id));
    } catch (error) {
      console.log(error);
    }
  };

  //Search Function which stays blank if there is no text, or displays and adds results to dataList if there is
  search = query => {
    this.setState({search: query});
    if (query !== '') {
      return fetch('http://10.0.2.2:3333/api/v0.0.5/search_user?q=' + query)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            searchReasults: responseJson,
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.setState({
        searchReasults: [],
      });
    }
  };

  //Navigate to single profile function
  profileNav = selectedID => {
    this.storeSearchID(selectedID);
    this.props.navigation.navigate('UserProfiles');
  };

  render() {
    return (
      <View style={styles.mainView}>
        <SearchBar
          noIcon={true}
          placeholder="Search for a user"
          onChangeText={this.search}
          value={this.state.search}
          //style={styles.mainView}
        />
        <FlatList
          data={this.state.searchReasults}
          style={styles.chitList}
          renderItem={({item}) => (
            <ListItem
              title={item.given_name + ' ' + item.family_name}
              subtitle={item.email}
              bottomDivider
              chevron
              containerStyle={styles.chitList}
              titleStyle={styles.chitText}
              subtitleStyle={styles.chitText}
              onPress={() => this.profileNav(item.user_id)}
            />
          )}
          keyExtractor={(item, index) => String(index)}
        />
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

  chitList: {
    //ize: 15,
    //color: 'white',
    //marginBottom: 5,
    //tintColor: '#101010',
    backgroundColor: '#101010',
  },
  chitText: {
    //ize: 15,
    color: 'white',
    //marginBottom: 5,
    //tintColor: '#101010',
    //backgroundColor: '#101010',
  },
});

export default SearchUserScreen;
