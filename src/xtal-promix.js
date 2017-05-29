var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalPromix() {
            class XtalPromix extends Polymer.Element {
                static get is() { return 'xtal-promix'; }
                static get properties() {
                    return {
                        setAttributesOnReady: {
                            type: String,
                        }
                    };
                }
                decrementUnresolvedElements() {
                    this.unresolvedElements--;
                    if (this.unresolvedElements === 0)
                        this.readyToSetAttributes();
                }
                connectedCallback() {
                    super.connectedCallback();
                    const dependencies = this.querySelectorAll('[is="dependency"]');
                    const len = dependencies.length;
                    this.unresolvedElements = len;
                    for (let i = 0; i < len; i++) {
                        const dependency = dependencies[i];
                        const tagName = dependency.tagName.toLowerCase();
                        this.processTag(tagName);
                    }
                }
                readyToSetAttributes() {
                    const newVal = this.getAttribute('set-attributes-on-ready');
                    if (!newVal)
                        return;
                    const attribs = newVal.split(';');
                    const parent = this.parentElement;
                    for (const attrib of attribs) {
                        const splitAttrib = attrib.split(':');
                        const key = splitAttrib[0];
                        if (key.startsWith('on-')) {
                            const eventName = key.substr(3);
                            const eventHandlerName = splitAttrib[1];
                            console.log('eventName = ' + eventName);
                            parent.addEventListener(eventName, parent[eventHandlerName]);
                        }
                        else {
                            parent.setAttribute(key, splitAttrib[1]);
                        }
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
                            //debugger;
                            for (const key of Object.getOwnPropertyNames(mixinClass)) {
                                console.log(key);
                                if (key === 'constructor')
                                    continue;
                                superClass[key] = mixinClass[key];
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