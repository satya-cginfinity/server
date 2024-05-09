//#region Libraries
var express = require('express');
var router = express.Router();
//#endregion

//#region Authenticated API's
router.get('/message', (req, res) => {
    console.log('Request Authentication Status: ' + req.isAuthenticated());
    res.json({ message: "Welcome to App page!" });
});

router.get('/homePageMessage', (req, res) => {
    res.json({ message: "Authentication succeded! \n Welcome to Home page!" });
});

router.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({ message: 'Congratulations! ' + req.body['firstParam'] + req.body['secondParam'] });
});
//#endregion

module.exports = router;