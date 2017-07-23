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
        function initXtalBrowserWindow() {
            var XtalBrowserWindow = (function (_super) {
                __extends(XtalBrowserWindow, _super);
                function XtalBrowserWindow() {
                    var _this = _super.call(this) || this;
                    _this.linkOnly = false;
                    _this.sandBox = '';
                    _this.windowTop = 0;
                    _this.width = '';
                    _this.collapsedText = '►';
                    _this.clicked = false;
                    return _this;
                }
                Object.defineProperty(XtalBrowserWindow, "is", {
                    get: function () { return 'xtal-browser-window'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalBrowserWindow, "properties", {
                    get: function () {
                        return {
                            linkOnly: {
                                type: Boolean
                            },
                            sandBox: {
                                type: String
                            },
                            windowTop: {
                                type: Number
                            },
                            width: {
                                type: String,
                                value: '90%'
                            },
                            collapsedText: {
                                type: String,
                                value: '►'
                            },
                            clicked: {
                                type: Boolean,
                                notify: true,
                                reflectToAttribute: true
                            }
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                XtalBrowserWindow.prototype.connectedCallback = function () {
                    _super.prototype.connectedCallback.call(this);
                };
                XtalBrowserWindow.prototype.ready = function () {
                    _super.prototype.ready.call(this);
                    var aLink = this.children[0];
                    aLink.target = '_blank';
                    if (this.sandBox) {
                        var iFrame = this.$.iframe;
                        iFrame.setAttribute('sandbox', this.sandBox);
                    }
                };
                XtalBrowserWindow.prototype.handleOnLoad = function () {
                    this.$.div_iframe.scrollTop = this.windowTop;
                };
                XtalBrowserWindow.prototype.markClicked = function () {
                    this.clicked = true;
                };
                XtalBrowserWindow.prototype.toggleIFrame = function () {
                    this.clicked = true;
                    var aLink = this.children[0];
                    if (this.linkOnly) {
                        window.open(aLink.href);
                        return;
                    }
                    var iFrame = this.$.iframe;
                    var toggleButton = this.$.toggle_button;
                    var divIFrame = this.$.div_iframe;
                    var div_noFrame = this.$.div_noFrame;
                    if (divIFrame.style.display === 'none') {
                        divIFrame.style.display = 'block';
                        div_noFrame.style.display = 'none';
                        iFrame.src = aLink.href;
                        toggleButton.innerText = '▼';
                    }
                    else {
                        iFrame.src = 'about:blank';
                        divIFrame.style.display = 'none';
                        div_noFrame.style.display = 'block';
                        toggleButton.innerText = this.collapsedText;
                    }
                };
                return XtalBrowserWindow;
            }(Polymer.Element));
            customElements.define(XtalBrowserWindow.is, XtalBrowserWindow);
        }
        customElements.whenDefined('xtal-ball').then(function () { return initXtalBrowserWindow(); });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-browser-window.js.map