const User = require('../models/user.server.model');
const bcrypt = require('bcrypt');
const emailvalidator = require('email-validator');
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
            console.log("value is " + values[0][i]);
            console.log("and valid is " + !values[0][i].length == 0);
            if (values[0][i].length == 0) {
                valid = false;
            }
            // console.log(valid);
        }


        if (!emailvalidator.validate(email)) {
            valid = false;
        };

        // console.log("checking valid");
        console.log("valid is " + valid)
        if (valid == true) {
            try {
                await User.insert(values, function (result) {

                    //console.log("*********" + result);
                    if (result != "error") {
                        id = result.insertId;
                        console.log("valid 201");
                        res.status(201);
                        res.json({ userid: id });
                        //Should be the id look at swagger api 
                        //console.log(result);

                        console.log(id);

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
        console.log("user not valid");
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

