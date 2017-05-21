module xtal.elements{
    class XtalLattice extends HTMLElement{
        _data : any[][];
        _els : HTMLElement[][];
        constructor(){
            super();
            this._data = this.data;
        }
        connectedCallback(){
            if(this._data !== undefined) this.updateDOM();
        }
        
        get data(){
            return this._data;
        }
        set data(newVal){
            this._data = newVal;
            if(this._data !== undefined) this.updateDOM();
        }
        updateDOM(){
            if(this._els === undefined){
                this._els = [];
                const els = this._els;
                this.querySelectorAll('[data-rc]').forEach((el: HTMLElement) =>{
                    const rc = el.dataset.rc
                    const rcArr = rc.split(',').map(s => parseInt(s));
                    const rowNum = rcArr[0];
                    if(els[rowNum] === undefined) els[rowNum] = [];
                    els[rowNum][rcArr[1]] = el;
                })
                
            }
            this._data.forEach((row, idx)=>{
                row.forEach((cell, jdx) =>{
                    const el = this._els[idx][jdx];
                    console.log({el: el, cell: cell});
                    el.innerText = cell;
                })
            });
            
        }
    }
    customElements.define('xtal-lattice', XtalLattice)
}