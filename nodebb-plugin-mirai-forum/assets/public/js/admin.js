'use strict';

/* globals define, $, socket, bootbox */
(() => {
    let init0 = function (Settings, alerts) {
        var Markdown = {};
    
        Markdown.init = function () {
            console.log("!!!");
            Settings.load('mfa-settings', $('.mfa-settings'), function (err, settings) {
            });
    
            $('#save').on('click', function () {
                Settings.save('mfa-settings', $('.mfa-settings'), function () {
                    alerts.alert({
                        type: 'success',
                        alert_id: 'addon-saved',
                        title: 'Data saved',
                    });
                });
            });
        };
    
        return Markdown;
    };
    define('admin/plugins/mirai-forum-addon', ['settings', 'alerts'], init0);
    define('admin/plugins/mirai-forum/settings', ['settings', 'alerts'], init0);
})()