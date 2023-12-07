import translations from 'https://raw.githubusercontent.com/CoringPlay/farmrpg-localization/main/localization.js';

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
traverse(document.body);
observer.observe(document.body, observerConfig);
