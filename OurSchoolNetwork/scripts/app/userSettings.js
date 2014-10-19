/**
 * Signup view model
 */
var app = app || {};

app.UserSettings = (function () {
    'use strict';

    var settingsViewModel = (function () {

        var dataSource;
        var $SettingsForm;
        var $formFields;
        var $signupBtnWrp;
        var validator;

        var update = function () {

            dataSource.Gender = parseInt(dataSource.Gender);
            var birthDate = new Date(dataSource.BirthDate);
            if (birthDate.toJSON() === null) {
                birthDate = new Date();
            }
            dataSource.BirthDate = birthDate;

            /*
            $.ajax({
                type: "PUT",
                url: 'http://api.everlive.com/v1/' + appSettings.everlive.apiKey + '/Users/' + dataSource.Id,
                //headers: { "Authorization": "Bearer your-access-token-here" },
                contentType: "application/json",
                data: JSON.stringify(dataSource),
                success: function (data) {
                    app.showAlert("Update successful");
                    app.mobileApp.navigate('#:back');
                },
                error: function (error) {
                    alert(JSON.stringify(error));
                }
            });*/

            Everlive.$.Users.update(
                dataSource)
            .then(function () {
                app.showAlert("Update successful");
               // app.mobileApp.navigate('views/activitiesView.html');
            },
            function (err) {
                app.showError(err.message);
            });
        };

        // Executed after Signup view initialization
        // init form validator
        var init = function () {

            $SettingsForm = $('#SettingsForm');
            $formFields = $SettingsForm.find('input, textarea, select');
            $signupBtnWrp = $('#signupBtnWrp');
            validator = $SettingsForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');

            $formFields.on('keyup keypress blur change input', function () {
                if (validator.validate()) {
                    $signupBtnWrp.removeClass('disabled');
                } else {
                    $signupBtnWrp.addClass('disabled');
                }
            });
        }

        // Executed after show of the Signup view
        var show = function () {
            var user = app.Users.currentUser.get('data');
            dataSource = kendo.observable({
                Id: user.Id,
                //Username: user.Username,
                //Password: user.Password,
                DisplayName: user.DisplayName,
                //Email: user.Email,
                Gender: user.Gender,
                About: user.About,
               // Friends: [],
                BirthDate: user.BirthDate
            });
            kendo.bind($('#SettingsForm'), dataSource, kendo.mobile.ui);
        };

        // Executed after hide of the Signup view
        // disable signup button
        var hide = function () {
            $signupBtnWrp.addClass('disabled');
        };

        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            sel.style.color = (selected == 0) ? '#b6c5c6' : '#34495e';
        }

        return {
            init: init,
            show: show,
            hide: hide,
            onSelectChange: onSelectChange,
            update: update
        };

    }());

    return settingsViewModel;

}());
