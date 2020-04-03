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
  //Runs the specified functions whenever the user navigates to the page
  componentDidMount() {
    this.takeFocus = this.props.navigation.addListener('willFocus', () => {
      this.loadCurrentDrafts();
    });
    this.loadCurrentDrafts();
  }
  //Loads the list of saved drafts
  async loadCurrentDrafts() {
    const currentDrafts = await AsyncStorage.getItem('chitDrafts');
    const formattedDrafts = await JSON.parse(currentDrafts);
    this.setState({
      chitDrafts: formattedDrafts,
    });
    console.log(
      'Loaded data from drafts: ' + JSON.stringify(this.state.chitDrafts),
    );
  }
  //Stores the draft content to display on another page
  storeSearchID = async chitPack => {
    try {
      console.log('Chit data:', chitPack);
      await AsyncStorage.setItem('selecChit', JSON.stringify(chitPack));
    } catch (error) {
      console.log(error);
    }
  };
  //Navigation to the view draft screen
  draftNav = selectedChit => {
    this.storeSearchID(selectedChit);
    this.props.navigation.navigate('DraftView');
  };
  //Wipes all of the saved drafts
  async draftWipe() {
    try {
      await AsyncStorage.removeItem('chitDrafts');
      Alert.alert('All drafts deleted');
      console.log('All drafts deleted');
    } catch (error) {
      console.log(error);
    }
  }
  //Renders the screen
  render() {
    return (
      <View style={styles.pageBase}>
        <Text style={styles.pageHead}> View all drafts </Text>
        <TouchableOpacity
          onPress={() => this.draftWipe()}
          style={styles.buttonStyle}
          accessibilityLabel="Delete all drafts"
          accessibilityHint="Click to delete all drafts from storage"
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
              accessibilityLabel="Draft edit"
              accessibilityHint="Click to navigate to draft edit screen"
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
  pageBase: {
    flex: 1,
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
