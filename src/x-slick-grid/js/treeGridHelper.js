///<reference path='../../../node_modules/@types/slickgrid/index.d.ts'/>
///<reference path='../x-slick-grid.ts'/>
var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        var xslickgrid;
        (function (xslickgrid) {
            function filterNode(item, container, calledFilterTreeNodes) {
                var treeNode = item;
                var data = container._data;
                if (treeNode.parent !== null) {
                    var parent_1 = data[treeNode.parent];
                    while (parent_1) {
                        if (parent_1._collapsed) {
                            return false;
                        }
                        if (parent_1.parent === null)
                            break;
                        parent_1 = data[parent_1.parent];
                    }
                }
                if (calledFilterTreeNodes) {
                    if (treeNode._hasAncestorThatMatchesFilter)
                        return true;
                    if (treeNode._matchesFilter)
                        return true;
                    if (treeNode._hasDescendantThatMatchesFilter)
                        return true;
                    return false;
                }
                return true;
            }
            xslickgrid.filterNode = filterNode;
            function linkChildren(container) {
                //const nodeLookup: {[key: string] : ITreeNode[]} = {};
                var hasCheckBoxSelector = container.useSlickCheckboxSelectColumn;
                var data = container._data;
                //children always come after parent
                data.forEach(function (row) {
                    delete row.childIndices;
                    row._noOfCheckedChildren = 0;
                    row._noOfIndeterminateChildren = 0;
                    row._noOfUncheckedChildren = 0;
                });
                for (var i = 0, ii = data.length; i < ii; i++) {
                    var node = data[i];
                    if (node.parent !== null) {
                        var parent_2 = data[node.parent];
                        if (parent_2) {
                            if (!parent_2.childIndices)
                                parent_2.childIndices = [];
                            parent_2.childIndices.push(i);
                            if (hasCheckBoxSelector) {
                                if (node._checked) {
                                    parent_2._noOfCheckedChildren++;
                                }
                                else if (node._indeterminate) {
                                    parent_2._noOfIndeterminateChildren++;
                                }
                                else {
                                    parent_2._noOfUncheckedChildren++;
                                }
                            }
                        }
                    }
                }
            }
            xslickgrid.linkChildren = linkChildren;
            function analyzeTreeNodes(itemFilter) {
                var container = this;
                linkChildren(container);
                var data = container._data;
                for (var i = 0, ii = data.length; i < ii; i++) {
                    var node = data[i];
                    var item = node;
                    node._matchesFilter = itemFilter(item);
                    node._hasDescendantThatMatchesFilter = false;
                    node._hasAncestorThatMatchesFilter = false;
                    node._collapsed = true;
                    //if(node._matchesFilter) node._collapsed = true;
                }
                var nodesThatMatchFilter = data.filter(function (node) { return node._matchesFilter; });
                for (var i = 0, ii = nodesThatMatchFilter.length; i < ii; i++) {
                    var node = nodesThatMatchFilter[i];
                    markChildren(node, data);
                    if (node.parent !== null) {
                        var parent_3 = data[node.parent];
                        while (parent_3) {
                            if (parent_3._hasDescendantThatMatchesFilter)
                                break;
                            parent_3._hasDescendantThatMatchesFilter = true;
                            if (!parent_3._matchesFilter) {
                                parent_3._collapsed = false;
                            }
                            else {
                                break;
                            }
                            if (parent_3.parent !== null) {
                                parent_3 = data[parent_3.parent];
                            }
                            else {
                                //parent = null;
                                break;
                            }
                        }
                    }
                }
            }
            xslickgrid.analyzeTreeNodes = analyzeTreeNodes;
            function markChildren(node, nodes) {
                var children = node.childIndices;
                if (!children)
                    return;
                for (var i = 0, ii = children.length; i < ii; i++) {
                    var child = nodes[children[i]];
                    child._hasAncestorThatMatchesFilter = true;
                    markChildren(child, nodes);
                }
            }
            function sortColumn(args) {
                var container = this;
                linkChildren(container);
                var fieldName = args.sortCol.field;
                var data = container._data;
                // debugger;
                // console.log('data', data);
                //const data_clone = data.slice(0); //Internet explorer starts modifying the order of an array while sorting
                var compareFn = function (lhs, rhs) {
                    var lhsVal = data[lhs][fieldName];
                    var rhsVal = data[rhs][fieldName];
                    if (lhsVal === rhsVal)
                        return 0;
                    if (lhsVal > rhsVal)
                        return args.sortAsc ? 1 : -1;
                    return args.sortAsc ? -1 : 1;
                };
                var root = {
                    childIndices: [],
                };
                for (var i = 0, ii = data.length; i < ii; i++) {
                    var row = data[i];
                    if (row.parent === null)
                        root.childIndices.push(i);
                }
                sortChildIndices(root, compareFn, data);
                console.log('root', root);
                var newData = [];
                addData(root, newData, data, {
                    parentIdx: -1,
                    currentIndx: 0,
                });
                // console.log('newData', newData);
                // debugger;
                container._data = newData;
                //console.log(container._data);
                linkChildren(container);
                console.log(container._data);
                var dataProvider = container.dataProvider;
                dataProvider.beginUpdate();
                dataProvider.setItems(newData);
                container._data = newData;
                dataProvider.endUpdate();
                //container.setInitialData()
                console.log('rerender');
                var grid = container.grid;
                grid.invalidate();
                grid.render();
            }
            xslickgrid.sortColumn = sortColumn;
            function sortChildIndices(node, compareFn, data) {
                var childIndices = node.childIndices;
                if (!childIndices)
                    return;
                node.sortedChildIndices = childIndices.slice(0);
                node.sortedChildIndices.sort(compareFn);
                for (var i = 0, ii = childIndices.length; i < ii; i++) {
                    var childIdx = childIndices[i];
                    var child = data[childIdx];
                    sortChildIndices(child, compareFn, data);
                }
            }
            function addData(node, newData, data, listPointer) {
                // if(!listPointer.isArtificial){
                //     newData.push(node);
                // }else{
                //     listPointer.isArtificial = false;
                // }
                var sortedChildIndices = node.sortedChildIndices;
                var parentIdx = listPointer.parentIdx;
                if (!sortedChildIndices)
                    return;
                for (var i = 0, ii = sortedChildIndices.length; i < ii; i++) {
                    var childIdx = sortedChildIndices[i];
                    var child = data[childIdx];
                    if (parentIdx !== -1) {
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
            function collapseAndHideNodes(container, searchString, test) {
            }
            xslickgrid.collapseAndHideNodes = collapseAndHideNodes;
            function attachToggleClickEvent(container, useSlickCheckboxSelectColumn) {
                container['addEventListener']('checkbox-checked', function (e, args) {
                    var cb = e.target;
                    var row = parseInt(cb.dataset.row);
                    var item = container.dataProvider.getItem(row);
                    //cb.indeterminate = false;
                    var didAnythingChange = checkItemAndChildrenRecursively(container.dataProvider, item, cb.isChecked);
                    if (didAnythingChange) {
                        console.log('call updateParentRecursively');
                        updateParentRecursively(container.dataProvider, item, cb.isChecked, cb.isInterminate);
                    }
                    //debugger;
                    var grid = container.grid;
                    grid.invalidate();
                    grid.render();
                });
                container.grid.onClick.subscribe(function (e, args) {
                    var target = e['target'];
                    var $target = $(target);
                    if ($target.hasClass('xsg_toggle')) {
                        var item = container.dataProvider.getItem(args.row);
                        if (item) {
                            if (!item._collapsed) {
                                item._collapsed = true;
                            }
                            else {
                                item._collapsed = false;
                            }
                            container.dataProvider.updateItem(item.id, item);
                        }
                        e.stopImmediatePropagation();
                    }
                });
            }
            xslickgrid.attachToggleClickEvent = attachToggleClickEvent;
            function checkItemAndChildrenRecursively(dataProvider, item, value) {
                //console.log({_checked: item._checked, value: value});
                if (item._checked === value) {
                    console.log('no change');
                    console.log({ checked: item._checked, value: value });
                    return false; // no change
                }
                var childIndexCount = item.childIndices ? item.childIndices.length : 0;
                if (value) {
                    item._noOfCheckedChildren = childIndexCount;
                    item._noOfUncheckedChildren = 0;
                }
                else {
                    item._noOfCheckedChildren = 0;
                    item._noOfUncheckedChildren = childIndexCount;
                }
                item._noOfIndeterminateChildren = 0;
                item._checked = value;
                console.log({ item_checked: item._checked });
                if (childIndexCount > 0) {
                    for (var i = 0; i < childIndexCount; i++) {
                        var childIdx = item.childIndices[i];
                        var childItem = dataProvider.getItem(childIdx);
                        checkItemAndChildrenRecursively(dataProvider, childItem, value);
                    }
                }
                return true;
            }
            function updateParentRecursively(dataProvider, item, value, wasIndeterminate) {
                if (typeof item.parent === 'undefined')
                    return;
                var parent = dataProvider.getItem(item.parent);
                console.log('parent', parent);
                console.log('args', { value: value, wasIndeterminate: wasIndeterminate });
                if (!parent)
                    return;
                if (parent._checked && value)
                    return; //nothing changed
                if (!parent._checked && (!parent._indeterminate && (!value && !wasIndeterminate)))
                    return; //nothing changed
                console.log('updating parent');
                var parentWasIndeterminate = parent._indeterminate;
                if (value) {
                    parent._noOfCheckedChildren++;
                    if (wasIndeterminate) {
                        parent._noOfIndeterminateChildren--;
                    }
                    else {
                        parent._noOfUncheckedChildren--;
                    }
                    //TODO what if clicked checkbox was indeterminate?
                }
                else {
                    parent._noOfUncheckedChildren++;
                    if (wasIndeterminate) {
                        parent._noOfIndeterminateChildren--;
                    }
                    else {
                        parent._noOfCheckedChildren--;
                    }
                }
                var noOfChildren = parent.childIndices.length;
                var needToUpdateParent = false;
                switch (noOfChildren) {
                    case parent._noOfCheckedChildren:
                        if (!parent._checked || parentWasIndeterminate) {
                            console.log('scenario 1');
                            needToUpdateParent = true;
                            parent._checked = true;
                            parent._indeterminate = false;
                        }
                        break;
                    case parent._noOfUncheckedChildren:
                        if (parent._checked || parentWasIndeterminate) {
                            console.log('scenario 2');
                            needToUpdateParent = true;
                            parent._checked = false;
                            parent._indeterminate = false;
                        }
                        break;
                    default:
                        if (parent._checked || !parentWasIndeterminate) {
                            console.log('scenario 3');
                            needToUpdateParent = true;
                            parent._checked = false;
                            parent._indeterminate = true;
                        }
                }
                if (needToUpdateParent) {
                    updateParentRecursively(dataProvider, parent, parent._checked, parent._indeterminate);
                }
            }
            var ampRegExp = /&/g;
            var ltRegExp = /</g;
            var gtRegExp = />/g;
            function nodeColumnFormatter(row, cell, value, columnDef, dataContext, container) {
                value = value.replace(ampRegExp, "&amp;").replace(ltRegExp, "&lt;").replace(gtRegExp, "&gt;");
                var spacer = "<span style='display:inline-block;height:1px;width:" + (15 * dataContext["indent"]) + "px'></span>";
                var data = container._data;
                var idx = container.dataProvider.getIdxById(dataContext.id);
                if (data[idx + 1] && data[idx + 1].indent > data[idx].indent) {
                    if (dataContext._collapsed) {
                        return spacer + " <span class='xsg_toggle xsg_expand'></span>&nbsp;" + value;
                    }
                    else {
                        return spacer + " <span class='xsg_toggle xsg_collapse'></span>&nbsp;" + value;
                    }
                }
                else {
                    return spacer + " <span class='xsg_toggle'></span>&nbsp;" + value;
                }
            }
            xslickgrid.nodeColumnFormatter = nodeColumnFormatter;
            function setAllItemsToValue(container, fieldName, value) {
                var items = container.dataProvider.getItems();
                items.forEach(function (item) {
                    item._collapsed = value;
                });
                container.dataProvider.refresh(container);
                container.grid.invalidate();
            }
            function collapseAll() {
                var container = this;
                setAllItemsToValue(container, '_collapsed', true);
            }
            xslickgrid.collapseAll = collapseAll;
            function expandAll() {
                var container = this;
                setAllItemsToValue(container, '_collapsed', false);
            }
            xslickgrid.expandAll = expandAll;
        })(xslickgrid = elements.xslickgrid || (elements.xslickgrid = {}));
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=treeGridHelper.js.map