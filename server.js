//#region Libraries
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const OneLoginStrategy = require('passport-openidconnect').Strategy;
const sessionStorage = require('sessionstorage')
const app = express();
//#endregion

//#region Middlewares
app.use(cors());
app.use(express.json());
app.use(require('express-session')({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
//#endregion

var home = require('./home');
var _id = "";

//#region Configure Passport Start
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
  _id = userId.id;
  sessionStorage.setItem(_id, JSON.stringify(accessToken));

  return cb(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
//#endregion

//#region Authentication
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
    res.redirect(`http://localhost:3000/home?id=${_id}`);
});

app.get('/failure', (req, res) => {
    res.json({ message: "Authentication failed!" });
});

function checkAuthentication(req,res,next){
  var token = req.header('access-token');
  req.session.accessToken = token;
  var v = req.isAuthenticated();

  if(token == JSON.parse(sessionStorage.getItem(_id))){
    next();
  } else{
    res.json({ message: "Authentication failed! \n Please Login!" });
  }

  // if(req.isAuthenticated()){
  //     next();
  // } else{
  //     res.redirect("/login/sso");
  // }
}
//#endregion

//#region Routes
app.use('/home', checkAuthentication, home);
//#endregion

//#region Unauthenticated API's
app.get('/welcomeMessage', (req, res) => {
  res.json({ message: "Click Below to login" });
});

app.post('/api/requestToken', (req, res, next) => {
  var key = req.body['key'];
  const tokenString = sessionStorage.getItem(key);
  const accessToken = JSON.parse(tokenString);
  res.status(201).json({ message: accessToken });
});
//#endregion

//#region Others
app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});

module.exports = app;
//#endregion