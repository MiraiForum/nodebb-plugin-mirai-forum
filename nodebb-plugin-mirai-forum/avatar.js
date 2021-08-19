const reqNodebb = require.main.require;

const nodebbHelper = reqNodebb('./public/src/modules/helpers.js');
const Benchpress = reqNodebb('benchpressjs');


module.exports = function () {
    (function (nodebbBuildAvatar) {
        console.log("Injecting nodebb helpers", nodebbHelper);

        nodebbHelper.buildAvatar = function (ava) {
            console.log("Injected buildAvatar called", arguments);
            if (!ava) {
                ava = this;
            }
            // ava.uploadedpicture = ava.picture = 'https://avatars.githubusercontent.com/u/12100985?v=4';
            return nodebbBuildAvatar.apply(this, arguments);
        };

        Benchpress.registerHelper('buildAvatar', nodebbHelper.buildAvatar);
    })(nodebbHelper.buildAvatar);
};