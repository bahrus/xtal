///<reference path='SlickGrid.d.ts'/>
///<reference path='../x-slick-grid.ts'/>

module crystal.elements.xslickgrid{

    export interface IHaveChildIndices{
        childIndices?: number[];
        sortedChildIndices?: number[];
    }
    export interface ITreeNode extends IHaveChildIndices{
        indent: number;
        id: string;
        parent: number;
        _collapsed: boolean;
        _matchesFilter: boolean;
        _hasDescendantThatMatchesFilter: boolean;
        _hasAncestorThatMatchesFilter: boolean;
        _checked: boolean;
        _indeterminate: boolean;
        _noOfUncheckedChildren: number;
        _noOfCheckedChildren: number;
        _noOfIndeterminateChildren: number;
    }



    export function filterNode<T>(item: T, container: IXSlickGridElement<T>, calledFilterTreeNodes?: boolean) {
        let treeNode = (item as any) as ITreeNode;
        const data = container._data;
        if (treeNode.parent !== null) {
            let parent = (data[treeNode.parent] as any) as ITreeNode;
            while (parent) {
                if (parent._collapsed ) {
                    return false;
                }
                if(parent.parent === null) break;
                parent = (data[parent.parent] as any) as ITreeNode;
            }
        }
        if(calledFilterTreeNodes){
            if(treeNode._hasAncestorThatMatchesFilter) return true;
            if(treeNode._matchesFilter) return true;
            if(treeNode._hasDescendantThatMatchesFilter) return true;
            return false;
        }
        return true;
    }

    

    export function linkChildren<T>(container: IXSlickGridElement<T>){
        //const nodeLookup: {[key: string] : ITreeNode[]} = {};
        const hasCheckBoxSelector = container.useSlickCheckboxSelectColumn;
        const data = (container._data as any) as ITreeNode[];
        //children always come after parent
        data.forEach(row => {
            delete row.childIndices;
            row._noOfCheckedChildren = 0;
            row._noOfIndeterminateChildren = 0;
            row._noOfUncheckedChildren = 0;
        });
        for(let i = 0, ii = data.length; i < ii; i++){
            const node = data[i];
            if(node.parent !== null) {
                const parent = (data[node.parent] as any) as ITreeNode;
                if(parent){
                    if(!parent.childIndices) parent.childIndices = [];
                    parent.childIndices.push(i);
                    if(hasCheckBoxSelector){
                        if(node._checked){
                            parent._noOfCheckedChildren++;
                        }else if(node._indeterminate){
                            parent._noOfIndeterminateChildren++;
                        }else{
                            parent._noOfUncheckedChildren++;
                        }
                    }
                }
            }
        }
    }

    export function analyzeTreeNodes<T>(itemFilter: (item: T) => boolean){
        const container = this as IXSlickGridElement<T>;
        linkChildren(container);
        const data = (container._data as any) as ITreeNode[];
        for(let i = 0, ii = data.length; i < ii; i++) {
            const node = data[i];
            const item = (node as any) as T;
            node._matchesFilter = itemFilter(item);
            node._hasDescendantThatMatchesFilter = false;
            node._hasAncestorThatMatchesFilter = false;
            node._collapsed = true;
            //if(node._matchesFilter) node._collapsed = true;
        }
        const nodesThatMatchFilter = data.filter(node => node._matchesFilter);
        for(let i = 0, ii = nodesThatMatchFilter.length; i < ii; i++){
            const node = nodesThatMatchFilter[i];
            markChildren(node, data);
            if(node.parent !== null){
                let parent = (data[node.parent] as any) as ITreeNode;
                while(parent){
                    if(parent._hasDescendantThatMatchesFilter) break;
                    parent._hasDescendantThatMatchesFilter = true;
                    if(!parent._matchesFilter){
                        parent._collapsed = false;
                    }else{
                        break;
                    }
                    if(parent.parent !==null){
                        parent = (data[parent.parent] as any) as ITreeNode;
                    }else{
                        //parent = null;
                        break;
                    }
                }
                
            }
        }

    }

    function markChildren(node: ITreeNode, nodes: ITreeNode[]){
        const children = node.childIndices;
        if(!children) return;
        for(let i = 0, ii = children.length; i < ii; i++){
            const child = nodes[ children[i] ];
            child._hasAncestorThatMatchesFilter = true;
            markChildren(child, nodes);
        }
    }

