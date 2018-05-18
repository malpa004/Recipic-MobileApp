import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
	Image,
	ScrollView,
	ActivityIndicator,
	FlatList
} from 'react-native';
import { ImagePicker } from 'expo';
import RecipeCard from './Card';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements';
import config from '../config'

class ErrorMsgBurgers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: 'This is the Saved Recipes Page',
    }
	  
	  if(this.props.image == 'sad'){
		  this.setState({image: '../images/sad-burger.png'})
	  }
  }

  componentDidMount() {
  }

  render() {
	  console.log(this.props.image);
    return (
		<View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
		padding: 50,
			marginBottom: 100
      }}>
		<Text style={{fontSize:18, textAlign: 'center'}}>{this.props.errorText}</Text>
				</View>
      
    );
  }

}
export default ErrorMsgBurgers;

