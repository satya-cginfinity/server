require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportSaml = require('passport-saml');
const OneLoginStrategy = require('passport-openidconnect').Strategy;
const app = express();

//   passport.serializeUser((user, done) => {
//     done(null, user);
//   });
  
//   passport.deserializeUser((user, done) => {
//     done(null, user);
//   });
  
  // SAML strategy for passport -- Single IPD
  const strategy = new passportSaml.Strategy(
    {
      entryPoint: 'https://testworkqueue.onelogin.com/trust/saml2/http-post/sso/a95d473e-ed6f-40d9-94a3-4146fc458f94',
      issuer: 'http://localhost:8000/callback',
      callbackUrl: 'http://localhost:8000/callback',
      cert: 'MIID5TCCAs2gAwIBAgIUDGuEVKnYBDBbauvl9C7b9I4OUnIwDQYJKoZIhvcNAQEFBQAwSDETMBEGA1UECgwKQ0dJbmZpbml0eTEVMBMGA1UECwwMT25lTG9naW4gSWRQMRowGAYDVQQDDBFPbmVMb2dpbiBBY2NvdW50IDAeFw0yNDA0MTkxMzQwMjFaFw0yOTA0MTkxMzQwMjFaMEgxEzARBgNVBAoMCkNHSW5maW5pdHkxFTATBgNVBAsMDE9uZUxvZ2luIElkUDEaMBgGA1UEAwwRT25lTG9naW4gQWNjb3VudCAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC9nlf7WnunN0jd+p34aMUt7iK2qkOr+qkWooseguruRylmdbIixZL4PVUHAkcZ0HqRqenihMtMIoQrACVExACTIRkH+k9gghkPDmyTF0Ew76mcX4BSpIwLI/1DeP3n2Grpq7pto8R3SppadxSz+frnuHOXqVwq7Jmn6a0Jjz9WU/YhVadDC5wHDUTRppqhgexeI6dqotCBpHC0pn2fh8Y0OQqQ+dJcoPl2QmupJvSMdxgbLJb3dfzaUjdDrsOy5571ZQwSEQXQg04L2NSGkA4a+B+rioi5xApKymt6//rE+bBdN9sB6Bf850M7tYSK+bIyPz9wz0PN50GRZHa/S33lAgMBAAGjgcYwgcMwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUhVXaEm7J6eznGSqKAfbVNtlGn2IwgYMGA1UdIwR8MHqAFIVV2hJuyens5xkqigH21TbZRp9ioUykSjBIMRMwEQYDVQQKDApDR0luZmluaXR5MRUwEwYDVQQLDAxPbmVMb2dpbiBJZFAxGjAYBgNVBAMMEU9uZUxvZ2luIEFjY291bnQgghQMa4RUqdgEMFtq6+X0Ltv0jg5ScjAOBgNVHQ8BAf8EBAMCB4AwDQYJKoZIhvcNAQEFBQADggEBADlQ5IN44UEy86JINAVHfBnSsAy1wyAISDirZDSCUFY6ZFksdPwMGdmhiY06/xNkzRzPN4O6PUtwlBzAEALPE0VGjGkebpd9V/EUwehUka4P2e60J3KSqNK26EX8iFlem3zRhVjWwwWoyiJ0d1QK4F92aYvZYYxkxy2CoXsNI5CaFo57J6I3NTE4xMgd5Yf8lJiPRK9zntqkmC7Lxt3CHO2ohJkC7nCPl90J+qN6tdRm8agMB1msZjYy+++bLU1We1S0aSwKppzP8zYeOIa0SRd95ecDveSUGt0jCWKWYbWM8UkH9UDnaM5NH85URwBA21WVk5fKm3/UDVs8KXc/9sU='
    },
    (profile, done) => done(null, profile),
  );
  
  //passport.use(strategy);
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

// app.get("/login/sso",
//     passport.authenticate("saml", 
//     {
//         successRedirect: '/',
//         failureRedirect: '/failure',
//         failureFlash: true
//     }),
//     function (req, res) {
//       res.redirect("/");
//     },
//   );

app.get("/login/sso",
    passport.authenticate('openidconnect', 
    {
        successReturnToOrRedirect: "/",
        scope: 'profile'
    })
  );

// app.get('/login/sso',  (req, res) => {

//     console.log('Passport method started');
//     console.log(req.isAuthenticated());
   
//     if(!req.isAuthenticated())
//     {
//       passport.authenticate('saml', {
//         successRedirect: '/success',
//         failureRedirect: '/failure',
//         failureFlash: true
//       });

//       console.log(req.body);

//     //   passport.authenticate('openidconnect', {
//     //     successReturnToOrRedirect: "/success",
//     //     scope: 'profile'
//     //   });
//     }
//      else
//     {
//        res.redirect('https://testworkqueue.onelogin.com/trust/saml2/http-post/sso/a95d473e-ed6f-40d9-94a3-4146fc458f94');
//     }

//       console.log('Passport method ended');
//       //res.redirect('http://localhost:8000/message');
// });

app.get('/oauth/callback', passport.authenticate('openidconnect', {
    callback: true,
    successReturnToOrRedirect: '/success',
    failureRedirect: '/'
  }));

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