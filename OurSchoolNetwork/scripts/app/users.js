/**
 * Users model
 */

var app = app || {};

app.Users = (function () {
    'use strict';

    var usersModel = (function () {

        var currentUser = kendo.observable({ data: null });
        var usersData;

        // Retrieve current user and all users data from Backend Services
        var loadUsers = function () {

            // Get the data about the currently logged in user
            return app.everlive.Users.currentUser()
            .then(function (data) {

                var currentUserData = data.result;
                currentUserData.PictureUrl = app.helper.resolveProfilePictureUrl(currentUserData.Picture);
                currentUser.set('data', currentUserData);

                // Get the data about all registered users
                return app.everlive.Users.get();
            })
            .then(function (data) {

                usersData = new kendo.data.ObservableArray(data.result);
            })
            .then(null,
                  function (err) {
                      app.showError(err.message);
                  }
            );
        };

        var pullClassMates = function () {
            var grades = currentUser.get('data').Grade;
            if (grades === undefined) return [];
            var mates = $.grep(usersData, function (e) {
                if (e.Grade === undefined) return false;
                var b = false;
                e.Grade.forEach(function (gradeId) {
                    b = b || (grades.indexOf(gradeId) >= 0);
                });
                return b;
            });
            var ids = [];
            mates.forEach(function (mate) { ids.push(mate.Id); });
            return ids;
        };

        return {
            load: loadUsers,
            users: function () {
                return usersData;
            },
            currentUser: currentUser,
            pullClassMates: pullClassMates
        };

    }());

    return usersModel;

}());
