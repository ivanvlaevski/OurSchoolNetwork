/**
 * GeoLocationService
 */

var app = app || {};

app.GeoLocationService = (function () {
    'use strict';

    var _callBack = null;

    return {
        startWatch: function (callBack) {
            _callBack = callBack;
            if (appSettings.watchId != null) {
                navigator.geolocation.clearWatch(appSettings.watchId);
            };
            var options = { options: 30000, enableHighAccuracy: true };
            appSettings.watchId = navigator.geolocation.watchPosition(function () {
                app.GeoLocationService.onSuccess(this,arguments);
            }, function () {
                app.GeoLocationService.onError(this,arguments);
            }, options);
        },
            
        onSuccess: function (a, position) {            
            appSettings.currentLocation = { pos: position, error: null };// new Everlive.GeoPoint(position.coords.latitude,positon.coords.longitude);
            if (_callBack) {
                _callBack();
                _callBack = null;
            }
            console.log('new location: ' + appSettings.currentLocation.pos[0].coords.latitude + '-' + appSettings.currentLocation.pos[0].coords.longitude);
        },
        
        onError: function (a,error) {
            // alert(error);
            appSettings.currentLocation = { pos: null, error: error };
        }
    };


}());