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
        addListener(nd, construct) {
            const cp = construct.properties;
            if (typeof cp !== 'object')
                return;
            for (let key in cp) {
                const prop = cp[key];
                //console.log(prop);
                if (prop['notify'] === true) {
                    //console.log(this);
                    nd.addEventListener(key + '-changed', e => {
                        console.log(e);
                    });
                }
            }
        }
        getDashedTagNames(nd) {
            if (!nd.hasChildNodes)
                return;
            const _this = this;
            for (let i = 0, cn = nd.children, ii = cn.length; i < ii; i++) {
                const childNd = cn[i];
                let tagName = childNd.tagName;
                if (tagName.indexOf('-') > 0) {
                    tagName = tagName.toLowerCase();
                    const dc = this.dashedChildren;
                    if (dc[tagName] === undefined) {
                        dc[tagName] = null;
                        customElements.whenDefined(tagName).then(() => {
                            const construct = customElements.get(tagName);
                            dc[tagName] = construct;
                            _this.addListener(childNd, construct);
                        });
                    }
                    else {
                        _this.addListener(childNd, dc[tagName]);
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