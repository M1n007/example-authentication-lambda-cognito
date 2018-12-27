const AWSCognito = require("amazon-cognito-identity-js");

var poolData = {
    UserPoolId: "", // Your user pool id here
    ClientId: "" // Your client id here
};

var userPool = new AWSCognito.CognitoUserPool(poolData);


exports.signUp = (event, context, callback) => {

    var username = event.username;
    var password = event.password

    userPool.signUp(username, password, null, null, function (err, result) {
        if (err) {
            callback(null, err.message || JSON.stringify(err));
            return;
        }
        var cognitoUser = result.user;
        callback(null, 'user name is ' + cognitoUser.getUsername());
    });

};


