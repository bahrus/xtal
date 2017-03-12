///<reference path='SlickGrid.d.ts'/>
///<reference path='../x-slick-grid.ts'/>
var crystal;
(function (crystal) {
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
    })(elements = crystal.elements || (crystal.elements = {}));
})(crystal || (crystal = {}));
//# sourceMappingURL=DataViewHelper.js.map