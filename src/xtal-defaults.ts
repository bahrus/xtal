module xtal.elements{
    function initXtalDefaults(){
        class XtalDefaults extends Polymer.Element{
            static get is(){return 'xtal-defaults';}
            ready(){
                super.ready();
                const defaultTags = this.getElementsByTagName('template')['content'].children;
                for(let i = 0, ii = defaultTags.length; i < ii; i++){
                    const defaultTag = defaultTags[i];
                    const tagName = defaultTag.nodeName.toLowerCase();
                    const matchingTags = document.getElementsByTagName(tagName);
                    const attribs = defaultTag.attributes;
                    for(var j = 0, jj = attribs.length; j < jj; j++){
                        var attrib = attribs[j];
                        var attribName = attrib.nodeName;
                        var val = attrib.nodeValue;
                        for(var k = 0, kk = matchingTags.length; k < kk; k++){
                            var matchingTag = matchingTags[k];
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