module xtal{
    export const domLite:{[key: string] : HTMLTemplateElement} = {}
    export class XtalLite extends HTMLElement{
        dashedChildren: {[key: string] : Function} = {};
        connectedCallback() {
            const id = this.tagName.toLowerCase();
            const template = xtal.domLite[id] as HTMLTemplateElement;
            var clone = document.importNode(template.content, true);
            const nd = this.appendChild(clone);
            this.getDashedTagNames(this);            
            // customElements.whenDefined('xtal-fetch').then(() =>{
            //     console.log(customElements.get('xtal-fetch'));
            // });
        }
        getDashedTagNames(nd: HTMLElement){
            if(!nd.hasChildNodes) return;
            for(let i = 0, cn = nd.children, ii = cn.length; i < ii; i++){
                console.log('i = ' + i);
                const childNd = cn[i] as HTMLElement;
                let tagName = childNd.tagName;
                const dc = this.dashedChildren;
                if(tagName.indexOf('-') > 0){
                    tagName = tagName.toLowerCase();
                    if(typeof dc[tagName] === 'undefined'){
                        dc[tagName] = null;
                        customElements.whenDefined(tagName).then(() =>{
                            const construct = customElements.get(tagName);
                            console.log(construct);
                        })
                    }
                   
                }else{
                    this.getDashedTagNames(childNd);
                }
            }
        }
    }
    customElements.define('xtal-lite', XtalLite);

    class DOMLite extends HTMLElement{
        connectedCallback(){
            const domTemplate = this.querySelector('template');
            xtal.domLite[this.id] = domTemplate;
        }
    }
    customElements.define('dom-lite', DOMLite);
}