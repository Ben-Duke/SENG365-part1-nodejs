const db = require('../../config/db');


exports.getAll = function (done) {
    db.getPool().query('SELECT * FROM User', function (err, rows) {

        if (err) return done({ "ERROR": "Error selecting" });

        return done(rows);
    })
};

exports.checkAuthUser = async function (creds, done) {
    console.log("calling auth by id");
    try {
        const result = await db.getPool()
            .query('SELECT * FROM User WHERE user_id = ? AND auth_token = ?',
                creds);
        //console.log("in auth " + result);
        done(result);
    }
    catch (err) {
        console.log(err.toString());
        done("error")
    }
}

exports.authUser = async function (creds, done) {
    console.log("calling login");
    try {
        const result = await db.getPool()
            .query('SELECT * FROM User WHERE (username = ? OR email = ?) AND password = ?',
                creds);
        //console.log("in auth " + result);
        done(result);
    }
    catch (err) {
        console.log(err.toString());
        done("error")
    }
}

exports.logout = async function (authToken, done) {
    try {
        const request = await db.getPool().query('UPDATE User SET auth_token = NULL WHERE auth_token = ?',
            authToken);
        console.log(request);
        done("Logged out");
    }
    catch (err) {
        console.log("Error in exports.logout: " + err.toString());
        done("Error");
    }
}
exports.checkAuth = async function (authToken, done) {
    try {
        const request = await db.getPool().query('SELECT * FROM User WHERE auth_token = ?',
            authToken);
        done(request);
    }
    catch (err) {
        console.log("Error in exports.checkAuth: " + err.toString());
        done("Error");
    }
}

exports.getOne = async function (userId, done) {
    console.log("calling getOne");
    console.log("looking");
    db.getPool().query('SELECT * FROM User WHERE user_id = ?', userId, function (err, rows) {

        if (err) return done(err);
        done(rows);
    })
};

exports.insert = async function (values, done) {

    console.log("calling Insert");
    try {
        const result = await db.getPool()
            .query('INSERT INTO User (username, email, given_name, family_name, password) VALUES (?)',
                values);

        done(result);
    }
    catch (err) {
        done("error")

    }
};

exports.addAuth = async function (values) {
    console.log("Calling update Auth");
    try {
        const result = await db.getPool().query('UPDATE User SET auth_token = (?) WHERE user_id = (?)', values);

    } catch (err) {
        console.log(err.toString());
        console.log("COULDNT AUTH USER!!");
    }
}

exports.alterProfilePicture = async function (id, filename, done) {


    let values = [filename, id];
    db.getPool().query('UPDATE User SET profile_photo_filename = ? WHERE user_id = ?', values, function (err, result) {
        if (err) return done(err);
        done(result);
    })
};

exports.alter = function (firstname, lastname, password, id, done) {

    let values = [firstname, lastname, password, id];
    db.getPool().query('UPDATE User SET given_name = ?, family_name = ?, password = ? WHERE user_Id = ?', values, function (err, result) {
        if (err) return done(err);
        done(result);
    })
};

exports.remove = function (id, done) {
    db.getPool().query('DELETE FROM User WHERE user_Id = ?', id, function (err, rows) {
        if (err) return done(err);
        done(rows);
    })
};