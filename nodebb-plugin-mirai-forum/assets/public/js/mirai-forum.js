(function () {
    $(window).on('action:topic.loading', () => {
        require(['components', 'translator'], (components, translator) => {
            let posts = components.get('post');
            let hid = posts.find('.text-hov-hidden');
            translator.translate('[[mirai-forum:hidden-message.title]]').then((title) => {
                hid.attr('title', title);
            });

        });
    });
})();
