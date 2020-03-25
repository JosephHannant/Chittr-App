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
import {withOrientation} from 'react-navigation';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userData: [],
    };
  }

  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.getData();
    });
    this.getData();
  }

  getData() {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=100')
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
        <Text style={styles.pageHead}> Home Screen </Text>
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
          //style={styles.chitList}
          renderItem={({item}) => (
            <Text style={styles.chitItem}>
              <Text style={styles.chitHeader}>
                {item.user.given_name} {item.user.family_name}
              </Text>
              <Text> chitt'd {'\n'}</Text>
              <Text style={styles.chitList}>
                {item.chit_content}
                {'\n'}
              </Text>
              <Text style={styles.chitDate}>
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
    backgroundColor: '#101010',
  },
  chitList: {
    fontSize: 15,
    //color: 'white',
    marginBottom: 5,
  },
  chitDate: {
    fontSize: 12,
    //color: 'white',
    marginBottom: 5,
  },
  recentChits: {
    fontWeight: 'bold',
    paddingTop: 20,
    textAlign: 'center',
  },
  pageHead: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  chitItem: {
    margin: 3,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#DCDCDC',
    elevation: 1,
  },
  chitHeader: {
    fontWeight: 'bold',
  },
});
export default HomeScreen;
