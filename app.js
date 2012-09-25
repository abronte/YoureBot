require('js-yaml');

var twitter = require('ntwitter'),
    config = require("./config.yml");

var twit = new twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token,
  access_token_secret: config.twitter.access_secret
});

var last_tweet;
var can_tweet = true;

console.log("Streaming...");

twit.stream('statuses/filter', {'track':'your'}, function(stream) {
  stream.on('data', function (data) {
    if(validTweet(data) && can_tweet) {
      console.log("SUSPECT FOUND: "+data.text) 

      twit.verifyCredentials(function(err, resp){
        console.log(resp)
      })
      .updateStatus("you're*", {'in_reply_to_status_id':data.id}, function(resp) {
        console.log(data.user.screen_name + " APPREHENDED ");
        console.log(resp)

        last_tweet = new Date();
        can_tweet = false;
      });
    }

    var now = new Date();

    if(now - last_tweet >= (300 * 1000)) {
      can_tweet = true;
    }
  });
});   

// Messy as fuck, should refactor.
function validTweet(tweet) {
  var text = tweet.text.toLowerCase();

  if(tweet.in_reply_to_user_id == null && 
      tweet.in_reply_to_status_id == null &&
      text.indexOf("rt") == -1 && 
      text.indexOf("http:") == -1 &&
      text.indexOf("@") == -1 &&
      // tweet.retweet_count >= 10 &&
      ( text.indexOf("your not") > -1 ||
        text.indexOf("your trying") > -1 ||
        text.indexOf("your having") > -1 ||
        text.indexOf("your single") > -1 ||
        text.indexOf("your tired") > -1 ||
        text.indexOf("your over") > -1 ||
        text.indexOf("your just") > -1 )
      ) {
    return true;
  } else {
    return false;
  }
}
