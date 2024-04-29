const passport = require('passport');
const passportSaml = require('passport-saml');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// SAML strategy for passport -- Single IPD
const strategy = new passportSaml.Strategy(
  {
    // entryPoint: process.env.SSO_ENTRYPOINT,
    // issuer: process.env.SSO_ISSUER,
    // callbackUrl: process.env.SSO_CALLBACK_URL,
    // cert: process.env.SSO_CERT,

    entryPoint: 'https://testworkqueue.onelogin.com/trust/saml2/http-post/sso/a95d473e-ed6f-40d9-94a3-4146fc458f94',
    issuer: 'testworkqueue',
    callbackUrl: 'http://localhost:3000/home',
    cert: 'MIID5TCCAs2gAwIBAgIUDGuEVKnYBDBbauvl9C7b9I4OUnIwDQYJKoZIhvcNAQEFBQAwSDETMBEGA1UECgwKQ0dJbmZpbml0eTEVMBMGA1UECwwMT25lTG9naW4gSWRQMRowGAYDVQQDDBFPbmVMb2dpbiBBY2NvdW50IDAeFw0yNDA0MTkxMzQwMjFaFw0yOTA0MTkxMzQwMjFaMEgxEzARBgNVBAoMCkNHSW5maW5pdHkxFTATBgNVBAsMDE9uZUxvZ2luIElkUDEaMBgGA1UEAwwRT25lTG9naW4gQWNjb3VudCAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC9nlf7WnunN0jd+p34aMUt7iK2qkOr+qkWooseguruRylmdbIixZL4PVUHAkcZ0HqRqenihMtMIoQrACVExACTIRkH+k9gghkPDmyTF0Ew76mcX4BSpIwLI/1DeP3n2Grpq7pto8R3SppadxSz+frnuHOXqVwq7Jmn6a0Jjz9WU/YhVadDC5wHDUTRppqhgexeI6dqotCBpHC0pn2fh8Y0OQqQ+dJcoPl2QmupJvSMdxgbLJb3dfzaUjdDrsOy5571ZQwSEQXQg04L2NSGkA4a+B+rioi5xApKymt6//rE+bBdN9sB6Bf850M7tYSK+bIyPz9wz0PN50GRZHa/S33lAgMBAAGjgcYwgcMwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUhVXaEm7J6eznGSqKAfbVNtlGn2IwgYMGA1UdIwR8MHqAFIVV2hJuyens5xkqigH21TbZRp9ioUykSjBIMRMwEQYDVQQKDApDR0luZmluaXR5MRUwEwYDVQQLDAxPbmVMb2dpbiBJZFAxGjAYBgNVBAMMEU9uZUxvZ2luIEFjY291bnQgghQMa4RUqdgEMFtq6+X0Ltv0jg5ScjAOBgNVHQ8BAf8EBAMCB4AwDQYJKoZIhvcNAQEFBQADggEBADlQ5IN44UEy86JINAVHfBnSsAy1wyAISDirZDSCUFY6ZFksdPwMGdmhiY06/xNkzRzPN4O6PUtwlBzAEALPE0VGjGkebpd9V/EUwehUka4P2e60J3KSqNK26EX8iFlem3zRhVjWwwWoyiJ0d1QK4F92aYvZYYxkxy2CoXsNI5CaFo57J6I3NTE4xMgd5Yf8lJiPRK9zntqkmC7Lxt3CHO2ohJkC7nCPl90J+qN6tdRm8agMB1msZjYy+++bLU1We1S0aSwKppzP8zYeOIa0SRd95ecDveSUGt0jCWKWYbWM8UkH9UDnaM5NH85URwBA21WVk5fKm3/UDVs8KXc/9sU='
  },
  (profile, done) => done(null, profile),
);

passport.use(strategy);

// passport.use(new OneLoginStrategy({
//   issuer: 'https://testworkqueue.onelogin.com/oidc/2',
//   clientID: '402e3610-e2d9-013c-4b5c-2a2a11e11921236803',
//   clientSecret: 'f68e0be2b4c7b3fdfd0030935a356ef958058e19e34d8748629d8b76198ef7c9',
//   authorizationURL: 'https://openid-connect.onelogin.com/oidc/auth',
//   userInfoURL: 'https://openid-connect.onelogin.com/oidc/me',
//   tokenURL: 'https://openid-connect.onelogin.com/oidc/token',
//   callbackURL: 'http://localhost:8000/callback',
//   passReqToCallback: true
// },
// function(req, issuer, userId, profile, accessToken, refreshToken, params, cb) {

//   console.log('issuer:', issuer);
//   console.log('userId:', userId);
//   console.log('accessToken:', accessToken);
//   console.log('refreshToken:', refreshToken);
//   console.log('params:', params);

//   req.session.accessToken = accessToken;

//   return cb(null, profile);
// }));

module.exports = passport;