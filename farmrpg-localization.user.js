// ==UserScript==
// @name         FarmRPG Localization
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Localize FarmRPG website
// @author       Coring
// @match        https://farmrpg.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function loadTranslations(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://raw.githubusercontent.com/CoringPlay/farmrpg-localization/main/localization.json",
            onload: function(response) {
                if (response.status === 200) {
                    const translations = JSON.parse(response.responseText);
                    callback(translations);
                } else {
                    console.error("Ошибка загрузки файла с переводами:", response.statusText);
                }
            },
            onerror: function(error) {
                console.error("Произошла ошибка при выполнении запроса:", error);
            }
        });
    }
    function localizeText(node, translations) {
        const originalText = node.textContent.trim();
        if (translations[originalText]) {
            node.textContent = translations[originalText];
        }
    }
    function traverseAndLocalize(node, translations) {
        if (node.nodeType === 3) {
            localizeText(node, translations);
        } else {
            for (const child of node.childNodes) {
                traverseAndLocalize(child, translations);
            }
        }
    }
    function localizePage(translations) {
        const body = document.body;
        traverseAndLocalize(body, translations);
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(addedNode => {
                    traverseAndLocalize(addedNode, translations);
                });
            });
        });
        observer.observe(body, { childList: true, subtree: true });
    }
    loadTranslations(localizePage);

})();
