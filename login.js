var mysql = require("mysql");
const AWSCognito = require("amazon-cognito-identity-js");

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "",
    user: "root",
    password: "testing",
    database: ""
});

var poolData = {
    UserPoolId: "", // Your user pool id here
    ClientId: "" // Your client id here
};

var userPool = new AWSCognito.CognitoUserPool(poolData);


exports.Login = (event, context, callback) => {

    var username = event.username;
    var password = event.password

    var authenticationData = {
        Username: username, // your username here
        Password: password, // your password here
    };

    var authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);

    var userData = {
        Username: username,
        Pool: userPool
    }

    var cognitoUser = new AWSCognito.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            callback(null, result.getAccessToken().getJwtToken())
        }
    })

};


