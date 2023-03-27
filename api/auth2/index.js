// const express = require('express');
// const passport = require('passport');
// //const fetch = require('node-fetch');

// const createHandler = require('azure-function-express').createHandler;

// //const BearerStrategy = require('passport-azure-ad').BearerStrategy;

// // const options = {
// //     identityMetadata: `https://${auth.authority}/${auth.tenantID}/${auth.version}/${auth.discovery}`,
// //     issuer: `https://${auth.authority}/${auth.tenantID}/${auth.version}`,
// //     clientID: auth.clientID,
// //     validateIssuer: auth.validateIssuer,
// //     audience: auth.audience,
// //     loggingLevel: auth.loggingLevel,
// //     passReqToCallback: auth.passReqToCallback,
// // };

// // const bearerStrategy = new BearerStrategy(options, (token, done) => {
// //     done(null, {}, token);
// // });

// // const app = express();

// // //app.use(require('morgan')('combined'));
// // app.use(require('body-parser').urlencoded({ 'extended': true }));
// // app.use(passport.initialize());
// // passport.use(bearerStrategy);

// // Enable CORS (for local testing only -remove in production/deployment)
// // app.use((req, res, next) => {
// //     res.header('Access-Control-Allow-Origin', '*');
// //     res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
// //     next();
// // });

// // // This is where your API methods are exposed
// // app.get('/api', passport.authenticate('oauth-bearer', { session: false }),
// //     async (req, res) => {
// //         console.log('Validated claims: ', JSON.stringify(req.authInfo));

// //         // the access token the user sent
// //         const userToken = req.get('authorization');

// //         // request new token and use it to call resource API on user's behalf
// //         let tokenObj = await getNewAccessToken(userToken);

// //         // access the resource with token
// //         let apiResponse = await callResourceAPI(tokenObj['access_token'], auth.resourceUri)

// //         res.status(200).json(apiResponse);
// //     }
// // );

// // async function getNewAccessToken(userToken) {

// //     const [bearer, tokenValue] = userToken.split(' ');
// //     const tokenEndpoint = `https://${auth.authority}/${auth.tenantName}/oauth2/${auth.version}/token`;

// //     let myHeaders = new fetch.Headers();
// //     myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

// //     let urlencoded = new URLSearchParams();
// //     urlencoded.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
// //     urlencoded.append('client_id', auth.clientID);
// //     urlencoded.append('client_secret', auth.clientSecret);
// //     urlencoded.append('assertion', tokenValue);
// //     urlencoded.append('scope', ...auth.resourceScope);
// //     urlencoded.append('requested_token_use', 'on_behalf_of');

// //     let options = {
// //         method: 'POST',
// //         headers: myHeaders,
// //         body: urlencoded
// //     };

// //     let response = await fetch(tokenEndpoint, options);
// //     let json = response.json();
// //     return json;
// // }

// // async function callResourceAPI(newTokenValue, resourceURI) {
    
// //     let options = {
// //         method: 'GET',
// //         headers: {
// //             'Authorization': `Bearer ${newTokenValue}`,
// //             'Content-type': 'application/json',
// //             'Accept': 'application/json',
// //             'Accept-Charset': 'utf-8'
// //         },
// //     };
    
// //     let response = await fetch(resourceURI, options);
// // 	let json = await response.json();
// //     return json;
// // }

// //module.exports = createHandler(app);

// //=========================

// const app = express();

// app.use(require('body-parser').urlencoded({ 'extended': true }));

// console.log(`====================================================`);
// console.log(`req: ${JSON.stringify(req)}`);
// console.log(`====================================================`);

// const users = [
//     { id: '2f24vvg', email: 'test@test.com', password: 'password' }
// ];

// // configure passport.js to use the local strategy
// passport.use(new local.Strategy(
//     { usernameField: 'email' },
//     (email, password, done) => {
//         console.log('Inside local strategy callback')
//         // here is where you make a call to the database
//         // to find the user based on their username or email address
//         // for now, we'll just pretend we found that it was users[0]
//         const user = users[0]
//         if (email === user.email && password === user.password) {
//             console.log('Local strategy returned true')
//             return done(null, user)
//         }
//     }
// ));

// // tell passport how to serialize the user
// passport.serializeUser((user, done) => {
//     console.log('Inside serializeUser callback. User id is save to the session file store here')
//     done(null, user.id);
// }, req);

// passport.deserializeUser((id, done) => {
//     console.log('Inside deserializeUser callback')
//     console.log(`The user id passport saved in the session file store is: ${id}`)
//     const user = users[0].id === id ? users[0] : false;
//     done(null, user);
// }, req);

// passport.initialize()
// passport.session()

// const isLoggedIn = (req, res, next) => {
//     if(req.isAuthenticated()){
//         return next()
//     }
//     return res.status(400).json({"statusCode" : 400, "message" : "not authenticated"})
// }

// app.get('*', isLoggedIn, (req, res) => {
//     res.json("data")
// })


// module.exports = createHandler(app);
