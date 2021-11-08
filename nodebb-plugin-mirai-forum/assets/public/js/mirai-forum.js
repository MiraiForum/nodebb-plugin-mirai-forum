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
