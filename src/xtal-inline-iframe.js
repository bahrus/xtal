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
        var XtalInlineIFrame = (function (_super) {
            __extends(XtalInlineIFrame, _super);
            function XtalInlineIFrame() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(XtalInlineIFrame, "is", {
                get: function () { return 'xtal-inline-iframe'; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XtalInlineIFrame, "properties", {
                get: function () {
                    return {
                        passObject: {
                            type: Object,
                            observer: 'onObjectChange'
                        },
                        passPropertyKey: {
                            type: String,
                        },
                        passTo: {
                            type: String
                        }
                    };
                },
                enumerable: true,
                configurable: true
            });
            XtalInlineIFrame.prototype.ready = function () {
                _super.prototype.ready.call(this);
                var _this = this;
                var innerHTML;
                if (this.children.length === 1) {
                    var srcRoot = _this.children[0];
                    if (srcRoot.tagName === 'TEMPLATE') {
                        var htmlToEmbed = document.importNode(srcRoot, true);
                        innerHTML = htmlToEmbed.innerHTML;
                        if (innerHTML === '') {
                            var outerHTML = htmlToEmbed.outerHTML;
                            innerHTML = outerHTML.replace('<template>', '');
                            innerHTML = innerHTML.replace('</template>', ''); //TODO replace last only
                        }
                    }
                    else {
                        innerHTML = this.innerHTML;
                    }
                }
                else {
                    innerHTML = this.innerHTML;
                }
                console.log('innerHML = ' + innerHTML);
                var iframe = _this.$.target;
                innerHTML = "\n            <html>\n                <body>" + innerHTML + "</body>\n            </html>\n            ";
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(innerHTML);
                iframe.contentWindow.document.close();
            };
            XtalInlineIFrame.prototype.onObjectChange = function (newVal) {
                var targetElements = this.$.target.contentWindow.document.querySelectorAll(this['passTo']);
                for (var i = 0, ii = targetElements.length; i < ii; i++) {
                    var targetElement = targetElements[i];
                    targetElement[this['passPropertyKey']] = newVal;
                }
            };
            return XtalInlineIFrame;
        }(Polymer.Element));
        customElements.define(XtalInlineIFrame.is, XtalInlineIFrame);
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-inline-iframe.js.map