import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableHighlight,
	ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import config from '../config'
import { Share } from 'react-native'
import { Card } from 'react-native-elements';
import { CheckBox } from 'react-native-elements'
import { List, ListItem } from 'react-native-elements'
import { TextField } from 'react-native-material-textfield';
import { KeepAwake, Speech } from 'expo';

class RecipePage extends React.Component {

	
  static navigationOptions = {
    title: 'Recipe Page',  
	headerTintColor: '#FFFFFF',
	headerStyle: {
	backgroundColor: '#388E3C',
	},
	headerTitleStyle: {
	fontSize: 18
	}  
  };


  shareTextMessage() {
    Share.share({
      message: "Hey check out this cool recipe I found: " + this.props.navigation.state.params.nextlink + "\n And also this cool app called Recipic!"
    })
    .then(this._showResult)
    .catch(err => console.log(err))
  }

  _showResult (result) {
    console.log(result)
  }

  constructor(props) {
    super(props);

	  console.log(this.props);
    this.state = {isFavourite : false,   
				  alldone: true,
				  inProgress: false};
//    this.addToFavourites = this.addToFavourites.bind(this);
    this.toggleFavourite = this.toggleFavourite.bind(this);
	  this.speak = this.speak.bind(this);


  }

sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

	toggleFavourite(){
		
		console.log(!this.props.screenProps.profile.sub);
		//this.props.screenProps.login(); 
		if(!!this.props.screenProps.profile.sub){
			var fav = !this.state.isFavourite;
			this.setState({isFavourite : fav});
			console.log(fav);
			let myRequest = new Request(`${config.API_BASE}/api/db/favourite`, {
      method: 'POST',
      // this header sends the user token from auth0
      headers: {'Accept': 'application/json','Content-Type': 'application/json'},
	  body: JSON.stringify({
      'recipe': this.state.recipe,
		  'fav': fav,
		  'userId': this.props.screenProps.profile.sub,
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
        this.setState({ 'authStatus': 'works!' });
      })
      .catch(error => {
        console.log("server call!")
      });
			
		}else{
			this.props.screenProps.login(); 
		}
		
		
	}


  componentDidMount() {
this.props.navigation.setParams({ handleShare: this.shareTextMessage });
	  console.log('component did mount called');
    let myRequest = new Request(`${config.API_BASE}/api/db/getRecipe`, {
    method: 'POST',
    headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'url': this.props.navigation.state.params.nextlink,
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
//		      console.log(json);
		this.setState({'recipe': json});

      })
	  
	  let myRequest1 = new Request(`${config.API_BASE}/api/db/isFavourite`, {
    method: 'POST',
    headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'url': this.props.navigation.state.params.nextlink,
	'userId': this.props.screenProps.profile.sub, 
    }),
  });
    // console.log('request', myRequest);

    fetch(myRequest1)
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
		this.setState({isFavourite: json.isFav});
      })
  }

