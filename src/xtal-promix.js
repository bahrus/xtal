var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalPromix() {
            /**
             * "Promix" is a portmeanteau of "promise" and "mixin" (dropping the "in" for brevity).//
             */
            class XtalPromix extends Polymer.Element {
                static get is() { return 'xtal-promix'; }
                static get properties() {
                    return {};
                }
                decrementUnresolvedElements() {
                    this.unresolvedElements--;
                    if (this.unresolvedElements === 0) {
                        //this.readyToSetAttributes();
                        const thingsToShow = this.querySelectorAll('[until="ready"]');
                        console.log({ thingsToShow: thingsToShow });
                        for (let i = 0, ii = thingsToShow.length; i < ii; i++) {
                            const thingToShow = thingsToShow[i];
                            thingToShow.style.display = 'block';
                        }
                    }
                }
                //setAttributesOnReady;
                connectedCallback() {
                    super.connectedCallback();
                    const dependencies = this.querySelectorAll('[is="mixin"]');
                    const len = dependencies.length;
                    this.unresolvedElements = len;
                    for (let i = 0; i < len; i++) {
                        const dependency = dependencies[i];
                        const tagName = dependency.tagName.toLowerCase();
                        this.processTag(tagName);
                    }
                }
                processTag(tagName) {
                    if (XtalPromix.alreadyApplied[tagName]) {
                        this.decrementUnresolvedElements();
                        return;
                    }
                    XtalPromix.alreadyApplied[tagName] = true;
                    const _this = this;
                    customElements.whenDefined(tagName).then(() => {
                        const posOfLastSlash = tagName.lastIndexOf('-');
                        const superClassTagName = tagName.substr(0, posOfLastSlash);
                        customElements.whenDefined(superClassTagName).then(() => {
                            const superClass = customElements.get(superClassTagName).prototype;
                            const mixinClass = customElements.get(tagName).prototype;
                            for (const key of Object.getOwnPropertyNames(mixinClass)) {
                                if (key === 'constructor')
                                    continue;
                                superClass[key] = mixinClass[key];
                            }
                            if (mixinClass.init) {
                                const allSuperClassElements = document.querySelectorAll(superClassTagName); //TODO!
                                for (let i = 0, ii = allSuperClassElements.length; i < ii; i++) {
                                    const el = allSuperClassElements[i];
                                    el['init']();
                                }
                            }
                            _this.decrementUnresolvedElements();
                        });
                    });
                }
            }
            XtalPromix.alreadyApplied = {};
            customElements.define(XtalPromix.is, XtalPromix);
        }
        customElements.whenDefined('xtal-ball').then(() => initXtalPromix());
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-promix.js.map