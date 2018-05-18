var express = require('express');
var router = express.Router();
var request = require('request');
const cheerio = require('cheerio');

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');
var ObjectId = require('mongodb').ObjectID;

// simple API call, no authentication or user info
router.get('/unprotected', function(req, res, next) {

  req.db.collection('max_todo').find().toArray(function(err, results) {
    if (err) {
      next(err);
    }

    res.json({
      todos: results
    });
  });

});

router.post('/search', function(req, res, next){

  var searchterm = req.body.searchterm;
  // var searchterm = "ham sandwich"
  console.log(searchterm);
  var AllRecipes = new Object();

  var link = "https://food52.com/recipes/search?q=" + searchterm;
  request(link, function (error, response, body) {
    var recipes = [];
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
       $('div.collectable-tile').each(function(i, element){
        // if(!($(this).hasClass('hub-card') || $(this).hasClass('video-card')) && !($(this).next().hasClass('article-card'))){
          var recipe = new Object();
          var name = $(this).find('.photo').attr('title');
          var nextlink = "https://food52.com" + $(this).find('.photo').attr('href');
          var imageurl = $(this).find('img.quick-basket-img').attr('data-pin-media');
          var recipeby = $(this).find('h3').find('.meta').find('.username').text();

          if(!!name && !!imageurl && !!recipeby && !!nextlink){
            recipe.title = name.trim();
            recipe.imageurl = imageurl.trim();
            recipe.recipeby = recipeby.trim();
            recipe.nextlink = nextlink.trim();
            recipes.push(recipe);
          }
      });
      console.log(recipes);
      AllRecipes.food52 = recipes;
    }

    // Allrecipes.com
    var link = "http://allrecipes.com/search/results/?wt=" + searchterm;
    request(link, function (error, response, body) {
      var recipes = [];
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        $('article.grid-col--fixed-tiles').each(function(i, element){
          if(!($(this).hasClass('hub-card') || $(this).hasClass('video-card')) && !($(this).next().hasClass('article-card'))){
            var recipe = new Object();
  	        var a = $(this).find('h3').text();
            var imageurl = $(this).find('img').attr("data-original-src");
            var text = $(this).find('div.rec-card__description').text();
            var recipeby = $(this).find('ul.cook-details').find('li').find('h4').text();
            var nextlink = "http://allrecipes.com" + $(this).find('a').attr("href");

            if(!!a && !!imageurl && !!text && !!recipeby && !!nextlink){
              recipe.title = a.trim();
              recipe.imageurl = imageurl.trim();
              recipe.text = text.trim();
              recipe.recipeby = recipeby.substring(10).trim();
              recipe.nextlink = nextlink.trim();
  	          recipes.push(recipe);
            }
          }
        });
        console.log(recipes);
        AllRecipes.allrecipes = recipes
        res.json(AllRecipes);
      }
    });


  });
});


// checkJwt middleware will enforce valid authorization token
router.get('/protected', checkJwt, function(req, res, next) {

  req.db.collection('max_todo').find().toArray(function(err, results) {
    if (err) {
      next(err);
    }

    res.json({
      todos: results
    });
  });

  // the auth0 user identifier for connecting users with data
  console.log('auth0 user id:', req.user.sub);

  // fetch info about the user (this isn't useful here, just for demo)
  const userInfoUrl = req.user.aud[1];
  const bearer = req.headers.authorization;
  fetch(userInfoUrl, {
  	headers: { 'authorization': bearer },
  })
    .then(res => res.json())
    .then(userInfoRes => console.log('user info res', userInfoRes))
    .catch(e => console.error('error fetching userinfo from auth0'));

});


