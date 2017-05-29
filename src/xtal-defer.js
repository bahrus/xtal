var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalDefer() {
            console.log('in initXtalDefer');
            class XtalDefer extends Polymer.Element {
                //static alreadyApplied : {[key: string] : boolean} = {};
                static get is() { return 'xtal-defer'; }
                connectedCallback() {
                    super.connectedCallback();
                    const dependencies = this.querySelectorAll('[is="dependency"]');
                    console.log('dependencies count = ' + dependencies.length);
                    for (let i = 0, ii = dependencies.length; i < ii; i++) {
                        const dependency = dependencies[i];
                        const tagName = dependency.tagName.toLowerCase();
                        this.processTag(tagName);
                    }
                }
                processTag(tagName) {
                    //if(XtalDefer.alreadyApplied[tagName]) return;
                    //XtalDefer.alreadyApplied[tagName] = true;
                    customElements.whenDefined(tagName).then(() => {
                        const mixinClass = customElements.get(tagName);
                        const posOfLastSlash = tagName.lastIndexOf('-');
                        const superClassTagName = tagName.substr(0, posOfLastSlash);
                        customElements.whenDefined(superClassTagName).then(() => {
                            const superClass = customElements.get(superClassTagName);
                            //for(const key in mixinClass.getOwnProperties)
                            debugger;
                        });
                    });
                }
            }
            customElements.define(XtalDefer.is, XtalDefer);
        }
        console.log('iah');
        customElements.whenDefined('xtal-ball').then(() => initXtalDefer());
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-defer.js.map