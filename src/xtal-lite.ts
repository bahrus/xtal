module xtal{
    interface ElementAttributeListener{
        el: HTMLElement;
        propertyKey: string;
    }
    export const domLite:{[key: string] : HTMLTemplateElement} = {}
    const caseMap = {};
    const CAMEL_TO_DASH = /([A-Z])/g;
    const DASH_TO_CAMEL = /-[a-z]/g;
    export class XtalLite extends HTMLElement{
        dashedChildren: {[key: string] : Function} = {};
        listeningInners: {[key: string] : HTMLElement[]} = {};
        listeningAttributes: {[key: string] : ElementAttributeListener[]} = {};
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
        // disconnectedCallback(){
        //     super.discon
        //     // this.listeningInners = null; //is this necessary?
        //     // this.listeningAttributes = null; //is this necessary?
        //     // //todo:  remove element listeners?
        // }
        
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

        /**
         * Converts "dash-case" identifier (e.g. `foo-bar-baz`) to "camelCase"
         * (e.g. `fooBarBaz`).
         *
         * @memberof Polymer.CaseMap
         * @param {string} dash Dash-case identifier
         * @return {string} Camel-case representation of the identifier
         */
        dashToCamelCase(dash) {
            return caseMap[dash] || (
                caseMap[dash] = dash.indexOf('-') < 0 ? dash : dash.replace(DASH_TO_CAMEL,
                (m) => m[1].toUpperCase()
                )
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
                    const innerBinding = this.getInnerBinding(resultPath, '{{', '}}');
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
                        const attrListeners = this.listeningAttributes[innerBinding];
                        if(attrListeners){
                            attrListeners.forEach(al =>{
                                al.el[this.dashToCamelCase(al.propertyKey)] = val;
                            })
                        }
                    })
                }
            }
        }
        getInnerBinding(s: string, openStr: string, closedStr: string){
            if(s === null) return null;
            if(s.substring(0, 2) !== openStr) return null;
            const len = s.length;
            if(s.substr(len - 2) !== closedStr) return null;
            return s.substring(2, len - 2);
        }
        processChildren(nd: HTMLElement){
            if(nd.children.length === 0) {
                const tc = nd.textContent.trim();
                console.log(nd.outerHTML, tc);
                const innerBinding = this.getInnerBinding(tc, '{{', '}}');
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
                    for(let j = 0, jj = childNd.attributes.length; j < jj; j++){
                        const atr = childNd.attributes[j];
                        const innerBinding = this.getInnerBinding(atr.value, '[[', ']]');
                        if(innerBinding){
                            const la = this.listeningAttributes;
                            if(!la[innerBinding]) la[innerBinding] = [];
                            la[innerBinding].push({
                                el: childNd,
                                propertyKey: atr.name,
                            });
                        }
                        console.log(atr);
                    }
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