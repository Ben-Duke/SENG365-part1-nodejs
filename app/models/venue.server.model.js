const db = require('../../config/db');

exports.getCats = async function (done) {
    console.log("calling getOne in venues cat");
    console.log("looking");
    db.getPool().query('SELECT * FROM VenueCategory WHERE 1', function (err, rows) {

        if (err) return done(err);
        done(rows);
    })
}
exports.insertNewVenue = async function (values, done) {
    console.log("calling into in venues");
    console.log("length of passed values is" + values.length);

    query = 'INSERT INTO Venue (venue_id, admin_id, category_id, venue_name, city, short_description, long_description, date_added, address, latitude, longitude) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    console.log("calling Insert");
    try {
        const result = await db.getPool().query(query, values);
        console.log("hi");
        done(result);
    }
    catch (err) {
        done(err.toString());

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
