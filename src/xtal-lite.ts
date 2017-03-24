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
        addListener(nd: HTMLElement, construct: any){
            const cp = construct.properties;
            if(typeof cp !== 'object') return;
            for(let key in cp){
                const prop = cp[key];
                //console.log(prop);
                if(prop['notify'] === true){
                    //console.log(this);
                    nd.addEventListener(key + '-changed', e => {
                        console.log(e);
                    })
                }
            }
        }
        getDashedTagNames(nd: HTMLElement){
            if(!nd.hasChildNodes) return;
            const _this = this;
            for(let i = 0, cn = nd.children, ii = cn.length; i < ii; i++){
                const childNd = cn[i] as HTMLElement;
                let tagName = childNd.tagName;
                if(tagName.indexOf('-') > 0){
                    tagName = tagName.toLowerCase();
                    const dc = this.dashedChildren;
                    if(dc[tagName] === undefined){
                        dc[tagName] = null;
                        customElements.whenDefined(tagName).then(() =>{
                            const construct = customElements.get(tagName);
                            dc[tagName] = construct;
                            _this.addListener(childNd, construct);
                        })
                    }else{
                        _this.addListener(childNd, dc[tagName]);
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