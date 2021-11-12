(function () {
    // TODO: 以后要可能对编辑器更新预览、编辑帖子的内容后等部分进行翻译
    // 为了避免复制粘贴代码，先把翻译部分分离出来
    var translateHiddenText = function(translator, hid){
        translator.translate('[[mirai-forum:hidden-message.title]]').then((title) => {
            hid.attr('title', title);
        });
    };
    var translateFoldButton = function(translator, btn){
        translator.translate('[[mirai-forum:folded.text]]').then((title) => {
            btn.text(title);
            // 翻译时顺便加入点击事件到按钮
            btn.on('click', function() {
                var content = $(this).parent('div.fold').children('div.fold-content');
                if (content.css('display') == 'block'){
                    content.css('display', 'none');
                } else {
                    content.css('display', 'block');
                }
            });
        });
    };
    $(window).on('action:topic.loading', () => {
        require(['components', 'translator'], (components, translator) => {
            let posts = components.get('post');
            let hid = posts.find('.text-hov-hidden');
            translateHiddenText(translator, hid);
        });
        require(['components', 'translator'], (components, translator) => {
            let posts = components.get('post');
            let btn = posts.find('.fold-button');
            translateFoldButton(translator, btn);
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
