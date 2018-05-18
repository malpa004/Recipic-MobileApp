import Expo from 'expo';
import React from 'react';
import {
  	Button,
  	StyleSheet,
	Text,
	View,
	Platform,
	StatusBar
} from 'react-native';
import navigation, { TabNavigator, StackNavigator } from 'react-navigation';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

import { withAuth } from './Auth';

import SearchRecipe from './screens/SearchRecipe';
import SavedRecipes from './screens/SavedRecipes';
import RecipePage from './screens/RecipePage';
import HomeScreen from './screens/HomeScreen';

const InitialScreen = TabNavigator({
    Search: {screen: SearchRecipe},
    Saved: {screen: SavedRecipes}
  },
  {
    tabBarPosition: 'top',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
	  style: {
    backgroundColor: '#388E3C',
  	},
		indicatorStyle: {
    	backgroundColor: '#FFFFFF',
		height: 3,
  	},
		labelStyle: {
    	fontWeight: 'bold',
		fontSize: 14,
  	},
    },
});


// const HomeScreen = ({ navigation }) => (
//   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//     <Text style={styles.title}>Home Screen</Text>
//     <Button
//       onPress={() => navigation.navigate('RecipePage')}
//       title="Go to Recipe"
//     />
//   </View>
// );

const DetailsScreen = ({navigation}) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={styles.title}>Details Screen</Text>

  </View>
);

const RootNavigator = StackNavigator({
  Home: {screen: InitialScreen,
    navigationOptions: {
      header: null
    }
  },
  RecipePage: {
    screen: RecipePage,
  },
});

class App extends React.Component {

  render() {
    return (
      // TODO: Add Navigator in view and provide padding: https://github.com/react-community/react-navigation/issues/1478
		<View style={{flex:1}}>
		<View style={styles.statusBar} />
        	<RootNavigator screenProps={this.props} />
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
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  }, statusBar: {
    backgroundColor: "#45c006",
    height: StatusBar.currentHeight,
  },

});
Expo.registerRootComponent(withAuth(App));
