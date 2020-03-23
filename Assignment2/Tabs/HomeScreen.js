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
      <View style={styles.mainView}>
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
          style={styles.chitList}
          renderItem={({item}) => (
            <Text style={styles.chitItem}>
              <Text style={styles.chitHeader}>
                {item.user.given_name} {item.user.family_name}
              </Text>
              <Text> chitt'd {'\n'}</Text>
              <Text>
                {item.chit_content}
                {'\n'}
              </Text>
              <Text>
                Date posted {new Date(item.timestamp).toLocaleString()}
              </Text>
            </Text>
          )}
          keyExtractor={({chitid}, mainKey) => chitid}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainView: {
    flex: 1,

    // Set content's vertical alignment.
    justifyContent: 'center',

    // Set content's horizontal alignment.
    alignItems: 'center',

    // Set hex color code here.
    backgroundColor: '#FFEB3B',
  },
  chitList: {
    fontSize: 12,
    marginBottom: 5,
  },
  recentChits: {
    fontWeight: 'bold',
    paddingTop: 20,
    textAlign: 'center',
  },
  chitItem: {
    margin: 5,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#e6ffff',
    elevation: 2,
  },
  chitHeader: {
    fontWeight: 'bold',
  },
});
export default HomeScreen;
