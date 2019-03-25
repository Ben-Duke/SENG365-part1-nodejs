const venue = require('../controllers/venue.server.controller');

module.exports = function (app) {
    app.route('/api/v1/categories')
        .get(venue.list);

    app.route('/api/v1/venues')
        .post(venue.insert);
};