    export function sortColumn<T>(args: Slick.SortColumn<T>){
        const container = this as IXSlickGridElement<T>;
        linkChildren(container);
        const fieldName = args.sortCol.field;
        const data = (container._data as any) as ITreeNode[];
        // debugger;
        // console.log('data', data);
        //const data_clone = data.slice(0); //Internet explorer starts modifying the order of an array while sorting
        const compareFn = (lhs: number, rhs: number) => {
            const lhsVal = data[lhs][fieldName];
            const rhsVal = data[rhs][fieldName];
            if(lhsVal === rhsVal) return 0;
            if(lhsVal > rhsVal) return args.sortAsc ? 1 : -1;
            return args.sortAsc ? -1 : 1;
        }
        const root : IHaveChildIndices = {
            childIndices: [],
        };
        for(let i = 0, ii = data.length; i < ii; i++){
            const row = data[i];
            if(row.parent === null) root.childIndices.push(i);
        }
        sortChildIndices(root, compareFn, data);
        console.log('root', root);
        const newData : ITreeNode[] = [];
        addData(root, newData, data, {
            parentIdx: -1,
            currentIndx: 0,
            //isArtificial: true
        });
        // console.log('newData', newData);
        // debugger;
        container._data = (newData as any) as T[];
        //console.log(container._data);
        linkChildren(container);
        console.log(container._data);
        const dataProvider = container.dataProvider;
        dataProvider.beginUpdate();
        dataProvider.setItems(newData);
        container._data = (newData as any) as T[];
        dataProvider.endUpdate();
        
        //container.setInitialData()
        console.log('rerender');
        const grid = container.grid;
        grid.invalidate();
        grid.render();
    }

    function sortChildIndices(node: IHaveChildIndices, compareFn: (lhs:number, rhs: number) => number, data: IHaveChildIndices[]){
        const childIndices = node.childIndices;
        if(!childIndices) return;
        node.sortedChildIndices = childIndices.slice(0);
        node.sortedChildIndices.sort(compareFn);
        for(let i = 0, ii = childIndices.length; i < ii; i++){
            const childIdx = childIndices[i];
            const child = data[childIdx];
            sortChildIndices(child, compareFn, data);
        }
    }

    interface IListPointer{
        parentIdx: number;
        currentIndx: number;
        //isArtificial?: boolean;
    }

    function addData(node:IHaveChildIndices, newData: ITreeNode[], data: ITreeNode[], listPointer: IListPointer){
        // if(!listPointer.isArtificial){
        //     newData.push(node);
        // }else{
        //     listPointer.isArtificial = false;
        // }
        const sortedChildIndices = node.sortedChildIndices;
        const parentIdx = listPointer.parentIdx;
        if(!sortedChildIndices) return;
        for(let i = 0, ii = sortedChildIndices.length; i < ii; i++){
            const childIdx = sortedChildIndices[i];
            const child = data[childIdx];
            if(parentIdx !== -1){
                child.parent = parentIdx;
            }
            newData.push(child);
            listPointer.parentIdx = listPointer.currentIndx;
            listPointer.currentIndx++;
            addData(child, newData, data, listPointer);
        }
    }

    // function compare(LHS: ITreeNode, RHS: ITreeNode, fieldName: string){
    //     if(LHS.parent === LHS.parent){
    //         if(LHS[fieldName] === RHS[fieldName]) return 0;
    //     }
    // }

    export function collapseAndHideNodes<T>(container: IXSlickGridElement<T>, searchString: string,
                                            test: (container: IXSlickGridElement<T>, item: T, searchString: string) => boolean){


    }

    export function attachToggleClickEvent<T>(container: IXSlickGridElement<T>, useSlickCheckboxSelectColumn: boolean){
        
        container['addEventListener']('checkbox-checked', (e, args) =>{
            //debugger;
            const cb = e.target;
            const row = parseInt(cb.dataset.row);
            const item = container.dataProvider.getItem(row) as ITreeNode;
            //cb.indeterminate = false;
            const didAnythingChange = checkItemAndChildrenRecursively(container.dataProvider, item, cb.isChecked);
            if(didAnythingChange){
                console.log('call updateParentRecursively');
                updateParentRecursively(container.dataProvider, item, cb.isChecked, cb.isInterminate);
            }
            //debugger;
            const grid = container.grid;
            grid.invalidate();
            grid.render();
        });
        container.grid.onClick.subscribe((e, args) =>{
            const target = e['target'];
            const $target = $(target);
            if ($target.hasClass('xsg_toggle')) {
                const item = container.dataProvider.getItem(args.row) as ITreeNode;
                if (item) {
                    if (!item._collapsed) {
                        item._collapsed = true;
                    } else {
                        item._collapsed = false;
                    }

                    container.dataProvider.updateItem(item.id, item);
                }
                e.stopImmediatePropagation();
            }
        });
    }

