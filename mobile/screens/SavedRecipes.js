import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
} from 'react-native';

import config from '../config';
import RecipeCard from './Card';

class SavedRecipes extends React.Component {

  constructor(props) {
    super(props);
	  	  const {profile, login, logout, getAuthorizationHeader} = this.props.screenProps;
    this.state = {
      message: 'This is the Saved Recipes Page',
	  noRecipeYet: true,
		isFetching: false
    }
  }
	
	 onRefresh() {
    console.log('refreshing');
    this.setState({ isFetching: true }, function() {
      this.getData(this.props.screenProps.profile.sub)
    });
  }
	
getData(userid){
	
	console.log("Send from render" + userid);
		  let myRequest = new Request(`${config.API_BASE}/api/db/getFavourites`, {
      method: 'POST',
      // this header sends the user token from auth0
      headers: {'Accept': 'application/json','Content-Type': 'application/json'},			
	  body: JSON.stringify({'userId': userid}),			
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
		  this.setState({isFetching: false, recipes:json.recipes, noRecipeYet:false});
      })
      .catch(error => {
        console.log("server call!")
      });
	}
	


  componentDidMount() {
	  console.log("This is component did it really mount??");
	  console.log("ID is " + this.props.screenProps.profile.sub);
		
	if(!!this.props.screenProps.profile.sub && this.state.noRecipeYet)
	{
		this.getData(this.props.screenProps.profile.sub);
  	}
  }

  render() {
	  console.log(this.state.recipes);
	  //this.props.screenProps.logout();
	  console.log(this.props.screenProps.profile.sub);
	  if(!!this.props.screenProps.profile.sub && this.state.noRecipeYet)
	{
		  this.getData(this.props.screenProps.profile.sub);
	  }
	  
    return (
      <View>
		
		{!this.props.screenProps.profile.sub && <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
		padding: 50,
			marginTop:150
      }}>

		<Image style ={{width:200, height:200}}
          source={require('../images/save-burger.png')}
        />
		<Text style={{fontSize:18, textAlign: 'center'}}>{"You are not logged in yet. Log in to see your saved recipes :)"}</Text>
					<View style={{height: 50, width: 75, marginTop: 5}}>
					<Button title="Login" color='#388E3C' onPress={ () => this.props.screenProps.login()}/>
					</View>
				</View>}

		{!!this.props.screenProps.profile.sub && (!this.state.recipes || this.state.recipes.length==0) && <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
		padding: 50,
			marginTop: 150
      }}>

		<Image style ={{width:200, height:200}}
          source={require('../images/save-burger.png')}
        />
		<Text style={{fontSize:18, textAlign: 'center'}}>{"You've not saved any recipes yet. Click on the heart in any recipe you like :)"}</Text>
					
				</View>}
			
			{this.state.recipes && this.state.recipes.length>0 && this.props.screenProps.profile.sub && <Text style={{fontSize: 28, textAlign: 'center', fontWeight: 'bold', marginTop: 10, color: '#2b2b3c'}}>Your favorite recipes! </Text>}
						
			{this.state.recipes && this.state.recipes.length>0 && <FlatList
  data={this.state.recipes}
		onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
  renderItem={({item}) => <RecipeCard {...this.props} key={item.recipe.nextlink} data={item.recipe}/>}
			 keyExtractor={(item, index) => index}
/>}
      </View>
    );
  }

}

//        <Button
//                 onPress={() => this.props.navigation.navigate('RecipePage')}
//                 title="Go to Recipe"
//               />

export default SavedRecipes;