speak(tospeak, from){
	console.log(tospeak);
	this.setState({from: from});
	
	if(this.state.inProgress){
		this.setState({alldone: false});
		this._stop();
	}
	
	if(!!tospeak){
		this._speak(tospeak, from);	
	}else{
		this.setState({alldone: true});
	}
}

 _speak = (tospeak, from) => {
    const start = () => {
      this.setState({ inProgress: true });
    };
    const complete = () => {
		this.sleep(1000);
      if(this.state.inProgress){
		  this.setState({ inProgress: false});
	  }
		
//		setTimeout(function(){speak(tospeak.slice(1), from);}, 3000);
		this.speak(tospeak.slice(1), from);
    };
	 const finish = () => {
		if(this.state.inProgress){
		  this.setState({ inProgress: false, alldone:true});
	  }
    };

    Speech.speak(tospeak[0], {
      language: "en",
      pitch: 1,
      rate: 0.75,
      onStart: start,
      onDone: complete,
      onStopped: finish,
      onError: finish,
    });
  };

  _stop = () => {
    Speech.stop();
  };

	
  _keyExtractor = (item, index) => item.id;

  renderItem({ item, index }) {
      return <TouchableHighlight
		activeOpacity={1}
								 underlayColor="#eee"><Text style={{textAlign: 'left'}}>&#10148; {item}{"\n"}</Text></TouchableHighlight>;
   }

   readIngrediants(){
     console.log(this.props.screenProps);
     for(let i = 0; i < this.state.data.length; i++){
       Expo.Speech.speak(this.state.data[i], {pitch: 1.0, rate: 1.0, language: "en-US" })
     }
   }

  render() {
const {profile, login, logout, getAuthorizationHeader} = this.props.screenProps;
//  console.log(this.state.isFavourite);

    if(this.state.isFavourite){
      icon = <Ionicons name="md-heart" size={40} color="#FF0000" style={{width: 50, height: 40, marginTop: 5}} onPress={this.toggleFavourite}/>
    }
    else {
      icon = <Ionicons name="md-heart-outline" size={40} color="#2b2b3c" style={{width: 50, height: 40, marginTop: 5}} onPress={this.toggleFavourite}/>
    }
	  
	 console.log("Recipe in set state" + this.state.recipe);

  return (
    <View>
	  <KeepAwake/>
		  {this.state.recipe &&
	  <ScrollView>
		   <View style={{paddingHorizontal: 10}}>
		  <View style={{flexDirection: 'row', alignSelf: 'center'}}>
	  
        <Image
            style={{width: 360, height: 200}}
            source={{uri: this.state.recipe.imageurl}}
          />
      </View>
      <View style={{flexDirection: 'row', width: 400, alignItems: 'center', justifyContent: 'space-between'}}>
         <View style={{width: 250}}>
      <Text style={{fontSize:22, textAlign: 'left', fontFamily:'sans-serif-condensed', fontWeight: 'bold'}}>{this.state.recipe.title}</Text>
      </View>
		<View style={{flexDirection: 'row' ,alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 50}}>
        {icon}	
		<Ionicons name="md-share" size={40} style={{width: 30, height: 40, marginTop: 5, marginRight: 10}} onPress={ () => this.shareTextMessage() }/>	
		</View>  
      </View>

      <View style={{alignItems: 'flex-start', marginTop: 20}}>
	  <View Style={{flexDirection: 'row', width: 400, alignItems: 'center'}}>	  
      <View><Text style={{fontSize:18, fontFamily:'sans-serif-condensed', color:'#388E3C', fontWeight: 'bold'}}>Ingredients</Text></View>  
	  <View>
		  {this.state.alldone && (this.state.from!="ing" || !this.state.inProgress) && <Ionicons name="md-volume-up" size={40} style={{marginBottom: 10}} onPress={() => this.speak(this.state.recipe.ingredients, "ing")}/>}
		   {!(this.state.alldone && (this.state.from!="ing" || !this.state.inProgress) ) && <Ionicons name="md-volume-off" size={40} style={{marginBottom: 10}} onPress={() => this._stop()}/>}
	  </View>
	  </View>	  

      <FlatList
          data={this.state.recipe.ingredients}
          renderItem={this.renderItem}
		   keyExtractor={(item, index) => index}
      />
      </View>
      <View style={{alignItems: 'flex-start', marginTop: 25}}>
	  <View Style={{flexDirection: 'row'}}>
      <Text style={{fontSize:18, fontFamily:'sans-serif-condensed', color:'#388E3C', fontWeight: 'bold'}}>Directions</Text>
		   {this.state.alldone && (this.state.from!="ste" || !this.state.inProgress) && <Ionicons name="md-volume-up" size={40} style={{marginBottom: 10}} onPress={() => this.speak(this.state.recipe.steps, "ste")}/>}
		   {!(this.state.alldone && (this.state.from!="ste" || !this.state.inProgress)) && <Ionicons name="md-volume-off" size={40} style={{marginBottom: 10}} onPress={() => this._stop()}/>}
       </View>  
	  <FlatList
          data={this.state.recipe.steps}
          renderItem={({item})=>
			<TouchableHighlight
		activeOpacity={1}
				 onPress={() => {this.speak([item], "abs");}}
				 underlayColor="#eee"><Text style={{textAlign: 'left', lineHeight: 30}}>&#10148; {item}{"\n\n"}</Text></TouchableHighlight>
		}
		   keyExtractor={(item, index) => index}
      />
      </View>
	  
	  </View>
		  </ScrollView>
			  }
		  
		  {!this.state.recipe && <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
		padding: 50,
			marginTop: 200
      }}>
			
		<Image style ={{width:150, height:150}}
          source={require('../images/angry-burger.png')}
        />
		<Text style={{fontSize:18, textAlign: 'center'}}>{"Why is the internet so slow? :/"}</Text>
				</View>}
      
    </View>
    );
  }

}

export default RecipePage;
