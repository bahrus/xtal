///<reference path='../../node_modules/@types/slickgrid/index.d.ts'/>
///<reference path='../../node_modules/@types/jquery/index.d.ts'/>
///<reference path='js/treeGridHelper.ts'/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        // export function importHrefs(importStep: IDynamicImportStep[], polymerElement: Polymer.Element, callBack?: () => void){
        //     if(importStep.length === 0) {
        //         if(callBack) callBack();
        //         return;
        //     }
        //     const nextStep = importStep.shift();
        //     if(!nextStep){
        //         importHrefs(importStep, polymerElement, callBack);
        //         return;
        //     }
        //     const cdnPath = polymerElement['basePath'] ? polymerElement['basePath'] : '';
        //     const resolvedURL = polymerElement.resolveUrl(cdnPath + nextStep.importURL);
        //     polymerElement.importPath(resolvedURL, 
        //         () => importHrefs(importStep, polymerElement, callBack), 
        //         () => tryWithoutCDN(cdnPath, nextStep, importStep, callBack, polymerElement)
        //     );
        // }
        // export function downloadJSFilesInParallelButLoadInSequence(refs: IDynamicJSLoadStep[], callBack?:() => void){
        //     //see https://www.html5rocks.com/en/tutorials/speed/script-loading/
        //     const notLoadedYet : {[key: string] : boolean} = {};
        //     const nonNullRefs = refs.filter(ref => ref !== null);
        //     nonNullRefs.forEach(ref => {
        //         notLoadedYet[ref.src] = true;
        //     });
        //     nonNullRefs.forEach(ref =>{
        //         const script = document.createElement('script');
        //         script.src = ref.src;
        //         script.async = false;
        //         script.onload = () =>{
        //             //console.log(script.src + ' loaded');
        //             delete notLoadedYet[script.src];
        //             if(Object.keys(notLoadedYet).length === 0){
        //                 if(callBack) callBack();
        //             }
        //         }
        //         document.head.appendChild(script);
        //     });
        // }
        function addCSSLinks(refs) {
            var notLoadedYet = {};
            var nonNullRefs = refs.filter(function (ref) { return ref !== null; });
            nonNullRefs.forEach(function (ref) {
                notLoadedYet[ref.href] = true;
            });
            //from http://stackoverflow.com/questions/574944/how-to-load-up-css-files-using-javascript
            nonNullRefs.forEach(function (ref) {
                var head = document.getElementsByTagName('head')[0];
                var link = document.createElement('link');
                //link.id   = cssId;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = ref.href;
                link.media = 'all';
                head.appendChild(link);
            });
        }
        elements.addCSSLinks = addCSSLinks;
        // function tryWithoutCDN(cdnPath, nextStep, importStep, callBack, polymerElement){
        //     if(!cdnPath) {
        //         importHrefs(importStep, polymerElement, callBack);
        //         return;
        //     }
        //     const resolvedURL = polymerElement.resolveUrl(nextStep.importURL);
        //     polymerElement.importHref(resolvedURL, 
        //         () => importHrefs(importStep, polymerElement, callBack));
        // }
        function attachEventHandlers(grid, handlers) {
            if (!handlers)
                return;
            for (var key in handlers) {
                var handler = handlers[key];
                grid[key].subscribe(handler);
            }
        }
        elements.attachEventHandlers = attachEventHandlers;
        function initXtalXSlickGrid() {
            var XtalXSlickGrid = (function (_super) {
                __extends(XtalXSlickGrid, _super);
                function XtalXSlickGrid() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    //Begin field initialization
                    _this.height = '500px';
                    _this.width = '600px';
                    _this.renderCount = 0;
                    _this.clickedCellIndex = 0;
                    _this.clickedRowIndex = 0;
                    _this.numberOfWidthDeltas = 0;
                    _this.numberOfOrderChanges = 0;
                    _this.isContextMenuOpen = false;
                    _this.lastClickedXValue = 0;
                    _this.lastClickedYValue = 0;
                    //TODO:  type these
                    _this.wcOptions = null;
                    _this._data = null;
                    _this.gridDiv = null;
                    _this.grid = null;
                    _this._dataProvider = null;
                    _this.collapseAll = null;
                    _this.expandAll = null;
                    return _this;
                }
                Object.defineProperty(XtalXSlickGrid, "is", {
                    get: function () {
                        return 'x-slick-grid';
                    },
                    enumerable: true,
                    configurable: true
                });
                XtalXSlickGrid.prototype.fillContainerBothDimImpl = function () {
                    this.fillContainerXImpl('offsetTop', 'clientHeight', 'height', false);
                    this.fillContainerXImpl('offsetLeft', 'clientWidth', 'width', true);
                };
                XtalXSlickGrid.prototype.fillContainerHeightImpl = function () {
                    this.fillContainerXImpl('offsetTop', 'clientHeight', 'height', true);
                };
                XtalXSlickGrid.prototype.fillContainerWidthImpl = function () {
                    this.fillContainerXImpl('offsetLeft', 'clientWidth', 'width', true);
                };
                XtalXSlickGrid.prototype.fillContainerXImpl = function (offsetDim, clientDim, cssDim, resize) {
                    var thisGrid = this.querySelector('[role="grid"]');
                    var $thisGrid = $(thisGrid);
                    var offset = this[offsetDim];
                    var containerLength = this.parentElement[clientDim];
                    var thisLength = containerLength - offset;
                    if (thisLength > 0) {
                        $thisGrid.css(cssDim, thisLength);
                        if (resize && this.grid) {
                            this.grid.resizeCanvas();
                        }
                    }
                };
                XtalXSlickGrid.prototype.setEditorAndFormatter = function (columns) {
                    for (var i = 0, ii = columns.length; i < ii; i++) {
                        var col = columns[i];
                        if (col.editorFn) {
                            col.editor = col.editorFn(col);
                        }
                        if (col.formatterFn) {
                            col.formatter = col.formatterFn(col);
                        }
                        var childColumns = col.columns;
                        if (childColumns)
                            this.setEditorAndFormatter(childColumns);
                    }
                };
                XtalXSlickGrid.prototype.setInitialData = function (data, columns, gridOptions, wcOptions) {
                    var _this = this;
                    //this.data = data;
                    //this.columns = columns;
                    if (!this.readyFnInitialized) {
                        setTimeout(function () {
                            _this.setInitialData(data, columns, gridOptions, wcOptions);
                        }, 10);
                        return;
                    }
                    var checkboxSelector = null;
                    if (this.useSlickCheckboxSelectColumn) {
                        //console.log('add checkbox selector');
                        checkboxSelector = new Slick['CheckboxSelectColumn']({
                            cssClass: "slick-cell-checkboxsel"
                        });
                        columns.unshift(checkboxSelector.getColumnDefinition());
                        //grid.registerPlugin(checkboxSelector);
                    }
                    this.setEditorAndFormatter(columns);
                    //this.gridOptions = gridOptions;
                    if (!gridOptions)
                        gridOptions = {};
                    gridOptions['_container'] = this;
                    if (data['addItem']) {
                        var dataProvider = data;
                        dataProvider['container'] = this;
                        this._dataProvider = dataProvider;
                        this.grid = new Slick.Grid(this.gridDiv, dataProvider, columns, gridOptions);
                    }
                    else {
                        if (this.useTreeGridHelper) {
                            this._data = data;
                        }
                        if (wcOptions && wcOptions.dataProvider) {
                            var dataProvider = wcOptions.dataProvider(data);
                            dataProvider['container'] = this;
                            this._dataProvider = dataProvider;
                            this.grid = new Slick.Grid(this.gridDiv, dataProvider, columns, gridOptions);
                        }
                        else if (this.useDataViewDataProvider) {
                            var dataProvider = new Slick.Data.DataView({ inlineFilters: true });
                            dataProvider['container'] = this;
                            this._dataProvider = dataProvider;
                            this.grid = new Slick.Grid(this.gridDiv, dataProvider, columns, gridOptions);
                        }
                        else {
                            this.grid = new Slick.Grid(this.gridDiv, data, columns, gridOptions);
                        }
                    }
                    if (this.useTreeGridHelper) {
                        xtal.elements.xslickgrid.attachToggleClickEvent(this, this.useSlickCheckboxSelectColumn);
                        this.collapseAll = xtal.elements.xslickgrid.collapseAll;
                        this.expandAll = xtal.elements.xslickgrid.expandAll;
                    }
                    var grid = this.grid;
                    switch (this.selectionModel) {
                        case 'Cell':
                            grid.setSelectionModel((new Slick.CellSelectionModel()));
                            break;
                        case 'RowPlus':
                        case 'Row':
                            grid.setSelectionModel(new Slick.RowSelectionModel());
                            break;
                    }
                    if (checkboxSelector) {
                        //grid.registerPlugin(checkboxSelector);
                    }
                    this.wcOptions = wcOptions;
                    if (wcOptions) {
                        xtal.elements.attachEventHandlers(grid, wcOptions.eventHandlers);
                        // if(wcOptions.trackRowHover){
                        //     this.importHref(this.resolveUrl('x-slick-grid.mouseOverRow.html'), () =>{
                        //         enableMouseOverSlickGrid(this);
                        //     }, null, true);
                        // }
                        if (wcOptions.trackCurrentRow) {
                            this.clickedCellIndex = -1;
                            this.clickedRowIndex = -1;
                            grid.onClick.subscribe(function (e) {
                                var cell = grid.getCellFromEvent(e);
                                _this.clickedCellIndex = cell.cell;
                                _this.clickedRowIndex = cell.row;
                            });
                        }
                        if (wcOptions.trackColumnChanges) {
                            this.numberOfWidthDeltas = 0;
                            this.numberOfOrderChanges = 0;
                            grid.onColumnsResized.subscribe(function (e) {
                                _this.numberOfWidthDeltas++;
                            });
                            grid.onColumnsReordered.subscribe(function (e) {
                                _this.numberOfOrderChanges++;
                            });
                        }
                        if (wcOptions.trackContextMenu) {
                            this.isContextMenuOpen = false;
                            grid.onContextMenu.subscribe(function (e) {
                                e.preventDefault();
                                _this.isContextMenuOpen = true;
                                _this.lastClickedXValue = e['pageX'];
                                _this.lastClickedYValue = e['pageY'];
                                var _thisEl = _this;
                                $("body").one("click", function () {
                                    _thisEl.isContextMenuOpen = false;
                                });
                            });
                        }
                        if (wcOptions.enableAddRowOptions && wcOptions.enableAddRowOptions.autoCommit) {
                            grid.onAddNewRow.subscribe(function (e, args) {
                                var data = grid.getData();
                                var item = args.item;
                                grid.invalidateRow(data.length);
                                data.push(item);
                                grid.updateRowCount();
                                grid.render();
                            });
                        }
                    }
                    if (this.fillContainerHeight) {
                        this.fillContainerHeightImpl();
                    }
                    if (this.fillContainerWidth) {
                        this.fillContainerWidthImpl();
                    }
                    if (this.useTreeGridHelper) {
                        if (this.useSlickCheckboxSelectColumn) {
                            xtal.elements.xslickgrid.linkChildren(this);
                        }
                        xtal.elements.xslickgrid.attachToggleClickEvent(this, this.useSlickCheckboxSelectColumn);
                        this.collapseAll = xtal.elements.xslickgrid.collapseAll;
                        this.expandAll = xtal.elements.xslickgrid.expandAll;
                    }
                    this.renderCount++;
                    return grid;
                };
                XtalXSlickGrid.prototype.onNewGridRenderParams = function (newVal) {
                    this.setInitialData(newVal.data, newVal.columns, newVal.gridOptions, newVal.wcOptions);
                };
                Object.defineProperty(XtalXSlickGrid.prototype, "columns", {
                    get: function () {
                        return this.grid.getColumns();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalXSlickGrid.prototype, "data", {
                    get: function () {
                        return this.grid.getData();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalXSlickGrid.prototype, "selectedRow", {
                    get: function () {
                        if (this.clickedRowIndex === -1)
                            return null;
                        return this.data[this.clickedRowIndex];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalXSlickGrid.prototype, "options", {
                    get: function () {
                        return this.grid.getOptions();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalXSlickGrid.prototype, "dataProvider", {
                    get: function () {
                        //const grid = this.grid as Slick.Grid<any>;
                        return this._dataProvider;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalXSlickGrid, "properties", {
                    //End field initialization
                    get: function () {
                        return {
                            /**
                            * The height of the grid.
                            */
                            height: {
                                type: String,
                                value: '500px',
                            },
                            /**
                             * The width of the grid
                             */
                            width: {
                                type: String,
                                value: '600px'
                            },
                            /**
                             *  If attribute is present, stretch the grid to the bottom edge of the containing element
                            */
                            fillContainerHeight: {
                                type: Boolean,
                                value: false
                            },
                            /**
                             * If attribute is present, stretch the grid to the right edge of the containing element
                             */
                            fillContainerWidth: {
                                type: Boolean,
                                value: false
                            },
                            /**
                             * Count of how many times the grid has been rendered.
                             */
                            renderCount: {
                                type: Number,
                                value: 0,
                                notify: true,
                                reflectToAttribute: true,
                            },
                            /**
                            * Indicates the last clicked cell index
                            */
                            clickedCellIndex: {
                                type: Number,
                                notify: true,
                                reflectToAttribute: true,
                                readOnly: true,
                            },
                            /**
                             * Indicates the last clicked row index
                             */
                            clickedRowIndex: {
                                type: Number,
                                notify: true,
                                reflectToAttribute: true
                            },
                            numberOfWidthDeltas: {
                                type: Number,
                                notify: true,
                            },
                            numberOfOrderChanges: {
                                type: Number,
                                notify: true,
                            },
                            isContextMenuOpen: {
                                type: Boolean,
                                notify: true,
                                reflectToAttribute: true
                            },
                            lastClickedXValue: {
                                type: Number,
                                notify: true,
                            },
                            lastClickedYValue: {
                                type: Number,
                                notify: true,
                            },
                            /**
                             * Possible values are 'Cell', 'Row' 'RowPlus'
                             */
                            selectionModel: {
                                type: String,
                            },
                            /**
                             * If specified, then the needed references, will try to load from the cdn from the specified base path.
                             * If that fails, then it will load from the local web service
                             */
                            basePath: {
                                type: String
                            },
                            useSlickAutoToolTips: {
                                type: Boolean,
                            },
                            useSlickCellCopyManager: {
                                type: Boolean,
                            },
                            useSlickCheckboxSelectColumn: {
                                type: Boolean,
                            },
                            useDataViewDataProvider: {
                                type: Boolean,
                            },
                            useSlickPaging: {
                                type: Boolean,
                            },
                            useSlickColumnPicker: {
                                type: Boolean
                            },
                            useSlickFormatters: {
                                type: Boolean
                            },
                            useSlickEditors: {
                                type: Boolean,
                                value: false
                            },
                            useTreeGridHelper: {
                                type: Boolean,
                            },
                            gridRenderParams: {
                                type: Object,
                                observer: 'onNewGridRenderParams'
                            },
                            readyFnInitialized: {
                                type: Boolean,
                                notify: true,
                            }
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                XtalXSlickGrid.prototype.ready = function () {
                    var _this = this;
                    _super.prototype.ready.call(this);
                    this.innerHTML = "\n                <div role=\"grid\"></div>\n                ";
                    var $IsDefined = (typeof ($) !== 'undefined');
                    var sm = this.selectionModel;
                    var incCell = ((sm === 'Cell') || (sm === 'RowPlus'));
                    var incRow = ((sm === 'Row') || (sm === 'RowPlus'));
                    var slickCSSDependencies = [
                        this.useSlickPaging ? { href: this.resolveUrl('controls/slick.pager.css') } : null,
                        this.useSlickColumnPicker ? { href: this.resolveUrl('controls/slick.columnpicker.css') } : null,
                        this.useTreeGridHelper ? { href: this.resolveUrl('css/treeGridHelper.css') } : null,
                    ];
                    var slickJSDependencies = [
                        !$IsDefined ? { src: this.resolveUrl('../../bower_components/jquery/jquery.min.js') } : null,
                        !$IsDefined || !$['ui'] ? { src: this.resolveUrl('../../bower_components/jquery-ui/jquery-ui.min.js') } : null,
                        !$IsDefined || !$.fn.drag ? { src: this.resolveUrl('../../bower_components/jquery.event/event.drag/jquery.event.drag.js') } : null,
                        { src: this.resolveUrl('js/slick.core.js') },
                        { src: this.resolveUrl('js/slick.grid.js') },
                        this.useSlickEditors ? { src: this.resolveUrl('js/slick.editors.js') } : null,
                        incCell ? { src: this.resolveUrl('js/plugins/slick.cellrangeselector.js') } : null,
                        incCell ? { src: this.resolveUrl('js/plugins/slick.cellselectionmodel.js') } : null,
                        incCell ? { src: this.resolveUrl('js/plugins/slick.cellrangedecorator.js') } : null,
                        this.useSlickCellCopyManager ? { src: this.resolveUrl('js/plugins/slick.cellselectionmodel.js') } : null,
                        this.useSlickAutoToolTips ? { src: this.resolveUrl('../../bower_components/handlebars/handlebars.min.js') } : null,
                        this.useSlickAutoToolTips ? { src: this.resolveUrl('js/plugins/slick.autotooltips.js') } : null,
                        this.useSlickCheckboxSelectColumn ? { src: this.resolveUrl('js/plugins/slick.checkboxselectcolumn.js') } : null,
                        (incCell || incRow) ? { src: this.resolveUrl('js/plugins/slick.rowselectionmodel.js') } : null,
                        this.useDataViewDataProvider ? { src: this.resolveUrl('js/slick.dataview.js') } : null,
                        this.useDataViewDataProvider ? { src: this.resolveUrl('js/DataViewHelper.js') } : null,
                        this.useSlickPaging ? { src: this.resolveUrl('controls/slick.pager.js') } : null,
                        this.useSlickColumnPicker ? { src: this.resolveUrl('controls/slick.columnpicker.js') } : null,
                        this.useSlickFormatters ? { src: this.resolveUrl('js/slick.formatters.js') } : null,
                        this.useTreeGridHelper ? { src: this.resolveUrl('js/treeGridHelper.js') } : null,
                    ];
                    //xtal.elements.importHrefs(slickDependencies, this);
                    xtal.elements.addCSSLinks(slickCSSDependencies);
                    xtal.elements.downloadJSFilesInParallelButLoadInSequence(slickJSDependencies, function () {
                        var thisGrid = _this.querySelector('[role]');
                        var $thisGrid = $(thisGrid);
                        $thisGrid
                            .css('height', _this.height)
                            .css('width', _this.width);
                        _this.gridDiv = $thisGrid;
                        if (_this.fillContainerWidth || _this.fillContainerHeight) {
                            window.addEventListener('resize', function (e) {
                                if (_this.fillContainerWidth && _this.fillContainerHeight) {
                                    _this.debounce('fillContainerBothDim', _this.fillContainerBothDimImpl, 500);
                                }
                                else if (_this.fillContainerHeight) {
                                    _this.debounce('fillContainerHeight', _this.fillContainerHeightImpl, 500);
                                }
                                else {
                                    _this.debounce('fillContainerWidth', _this.fillContainerWidthImpl, 500);
                                }
                            });
                        }
                        if (_this.useTreeGridHelper) {
                            _this['analyzeTreeNodes'] = xtal.elements.xslickgrid.analyzeTreeNodes;
                            _this['sortColumn'] = xtal.elements.xslickgrid.sortColumn;
                        }
                        _this.readyFnInitialized = true;
                        //this['fire']('loadedDependencies');
                        _this.dispatchEvent(new CustomEvent('loadedDependencies'));
                    });
                };
                return XtalXSlickGrid;
            }(Polymer.Element));
            customElements.define(XtalXSlickGrid.is, XtalXSlickGrid);
        }
        // function waitForPolymerElement(){if(typeof Polymer === 'undefined' || Polymer.Element === undefined){setTimeout(waitForPolymerElement, 50);return;}
        //     initXtalXSlickGrid();
        // }
        // waitForPolymerElement();
        customElements.whenDefined('xtal-ball').then(function () { return initXtalXSlickGrid(); });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=x-slick-grid.js.map