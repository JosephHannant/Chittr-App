import React, {Component} from 'react';
import {
  TextInput,
  View,
  Button,
  Image,
  FlatList,
  Text,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {SearchBar, ListItem} from 'react-native-elements';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      searchMade: false,
      searchData: [],
    };
  }

  search() {
    return fetch(
      'http://10.0.2.2:3333/api/v0.0.5/search_user?q=' + this.state.content,
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.length == 0) {
          Alert.alert('No Results Found');
        } else {
          this.setState({
            searchMade: true,
            searchData: responseJson,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    if (this.state.searchMade == true && this.state.searchData.length != 0) {
      return (
        <View>
          <TextInput
            onChangeText={content => {
              return this.setState({content: content});
            }}
          />

          <Button
            onPress={() => {
              this.setState({
                searchMade: true,
              });

              this.search();
            }}
            title="Search"
          />
          <FlatList
            data={this.state.searchData}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 1,
                  backgroundColor: '#000000',
                }}>
                <Image
                  style={{
                    height: 75,
                    width: 75,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  source={{
                    uri:
                      'http://10.0.2.2:3333/api/v0.0.5/user/' +
                      item.user_id +
                      '/photo/',
                  }}
                />
                <Text
                  style={{
                    color: '#BB86FC',
                  }}>
                  {item.given_name}, {item.family_name}
                </Text>
              </View>
            )}
            keyExtractor={({id}) => id}
          />
        </View>
      );
    }

    return (
      <View>
        <TextInput
          onChangeText={content => this.setState({content: content})}
        />

        <Button
          onPress={() => {
            this.setState({
              searchMade: true,
            });
            this.search();
          }}
          title="Search"
        />
      </View>
    );
  }
}

export default Search;
