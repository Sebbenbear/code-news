import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';

export default class App extends React.Component {

  constructor (props) {
    super(props);
    this.state = { isLoading: true };
  }

  async getTopStories() {
    let data = [];
    try {
      let response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
      let responseJson = await response.json();

      for (let i = 0; i < 20; i++) { //responseJson.length
        let id = responseJson[i];
        let itemResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        let itemResponseJson = await itemResponse.json();
        data.push(itemResponseJson);
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async componentDidMount() {
    let stories = await this.getTopStories();
    this.setState({
      isLoading: false,
      dataSource: stories,
    });
  }

  render() {
    if (this.state.isLoading) {
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.score} - {item.title}</Text>}
          keyExtractor={(item, index) => `${index}`}
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
    padding: 20
  },
});
