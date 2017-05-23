module xtal.elements{
    class XtalGet extends HTMLElement{
        connectedCallback(){
            const href = this.getAttribute('href');
            fetch(href).then(resp =>{
                resp.json().then(val => {
                    this.parentNode['data'] = val;
                });
                
            })
        }
    }
    customElements.define('xtal-get', XtalGet);
}