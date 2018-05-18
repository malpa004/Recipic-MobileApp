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
	FlatList,
	Linking
} from 'react-native';
import { ImagePicker } from 'expo';
import RecipeCard from './Card';
import ErrorMsgBurgers from './ErrorMsgBurgers';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements'
import config from '../config'

class SearchRecipe extends React.Component {


  constructor(props) {
	  
    super(props);
const {profile, login, logout, getAuthorizationHeader} = this.props.screenProps;
	  this.state = {
    	message: 'This is the Search Recipes Page',
		image: null,
		image_base64: "",
		searchterm: "",
		isLoading:false,
		notSearchedYet: true,
		notFood: false,
		noResult: false,
		searchedFor: "",
		data:{title:"Spaghetti Sauce with Ground Beef", img:'http://images.media-allrecipes.com/userphotos/250x250/00/66/77/667748.jpg', recipeBy: 'Random Person'}
    }
  }

  componentDidMount() {
  }
	startSearch = () => {
		
		this.setState({isLoading:true, notSearchedYet: false, notFood: false, noResult: false, recipes: [], searchedFor:this.state.searchterm} );
		
		console.log("Submitted: " + this.state.searchterm);
		let myRequest = new Request(`${config.API_BASE}/api/db/search`, {
      method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    'searchterm': this.state.searchterm,
  }),	
    });
    // console.log('request', myRequest);

    fetch(myRequest)
      .then(response => {
        // https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(res => res.json())
      .then(json => {
		console.log(json);
		this.setState({recipes: json, isLoading:false});
		if(json.allrecipes.length==0 && json.food52.length==0)
			{
				this.setState({noResult:true});
			}
      })
      .catch(error => {
        this.setState({ 'authStatus': 'broken; are you logged in? check logs.' });
      });
	}


  render() {
	  let { image } = this.state;
	  
    return (
      <View style={{flex: 1}}>
			
		<View style={{flexDirection: 'row'}}>
			

				
			<View style={{flex: 1, marginHorizontal: 15, marginBottom: 0}}>
			<TextField
			label='Search Recipe'  
        	value={this.state.searchterm}
        	onChangeText={(searchterm) => this.setState({searchterm})}	
			onSubmitEditing={this.startSearch}
			returnKeyType={"search"}	
			tintColor='#388E3C'	
			style={{marginBottom: 0}}
      		/>
			</View>

<Ionicons name="md-camera" size={32} color={'#2b2b3c'} onPress={this._pickImageCamera} style={{width: 45, height: 30, marginTop: 30}}/>
			
<Ionicons name="md-photos" size={32} color={'#2b2b3c'} onPress={this._pickImageCameraRoll} style={{width: 45, height: 30, marginTop: 30}}  />
	</View>
			
			{!!this.state.searchedFor && !this.state.isLoading && <Text style={{fontSize:14, textAlign: 'center', marginHorizontal:15}}>{'Showing results for "' + this.state.searchedFor + '"'}</Text>}
			
			<View style={{paddingHorizontal: 90, marginTop: 10, marginBottom: 10}}>
			{!!this.state.searchedFor && !this.state.isLoading && !this.state.notSearchedYet && <Button title="Search on YouTube" color="#FF0000" onPress={() => Linking.openURL('https://www.youtube.com/results?search_query='+this.state.searchedFor+'+recipe')}>
      		<Text>Press me</Text>
    		</Button>}	
			</View>	
			
			{this.state.isLoading && <ActivityIndicator size="large" color="#000" />}
			
			{this.state.isLoading && <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
		padding: 50,
			marginTop: 20
      }}>
			
		<Image style ={{width:150, height:150}}
          source={require('../images/angry-burger.png')}
        />
		<Text style={{fontSize:18, textAlign: 'center'}}>{"Why is the internet so slow? :/"}</Text>
				</View>}
									
			{this.state.notSearchedYet && <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
		padding: 50,
			marginBottom: 100
      }}>
			
		<Image style ={{width:200, height:200}}
          source={require('../images/search-burger.png')}
        />
		<Text style={{fontSize:18, textAlign: 'center'}}>{"Search for any recipe. You can use the search bar or upload an image :)"}</Text>
				</View>}
			
			{this.state.notFood && <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
		padding: 50,
			marginTop: 50
      }}>
			
		<Image style ={{width:200, height:200}}
          source={require('../images/confused-burger.png')}
        />
		<Text style={{fontSize:18, textAlign: 'center'}}>{"Are you sure that was an image of food? Please try uploading another image :)"}</Text>
				</View>}
			
			{this.state.noResult && <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
		padding: 50,
			marginTop: 50
      }}>
			
		<Image style ={{width:200, height:200}}
          source={require('../images/sad-burger.png')}
        />
		<Text style={{fontSize:18, textAlign: 'center'}}>{'Sorry we couldn\'t find any recipes for "'+this.state.searchedFor+'" :('}</Text>
				</View>}
			
			{this.state.recipes && <FlatList
  data={this.state.recipes.allrecipes}
  renderItem={({item}) => <RecipeCard {...this.props} key={item.nextlink} data={item}/>}
			 keyExtractor={(item, index) => index}
/>}

									
      </View>
		
    );
  }
													

sendImage()
{
	this.setState({isLoading:true, notSearchedYet:false, notFood: false, noResult: false, searchterm: "", recipes:[], searchedFor:""});
	
		const new_req = {
		"requests": [{
			"image": {
				"content": this.state.image_base64 },
			"features": [{
				"type": "LABEL_DETECTION",
				"maxResults": 100
			}]
		}]
	};	
	
	
		fetch("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyD85XfS8cndzKdDB6z_Qp4r05hGFbBSC-w",{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(new_req)
		})
		.then(res => {
//				console.log(res);
				
				var myObject = JSON.parse(res._bodyInit);
//			console.log(myObject.responses[0].labelAnnotations);
			var food = false;
			for(var i in myObject.responses[0].labelAnnotations){
				if(myObject.responses[0].labelAnnotations[i].description.indexOf('food')!=-1){
//					console.log(myObject.responses[0].labelAnnotations[i].description);
					food = true;
				}
			}
			if(food){
				this.setState({'searchterm':myObject.responses[0].labelAnnotations[0].description});
				this.startSearch();
			}
			else{
				this.setState({notFood:true, isLoading:false, recipes:[], searchterm:""});
			}
		})
			 //JSON.parse(res.bodyInit))
		.then(body => {
			//this.setState({fromVisionAPI:})
			console.log(body);
		});
	
	
	
	
}
  
  _pickImageCamera = async () => {
	  
	  
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
		base64: true,
		quality: 0.5
    });

//    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri, image_base64: result.base64 });
		this.sendImage();
    }
	  
	  
  };

_pickImageCameraRoll = async () => {
	  
	  
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
		base64: true,
		quality: 0.5
    });

//    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri, image_base64: result.base64 });
	// send this to the server
		this.sendImage();
    }
	  
	  
  };
}

export default SearchRecipe;
