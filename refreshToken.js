const AWS = require('aws-sdk');
const CognitoUserPool = require('amazon-cognito-identity-js-node').CognitoUserPool;
const CognitoUserSession = require('amazon-cognito-identity-js-node').CognitoUserSession;
const CognitoUser = require('amazon-cognito-identity-js-node').CognitoUser;
const CognitoIdToken = require('amazon-cognito-identity-js-node').CognitoIdToken;
const CognitoAccessToken = require('amazon-cognito-identity-js-node').CognitoAccessToken;
const CognitoRefreshToken = require('amazon-cognito-identity-js-node').CognitoRefreshToken;

const COGNITO_IDENTITY_POOL_ID = "YOUR IDENTITY POOL ID";
const COGNITO_USER_POOL_ID = "YOUR COGNITO USER POOL ID";
const COGNITO_CLIENT_ID = "YOUR COGNITO CLIENT ID";
const AWS_API_GATEWAY_HOSTNAME = "API GATEWAY HOSTNAMR";
const AWS_REGION = "us-east-2";

AWS.config.region = 'us-east-2'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'YOUR DENTITY POOL ID',
});

exports.refreshToken = (event, context, callback) => {
    const AccessToken = new CognitoAccessToken({ AccessToken: event.accessToken });
    const IdToken = new CognitoIdToken({ IdToken: event.idToken });
    const RefreshToken = new CognitoRefreshToken({ RefreshToken: event.refreshToken });
    const sessionData = {
        IdToken: IdToken,
        AccessToken: AccessToken,
        RefreshToken: RefreshToken
    };
    const cachedSession = new CognitoUserSession(sessionData);

    if (cachedSession.isValid()) {
        callback(null, "Token Valid") //result if your token valid
    } else {
        const poolData = {
            UserPoolId: COGNITO_USER_POOL_ID,
            ClientId: COGNITO_CLIENT_ID
        };
        const userPool = new CognitoUserPool(poolData);
        const userData = {
            Username: event.username,
            Pool: userPool
        };
        cognitoUser = new CognitoUser(userData)
        cognitoUser.refreshSession(RefreshToken, (err, session) => {
            if (err) throw err;
            const tokens = {
                accessToken: session.getAccessToken().getJwtToken(),
                idToken: session.getIdToken().getJwtToken(),
                refreshToken: session.getRefreshToken().getToken()
            };
            const loginInfo = {};
            loginInfo[`cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`] = tokens.idToken;
            const params = {
                IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
                Logins: loginInfo
            };
            AWS.config.credentials = new AWS.CognitoIdentityCredentials(params)
            callback(null, tokens)
        });
    }

}