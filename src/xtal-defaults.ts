module xtal.elements{
    function initXtalDefaults(){
        class XtalDefaults extends Polymer.Element{
            static get is(){return 'xtal-defaults';}
            ready(){
                super.ready();
                const templates = this.getElementsByTagName('template');
                if(templates.length !== 1) return;
                const template = templates[0];
                const defaultTags = template.content.children;
                for(let i = 0, ii = defaultTags.length; i < ii; i++){
                    const defaultTag = defaultTags[i];
                    const tagName = defaultTag.nodeName.toLowerCase();
                    const matchingTags = document.getElementsByTagName(tagName);
                    const attribs = defaultTag.attributes;
                    for(let j = 0, jj = attribs.length; j < jj; j++){
                        const attrib = attribs[j];
                        const attribName = attrib.nodeName;
                        const val = attrib.nodeValue;
                        for(let k = 0, kk = matchingTags.length; k < kk; k++){
                            const matchingTag = matchingTags[k];
                            matchingTag.setAttribute(attribName, val);
                        }
                    }
                }
            }
        }
        customElements.define(XtalDefaults.is, XtalDefaults);
    }
    customElements.whenDefined('xtal-ball').then(() => initXtalDefaults());
}