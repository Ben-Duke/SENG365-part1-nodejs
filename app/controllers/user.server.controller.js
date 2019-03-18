const User = require('../models/user.server.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.list = function (req, res) {
    User.getAll(function (result) {
        res.json(result);
    })
};

exports.create = async function (req, res) {
    let user_data = {
        "username": req.body.username,
        "email": req.body.email,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "password": req.body.password
    };
    var valid = true;
    let user = user_data['username'];
    //.toString();
    let email = user_data['email'].toString();
    let givenName = user_data['givenName'].toString();
    let familyName = user_data['familyName'].toString();
    let password = user_data['password'].toString();


    if (user == null || user == "") {
        console.log("Empty");
    }
    console.log();
    console.log();
    console.log();
    console.log("***********")
    console.log("usernames is" + user);
    console.log("email is" + email);
    console.log("gname is" + givenName);
    console.log("famnames is" + familyName);
    console.log();
    console.log();

    let values = [
        [user, email, givenName, familyName, password]
    ];

    if (user != null && user != "") {
        for (i = 0; i < values[0].length; i++) {
            // console.log("value is " + values[0][i]);
            if (values[0][i].length == 0) {
                valid = false;
            }
            // console.log(valid);
        }

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        console.log("reg check " + re.test(String(values[0][1]).toLowerCase()));
        if (!re.test(String(values[0][1]).toLowerCase())) {
            valid = false;
        };

        // console.log("checking valid");
        // console.log(valid)
        if (valid == true) {
            try {
                await User.insert(values, function (result) {

                    //console.log("*********" + result);
                    if (result != "error") {
                        //console.log("valid 201");
                        res.status(201);
                        res.json("Created");
                    } else {
                        //console.log("400");
                        res.status(400);
                        res.json("Bad request");
                    }

                });
            } catch (err) {
                console.log("Error");
            }
        }
        else {
            res.status(400);
            res.send("Bad Request");
        }
    } else {
        res.status(400);
        res.send("Bad Request");
    }
};

exports.read = function (req, res) {
    let id = req.params.userId;
    console.log("id is " + id);
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
        //console.log(result);
        res.json(result);
    })
};

exports.delete = function (req, res) {
    let id = req.params.userId;
    User.remove(id, function (result) {
        res.json(result);
    })
};

