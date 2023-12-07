// ==UserScript==
// @name         FarmRPG Localizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Localize FarmRPG website without language selection
// @author       You
// @match        https://farmrpg.com/*
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    // Загрузка файла с переводами
    const response = await fetch('https://raw.githubusercontent.com/CoringPlay/farmrpg-localization/main/localization.js');
    const translations = await response.json();

    function replaceText(node) {
        node.nodeValue = node.nodeValue.replace(
            new RegExp(Object.keys(translations).join('|'), 'g'),
            matched => translations[matched]
        );
    }

    function traverse(node) {
        const treeWalker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        while (treeWalker.nextNode()) {
            replaceText(treeWalker.currentNode);
        }
    }

    function handleMutations(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    traverse(node);
                });
            }
        }
    }

    const observer = new MutationObserver(handleMutations);

    const observerConfig = {
        childList: true,
        subtree: true,
        characterData: true
    };

    // Применяем локализацию при загрузке
    traverse(document.body);

    // Начинаем отслеживание изменений
    observer.observe(document.body, observerConfig);
})();
