// This is where it all goes :)

$(function() {
  sjcl.random.startCollectors();

  AWS.config.region = 'us-east-1';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:04bf3f30-8ea2-44d5-961f-1b7f61450363',
    Logins: {}
  });

  AWS.config.logger = console;

  console.log("Hello world.");

  AWS.config.credentials.get(function() {
    var identityId = AWS.config.credentials.identityId;
    console.log(identityId);

    var syncClient = new AWS.CognitoSyncManager();
    syncClient.openOrCreateDataset('rubyonrails.co.uk', function(err, dataset) {
      dataset.put('hello', 'World', function(err, record) {
        dataset.synchronize({
          onSuccess: function(data, newRecords) {
            console.log("Success!");
            console.log(data);
            console.log(newRecords);
          }
        });
      });
    });

    var poolData = {
      UserPoolId: 'us-east-1_XRvr3oTui',
      ClientId: '7bqasb3pgsgt5cduktgqqugrgd',
      Paranoia: 7
    };

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var cognitoUser = userPool.getCurrentUser();
    if(cognitoUser != null) {
      cognitoUser.getSession(function(err, result) {
        if(result) {
          console.log('You are now logged in.');
        }
      });
    }

  });
});

function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);

  if(response.status === 'connected') {
    testAPI();
  } else if(response.status === 'not_authorized') {
    document.getElementById('status').innerHTML = 'Please log into this app';
  } else {
    document.getElementById('status').innerHTML = 'Please log into Facebook';
  }
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function testAPI() {
  console.log('Welcome! Fetching your information...');
  FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
  });
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("Google user information");
  console.log(profile);

  AWS.config.credentials.params.Logins['accounts.google.com'] = googleUser.getAuthResponse().id_token;
  AWS.config.credentials.expired = true;

  AWS.config.credentials.get(function() {
    console.log("Credentials gotten for Google. identityId = " + AWS.config.credentials.identityId);

    var syncClient = new AWS.CognitoSyncManager();
    syncClient.openOrCreateDataset('rubyonrails.co.uk', function(err, dataset) {
      dataset.put('currentLogin', 'Google', function(err, record) {
        dataset.put('name', profile.getName(), function(err, record) {
          dataset.put('email', profile.getEmail(), function(err, record) {
            dataset.synchronize({
              onSuccess: function(data, newRecords) {
                console.log('Google profile synchronised.');
              }
            });
          });
        });
      });
    });
  });
}
