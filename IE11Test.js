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
var AppDrawer = (function (_super) {
    __extends(AppDrawer, _super);
    function AppDrawer() {
        return _super.call(this) || this;
    }
    AppDrawer.prototype.connectedCallback = function () {
        this.innerHTML = "<b>I'm an app-drawer-markup!</b>";
    };
    return AppDrawer;
}(HTMLElement));
window.addEventListener('WebComponentsReady', function () {
    customElements.define('app-drawer', AppDrawer);
});
//# sourceMappingURL=IE11Test.js.map