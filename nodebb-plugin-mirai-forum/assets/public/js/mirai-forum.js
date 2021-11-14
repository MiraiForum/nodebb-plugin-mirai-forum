(function () {
    function folden_onButtonClick() {
        var content = $(this).parent('div.fold').children('div.fold-content');
        if (content.css('display') == 'block') {
            content.css('display', 'none');
        } else {
            content.css('display', 'block');
        }
    }

    function folden_registerButtonClickHandler(btn) {
        let btn0 = $(btn);
        if (btn0.attr('folden-handler-registered') == undefined) {
            btn0.on('click', folden_onButtonClick);
            btn0.attr('folden-handler-registered', '1');
        }
    }

    let miraiForumPublic = window.miraiForumPublic = {};
    /**
     * @param {HTMLButtonElement} btn 
     */
    miraiForumPublic.onFoldButtonClick = function (btn) {
        btn.removeEventListener('click', miraiForumPublic.onFoldButtonClick);
        btn.onclick = null;
        folden_registerButtonClickHandler(btn);
        folden_onButtonClick.apply(btn);
    }

    function setupPost(post) {
        require(['translator'], (translator) => {
            let hid = post.find('.text-hov-hidden');
            translator.translate('[[mirai-forum:hidden-message.title]]').then((title) => {
                hid.attr('title', title);
            });
            let btn = post.find('.fold-button');
            folden_registerButtonClickHandler(btn);
            translator.translate('[[mirai-forum:folded.text]]').then((title) => {
                btn.text(title);
            });
        });
    }

    function fireSetupOfPost(pid) {
        let post0 = $('[component="post"][data-pid="' + pid + '"]');
        setupPost(post0);
    }

    $(window).on('action:topic.loading', () => {
        require(['components'], (components) => {
            let posts = components.get('post');
            setupPost(posts)
        });
    });
    $(window).on('action:posts.edited', function (e0, data) {
        // console.log('action:posts.edited', arguments);
        fireSetupOfPost(data.post.pid)
    });
    $(window).on('action:posts.loaded', function (e0, data) {
        // console.log('action:posts.loaded', arguments)
        // '[component="post"][data-pid="' + pid + '"]'
        // [1].posts[0].pid
        for (let post of data.posts) {
            fireSetupOfPost(post.pid)
        }
    })
    $(window).on('action:composer.enhanced', (arguments) => {
        console.log(arguments);
        require([
            'composer/formatting',
            'composer/controls',
            'translator',
        ], function (formatting, controls, translator) {
            if (formatting && controls) {
                translator.getTranslations(window.config.userLang || window.config.defaultLang, 'mirai-forum', function (strings) {

                    formatting.addButtonDispatch('hidden-text', function (textarea, selectionStart, selectionEnd) {
                        if (selectionStart === selectionEnd) {
                            let hov = strings["hidden-message.placeholder"] || 'Text to hidden';
                            controls.insertIntoTextarea(textarea, '+=[' + hov + ']=+');
                            controls.updateTextareaSelection(textarea, selectionStart + 3, selectionEnd + hov.length + 3);
                        } else {
                            var wrapDelta = controls.wrapSelectionInTextareaWith(textarea, '+=[', ']=+');
                            controls.updateTextareaSelection(textarea, selectionStart + 3 + wrapDelta[0], selectionEnd + 3 - wrapDelta[1]);
                        }
                    });

                    formatting.addButtonDispatch('folded-text', function (textarea, selectionStart, selectionEnd) {
                        if (selectionStart === selectionEnd) {
                            let hov = strings["folded.placeholder"] || 'Content to fold';
                            controls.insertIntoTextarea(textarea, '[fold]' + hov + '[/fold]');
                            controls.updateTextareaSelection(textarea, selectionStart + 6, selectionEnd + hov.length + 6);
                        } else {
                            var wrapDelta = controls.wrapSelectionInTextareaWith(textarea, '[fold]', '[/fold]');
                            controls.updateTextareaSelection(textarea, selectionStart + 6 + wrapDelta[0], selectionEnd + 6 - wrapDelta[1]);
                        }
                    });
                });
            }
        });
    });
})();
