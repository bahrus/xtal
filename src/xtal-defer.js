var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalDefer() {
            class XtalDefer extends Polymer.Element {
                static get is() { return 'xtal-defer'; }
                connectedCallback() {
                    super.connectedCallback();
                    const dependencies = this.querySelectorAll('[is="dependency"]');
                    for (let i = 0, ii = dependencies.length; i < ii; i++) {
                        const dependency = dependencies[i];
                        const tagName = dependency.tagName.toLowerCase();
                        this.processTag(tagName);
                    }
                }
                processTag(tagName) {
                    if (XtalDefer.alreadyApplied[tagName])
                        return;
                    XtalDefer.alreadyApplied[tagName] = true;
                    customElements.whenDefined(tagName).then(() => {
                        const posOfLastSlash = tagName.lastIndexOf('-');
                        const superClassTagName = tagName.substr(0, posOfLastSlash);
                        customElements.whenDefined(superClassTagName).then(() => {
                            const superClass = customElements.get(superClassTagName).prototype;
                            const mixinClass = customElements.get(tagName).prototype;
                            //debugger;
                            for (const key of Object.getOwnPropertyNames(mixinClass)) {
                                console.log(key);
                                if (key === 'constructor')
                                    continue;
                                superClass[key] = mixinClass[key];
                            }
                        });
                    });
                }
            }
            XtalDefer.alreadyApplied = {};
            customElements.define(XtalDefer.is, XtalDefer);
        }
        customElements.whenDefined('xtal-ball').then(() => initXtalDefer());
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-defer.js.map