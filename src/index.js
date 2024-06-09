import { encode } from 'plantuml-encoder/browser-index.js'

const RevealPlantUML = {

    id: 'RevealPlantUML',

    init: function () {
    },

    ready: function () {
        const config = Reveal.getConfig().plantuml || {};
        const server = config.serverPath || 'https://www.plantuml.com/plantuml/svg/';

        document.querySelectorAll('.reveal pre code.plantuml').forEach(function (block) {
            const img = document.createElement("img");
            img.setAttribute("src", server + encode(block.textContent));

            const pre = block.parentElement;
            pre.parentNode.replaceChild(img, pre);
        });
    }
}

// Reveal.registerPlugin('plantuml', RevealPlantUML);
Reveal.addEventListener('ready', RevealPlantUML.ready);

export default Plugin = RevealPlantUML;
