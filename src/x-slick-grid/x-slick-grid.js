///<reference path='../../node_modules/@types/slickgrid/index.d.ts'/>
///<reference path='../../node_modules/@types/jquery/index.d.ts'/>
///<reference path='js/treeGridHelper.ts'/>
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
        function downloadJSFilesInParallelButLoadInSequence(refs, callBack) {
            //see https://www.html5rocks.com/en/tutorials/speed/script-loading/
            const notLoadedYet = {};
            const nonNullRefs = refs.filter(ref => ref !== null);
            nonNullRefs.forEach(ref => {
                notLoadedYet[ref.src] = true;
            });
            nonNullRefs.forEach(ref => {
                const script = document.createElement('script');
                script.src = ref.src;
                script.async = false;
                script.onload = () => {
                    //console.log(script.src + ' loaded');
                    delete notLoadedYet[script.src];
                    if (Object.keys(notLoadedYet).length === 0) {
                        if (callBack)
                            callBack();
                    }
                };
                document.head.appendChild(script);
            });
        }
        elements.downloadJSFilesInParallelButLoadInSequence = downloadJSFilesInParallelButLoadInSequence;
        function addCSSLinks(refs) {
            const notLoadedYet = {};
            const nonNullRefs = refs.filter(ref => ref !== null);
            nonNullRefs.forEach(ref => {
                notLoadedYet[ref.href] = true;
            });
            //from http://stackoverflow.com/questions/574944/how-to-load-up-css-files-using-javascript
            nonNullRefs.forEach(ref => {
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
            for (const key in handlers) {
                const handler = handlers[key];
                grid[key].subscribe(handler);
            }
        }
        elements.attachEventHandlers = attachEventHandlers;
        function initXtalXSlickGrid() {
            class XtalXSlickGrid extends Polymer.Element {
                constructor() {
                    super(...arguments);
                    //Begin field initialization
                    this.height = '500px';
                    this.width = '600px';
                    this.renderCount = 0;
                    this.clickedCellIndex = 0;
                    this.clickedRowIndex = 0;
                    this.numberOfWidthDeltas = 0;
                    this.numberOfOrderChanges = 0;
                    this.isContextMenuOpen = false;
                    this.lastClickedXValue = 0;
                    this.lastClickedYValue = 0;
                    //TODO:  type these
                    this.wcOptions = null;
                    this._data = null;
                    this.gridDiv = null;
                    this.grid = null;
                    this._dataProvider = null;
                    this.collapseAll = null;
                    this.expandAll = null;
                }
                static get is() {
                    return 'x-slick-grid';
                }
                fillContainerBothDimImpl() {
                    this.fillContainerXImpl('offsetTop', 'clientHeight', 'height', false);
                    this.fillContainerXImpl('offsetLeft', 'clientWidth', 'width', true);
                }
                fillContainerHeightImpl() {
                    this.fillContainerXImpl('offsetTop', 'clientHeight', 'height', true);
                }
                fillContainerWidthImpl() {
                    this.fillContainerXImpl('offsetLeft', 'clientWidth', 'width', true);
                }
                fillContainerXImpl(offsetDim, clientDim, cssDim, resize) {
                    const thisGrid = this.querySelector('[role="grid"]');
                    const $thisGrid = $(thisGrid);
                    const offset = this[offsetDim];
                    const containerLength = this.parentElement[clientDim];
                    const thisLength = containerLength - offset;
                    if (thisLength > 0) {
                        $thisGrid.css(cssDim, thisLength);
                        if (resize && this.grid) {
                            this.grid.resizeCanvas();
                        }
                    }
                }
                setEditorAndFormatter(columns) {
                    for (let i = 0, ii = columns.length; i < ii; i++) {
                        let col = columns[i];
                        if (col.editorFn) {
                            col.editor = col.editorFn(col);
                        }
                        if (col.formatterFn) {
                            col.formatter = col.formatterFn(col);
                        }
                        const childColumns = col.columns;
                        if (childColumns)
                            this.setEditorAndFormatter(childColumns);
                    }
                }
                setInitialData(data, columns, gridOptions, wcOptions) {
                    //this.data = data;
                    //this.columns = columns;
                    if (!this.readyFnInitialized) {
                        setTimeout(() => {
                            this.setInitialData(data, columns, gridOptions, wcOptions);
                        }, 10);
                        return;
                    }
                    let checkboxSelector = null;
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
                        const dataProvider = data;
                        dataProvider['container'] = this;
                        this._dataProvider = dataProvider;
                        this.grid = new Slick.Grid(this.gridDiv, dataProvider, columns, gridOptions);
                    }
                    else {
                        if (this.useTreeGridHelper) {
                            this._data = data;
                        }
                        if (wcOptions && wcOptions.dataProvider) {
                            const dataProvider = wcOptions.dataProvider(data);
                            dataProvider['container'] = this;
                            this._dataProvider = dataProvider;
                            this.grid = new Slick.Grid(this.gridDiv, dataProvider, columns, gridOptions);
                        }
                        else if (this.useDataViewDataProvider) {
                            const dataProvider = new Slick.Data.DataView({ inlineFilters: true });
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
                    const grid = this.grid;
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
                            grid.onClick.subscribe(e => {
                                var cell = grid.getCellFromEvent(e);
                                this.clickedCellIndex = cell.cell;
                                this.clickedRowIndex = cell.row;
                            });
                        }
                        if (wcOptions.trackColumnChanges) {
                            this.numberOfWidthDeltas = 0;
                            this.numberOfOrderChanges = 0;
                            grid.onColumnsResized.subscribe(e => {
                                this.numberOfWidthDeltas++;
                            });
                            grid.onColumnsReordered.subscribe(e => {
                                this.numberOfOrderChanges++;
                            });
                        }
                        if (wcOptions.trackContextMenu) {
                            this.isContextMenuOpen = false;
                            grid.onContextMenu.subscribe(e => {
                                e.preventDefault();
                                this.isContextMenuOpen = true;
                                this.lastClickedXValue = e['pageX'];
                                this.lastClickedYValue = e['pageY'];
                                const _thisEl = this;
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
                }
                onNewGridRenderParams(newVal) {
                    this.setInitialData(newVal.data, newVal.columns, newVal.gridOptions, newVal.wcOptions);
                }
                get columns() {
                    return this.grid.getColumns();
                }
                get data() {
                    return this.grid.getData();
                }
                get selectedRow() {
                    if (this.clickedRowIndex === -1)
                        return null;
                    return this.data[this.clickedRowIndex];
                }
                get options() {
                    return this.grid.getOptions();
                }
                get dataProvider() {
                    //const grid = this.grid as Slick.Grid<any>;
                    return this._dataProvider;
                }
                //End field initialization
                static get properties() {
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
                }
                ready() {
                    super.ready();
                    this.innerHTML = `
                <div role="grid"></div>
                `;
                    const $IsDefined = (typeof ($) !== 'undefined');
                    const sm = this.selectionModel;
                    const incCell = ((sm === 'Cell') || (sm === 'RowPlus'));
                    const incRow = ((sm === 'Row') || (sm === 'RowPlus'));
                    const slickCSSDependencies = [
                        this.useSlickPaging ? { href: this.resolveUrl('controls/slick.pager.css') } : null,
                        this.useSlickColumnPicker ? { href: this.resolveUrl('controls/slick.columnpicker.css') } : null,
                        this.useTreeGridHelper ? { href: this.resolveUrl('css/treeGridHelper.css') } : null,
                    ];
                    const slickJSDependencies = [
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
                    xtal.elements.downloadJSFilesInParallelButLoadInSequence(slickJSDependencies, () => {
                        const thisGrid = this.querySelector('[role]');
                        const $thisGrid = $(thisGrid);
                        $thisGrid
                            .css('height', this.height)
                            .css('width', this.width);
                        this.gridDiv = $thisGrid;
                        if (this.fillContainerWidth || this.fillContainerHeight) {
                            window.addEventListener('resize', e => {
                                if (this.fillContainerWidth && this.fillContainerHeight) {
                                    this.debounce('fillContainerBothDim', this.fillContainerBothDimImpl, 500);
                                }
                                else if (this.fillContainerHeight) {
                                    this.debounce('fillContainerHeight', this.fillContainerHeightImpl, 500);
                                }
                                else {
                                    this.debounce('fillContainerWidth', this.fillContainerWidthImpl, 500);
                                }
                            });
                        }
                        if (this.useTreeGridHelper) {
                            this['analyzeTreeNodes'] = xtal.elements.xslickgrid.analyzeTreeNodes;
                            this['sortColumn'] = xtal.elements.xslickgrid.sortColumn;
                        }
                        this.readyFnInitialized = true;
                        //this['fire']('loadedDependencies');
                        this.dispatchEvent(new CustomEvent('loadedDependencies'));
                    });
                }
            }
            customElements.define(XtalXSlickGrid.is, XtalXSlickGrid);
        }
        //function waitForPolymerElement(){if(typeof Polymer === 'undefined' || Polymer.Element === undefined){setTimeout(waitForPolymerElement, 50);return;}
        initXtalXSlickGrid();
        //}
        //waitForPolymerElement();
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=x-slick-grid.js.map