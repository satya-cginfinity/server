//#region Libraries
require('dotenv').config();
var express = require('express');
var router = express.Router();
var util = require('./common');
//#endregion

//#region Authenticated API's
router.get('/message', (req, res) => {
    console.log('Request Authentication Status: ' + req.isAuthenticated());
    res.json({ message: "Welcome to App page!" });
});

router.get('/userdetails', (req, res) => {
    var token = req.header('access-token');
    var user = util.getuserdetails(token); 
    res.json
        ({
            name: user.name,
            firstName: user.given_name,
            email: user.email,
            message: process.env.AUTHENTICATED
        });
});

router.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({ message: 'Congratulations! ' + req.body['firstParam'] + req.body['secondParam'] });
});
//#endregion

module.exports = router;