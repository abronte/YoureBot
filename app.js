require('js-yaml');

var twitter = require('ntwitter'),
    config = require("./config.yml"),
    twit = new twitter(config.twitter);

var last_tweet;
var can_tweet = true;

console.log("The grammar police are out on patrol!\n");

twit.stream('statuses/filter', {'track':'your'}, function(stream) {
  stream.on('data', function (data) {
    if(validTweet(data) && can_tweet) {
      console.log("SUSPECT FOUND: "+data.text) 

      twit.updateStatus("you're*", {'in_reply_to_status_id':data.id}, function(resp) {
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
