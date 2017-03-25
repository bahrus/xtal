module xtal{
    export const domLite:{[key: string] : HTMLTemplateElement} = {}
    const caseMap = {};
    const CAMEL_TO_DASH = /([A-Z])/g;
    export class XtalLite extends HTMLElement{
        dashedChildren: {[key: string] : Function} = {};
        listeningInners: {[key: string] : HTMLElement[]} = {};
        connectedCallback() {
            const id = this.tagName.toLowerCase();
            const template = xtal.domLite[id] as HTMLTemplateElement;
            var clone = document.importNode(template.content, true);
            const nd = this.appendChild(clone);
            this.processChildren(this);            
            // customElements.whenDefined('xtal-fetch').then(() =>{
            //     console.log(customElements.get('xtal-fetch'));
            // });
        }
        disconnectedCallback(){
            this.listeningInners = null; //is this necessary?
        }
        
        /**
        * Converts "camelCase" identifier (e.g. `fooBarBaz`) to "dash-case"
        * (e.g. `foo-bar-baz`).  From Polymer utils
        *
        * @memberof Polymer.CaseMap
        * @param {string} camel Camel-case identifier
        * @return {string} Dash-case representation of the identifier
        */
        camelToDashCase(camel) {
            return caseMap[camel] || (
                caseMap[camel] = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase()
            );
        }
        addListener(nd: HTMLElement, construct: any){
            const cp = construct.properties;
            if(typeof cp !== 'object') return;
            for(let key in cp){
                const prop = cp[key];
                if(prop['notify'] === true){
                    let resultPath = nd.getAttribute(key);
                    if(resultPath === undefined) continue;
                    const innerBinding = this.getInnerBinding(resultPath);
                    if(innerBinding === null) continue;
                    console.log('innerBinding = ' + innerBinding);
                    nd.addEventListener(this.camelToDashCase(key) + '-changed', e => {
                        console.log(e, resultPath);
                        const val = e['detail'].value;
                        this[innerBinding] = val;
                        const innerListeners = this.listeningInners[innerBinding];
                        if(innerListeners){
                            innerListeners.forEach(il =>{
                                il.innerHTML = val;
                            })
                        }
                    })
                }
            }
        }
        getInnerBinding(s: string){
            if(s.substring(0, 2) !== '{{') return null;
            const len = s.length;
            if(s.substr(len - 2) !== '}}') return null;
            return s.substring(2, len - 2);
        }
        processChildren(nd: HTMLElement){
            console.log('in getDashedTagNames');
            if(nd.children.length === 0) {
                const tc = nd.textContent.trim();
                console.log(nd.outerHTML, tc);
                const innerBinding = this.getInnerBinding(tc);
                if(innerBinding !== null){
                    nd.innerHTML = '';
                    const li = this.listeningInners;
                    if(!li[innerBinding]) li[innerBinding] = [];
                    li[innerBinding].push(nd);
                }
                return;
            }
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
                    this.processChildren(childNd);
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