router.post('/getRecipe', function(req, res, next){
  var link=req.body.url;
  // var imageurl =req.body.img;

  if(link.indexOf('allrecipes')!=-1){
    request(link, function (error, response, body) {
      const $ = cheerio.load(body);
      var currentRecipe = new Object();
      var mhead = $('.recipe-summary__h1').text()
      var rname = $('.submitter__name').text()
      var desc = $('.submitter__description').text()
       var imageurl = $('.hero-photo__wrap').find('img').attr("src");
      var prepTime = $('.prepTime__item').find('[itemprop="prepTime"]').text()
      var cookTime = $('.prepTime__item').find('[itemprop="cookTime"]').text()
      var readyTime = $('.prepTime__item').find('[itemprop="totalTime"]').text()


      var ingredients = [];
      var yt = $('section.recipe-ingredients');
      $(yt).find('ul').each(function(i,element){
        $(this).find('li').each(function(i, element){
          var a = $(this).find('span.recipe-ingred_txt').text().trim();
          if(!!a && a!="Add all ingredients to list")
          ingredients.push(a);
        });

      });

      var recsteps = [];
      $('.directions--section__steps').find('li').each(function(i, element){
        var a = $(this).find('span.recipe-directions__list--item').text().trim();
        if(!!a)
        recsteps.push(a);
      });

      currentRecipe.title=mhead.trim();
      currentRecipe.imageurl=imageurl.trim();
      currentRecipe.recipeby=rname.trim();
      currentRecipe.desc=desc.trim();
      currentRecipe.ingredients=ingredients;
      currentRecipe.prepTime=prepTime.trim();
      currentRecipe.cookTime=cookTime.trim();
      currentRecipe.readyTime=readyTime.trim();
      currentRecipe.nextlink = link;
      currentRecipe.steps=recsteps;
      console.log(currentRecipe);
      res.json(currentRecipe);
    });
  }


  else if(link.indexOf('food52')!=-1){
    request(link, function (error, response, body) {
      console.log(body);
      const $ = cheerio.load(body);
      var currentRecipe = new Object();

      var title = $('.article-header-title').text();
      var recipeby = $('.article-header-meta').find('[itemprop="author"]').text();
      var desc = $('.recipe-note').find('[itemprop="description"]').text();
      var ingredients = [];
      var directions = [];
      console.log(imageurl);
      $('section.clearfix').each(function(i, element){
        $(this).find('ul.recipe-list').find('li').each(function(i, element){
          var ingredient = "";
          $(this).find('span').each(function(i, element){
            ingredient+= $(this).text().trim()+" ";
          });
          ingredients.push(ingredient.trim());
        });

        $(this).find('[itemprop="recipeInstructions"]').each(function(i, element){
          directions.push($(this).text().trim());
        });

      });

      currentRecipe.imageurl = imageurl.trim();
      currentRecipe.title = title.trim();
      currentRecipe.recipeby = recipeby.trim();
      currentRecipe.desc = desc.trim();
      currentRecipe.ingredients = ingredients;
      currentRecipe.nextlink = link;
      currentRecipe.directions = directions;
      console.log(currentRecipe);
      res.json(currentRecipe);
    });
  }

});

router.post('/favourite', function(req, res, next) {

  var recipe = req.body.recipe;
  var fav = req.body.fav;
  var userId = req.body.userId;

  // console.log(recipe);
  console.log(userId);

  if(fav==true){
    req.db.collection('user_fav').insertOne({userId: userId, recipe:recipe}, function(err, results){
      if (err) {
        next(err);
      }
      console.log(results);
      res.json({results});
    });
  }else{
    req.db.collection('user_fav').deleteOne({userId: userId, 'recipe.nextlink':recipe.nextlink}, function(err, results){
      if (err) {
        next(err);
      }
      console.log(results);
      res.json({results});
    });
  }




  // the auth0 user identifier for connecting users with data
  // console.log('auth0 user id:', req.user.sub);
  //
  // // fetch info about the user (this isn't useful here, just for demo)
  // const userInfoUrl = req.user.aud[1];
  // const bearer = req.headers.authorization;
  // fetch(userInfoUrl, {
  // 	headers: { 'authorization': bearer },
  // })
  //   .then(res => res.json())
  //   .then(userInfoRes => console.log('user info res', userInfoRes))
  //   .catch(e => console.error('error fetching userinfo from auth0'));
  //
  //   res.send("kjhkj");

});


router.post('/getFavourites', function(req, res, next) {

  req.db.collection('user_fav').find({userId: req.body.userId, }).toArray(function(err, results) {
    if (err) {
      next(err);
    }

    res.json({
      recipes: results
    });
  });
});


router.post('/isFavourite', function(req, res, next) {
var isFav;
  req.db.collection('user_fav').find({userId: req.body.userId, 'recipe.nextlink':req.body.url}).toArray(function(err, results) {
    if (err) {
      next(err);
    }
    if(results.length==0){
      isFav=false;
    }else{
      isFav=true;
    }
    console.log(isFav);
    res.json({
      isFav: isFav
    });
  });
});


module.exports = router;
