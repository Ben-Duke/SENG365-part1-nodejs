const User = require('../models/user.server.model');

exports.list = function (req, res) {
    User.getAll(function (result) {
        res.json(result);
    })
};

exports.create = function (req, res) {
    let user_data = {
        "username": req.body.username,
        "email": req.body.email,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "password": req.body.password
    };
    var valid = true;
    let user = user_data['username'].toString();
    let email = user_data['email'].toString();
    let givenName = user_data['givenName'].toString();
    let familyName = user_data['familyName'].toString();
    let password = user_data['password'].toString();

    let values = [
        [user, email, givenName, familyName, password]
    ];
    for (i = 0; i < values[0].length; i++) {
        if (values[0][i].length == 0) {
            valid = false;
        }
    }
    if (valid == true) {
        User.insert(values, function (result) {

            console.log();
            if (result.code) {
                if (result.code == "ER_DUP_ENTRY") {
                    res.status(400);
                    res.send("Bad Request");
                }
            } else {
                res.status(201);
                res.json("Created");
            }

        });
    }

};

exports.read = function (req, res) {
    let id = req.params.userId;
    User.getOne(id, function (result) {

        if (result.toString() == "") {
            res.status(401);
            res.send("Not Found");
        } else {
            res.json(result);
        }

    })
};

exports.update = function (req, res) {
    let id = req.params.userId;
    let givenName = req.body.givenName;
    let familyName = req.body.familyName;
    let password = req.body.password;
    User.alter(givenName, familyName, password, id, function (result) {
        console.log(result);
        res.json(result);
    })
};

exports.delete = function (req, res) {
    let id = req.params.userId;
    User.remove(id, function (result) {
        res.json(result);
    })
};

