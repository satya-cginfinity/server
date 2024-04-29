require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportSaml = require('passport-saml');
const app = express();
var session = require('express-session');

passport.serializeUser((user, done) => {
done(null, user);
});

passport.deserializeUser((user, done) => {
done(null, user);
});

// SAML strategy for passport -- Single IPD
const strategy = new passportSaml.Strategy(
{
    entryPoint: process.env.ENTRY_POINT,
    issuer: process.env.ISSUER,
    callbackUrl: process.env.CALLBACK_URL,
    cert: process.env.CERT
},
(profile, done) => done(null, profile),
);

passport.use(strategy);
  
app.use(cors());
app.use(express.json());
app.use(session({ secret: '3test', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/login/sso",
    passport.authenticate("saml", 
    {
        successRedirect: '/',
        failureRedirect: '/failure',
        failureFlash: true
    }),
    function (req, res) {
      res.redirect("/");
    },
  );

app.get('/callback', (req, res) => {
    res.json({ message: "Got callback!" });
});

app.get('/success', (req, res) => {
    res.redirect('http://localhost:3000/home');
    //res.json({ message: "Authentication succeded!" });
});

app.get('/failure', (req, res) => {
    res.json({ message: "Authentication failed!" });
});

app.get('/message', (req, res) => {
    console.log('Request Authentication Status: ' + req.isAuthenticated());
    res.json({ message: "Welcome to App page!" });
});

app.get('/homePageMessage', (req, res) => {
    res.json({ message: "Authentication succeded! \n Welcome to Home page!" });
});

app.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    // res.status(201).json({ message: 'Congratulations! ' + req.body['firstParam'] + req.body['secondParam'] });
    res.status(201).json({ message: 'Click Below to login' });
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});

module.exports = app;