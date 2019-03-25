const users = require('../controllers/user.server.controller');

module.exports = function (app) {



    app.route('/api/v1/users')
        .get(users.list);

    app.route('/api/v1/users')
        .post(users.create);

    app.route('/api/v1/users/:id/photo')
        .get(users.getPhoto)
        .delete(users.deletePhoto)
        .put(users.uploadPhoto);

    app.route('/api/v1/users/logout')

        .post(users.logOut);

    app.route('/api/v1/users/login')
        .post(users.login);

    app.route('/api/v1/users/:userId')
        .get(users.read)
        .patch(users.update)
        .delete(users.delete);
};