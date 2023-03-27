// const passport = require("passport");
// //const bodyParser = require("body-parser");
// const createHandler = require("azure-function-express").createHandler;
// const express = require("express");
// const app = express();

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
// app.use(bodyParser.json());

// // init and configure passport
// app.use(passport.initialize());

// // Configure passport
// require("../config/passport")(passport);

// require("../config/mongo")
//   .connect()
//   .catch((error) => {
//     throw error;
//   });

// app.get('/api/getUserIdFromJwt', passport.authenticate('jwt', { session: false }), (req, res, next) => {
//     res.status(200).json(req.user)
// });

// // Binds the express app to an Azure Function handler
// module.exports = createHandler(app);

// //require('../config/express')(app, passport);

import * as express from 'express';
import * as passport from 'passport';
import * as exp from 'azure-function-express';
import * as passportFacebook from 'passport-facebook';
import * as local from 'passport-local'; //
const LocalStrategy = local.Strategy;

//const FacebookStrategy = require('passport-facebook').Strategy;

//import { AzureFunction, Context, HttpRequest } from '@azure/functions';
//const createHandler = require("azure-function-express").createHandler;

//const app = express();
//const session = require('express-session');

// app.use(session({
//   resave: false,
//   saveUninitialized: true,
//   secret: 'SECRET'
// }));





// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser(function (user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function (obj, cb) {
//   cb(null, obj);
// });

// passport.use(new passportFacebook.Strategy({
//     clientID: '3421538238062227',
//     clientSecret: '46b768c27fa592cb7ee4fa15b784c2fe',
//     callbackURL: 'http://localhost:4200/'
//   }, function (accessToken, refreshToken, profile, done) {
//     return done(null, profile);
//   }
// ));

//let router = express.Router();

// router.get("/auth/facebook",
//     passport.authenticate("facebook", {
//         scope: ["public_profile", "email"],
//     })
// );

// router.get("/auth/facebook/callback",
//     passport.authenticate("facebook", {
//         successRedirect: "/",
//         failureRedirect: "/",
//     })
// );



// router.get("/facebook",
//     passport.authenticate("facebook", {
//         scope: ["public_profile", "email"],
//     })
// );

// router.get("/facebook/callback",
//     passport.authenticate("facebook", {
//         successRedirect: "/",
//         failureRedirect: "/",
//     })
// );

// router.get("logout", (req, res) => {
//     //  req.logout();
//     res.redirect("/");
// });


// router.get("/logout", (req, res) => {
//     //  req.logout();
//     res.redirect("/");
// });

// router.get("api/logout", (req, res) => {
//     //  req.logout();
//     res.redirect("/");
// });

// router.get("/api/auth", (req, res) => {
//     //  req.logout();
//     console.log(JSON.stringify(req, null, 4));
//         res.status(402).send('Sorry, cant find that');
// });

// app.get("/api/auth/logout", (req, res) => {
// //  req.logout();
// console.log(JSON.stringify(req, null, 4));
// res.status(401).send('Sorry, cant find that');
// });

// app.get("*", (req, res) => {
//     console.log(JSON.stringify(req, null, 4));
//     res.send("PAGE NOT FOUND");
// });

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) return next();
//     res.redirect("/");
// }

import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        let response = null;
        let id = null;

        context.log(`====================================================`);
        context.log(`req: ${JSON.stringify(req)}`);
        context.log(`====================================================`);


        const users = [
            { id: '2f24vvg', email: 'test@test.com', password: 'password' }
        ];

        // configure passport.js to use the local strategy
        passport.use(new local.Strategy(
            { usernameField: 'email' },
            (email, password, done) => {
                console.log('Inside local strategy callback')
                // here is where you make a call to the database
                // to find the user based on their username or email address
                // for now, we'll just pretend we found that it was users[0]
                const user = users[0]
                if (email === user.email && password === user.password) {
                    console.log('Local strategy returned true')
                    return done(null, user)
                }
            }
        ));

        // tell passport how to serialize the user
        passport.serializeUser((user, done) => {
            console.log('Inside serializeUser callback. User id is save to the session file store here')
            done(null, user.id);
        }, req);

        passport.deserializeUser((id, done) => {
            console.log('Inside deserializeUser callback')
            console.log(`The user id passport saved in the session file store is: ${id}`)
            const user = users[0].id === id ? users[0] : false;
            done(null, user);
        }, req);

        passport.initialize()
        passport.session()

        // passport.authenticate('local', (err, user, info) => {
        //     if (info) { return context.res.send(info.message)}
        //     if (!user) { return context.res.redirect('/login'); }
        //     // req.login(user, (err) => {
        //     //   if (err) { return next(err); }
        //     //   return context.res.redirect('/authrequired');
        //     // })
        //   })(req, context.res, next);

        context.log(`>>>>>>>>>> req: ${JSON.stringify(req)}`);

        context.res = {
            body: response
        };

    } catch (err) {
        context.log(`*** Err: ${err}`);
        context.log(`*** Error throw: ${JSON.stringify(err)}`);
        context.res = {
            status: 501,
            body: err,
        };
    }
};

export default httpTrigger;
