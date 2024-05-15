//#region Libraries
const jwt  = require('jsonwebtoken');
//#endregion

const getuserdetails = function(token){
    var decodedToken = jwt.decode(token);
    return decodedToken;
   }

module.exports = {getuserdetails};