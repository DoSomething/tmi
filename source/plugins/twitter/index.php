<?php

/**
 * Retrieves the access token needed for making API calls using Twitter's
 * application-only authentication.
 */

class TmiTwitterOauth2 {

  // URL to retrieve the access token.
  private $oauth2Url = 'https://api.twitter.com/oauth2/token';

  // The bearer token used to then require the access token.
  private $token;

  public function __construct($consumerKey, $consumerSecret) {
    $this->token = base64_encode($consumerKey . ':' . $consumerSecret);
  }

  public function fetchAccessToken() {

    $headers = array(
      'Authorization: Basic ' . $this->token,
      'Content-Type: application/x-www-form-urlencoded;charset=UTF-8',
    );

    $postFields = array(
      "grant_type" => "client_credentials",
    );
    $postQuery = http_build_query($postFields);

    // Get access token
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $this->oauth2Url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POST, count($postFields));
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postQuery);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($ch);
    curl_close($ch);

    echo $result;
  }
}

/**
 * Retrieves a number of tweets from a screen name.
 */

class TmiTweets {

  // API URL for fetching tweets from a user.
  private $url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';

  // Access token needed to make API calls.
  private $accessToken;

  // Number of tweets to fetch.
  private $numTweets;

  // Screen name of the user to fetch tweets from.
  private $screenName;

  public function __construct($_token, $_screenName, $_numTweets) {
    $this->accessToken = $_token;
    $this->screenName = $_screenName;
    $this->numTweets = $_numTweets;
  }

  public function fetch() {
    $url = $this->url . '?screen_name=' . $this->screenName . '&count=' . $this->numTweets;

    $headers = array(
      'Authorization: Bearer ' . $this->accessToken,
    );

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($ch);
    curl_close($ch);

    echo $result;
  }
}

// If there's no access_token provided, go and get it.
if (empty($_GET['access_token'])) {
  $consumerKey = getenv('TMITWEETS_CONSUMER_KEY') ? getenv('TMITWEETS_CONSUMER_KEY') : FALSE;
  $consumerSecret = getenv('TMITWEETS_CONSUMER_SECRET') ? getenv('TMITWEETS_CONSUMER_SECRET') : FALSE;

  if ($consumerKey && $consumerSecret) {
    $tmiOauth = new TmiTwitterOauth2($consumerKey, $consumerSecret);
    $tmiOauth->fetchAccessToken();
  }
  else {
    echo "Consumer key and/or consumer secret not set.";
  }
}
// If we've got the access_token, then go get the tweets.
else {
  $screenName = 'TMI_Agency';
  $count = isset($_GET['count']) ? $_GET['count'] : 3;
  $tmiTweets = new TmiTweets($_GET['access_token'], $screenName, $count);
  $tmiTweets->fetch();
}
