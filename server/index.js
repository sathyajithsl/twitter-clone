const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');
const app = express();
const db = monk('localhost/twitter');
const tweets = db.get('tweets');
const filter = new Filter();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.json({
      message: 'twitter'
    });
});

app.get('/tweet',(req,res) => {
  tweets
    .find()
    .then(tweets => {
      res.json(tweets);
    });
});
function isValidTweet(tweet){
  var name = tweet.name;
  var content = tweet.content;
  return name && name.toString().trim() !== '' && content && content.toString().trim() !== '';
}

//limit rate of posting 
//rate limiter is put here to affect only posting new tweets
//limit is 1 tweeet every 30 seconds
app.use(rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 1
}));

app.post('/tweet', (req, res) => {
  if(isValidTweet(req.body)){
    var name = filter.clean(req.body.name.toString());
    var content = filter.clean(req.body.content.toString());
    var tweet = {
      'name' : name,
      'content' : content,
      'created' : new Date()
    }
    tweets
      .insert(tweet)
      .then(createdTweet => {
        res.json(createdTweet);
      })
  } else {
    res.status(422);
    res.json({
      'message' : 'name and content required'
    })
  }
});

app.listen(5000, () => {
    console.log('5000');
});