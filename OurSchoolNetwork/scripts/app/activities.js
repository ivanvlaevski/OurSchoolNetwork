/**
 * Activities view model
 */

var app = app || {};

app.Activities = (function () {
    'use strict'

    // Activities model
    var activitiesModel = (function () {

        var activityModel = {

            id: 'Id',
            fields: {
                Text: {
                    field: 'Text',
                    defaultValue: ''
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                Picture: {
                    fields: 'Picture',
                    defaultValue: null
                },
                UserId: {
                    field: 'UserId',
                    defaultValue: null
                },
                ShowInClassOnly: {
                    field: 'ShowInClassOnly',
                    defaultValue: true
                },
                Location: {
                    field: 'Location'
                },
                Likes: {
                    field: 'Likes'
                },
                NotLikes: {
                    field: 'NotLikes'
                },
                DeleteRequests: {
                    field: 'DeleteRequests'
                }
            },
            CreatedAtFormatted: function () {
                return app.helper.formatDate(this.get('CreatedAt'));
            },
            PictureUrl: function () {
                return app.helper.resolvePictureUrl(this.get('Picture'));
            },
            CountLikes: function() {
                var likes = this.get('Likes');
                return (likes === undefined ? 0 : likes.length);
            },
            CountNotLikes: function() {
                var notlikes = this.get('NotLikes');
                return (notlikes === undefined ? 0 : notlikes.length);
            },
            CountDeleteRequests: function () {
                var deleterequests = this.get('DeleteRequests');
                return (deleterequests=== undefined ? '' : (deleterequests.length>5?'ilv-hide':''));
            },
            User: function () {

                var userId = this.get('UserId');

                var user = $.grep(app.Users.users(), function (e) {
                    return e.Id === userId;
                })[0];

                return user ? {
                    DisplayName: user.DisplayName,
                    PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture)
                } : {
                    DisplayName: 'Anonymous',
                    PictureUrl: app.helper.resolveProfilePictureUrl()
                };
            },
            isVisible: function () {
                var currentUserId = app.Users.currentUser.data.Id;
                var userId = this.get('UserId');

                return currentUserId === userId;
            }
        };

        // Activities data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var activitiesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: activityModel
            },
            transport: {
                read: function (options) {
                    if (appSettings.currentLocation !== null) {
                        console.log('use location >> ' + appSettings.currentLocation.pos[0].coords.latitude + '-' + appSettings.currentLocation.pos[0].coords.longitude);
                        $.ajax({
                            type: "GET",
                            url: 'http://api.everlive.com/v1/' + appSettings.everlive.apiKey + '/Activities',
                            headers: {
                                "X-Everlive-Filter": JSON.stringify({
                                    "Location": {
                                        "$nearSphere": {
                                            "longitude": appSettings.currentLocation.pos[0].coords.latitude,
                                            "latitude": appSettings.currentLocation.pos[0].coords.longitude
                                        },
                                        "$maxDistanceInKilometers": 0.25
                                    },
                                    "UserId": { "$in": app.Users.pullClassMates() }
                                })
                            },
                            success: function (result) {
                                options.success(result);
                            },
                            error: function (result) {
                                options.error(result);
                            }
                        });
                    } else {
                        options.error();
                    };
                },
                create: function (options) {
                    $.ajax({
                        type: "POST",
                        url: 'http://api.everlive.com/v1/' + appSettings.everlive.apiKey + '/Activities',
                        //dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(options.data),
                        success: function (result) {
                            options.success(result);
                        },
                        error: function (result) {
                            options.error(result);
                        }
                    });
                },
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-activities-span').hide();
                } else {
                    $('#no-activities-span').show();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });

        return {
            activities: activitiesDataSource
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

        var init = function () {
            console.log('init');
            
        }

        return {
            activities: activitiesModel.activities,
            activitySelected: activitySelected,
            logout: logout,
            init: init
        };

    }());

    return activitiesViewModel;

}());
