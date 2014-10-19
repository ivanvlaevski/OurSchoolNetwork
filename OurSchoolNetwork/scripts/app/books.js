/**
 * Books view model
 */

var app = app || {};

app.Books = (function () {
    'use strict'

    // Books model
    var BooksModel = (function () {

        var BookModel = {

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
                PictureURL: {
                    fields: 'PictureURL',
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
            getPictureUrl: function () {
                //return app.helper.resolvePictureUrl(this.get('Picture'));
                var t = this.get('PictureURL');
                if (t === null || t === undefined) t = "JavaScript:null;";
                return t;
            },
            getPictureView: function() {
                var t = this.get('PictureURL');
                if (t === null || t === undefined) {
                    t = "display:none;";
                } else {
                    t = "display:block;";
                };
                return t;
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

        // Books data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var BooksDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: BookModel
            },
            transport: {
                read: function (options) {
                    if (appSettings.currentLocation !== null) {
                        console.log('use location >> ' + appSettings.currentLocation.pos[0].coords.latitude + '-' + appSettings.currentLocation.pos[0].coords.longitude);
                        $.ajax({
                            type: "GET",
                            url: 'http://api.everlive.com/v1/' + appSettings.everlive.apiKey + '/Books',
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
                        url: 'http://api.everlive.com/v1/' + appSettings.everlive.apiKey + '/Books',
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
                    $('#no-Books-span').hide();
                } else {
                    $('#no-Books-span').show();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });

        return {
            Books: BooksDataSource
        };

    }());

    // Books view model
    var BooksViewModel = (function () {

        // Navigate to BookView When some Book is selected
        var BookSelected = function (e) {

            app.mobileApp.navigate('views/BookView.html?uid=' + e.data.uid);
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
            Books: BooksModel.Books,
            BookSelected: BookSelected,
            logout: logout,
            init: init
        };

    }());

    return BooksViewModel;

}());
