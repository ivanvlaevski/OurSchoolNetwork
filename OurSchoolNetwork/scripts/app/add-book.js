/**
 * AddActivity view model
 */

var app = app || {};

app.AddBook = (function () {
    'use strict'

    var addBookViewModel = (function () {
        
        var $newStatus;
        var validator;
        var PhothoName = null;
        
        
        var init = function () {
            
            validator = $('#enterStatus').kendoValidator().data('kendoValidator');
            $newStatus = $('#newStatus');
        };
        
        var show = function () {
            
            // Clear field on view show
            $newStatus.val('');
            validator.hideMessages();
        };
        
        var saveBook = function () {
            
            // Validating of the required fields
            if (validator.validate()) {
                
                // Adding new activity to Activities model
                var Books = app.Books.Books;
                var Book = Books.add();
                
                Book.Text = $newStatus.val();
                Book.UserId = app.Users.currentUser.get('data').Id;
                Book.Location = new Everlive.GeoPoint(
                    appSettings.currentLocation.pos[0].coords.latitude,
                    appSettings.currentLocation.pos[0].coords.longitude);
                Book.PictureURL = PhothoName;

                Books.one('sync', function () {
                    app.mobileApp.navigate('#:back');
                });
                
                Books.sync();
            }
        };
        
        var addImage = function () {
            var success = function (data) {
                var fileName = Math.random().toString(36).substring(2, 15) + ".jpg";
                app.everlive.Files.create({
                    Filename: fileName,
                    ContentType: "image/jpeg",
                    base64: data
                }).then(function () {
                    //PhothoName = fileName;
                    app.everlive.Files.get().then(function (data) {
                        var files = [];
                        data.result.forEach(function (image) {
                            if (image.Filename === fileName) {
                                files.push(image.Uri);
                                PhothoName = image.Uri;
                            }
                        });
                        $("#images").kendoMobileListView({
                            dataSource: files,
                            template: "<img src='#: data #'>"
                        });
                    });
                });
            };
            var error = function () {
                navigator.notification.alert("Unfortunately we could not add the image");
            };
            var config = {
                destinationType: Camera.DestinationType.DATA_URL,
                targetHeight: 400,
                targetWidth: 400
            };
            navigator.camera.getPicture(success, error, config);
        };

        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveBook: saveBook,
            addImage: addImage
        };
        
    }());
    
    return addBookViewModel;
    
}());
