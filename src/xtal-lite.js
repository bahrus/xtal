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
    xtal.domLite = {};
    var caseMap = {};
    var CAMEL_TO_DASH = /([A-Z])/g;
    var DASH_TO_CAMEL = /-[a-z]/g;
    /**
     * Base class for "Polymer Lite".  This class is meant as a stepping stone to full blown
     * Polymer elements but for scenarios where the contents can't work easily with Shadow DOM.
     * Supports getting content from <dom-lite> custom elements
     */
    var XtalLite = (function (_super) {
        __extends(XtalLite, _super);
        function XtalLite() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.dashedChildren = {};
            _this.listeningInners = {};
            _this.listeningAttributes = {};
            return _this;
        }
        XtalLite.prototype.connectedCallback = function () {
            var id = this.tagName.toLowerCase();
            var template = xtal.domLite[id];
            var clone = document.importNode(template.content, true);
            var nd = this.appendChild(clone);
            this.processChildren(this);
            // customElements.whenDefined('xtal-fetch').then(() =>{
            //     console.log(customElements.get('xtal-fetch'));
            // });
        };
        // disconnectedCallback(){
        //     super.discon
        //     // this.listeningInners = null; //is this necessary?
        //     // this.listeningAttributes = null; //is this necessary?
        //     // //todo:  remove element listeners?
        // }
        /**
        * Converts "camelCase" identifier (e.g. `fooBarBaz`) to "dash-case"
        * (e.g. `foo-bar-baz`).  From Polymer utils
        *
        * @memberof Polymer.CaseMap
        * @param {string} camel Camel-case identifier
        * @return {string} Dash-case representation of the identifier
        */
        XtalLite.prototype.camelToDashCase = function (camel) {
            return caseMap[camel] || (caseMap[camel] = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase());
        };
        /**
         * Converts "dash-case" identifier (e.g. `foo-bar-baz`) to "camelCase"
         * (e.g. `fooBarBaz`).
         *
         * @memberof Polymer.CaseMap
         * @param {string} dash Dash-case identifier
         * @return {string} Camel-case representation of the identifier
         */
        XtalLite.prototype.dashToCamelCase = function (dash) {
            return caseMap[dash] || (caseMap[dash] = dash.indexOf('-') < 0 ? dash : dash.replace(DASH_TO_CAMEL, function (m) { return m[1].toUpperCase(); }));
        };
        XtalLite.prototype.addListener = function (nd, construct) {
            var _this = this;
            var cp = construct.properties;
            if (typeof cp !== 'object')
                return;
            var _loop_1 = function (key) {
                var prop = cp[key];
                if (prop['notify'] === true) {
                    var resultPath = nd.getAttribute(key);
                    if (resultPath === undefined)
                        return "continue";
                    var innerBinding_1 = this_1.getInnerBinding(resultPath, '{{', '}}');
                    if (innerBinding_1 === null)
                        return "continue";
                    //console.log('innerBinding = ' + innerBinding);
                    nd.addEventListener(this_1.camelToDashCase(key) + '-changed', function (e) {
                        //console.log(e, resultPath);
                        var val = e['detail'].value;
                        _this[innerBinding_1] = val;
                        var innerListeners = _this.listeningInners[innerBinding_1];
                        if (innerListeners) {
                            innerListeners.forEach(function (il) {
                                il.innerHTML = val;
                            });
                        }
                        var attrListeners = _this.listeningAttributes[innerBinding_1];
                        if (attrListeners) {
                            attrListeners.forEach(function (al) {
                                al.el[_this.dashToCamelCase(al.propertyKey)] = val;
                            });
                        }
                    });
                }
            };
            var this_1 = this;
            for (var key in cp) {
                _loop_1(key);
            }
        };
        XtalLite.prototype.getInnerBinding = function (s, openStr, closedStr) {
            if (s === null)
                return null;
            if (s.substring(0, 2) !== openStr)
                return null;
            var len = s.length;
            if (s.substr(len - 2) !== closedStr)
                return null;
            return s.substring(2, len - 2);
        };
        XtalLite.prototype.processChildren = function (nd) {
            if (nd.children.length === 0) {
                var tc = nd.textContent.trim();
                //console.log(nd.outerHTML, tc);
                var innerBinding = this.getInnerBinding(tc, '{{', '}}');
                if (innerBinding !== null) {
                    nd.innerHTML = '';
                    var li = this.listeningInners;
                    if (!li[innerBinding])
                        li[innerBinding] = [];
                    li[innerBinding].push(nd);
                }
                return;
            }
            var _this = this;
            var _loop_2 = function (i, cn, ii) {
                var childNd = cn[i];
                var tagName = childNd.tagName;
                if (tagName.indexOf('-') > 0) {
                    tagName = tagName.toLowerCase();
                    for (var j = 0, jj = childNd.attributes.length; j < jj; j++) {
                        var atr = childNd.attributes[j];
                        var innerBinding = this_2.getInnerBinding(atr.value, '[[', ']]');
                        if (innerBinding) {
                            var la = this_2.listeningAttributes;
                            if (!la[innerBinding])
                                la[innerBinding] = [];
                            la[innerBinding].push({
                                el: childNd,
                                propertyKey: atr.name,
                            });
                        }
                        //console.log(atr);
                    }
                    var dc_1 = this_2.dashedChildren;
                    if (dc_1[tagName] === undefined) {
                        dc_1[tagName] = null;
                        customElements.whenDefined(tagName).then(function () {
                            var construct = customElements.get(tagName);
                            dc_1[tagName] = construct;
                            _this.addListener(childNd, construct);
                        });
                    }
                    else {
                        _this.addListener(childNd, dc_1[tagName]);
                    }
                }
                else {
                    this_2.processChildren(childNd);
                }
            };
            var this_2 = this;
            for (var i = 0, cn = nd.children, ii = cn.length; i < ii; i++) {
                _loop_2(i, cn, ii);
            }
        };
        return XtalLite;
    }(HTMLElement));
    xtal.XtalLite = XtalLite;
    customElements.define('xtal-lite', XtalLite);
    var DOMLite = (function (_super) {
        __extends(DOMLite, _super);
        function DOMLite() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DOMLite.prototype.connectedCallback = function () {
            var domTemplate = this.querySelector('template');
            xtal.domLite[this.id] = domTemplate;
        };
        return DOMLite;
    }(HTMLElement));
    customElements.define('dom-lite', DOMLite);
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-lite.js.map