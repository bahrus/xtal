module xtal.elements{

    function serialize(form: HTMLFormElement, asObject?: boolean) : string | {[key: string] : string | string[]} {
        if (!form || form.nodeName !== "FORM") {
            return;
        }
        //var i, j, q = [];
        let q : string[];
        let p : {[key: string] : string | string[]};
        if(asObject){
            p = {};
        }else{
            q = [];
        }
        for (let i = form.elements.length - 1; i >= 0; i = i - 1) {
            const elm = form.elements[i] as HTMLInputElement;
            if (elm.name === "") {
                continue;
            }
            if(elm.name.indexOf('_ignore_') === 0){
                continue;
            }
            let val: string;
            if(q){
                val = encodeURIComponent(elm.value);
            }else{
                val = elm.value;
            }
            switch (elm.nodeName) {
                case 'INPUT':
                    switch (elm.type) {
                        case 'text':
                        case 'hidden':
                        case 'password':
                        case 'button':
                        case 'reset':
                        case 'submit':
                            if(q){
                                q.push(elm.name + "=" + val);
                            }else{
                                p[elm.name] = val;
                            }

                            break;
                        case 'checkbox':
                        case 'radio':
                            if (elm.checked) {
                                if(q){
                                    q.push(elm.name + "=" + val);
                                }else{
                                    if(p[elm.name]){
                                        p[elm.name] = [];
                                    }
                                    p[elm.name]['push'](val);
                                }
                            }
                            break;
                        case 'file':
                            break;
                    }
                    break;
                case 'TEXTAREA':
                    if(q){
                        q.push(elm.name + "=" + val);
                    }else{
                        p[elm.name] = val;
                    }
                    break;
                case 'SELECT':
                    switch (elm.type) {
                        case 'select-one':
                            if(q){
                                q.push(elm.name + "=" + val);
                            }else{
                                p[elm.name] = val;
                            }
                            break;
                        case 'select-multiple':
                            const selm = <HTMLSelectElement><any>elm;
                            const options = selm.options;
                            for (let j = options.length - 1; j >= 0; j = j - 1) {
                                if (options[j]['selected']) {
                                    let val2: string;
                                    if(q){
                                        val2 =  encodeURIComponent(options[j]['value']);
                                    }else{
                                        val2 = options[j]['value'];
                                    }
                                    if(q){
                                        q.push(elm.name + "=" + val);
                                    }else{
                                        if(!p[elm.name]){
                                            p[elm.name] = [];
                                        }
                                        p[elm.name]['push'](val);
                                    }

                                }
                            }
                            break;
                    }
                    break;
                case 'BUTTON':
                    switch (elm.type) {
                        case 'reset':
                        case 'submit':
                        case 'button':
                            if(q){
                                q.push(elm.name + "=" + val);
                            }else{
                                if(!p[elm.name]){
                                    p[elm.name] = [];
                                }
                                p[elm.name]['push'](val);
                            }
                            break;
                    }
                    break;
            }
        }
        if(q){
            return q.join("&");
        }else{
            return p;
        }

    }
    function validateInputElement(inputEl: HTMLInputElement){
        const val = inputEl.value;
        if(inputEl.required && val.length === 0) return false;
        if(inputEl.maxLength != -1 && val.length > inputEl.maxLength) return false;
        if(inputEl.pattern){
            const regExp = new RegExp(inputEl.pattern);
            if(! regExp.test(val)) return false;
        }
        //TODO:  set class?
        return true;
    }

     function initXtalForm(){
        class XtalForm{
            static get is(){return 'xtal-form';}
            static get properties(){
                return{
                    auto:{
                        type: Boolean
                    },
                    ironAjaxSelector:{
                        type: String,
                    },
                    cacheAll:{
                        type: Boolean
                    },
                    disabled:{
                        type: Boolean,
                        observer: 'onDisabledChange'
                    }
                }
            }
        }
        customElements.define(XtalForm.is, XtalForm);
     }

     customElements.whenDefined('xtal-ball').then(() => initXtalForm());
}