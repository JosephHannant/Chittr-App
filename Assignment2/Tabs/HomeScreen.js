import React, {Component} from 'react';
import {
  FlatList,
  ActivityIndicator,
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Button,
  View,
} from 'react-native';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userData: [],
    };
  }

  getData() {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
      .then(response => response.json())
      .then(responsejson => {
        this.setState({
          isLoading: false,
          userData: responsejson,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View>
        <Text> Home Screen </Text>
        {/* <Button
                title="Login as User"
                onPress={()=> this.props.navigation.navigate('Login')}
            />
            <Button
                title="Create account"
                onPress={()=> this.props.navigation.navigate('Create')}
            /> */}
        <FlatList
          data={this.state.userData}
          renderItem={({item}) => <Text>{item.chit_content}</Text>}
          keyExtractor={({id}, index) => id}
        />
      </View>
    );
  }
}
// const styles = StyleSheet.create({
//   MainContainer: {
//     flex: 1,

//     // Set content's vertical alignment.
//     justifyContent: 'center',

//     // Set content's horizontal alignment.
//     alignItems: 'center',

//     // Set hex color code here.
//     backgroundColor: '#FFEB3B',
//   },
// });
export default HomeScreen;
