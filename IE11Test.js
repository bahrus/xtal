class AppDrawer extends HTMLElement {
    constructor() {
        super();
    }
    // static get observedAttributes() {
    //   return ['my-prop'];
    // }
    connectedCallback() {
        this.innerHTML = "<b>I'm an app-drawer-markup!</b>";
    }
    /**
     * I am here
     */
    get myProp() {
        return this._myProp;
    }
    set myProp(val) {
        this._myProp = val;
    }
}
window.addEventListener('WebComponentsReady', function () {
    customElements.define('app-drawer', AppDrawer);
});
//# sourceMappingURL=IE11Test.js.map