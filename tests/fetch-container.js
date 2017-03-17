class FetchContainer extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
        <div>This is a Native Custom Element</div>
        <xtal-fetch req-url="generated.json" as="json" result="{{generatedJSON}}"></xtal-fetch>
        <pre id="jsonOutput">Waiting...</pre>
    `;
    }
    get generatedJSON() {
        return this._generatedJSON;
    }
    set generatedJSON(val) {
        this._generatedJSON = val;
        console.log();
        this.querySelector('#jsonOutput');
    }
}
window.addEventListener('WebComponentsReady', function () {
    customElements.define('fetch-container', FetchContainer);
});
//# sourceMappingURL=fetch-container.js.map