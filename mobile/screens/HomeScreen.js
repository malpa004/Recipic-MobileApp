import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// example of using an expo Component
// https://docs.expo.io/versions/latest/sdk/keep-awake.html
import { KeepAwake } from 'expo';


class HomeScreen extends React.Component {


  static navigationOptions = {
      title: 'HomeScreen',
    };
  render() {
    // console.log('HomeScreen props!', this.props)
    const { navigate } = this.props.navigation;
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Home Screen</Text>
          <Button
            onPress={() => navigate('RecipePage')}
            title="Go to Recipe Page"
          />
        </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  spaced: {
    marginTop: 20,
  }
});

export default HomeScreen;
