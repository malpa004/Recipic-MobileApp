import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  Image,
  ListItem,
  View,
TouchableHighlight
} from 'react-native';

import { Card } from 'react-native-elements';

import config from '../config'

class RecipeCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: 'This is the Saved Recipes Page',
    }
  }

  componentDidMount() {
  }
	
	onPress(link){
		console.log("You pressed the card: " + link);
	}

  render() {
    return (
<Card flexDirection='row' >
	<TouchableHighlight 
		onPress={() => this.props.navigation.navigate('RecipePage', {nextlink:this.props.data.nextlink})}
		activeOpacity={1}
          underlayColor="#eee">
	  <View style={{flex: 1, flexDirection:'row', marginRight:110}}>
				<Image
				style={{height: 100, width: 100, borderRadius:10, marginRight:10}}
				source={{uri: this.props.data.imageurl}}
				/>
				<View>
				<Text numberOfLines={3} ellipsizeMode ={'tail'} style={{fontSize:18, marginBottom:10, marginRight: 110}}>
				  {this.props.data.title}
				</Text>
			<Text style={{color:'#388E3C', marginRight: 110}}>
				By: {this.props.data.recipeby}
			</Text>
			</View>
</View>
	</TouchableHighlight>
			</Card>
      
    );
  }

}

export default RecipeCard;