/**
 * Activities view model
 */

var app = app || {};

app.Schools = (function () {
    'use strict'

    // Activities model
    var schoolsModel = (function () {

        var schoolModel = {

            id: 'Id',
            fields: {
                Name: {
                    field: 'Name',
                    defaultValue: ''
                },
                Location: {
                    field: 'Location',
                    defaultValue: new Everlive.GeoPoint()
                }
            },
            isVisible: function () {
                var currentUserId = app.Users.currentUser.data.Id;
                var userId = this.get('UserId');

                return currentUserId === userId;
            }
        };

        
        var schoolsDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: schoolsModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'School'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-schools-span').hide();
                } else {
                    $('#no-schools-span').show();
                }
            },
            sort: { field: 'Name', dir: 'asc' }
        });

        return {
            schools: schoolsDataSource
        };

    }());

    // Activities view model
    var activitiesViewModel = (function () {

        // Navigate to activityView When some activity is selected
        var activitySelected = function (e) {

            app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
        };

        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };

        // Logout user
        var logout = function () {

            app.helper.logout()
            .then(navigateHome, function (err) {
                app.showError(err.message);
                navigateHome();
            });
        };

        return {
            activities: activitiesModel.activities,
            activitySelected: activitySelected,
            logout: logout
        };

    }());

    return activitiesViewModel;

}());
