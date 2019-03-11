const User = require('../models/user.server.model');

exports.list = function(req, res){
    User.getAll(function (result) {
        res.json(result);
    })
};

exports.create = function(req, res){
    let user_data = {
        "username" : req.body.username
    };

    let user = user_data['username'].toString();


    let values = [
        [user]
    ];

    User.insert(values, function (result) {
        res.json(result);
    });
};

exports.read = function (req, res) {
    let id = req.params.userId;
    User.getOne(id, function (result) {

        if(result.toString() == ""){
            res.status(401);
            res.send("Not Found");
        } else{
            res.json(result);
        }

    })
};

exports.update = function(req,res){
    let id = req.params.userId;
    let givenName = req.body.givenName;
    let familyName = req.body.familyName;
    let password = req.body.password;
    User.alter(givenName, familyName, password, id, function (result) {
        console.log(result);
        res.json(result);
    })
};

exports.delete = function(req,res){
    let id = req.params.userId;
    User.remove(id, function (result) {
        res.json(result);
    })
};

