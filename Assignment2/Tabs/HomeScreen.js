import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import {Avatar} from 'react-native-elements';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
          userData: responsejson,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.mainView}>
        <Text style={styles.pageHead}> Home Screen </Text>
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
              {/* <Text style={styles.chitDate}>
                Date posted {new Date(item.timestamp).toLocaleString()}
              </Text> */}
              <Image
                source={{
                  uri:
                    'http://10.0.2.2:3333/api/v0.0.5/chits/' +
                    item.chit_id +
                    '/photo',
                }}
                style={styles.chitPic}
              />
              {'\n'}
              {'\n'}
              {'\n'}
              {'\n'}
              {item.location == null ? (
                <Text style={styles.chitDate}>
                  Date posted {new Date(item.timestamp).toLocaleString()}
                </Text>
              ) : (
                <Text style={styles.chitDate}>
                  Date posted {new Date(item.timestamp).toLocaleString()}
                  {'\n'}lat: {item.location.latitude} long:{' '}
                  {item.location.longitude}
                </Text>
              )}
              {'\n'}
            </Text>
          )}
          keyExtractor={({chitid}, mainKey) => chitid}
        />
      </View>
    );
  }
}
//CSS styling sheet used throught the app to supply a consistent theme and improve user experience
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#101010',
  },
  chitList: {
    fontSize: 15,
    marginBottom: 5,
  },
  chitDate: {
    fontSize: 12,
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
  chitPic: {
    width: 100,
    height: 120,
  },
  chitItem: {
    margin: 3,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#DCDCDC',
    elevation: 1,
    //width: 350,
  },
  chitHeader: {
    fontWeight: 'bold',
  },
  displayPhotoStyle: {
    alignSelf: 'center',
    paddingTop: 10,
  },
});
export default HomeScreen;
