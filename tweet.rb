require 'twitter'
require 'yaml'

config = YAML.load_file('config.yml')

Twitter.configure do |c|
  c.consumer_key = config['twitter']['consumer_key']
  c.consumer_secret = config['twitter']['consumer_secret']
  c.oauth_token = config['twitter']['access_token_key']
  c.oauth_token_secret = config['twitter']['access_token_secret']
end

Twitter.update("@#{ARGV[1]} you're*", {'in_reply_to_status_id' => ARGV[0]})