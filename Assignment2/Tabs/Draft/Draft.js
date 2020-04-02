import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Drafts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chitDrafts: [],
    };
  }

  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadCurrentDrafts();
    });
    this.loadCurrentDrafts();
  }

  async loadCurrentDrafts() {
    //let chitIDC = await AsyncStorage.getItem('chitDrafts');
    const currentDrafts = await AsyncStorage.getItem('chitDrafts');
    const formattedDrafts = await JSON.parse(currentDrafts);
    this.setState({
      chitDrafts: formattedDrafts,
    });
    console.log(
      'Loaded data from drafts: ' + JSON.stringify(this.state.chitDrafts),
    );
  }

  storeSearchID = async chitPack => {
    try {
      console.log('Chit data:', chitPack);
      await AsyncStorage.setItem('selecChit', JSON.stringify(chitPack));
    } catch (error) {
      console.log(error);
    }
  };

  draftNav = selectedChit => {
    this.storeSearchID(selectedChit);
    this.props.navigation.navigate('DraftView');
  };

  async draftWipe() {
    try {
      await AsyncStorage.removeItem('chitDrafts');
      Alert.alert('All drafts deleted');
      console.log('All drafts deleted');
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={styles.mainView}>
        <Text style={styles.pageHead}> View all drafts </Text>
        <TouchableOpacity
          onPress={() => this.draftWipe()}
          style={styles.buttonStyle}
          accessibilityLabel="Logout"
          accessibilityHint="Press the button to logout"
          accessibilityRole="button">
          <Text>Delete all drafts</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.chitDrafts}
          //style={styles.chitList}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => this.draftNav(item.chitPack)}
              style={styles.chitItem}
              accessibilityLabel="Logout"
              accessibilityHint="Press the button to logout"
              accessibilityRole="button">
              <Text>{item.chitPack}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={({chitPack}) => chitPack}
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
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3,
    elevation: 2,
    marginTop: 10,
    marginBottom: 10,
    height: 40,
    color: 'white',
  },
  chitHeader: {
    fontWeight: 'bold',
  },
  displayPhotoStyle: {
    alignSelf: 'center',
    paddingTop: 10,
  },
});
export default Drafts;
