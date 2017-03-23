module xtal{
    export class XtalLite extends HTMLElement{
        connectedCallback() {
            //super.connectedCallback();
            const id = this.tagName.toLowerCase();
            const template = xtal['domLite'][id] as HTMLTemplateElement;
            var clone = document.importNode(template.content, true);
            this.appendChild(clone);
            //this.innerHTML = xtal['domLite'][id];
        }
    }
    customElements.define('xtal-lite', XtalLite);

    class DOMLite extends HTMLElement{
        connectedCallback(){
            const domTemplate = this.querySelector('template');
            if(!xtal['domLite']) xtal['domLite'] = {};
            xtal['domLite'][this.id] = domTemplate;
        }
    }
    customElements.define('dom-lite', DOMLite);
}