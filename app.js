require('js-yaml');

var exec = require('child_process').exec,
    twitter = require('ntwitter'),
    config = require("./config.yml"),
    twit = new twitter(config.twitter);

var last_tweet;
var can_tweet = true;

console.log("The grammar police are out on patrol!\n");

twit.stream('statuses/filter', {'track':'your'}, function(stream) {
  stream.on('data', function (data) {
    if(can_tweet && validTweet(data)) {
      console.log("SUSPECT FOUND: "+data.text+" - "+data.id);

      //SUPER janky, but for some reason get a 401 error when trying to tweet
      //inside here.
      exec("ruby tweet.rb "+data.id+" "+data.user.screen_name, function(error, stdout, stderr) {
        console.log(stdout);
        console.log(data.user.screen_name + " APPREHENDED ");
        last_tweet = new Date();
        can_tweet = false;
      });
    }

    var now = new Date();

    if(now - last_tweet >= (2 * 60 * 60 * 1000)) {
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
