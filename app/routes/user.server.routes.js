const users = require('../controllers/user.server.controller');

module.exports = function (app) {



    app.route('/api/v1/users')
        .get(users.list)
        .post(users.create);

    app.route('/api/v1/users/:userId')
        .get(users.read)
        .patch(users.update)
        .delete(users.delete);
};