module xtal.elements{
    class XtalInlineIFrame extends Polymer.Element{
        static get is(){return 'xtal-inline-iframe';}
        connectedCallback(){
            super.connectedCallback();
            const srcTemplate = this.children[0];
            const htmlToEmbed = document.importNode(srcTemplate, true);
            const iframe = this.$.target;
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(htmlToEmbed['innerHTML']);
            iframe.contentWindow.document.close();
        }
    }
    customElements.define(XtalInlineIFrame.is, XtalInlineIFrame)
}