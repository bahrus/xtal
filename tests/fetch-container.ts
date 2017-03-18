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
  _generatedJSON;
  get generatedJSON(){
      return this._generatedJSON;
  }
  set generatedJSON(val){
      debugger;
      this._generatedJSON = val;
      console.log(val)
      const preElement = this.querySelector('#jsonOutput') as HTMLPreElement;
      preElement.innerText = val;
  }
  _watch;
  get watch(){
    return this._watch;
  }

  set watch(val){
    console.log('watch called, val = ', val);
    this._watch = val;
  }


}
customElements.define('fetch-container', FetchContainer);
