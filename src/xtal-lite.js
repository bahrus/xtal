var xtal;
(function (xtal) {
    xtal.domLite = {};
    class XtalLite extends HTMLElement {
        constructor() {
            super(...arguments);
            this.dashedChildren = {};
        }
        connectedCallback() {
            const id = this.tagName.toLowerCase();
            const template = xtal.domLite[id];
            var clone = document.importNode(template.content, true);
            const nd = this.appendChild(clone);
            this.getDashedTagNames(this);
            // customElements.whenDefined('xtal-fetch').then(() =>{
            //     console.log(customElements.get('xtal-fetch'));
            // });
        }
        getDashedTagNames(nd) {
            if (!nd.hasChildNodes)
                return;
            for (let i = 0, cn = nd.children, ii = cn.length; i < ii; i++) {
                console.log('i = ' + i);
                const childNd = cn[i];
                let tagName = childNd.tagName;
                const dc = this.dashedChildren;
                if (tagName.indexOf('-') > 0) {
                    tagName = tagName.toLowerCase();
                    if (typeof dc[tagName] === 'undefined') {
                        dc[tagName] = null;
                        customElements.whenDefined(tagName).then(() => {
                            const construct = customElements.get(tagName);
                            console.log(construct);
                        });
                    }
                }
                else {
                    this.getDashedTagNames(childNd);
                }
            }
        }
    }
    xtal.XtalLite = XtalLite;
    customElements.define('xtal-lite', XtalLite);
    class DOMLite extends HTMLElement {
        connectedCallback() {
            const domTemplate = this.querySelector('template');
            xtal.domLite[this.id] = domTemplate;
        }
    }
    customElements.define('dom-lite', DOMLite);
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-lite.js.map