    function checkItemAndChildrenRecursively(dataProvider: any, item: ITreeNode, value: boolean){
        //console.log({_checked: item._checked, value: value});
        if(item._checked === value) {
            console.log('no change')
            console.log({checked: item._checked, value: value});
            return false; // no change
        }
        const childIndexCount = item.childIndices ? item.childIndices.length : 0;
        if(value){
            item._noOfCheckedChildren = childIndexCount;
            item._noOfUncheckedChildren = 0;
        }else{
            item._noOfCheckedChildren = 0;
            item._noOfUncheckedChildren = childIndexCount;
        }
        item._noOfIndeterminateChildren = 0;
        item._checked = value;
        console.log({item_checked: item._checked});
        if(childIndexCount > 0){
            for(let i = 0; i < childIndexCount; i++){
                const childIdx = item.childIndices[i];
                const childItem = dataProvider.getItem(childIdx) as ITreeNode;
                checkItemAndChildrenRecursively(dataProvider, childItem, value);
            }
        }
        return true;
    }

    function updateParentRecursively(dataProvider: any, item: ITreeNode, value: boolean, wasIndeterminate: boolean){
        if(typeof item.parent === 'undefined') return;
        let parent = (dataProvider.getItem(item.parent) as any) as ITreeNode;
        console.log('parent', parent);
        console.log('args', {value: value, wasIndeterminate: wasIndeterminate});
        if(!parent) return;
        if(parent._checked && value) return; //nothing changed
        if(!parent._checked && (!parent._indeterminate && (!value && !wasIndeterminate))) return; //nothing changed
        console.log('updating parent');
        const parentWasIndeterminate = parent._indeterminate;
        if(value){
            parent._noOfCheckedChildren++;
            if(wasIndeterminate){
                parent._noOfIndeterminateChildren--;
            }else{
                parent._noOfUncheckedChildren--;
            }
            //TODO what if clicked checkbox was indeterminate?
        }else{
            parent._noOfUncheckedChildren++;
            if(wasIndeterminate){
                parent._noOfIndeterminateChildren--;
            }else{
                parent._noOfCheckedChildren--;
            }
        }
        const noOfChildren = parent.childIndices.length;
        let needToUpdateParent = false;
        switch(noOfChildren){
            case parent._noOfCheckedChildren:
                if(!parent._checked || parentWasIndeterminate){
                    console.log('scenario 1')
                    needToUpdateParent = true;
                    parent._checked = true;
                    parent._indeterminate = false;
                }
                
                break;
            case parent._noOfUncheckedChildren:
                if(parent._checked || parentWasIndeterminate){
                    console.log('scenario 2');
                    needToUpdateParent = true;
                    parent._checked = false;
                    parent._indeterminate = false;
                }
                
                break;
            default:
                if(parent._checked || !parentWasIndeterminate){
                    console.log('scenario 3');
                    needToUpdateParent = true;
                    parent._checked = false;
                    parent._indeterminate = true;
                }
                
        }
        if(needToUpdateParent){
            updateParentRecursively(dataProvider, parent, parent._checked, parent._indeterminate);
        } 
    }

    const ampRegExp = /&/g;
    const ltRegExp = /</g;
    const gtRegExp = />/g;
    export function nodeColumnFormatter<T extends ITreeNode>(row: number, cell: number, value: any,
                                           columnDef : Slick.Column<T>, dataContext: ITreeNode, container: IXSlickGridElement<T>){
        value = value.replace(ampRegExp, "&amp;").replace(ltRegExp, "&lt;").replace(gtRegExp, "&gt;");
        var spacer = "<span style='display:inline-block;height:1px;width:" + (15 * dataContext["indent"]) + "px'></span>";
        const data = container._data;
        var idx = container.dataProvider.getIdxById(dataContext.id);
        if (data[idx + 1] && data[idx + 1].indent > data[idx].indent) {
            if (dataContext._collapsed) {
                return spacer + " <span class='xsg_toggle xsg_expand'></span>&nbsp;" + value;
            } else {
                return spacer + " <span class='xsg_toggle xsg_collapse'></span>&nbsp;" + value;
            }
        } else {
            return spacer + " <span class='xsg_toggle'></span>&nbsp;" + value;
        }
    }

    function setAllItemsToValue<T>(container: IXSlickGridElement<T>, fieldName: string, value: any){
        const items = container.dataProvider.getItems();
        items.forEach(item => {
            item._collapsed = value;
        })
        container.dataProvider.refresh(container);
        container.grid.invalidate();
    }
    export function collapseAll<T>(){//(container: IXSlickGridElement<T>){
        const container = this as IXSlickGridElement<T>;
        setAllItemsToValue<T>(container, '_collapsed', true);
    }
    export function expandAll<T>(){
        const container = this as IXSlickGridElement<T>;
        setAllItemsToValue<T>(container, '_collapsed', false);
    }
}
