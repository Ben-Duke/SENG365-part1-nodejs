const User = require('../models/user.server.model');
const bcrypt = require('bcrypt');
const emailvalidator = require('email-validator');
const saltRounds = 10;
const randtoken = require('rand-token');


exports.list = function (req, res) {
    User.getAll(function (result) {
        res.json(result);
    })
};

exports.login = async function (req, res) {
    //Todo check body has has token that is stored in the db for that user.
    let user_data = {
        "username": req.body.username,
        "email": req.body.email,
        "password": req.body.password
    };

    let user = user_data['username'];
    if (user != null && user != "") {
        user = user.toString();
    } else {
        user = "";
    }

    let email = user_data['email'];
    if (email != null && email != "") {
        email = email.toString();
    } else {
        email = "";
    }

    //let email = user_data['email'].toString();
    let password = user_data['password'].toString();

    try {
        await User.authUser(user, function (result) {
            console.log("result is " + result[0] + " type is " + typeof (result[0]));
            if (result[0] != null) {
                console.log("gernerate authcode");
                var token = randtoken.generate(32);
                console.log("Add auth code")
                let values = [
                    result[0].user_id,
                    token
                ]
                try {
                    User.addAuth(values, function () {
                        console.log("Worked");
                    })
                } catch (err) {
                    console.log("adding code failed");
                }
                console.log("Sending id + Auth back")
                id = result[0].user_id;
                res.status(200);
                res.json({
                    userId: id,
                    token: token
                });

            }
            else {
                res.status(400);
                res.send("Bad Request");
            }
        });
    } catch (err) {
        console.log(err);
    }
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
    {
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
    }
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
                        res.json({ userId: id });
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

