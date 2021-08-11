
let plugin = {};
let topics = require.main.require('./src/topics');
let posts = require.main.require('./src/posts');
let user = require.main.require('./src/user');

async function getPostOwner(pid) {
    let pdata = await posts.getPostFields(pid, ['uid']);
    return pdata.uid;
}

plugin["filter:privileges+posts+edit"] = async function (event) {
    // console.log(event);
    if (!event.edit) return event; // no permissions to edit posts
    if (event.isMod || event.owner) return event; // fast-break

    // Make topic authors can edit replys
    // But not allowed edit ADMINISTRATORS / MODERATORS replys

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


module.exports = plugin;
