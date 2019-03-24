const User = require('../models/user.server.model');
const bcrypt = require('bcrypt');
const emailvalidator = require('email-validator');
const saltRounds = 10;
const randtoken = require('rand-token');
const fs = require('fs');
const bodyParser = require('body-parser');
var path = require('path');

const multer = require('multer');
var upload = multer({ dest: './' })


exports.list = function (req, res) {
    User.getAll(function (result) {
        res.json(result);
    })
};

exports.getPhoto = async function (req, res) {
    console.log(req.get("X-Authorization"));
    //userProfilePicture = 'test.jpg'
    userId = req.params.id;
    console.log("User id is " + userId);
    try {
        await User.getOne(userId, function (result) {
            if (result[0] != null) {
                console.log(result[0].profile_photo_filename);
                if (result[0].profile_photo_filename != null) {
                    userProfilePicture = result[0].profile_photo_filename;
                    console.log(userProfilePicture);
                    res.sendFile(path.join(__dirname, '../photos', userProfilePicture));
                } else {
                    res.status(404);
                    res.send("Not Found");
                }
            } else {
                res.status(404);
                res.send("Not Found");
            }

        });

    } catch (err) {
        console.log(err.toString());
    }


    console.log("sent picture");
}

exports.uploadPhoto = async function (req, res) {

    // console.log(req.get("X-Authorization"));
    // console.log(req.get("Content-Type"));
    // console.log("Body is ");
    //rename with file name user_id_(user)+.jpeg or png
    try {
        authToken = req.get("X-Authorization");
        filetype = req.get("Content-Type");
        userId = req.params.id;
        console.log("user id is " + userId);
        await User.getOne(userId, function (results) {
            console.log("Get One results are " + results);
            console.log("does results == null: " + results == null);
            if (results[0] != null) {
                returnedId = results[0].user_id;
                returnedAuth = results[0].auth_token;
                currentProfilePicture = results[0].profile_photo_filename;
                if (returnedId != null) {
                    //check authcode 
                    console.log("return id was valid " + returnedId);
                    if (returnedAuth != null) {
                        //check auth tokens match
                        if (returnedAuth == authToken) {
                            try {
                                //put into buffer to write it
                                userfilename = results[0].user_id + results[0].username;

                                User.alterProfilePicture(returnedId, userfilename, function (results) {
                                    var buffer = new Buffer(req.body, 'binary')
                                    console.log("alter records");
                                    console.log(results);
                                    filename = userfilename;
                                    if (filetype == "image/jpeg") {
                                        filename += ".jpeg"
                                        console.log("creating jpeg");
                                    } else if (filetype == "image/png") {
                                        filename += ".png"
                                        console.log("creating png");
                                    }

                                    fs.writeFile("/app/photos/" + filename, buffer, function (err, written) {
                                        if (err) {
                                            console.log(err);
                                            console.log("FAILED TO WRITE FILE")
                                        }
                                        else {
                                            console.log("Successfully written");
                                            if (currentProfilePicture != null) {
                                                res.status("200");
                                                res.send("OK");
                                            } else {
                                                res.status("201");
                                                res.send("Created");
                                            }
                                            console.log("should have stopped");
                                        }
                                    });

                                })

                            } catch (err) {
                                console.log(err.toString());
                                res.status(400);
                                res.send("Bad Request")
                            }
                        } else {
                            res.status(403);
                            //if yopu lose a test for the 401 things its this
                            res.send("Forbidden");
                        }
                    }
                    else {
                        res.status(401);
                        res.send("Unauthorized");


                    }
                }
                else {
                    res.status(404);
                    res.send("Not Found");
                }
            }
        });

    } catch (err) {
        console.log(err.toString());

    }

}

exports.logOut = async function (req, res) {
    authToken = req.get("X-Authorization");
    console.log(authToken);
    if (authToken != null) {
        try {
            await User.checkAuth(authToken, function (result) {
                console.log(result[0]);
                if (result[0] != null) {
                    console.log("Going to remove token");
                    try {
                        console.log("Token is " + result[0].auth_token);
                        if (result[0].auth_token != null) {
                            User.logout(result[0].auth_token, function (done) {
                                console.log(done);
                                res.status(200);
                                res.send("OK");
                            })
                        } else {
                            res.status(401);
                            res.send("Unauthorized");
                        }

                    } catch (err) {
                        console.log(err.toString());
                        res.status(401);
                        res.send("Unauthorized");
                    }


                }
                else {
                    res.status(401);
                    res.send("Unauthorized");
                }
            });

        } catch (err) {
            console.log(err.toString());
            res.status(401);
            res.send("Unauthorized");
        }
    } else {
        res.status(401);
        res.send("Unauthorized");
    }

}

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

    let password = user_data['password'];
    if (password != null && password != "") {
        password = password.toString();
    } else {
        password = "";
    }


    let creds = [
        user, email, password
    ];
    try {
        await User.authUser(creds, function (result) {
            //console.log("result is " + result[0] + " type is " + typeof (result[0]));
            //console.log("result is " + result);
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
        console.log(result);
        if (result[0] == null) {
            res.status(404);
            res.send("Not Found");
        } else {
            if (result[0].auth_token != null) {
                console.log("Return all info");

                res.json({
                    "username": result[0].username,
                    "email": result[0].email,
                    "givenName": result[0].given_name,
                    "familyName": result[0].family_name
                });
            } else {
                console.log("Restrict output");
                res.json({
                    "username": result[0].username,
                    "givenName": result[0].given_name,
                    "familyName": result[0].family_name
                });
            }

        }

    })
};

exports.update = async function (req, res) {
    let id = req.params.userId;
    let givenName = req.body.givenName;
    let familyName = req.body.familyName;
    let password = req.body.password;
    let authToken = req.get("X-Authorization");
    console.log(givenName + " name " + familyName + " Fam " + password + "Password");
    if (givenName == null && familyName == null && password == null) {
        console.log("no changes");
        res.status(400);
        res.send("Bad Request");
    }
    else if (familyName != null && familyName == "") {
        res.status(400);
        res.send("Bad Request");
    }
    else if (password != null && !isNaN(password)) {
        res.status(400);
        res.send("Bad Request");
    }
    else {
        //check if auth matched user
        creds = [
            id, authToken
        ]
        try {
            const result = await User.checkAuthUser(creds, function (done) {

                console.log(done);
                console.log(done[0].auth_token);
                if (authToken != null) {
                    if (done[0].auth_token != authToken.toString()) {
                        res.status(403);
                        res.send("Forbidden");
                    } else {
                        try {
                            User.alter(givenName, familyName, password, id, function () {
                                //console.log(result);
                                res.status(200);
                                res.send("OK");
                            })
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
                else {
                    res.status(401);
                    res.send("Unauthorized");
                }
            });
        } catch (err) {
            console.log(err.toString());
        }

    }
};

exports.delete = function (req, res) {
    let id = req.params.userId;
    User.remove(id, function (result) {
        res.json(result);
    })
};

