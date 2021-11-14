
const plugin = {};
const topics = require.main.require('./src/topics');
const posts = require.main.require('./src/posts');
const privsPosts = require.main.require('./src/privileges/posts');
const user = require.main.require('./src/user');
const Meta = require.main.require('./src/meta');
const mutils = require('./utils');
const isDev = global.env === 'development';


plugin["filter:privileges+groups+list"] = function (privileges, callback) {
    privileges.push('groups:topics:edit-reply');
    callback(null, privileges);
};

plugin["filter:privileges+groups+list_human"] = function (labels, callback) {
    labels.push({ name: 'Edit reply' });
    callback(null, labels);
};

async function getPostOwner(pid) {
    let pdata = await posts.getPostFields(pid, ['uid']);
    return pdata.uid;
}

/**
 * @param {string | undefined | null} value
 * @returns {string} 
 */
function stringSafe(value) {
    if (value == undefined) return "";
    return value.replace('\r\n', '\n').replace('\r', '\n')
}

plugin["filter:register+check"] = async function (event) {

    /**
     * @type {string}
     */
    let bl = await Meta.configs.get("mirai-forum:username-blacklist");
    bl = stringSafe(bl);

    for (let rule of bl.split('\n')) {
        if (rule.trim().length == 0) continue;

        if (RegExp(rule, 'i').test(event.userData.username)) {
            throw Error("Invalid username");
        }
    }

    bl = await Meta.configs.get("mirai-forum:email-blacklist");
    bl = stringSafe(bl);

    for (let rule of bl.split('\n')) {
        if (rule.trim().length == 0) continue;

        if (RegExp(rule, 'i').test(event.userData.email)) {
            throw Error("Invalid email");
        }
    }

    return event;
};

plugin["filter:privileges+posts+edit"] = async function (event) {
    // console.log(event);
    if (!event.edit) return event; // no permissions to edit posts
    if (event.isMod || event.owner) return event; // fast-break

    // Make topic authors can edit replys
    // But not allowed edit ADMINISTRATORS / MODERATORS replys

    let hasEditReplyPerm = await privsPosts.can('topics:edit-reply', event.pid, event.uid);
    if (!hasEditReplyPerm) return event;


    let postOwner = await getPostOwner(event.pid);
    let isAdmin = await user.isAdministrator(postOwner);
    if (isAdmin) {
        return event;
    }
    let isMod = await posts.isModerator([event.pid], postOwner);
    isMod = isMod[0];
    if (isMod) {
        return event;
    }

    if (!event.isMod) {
        let topicData = await topics.getTopicFields(event.postData.tid, ['uid']);
        event.isMod = topicData.uid == event.uid;
    }

    return event;
};

plugin["static:app+load"] = async function (params) {
    function renderAdmin(req, res) {
        res.render(`admin/plugins/mirai-forum/settings.tpl`, {});
    }

    params.router.get(`/admin/plugins/mirai-forum-addon`, params.middleware.admin.buildHeader, renderAdmin);
    params.router.get(`/api/admin/plugins/mirai-forum-addon`, renderAdmin);

    return params;
};

plugin["filter:admin+header+build"] = async function (adminHeader) {
    adminHeader.plugins.push({
        route: `/plugins/mirai-forum-addon`,
        name: "Mirai Forum Addon",
    });

    return adminHeader;
};

(function () {
    const hiddenPattern = /\+\=\[(.*?)\]\=\+/g;
    const foldedPattern = /\<blockquote\>(?:\s*)\<p (?:.*?)\>\^fold<\/p>(.*?)\<\/blockquote\>/gs;

    // filter:parse+post
    /**
     * @param {string} data 
     */
    function parse(data) {
        if (isDev) {
            console.log('PARSING: Parsing ', data);
        }
        if (!hiddenPattern.test(data)) return data;
        return mutils.str_earse_code(data, (v) => {
            v = v.replace(foldedPattern, (v2, $1) => {
                return '<div class="fold"><button class="fold-button">...</button><div class="fold-content">' + $1 + '</div></div>';
            });
            v = v.replace(hiddenPattern, (v2, $1) => {
                return "<span class='text-hov-hidden'>" + $1 + '</span>';
            });
            return v;
        });
    }

    plugin["filter:sanitize+config"] = async function (sanitizeConfig) {
        sanitizeConfig.allowedClasses['button'] = ['fold-button'];
        return sanitizeConfig;
    };

    plugin["filter:parse+post"] = async function (data) {
        if (data && 'string' === typeof data) {
            data = parse(data);
        } else if (data.postData && data.postData.content) {
            data.postData.content = parse(data.postData.content);
        } else if (data.userData && data.userData.signature) {
            data.userData.signature = parse(data.userData.signature);
        }
        return data;
    };

    plugin["filter:composer+formatting"] = async function (data) {
        data.options.push({
            name: 'hidden-text',
            className: 'fa fa-eye-slash',
            title: 'Hidden text',
        });
        data.options.push({
            name: 'folded-text',
            className: 'fa fa-book',
            title: 'Folded Text',
        });
        return data;
    };

})();

module.exports = plugin;
