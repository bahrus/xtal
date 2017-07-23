///<reference path='../../../node_modules/@types/slickgrid/index.d.ts'/>
///<reference path='../x-slick-grid.ts'/>
var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        var xslickgrid;
        (function (xslickgrid) {
            function createDataViewWithFilter(data, filter, options) {
                var dataView = new Slick.Data.DataView({ inlineFilters: true });
                if (!options.containerFinder) {
                    throw 'containerFinder required';
                }
                dataView['container'] = options.containerFinder();
                dataView.beginUpdate();
                dataView.setItems(data);
                dataView.setFilter(filter);
                dataView.endUpdate();
                if (options && options.addStandardRowHandling) {
                    addStandardRowHandling(dataView, options);
                }
                return dataView;
            }
            xslickgrid.createDataViewWithFilter = createDataViewWithFilter;
            function addStandardRowHandling(dataView, options) {
                if (!options.containerFinder) {
                    throw 'containerFinder required';
                }
                dataView.onRowCountChanged.subscribe(function (e, args) {
                    console.log('onRowCountChanged');
                    const grid = options.containerFinder().grid;
                    grid.updateRowCount();
                    grid.render();
                });
                dataView.onRowsChanged.subscribe(function (e, args) {
                    //console.log('onRowsChanged');
                    const grid = options.containerFinder().grid;
                    grid.invalidateRows(args.rows);
                    grid.render();
                });
            }
            xslickgrid.addStandardRowHandling = addStandardRowHandling;
        })(xslickgrid = elements.xslickgrid || (elements.xslickgrid = {}));
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=DataViewHelper.js.map