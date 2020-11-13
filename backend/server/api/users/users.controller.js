

var User = require('./users.model')
var moment = require('moment')
var CryptoJS = require("crypto-js");

const jwt = require("jsonwebtoken")
const jwtExpirySeconds = '1d'

exports.Login = function (req, res) {
    console.log(req.body)
    try {
        User.findOne({ username: req.body.email }).exec(function (err, user) {
            if (err) throw new Error()
            if (!user) {
                res.status(200).json({ "message": 'Account does not exist !!' });
            } else {
                if (decryptData(user.password) == req.body.password) {

                    let username = user.username;
                    let userdat = {
                        _id: user._id,                    
                        username: user.username
                    }
                    if(req.body.role)  userdat.role = user.role
                    User.findOneAndUpdate({ "email": req.body.email }, { "$set": { "lastLogin": Date.now(), "IP": req.connection.remoteAddress } }).exec(function (err, result) {
                        if (err) throw new Error()
                        const token = jwt.sign({ id: username.toString() }, '123-key', { algorithm: "HS256", expiresIn: jwtExpirySeconds })
                        res.status(201).json({ user: userdat, token: token })
                    })
                      
                }
                else {
                    res.status(200).json({ "message": 'Invalid password !!' });

                }
            }

        })

    } catch{
        res.status(400).send({ "message": "Something went wrong !!" })
    }
}





exports.getUsers = function (req, res) {
    try {
        console.log(req.header('Authorization').replace('Bearer ', ''),"{{{{{{{{{{")
        var role=req.header('Authorization').replace('Bearer ', '')
        if(role=='Auditor'){
        User.find({}).skip(Number(req.query.skip)).limit(Number(req.query.limit)).exec((err, result) => {
            if (err) throw new Error()
            else {
                res.status(201).json(result)
            }
        })
    }else{
        res.status(401).send({ "error": "Not Found" })
        
    }
    } catch{
        res.status(400).send({ "error": "Something went wrong" })
    }
}


exports.create = function(req, res) {
    req.body.password = encrypt(req.body.password)
    req.body.role = "Auditor"
    User.create(req.body, function(err, user) {
      if(err) { return handleError(res, err); }
      return res.status(201).json(user);
    });
  };
  


  function encrypt(data) {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data),'secretkey').toString();

    return ciphertext;
  }
   function decryptData(cipherText) {
    var bytes  = CryptoJS.AES.decrypt(cipherText, 'secretkey');
    return  JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  
  }

function handleError(res, err) {
    return res.status(500).send(err);
  }