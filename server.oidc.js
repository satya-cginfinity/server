require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportSaml = require('passport-saml');
const OneLoginStrategy = require('passport-openidconnect').Strategy;
const app = express();

const baseUri = `${ process.env.OIDC_BASE_URI }/oidc/2`;

  passport.use(new OneLoginStrategy({
  issuer: baseUri,
  clientID: process.env.OIDC_CLIENT_ID,
  clientSecret: process.env.OIDC_CLIENT_SECRET,
  authorizationURL: `${baseUri}/auth`,
  userInfoURL: `${baseUri}/me`,
  tokenURL: `${baseUri}/token`,
  callbackURL: process.env.OIDC_REDIRECT_URI,
  passReqToCallback: true
},
function(req, issuer, userId, profile, accessToken, refreshToken, params, cb) {

  console.log('issuer:', issuer);
  console.log('userId:', userId);
  console.log('accessToken:', accessToken);
  console.log('refreshToken:', refreshToken);
  console.log('params:', params);

  req.session.accessToken = accessToken;

  return cb(null, profile);
}));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

app.use(cors());
app.use(express.json());
app.use(require('express-session')({ secret: 'test13', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/login/sso",
    passport.authenticate('openidconnect', 
    {
        successReturnToOrRedirect: "/",
        scope: 'profile'
    })
  );

app.get('/oauth/callback', passport.authenticate('openidconnect', {
    callback: true,
    successReturnToOrRedirect: '/success',
    failureRedirect: '/'
  }));

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