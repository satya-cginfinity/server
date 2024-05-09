require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const OneLoginStrategy = require('passport-openidconnect').Strategy;
const app = express();
var _token="";

app.use(cors());
app.use(express.json());
app.use(require('express-session')({ secret: 'test100', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

var home = require('./home');

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
  _token=accessToken;
  return cb(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

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
    //res.json({ message: `${_token}` });
});

app.get('/failure', (req, res) => {
    res.json({ message: "Authentication failed!" });
});

function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      next();
  } else{
      res.redirect("/login/sso");
  }
}

app.use('/home', checkAuthentication, home);

app.get('/welcomeMessage', (req, res) => {
  res.json({ message: "Click Below to login" });
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});

module.exports = app;