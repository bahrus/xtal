var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalDefaults() {
            var XtalDefaults = (function (_super) {
                __extends(XtalDefaults, _super);
                function XtalDefaults() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(XtalDefaults, "is", {
                    get: function () { return 'xtal-defaults'; },
                    enumerable: true,
                    configurable: true
                });
                XtalDefaults.prototype.ready = function () {
                    _super.prototype.ready.call(this);
                    var templates = this.getElementsByTagName('template');
                    if (templates.length !== 1)
                        return;
                    var template = templates[0];
                    var defaultTags = template.content.children;
                    for (var i = 0, ii = defaultTags.length; i < ii; i++) {
                        var defaultTag = defaultTags[i];
                        var tagName = defaultTag.nodeName.toLowerCase();
                        var matchingTags = document.getElementsByTagName(tagName);
                        var attribs = defaultTag.attributes;
                        for (var j = 0, jj = attribs.length; j < jj; j++) {
                            var attrib = attribs[j];
                            var attribName = attrib.nodeName;
                            var val = attrib.nodeValue;
                            for (var k = 0, kk = matchingTags.length; k < kk; k++) {
                                var matchingTag = matchingTags[k];
                                matchingTag.setAttribute(attribName, val);
                            }
                        }
                    }
                };
                return XtalDefaults;
            }(Polymer.Element));
            customElements.define(XtalDefaults.is, XtalDefaults);
        }
        customElements.whenDefined('xtal-ball').then(function () { return initXtalDefaults(); });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-defaults.js.map