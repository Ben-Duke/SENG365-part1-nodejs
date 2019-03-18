const db = require('../../config/db');


exports.getAll = function (done) {
    db.getPool().query('SELECT * FROM User', function (err, rows) {

        if (err) return done({ "ERROR": "Error selecting" });

        return done(rows);
    })
};

exports.getOne = function (userId, done) {
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