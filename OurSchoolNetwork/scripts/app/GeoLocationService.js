/**
 * GeoLocationService
 */

var app = app || {};

app.GeoLocationService = (function () {
    'use strict';



    return {
        startWatch: function () {
            if (appSettings.watchId != null) {
                navigator.geolocation.clearWatch(appSettings.watchId);
            };
            var options = { options: 10000, enableHighAccuracy: true };
            appSettings.watchId = navigator.geolocation.watchPosition(function () {
                app.GeoLocationService.onSuccess(this,arguments);
            }, function () {
                app.GeoLocationService.onError(this,arguments);
            }, options);
        },
            
        onSuccess : function (a,position) {
            appSettings.currentLocation = { pos: position, error: null };// new Everlive.GeoPoint(position.coords.latitude,positon.coords.longitude);
        },
        
        onError: function (a,error) {
            // alert(error);
            appSettings.currentLocation = { pos: null, error: error };
        }
    };


}());