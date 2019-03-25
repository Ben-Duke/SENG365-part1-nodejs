const db = require('../../config/db');

exports.getCats = async function (done) {
    console.log("calling getOne in venues cat");
    console.log("looking");
    db.getPool().query('SELECT * FROM VenueCategory WHERE 1', function (err, rows) {

        if (err) return done(err);
        done(rows);
    })
};
