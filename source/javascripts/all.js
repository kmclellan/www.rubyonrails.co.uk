// This is where it all goes :)

$(function() {
  AWS.config.region = 'us-east-1';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:04bf3f30-8ea2-44d5-961f-1b7f61450363',
  });

  AWS.config.logger = console;

  console.log("Hello world.");

  var identityId = AWS.config.credentials.identityId;

  console.log(identityId);

  AWS.config.credentials.get(function() {
    console.log("Got into credentials.get");
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
  });
});
