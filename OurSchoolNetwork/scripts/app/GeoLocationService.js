/**
 * Login view model
 */

var app = app || {};

app.GeoLocationService = (function () {
    'use strict';

    var startWatch = (function () {
        if (appSettings.watchId != null) {
            navigator.geolocation.clearWatch(appSettings.watchId);
        };
        var options = { options: 10000, enableHighAccuracy: true };
        appSettings.watchId = navigator.geolocation.watchPosition(function () {
            app.GeoLocationService.onSuccess(app.GeoLocationService, arguments);
        }, function () {
            app.GeoLocationService.onError(app.GeoLocationService, arguments);
        }, options);
    }());

    var onSuccess = (function (position) {
        appSettings.currentLocation = new Everlive.GeoPoint(position.coords.latitude,positon.coords.longitude);
    }());

    var onError = (function (error) {
        alert(error);
    }());


    return {
        startWatch: startWatch,
        onSuccess: onSuccess,
        onError: onError
    };





}());