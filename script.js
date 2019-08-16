/******************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Prestix Studio (https://www.prestix.studio)
 *               2018 Andrei Cheremskoy (https://GetToCode.com)
 *               2013 Cosmin Cimpoi (https://github.com/ccimpoi)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 ******************************************************************************/

(function () {

    if (typeof window !== 'object') {
        alert('Error: Kindle Optimizer is not active. The Amazon Cloud Reader window could not be found.');
        return;
    }

    KindleReaderContextMenu.ACRExtensions = true;

    var original_show = KindleReaderContextMenu.show;

    KindleReaderContextMenu.show = function () {
        var txtDoc = null;
        var selected_text_range = null;

        if (typeof (arguments[3]) !== 'undefined' && typeof (arguments[3]['start']) !== 'undefined') {
            var sId = arguments[3]['start'];
            var eId = arguments[3]['end'];

            $('iframe', document).each(function (j, textIframe) {
                var textIFrameDoc = $(textIframe).contents().get(0);
                if ($('#'+sId, textIFrameDoc).get(0)) {
                    txtDoc = textIFrameDoc;
                    return false;
                }
            });

            if (txtDoc) {
                selected_text_range = txtDoc.createRange();
                selected_text_range.setStartBefore($('#'+sId, txtDoc).get(0));
                selected_text_range.setEndAfter($('#'+eId, txtDoc).get(0));
            }
        }

        $('#ACRExtensions_searchB_sep', document).remove();
        $('#ACRExtensions_searchB', document).remove();
        var sepEl = $('<div id="ACRExtensions_searchB_sep" class="kindle_menu_separator"></div>');
        var searchB = $('<div id="ACRExtensions_searchB" class="kindle_menu_button button_enabled ui-corner-left">Search</div>');
        $('#kindle_menu_border', document).append(sepEl).append(searchB);
        setTimeout(function(){
            sepEl.show();
            searchB.removeClass('button_hidden');
        }, 1);
        $('#ACRExtensions_searchB', document).click(function (evt) {
            if (selected_text_range) {

                var content = selected_text_range.cloneContents();
                var text = content.textContent;
                var url = 'https://www.google.com/?gfe_rd=cr&ei=ogkeWeD0NvTJXpeog4gK&gws_rd=cr&fg=1#q=';
                var newTab = window.open(url + text, '_blank');
                newTab.focus();
            }
        });

        $('#ACRExtensions_translateB_sep', document).remove();
        $('#ACRExtensions_translateB', document).remove();
        var sepEl = $('<div id="ACRExtensions_translateB_sep" class="kindle_menu_separator"></div>');
        var translateB = $('<div id="ACRExtensions_translateB" class="kindle_menu_button button_enabled ui-corner-left">Translate</div>');
        $('#kindle_menu_border', document).append(sepEl).append(translateB);
        setTimeout(function(){
            sepEl.show();
            translateB.removeClass('button_hidden');
        }, 1);
        $('#ACRExtensions_translateB', document).click(function (evt) {
            if (selected_text_range) {

                var content = selected_text_range.cloneContents();
                var text = content.textContent;

                // This function is not used since 'googtrans' coockie is unavailable for kindle page.
                function readCookie(name) {
                    var c = document.cookie.split('; '),
                    cookies = {}, i, C;
                    for (i = c.length - 1; i >= 0; i--) {
                        C = c[i].split('=');
                        cookies[C[0]] = C[1];
                    }
                    return cookies[name];
                }

                function getBrowserLanguage() {
                    var userLang = navigator.language || navigator.userLanguage;
                    userLang = userLang.split('-')[0];
                    return userLang;
                }

                var currentLanguage = getBrowserLanguage();

                if(typeof currentLanguage === 'undefined'){
                    currentLanguage = 'en';
                } else if(currentLanguage === 'he'){
                    currentLanguage = 'iw';
                } else if(currentLanguage === 'zh'){
                    currentLanguage = 'zh-CN';
                }
                var url = 'https://translate.google.com/#auto/' + currentLanguage + '/';
                var newTab = window.open(url + text, '_blank');
                newTab.focus();
            }
        });

        $('#ACRExtensions_copyB_sep', document).remove();
        $('#ACRExtensions_copyB', document).remove();
        var sepEl = $('<div id="ACRExtensions_copyB_sep" class="kindle_menu_separator"></div>');
        var copyB = $('<div id="ACRExtensions_copyB" class="kindle_menu_button button_enabled ui-corner-left">Copy</div>');
        $('#kindle_menu_border', document).append(sepEl).append(copyB);
        setTimeout(function(){
            sepEl.show();
            copyB.removeClass('button_hidden');
        }, 1);
        $('#ACRExtensions_copyB', document).click(function (evt) {
            if (selected_text_range) {
                var newW = window.open('', 'ACRExtensions', 'height=400,width=400,location=0,menubar=0,scrollbars=1,toolbar=0');
                newW.document.body.appendChild(selected_text_range.cloneContents());
            }
        });

        return original_show.apply(KindleReaderContextMenu, arguments);
    };
})();
