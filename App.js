import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
  SegmentedControlIOS
} from 'react-native';

export default class App extends React.Component {

  constructor (props) {
    super(props);
    const storyTypes = ['top', 'best', 'new', 'ask', 'show', 'job'];
    this.state = {
      storyTypes: storyTypes,
      isLoading: true,
      selectedIndex: 0
    };
  }

  async getStories(storyType) {
    let data = [];
    const numberOfItems = 10;
    try {
      let response = await fetch(`https://hacker-news.firebaseio.com/v0/${storyType}stories.json?print=pretty`);
      let responseJson = await response.json();

      let requests = [];

      for (let id of responseJson) {
        requests.push(fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`));

        if (requests.length >= numberOfItems) {
          break;
        }
      }

      for (let request of requests) {
        let itemResponse = await request;
        let itemResponseJson = await itemResponse.json();
        data.push(itemResponseJson);
      }
      
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateStories() {
    let currentStoryType = this.state.storyTypes[this.state.selectedIndex];
    let stories = await this.getStories(currentStoryType);
    this.setState({
      isLoading: false,
      dataSource: stories,
    });
  }
  
  componentDidMount() {
    this.updateStories();
  }

  render() {
    if (this.state.isLoading) {
      return(
        <View style={{flex: 1, padding: 30, alignItems: 'center'}}>
          <ActivityIndicator/>
        </View>
      );
    }

    return (
      <View style={altStyles.container}>
        <Text>{this.state.storyTypes[this.state.selectedIndex]}</Text>
        <FlatList 
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.score} - {item.title}</Text>}
          keyExtractor={(item, index) => `${index}`}
        />
        <SegmentedControlIOS
          values={this.state.storyTypes}
          selectedIndex={this.state.selectedIndex}
          onChange={(event) => {
            this.setState({
              selectedIndex: event.nativeEvent.selectedSegmentIndex,
              isLoading: true,
            });
            this.updateStories();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50
  },
});

const altStyles = StyleSheet.create({
  container: {
    paddingTop: 50
  },
});
