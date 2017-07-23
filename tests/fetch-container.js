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
var FetchContainer = (function (_super) {
    __extends(FetchContainer, _super);
    function FetchContainer() {
        return _super.call(this) || this;
    }
    FetchContainer.prototype.connectedCallback = function () {
        this.innerHTML = "\n        <div>This is a Native Custom Element</div>\n        <xtal-fetch href=\"generated.json\" as=\"json\" result=\"{{generatedJSON}}\"></xtal-fetch>\n        <pre id=\"jsonOutput\">Waiting...</pre>\n    ";
    };
    Object.defineProperty(FetchContainer.prototype, "generatedJSON", {
        get: function () {
            return this._generatedJSON;
        },
        set: function (val) {
            debugger;
            this._generatedJSON = val;
            console.log(val);
            var preElement = this.querySelector('#jsonOutput');
            preElement.innerText = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FetchContainer.prototype, "watch", {
        get: function () {
            return this._watch;
        },
        set: function (val) {
            console.log('watch called, val = ', val);
            this._watch = val;
        },
        enumerable: true,
        configurable: true
    });
    return FetchContainer;
}(HTMLElement));
customElements.define('fetch-container', FetchContainer);
//# sourceMappingURL=fetch-container.js.map