///<reference path='SlickGrid.d.ts'/>
///<reference path='../x-slick-grid.ts'/>

module crystal.elements.xslickgrid{
    export interface ICreateDataViewOptions<T>{
        addStandardRowHandling?:  boolean;
        //gridFinder?: () => Slick.Grid<T>;
        containerFinder?: () => IXSlickGridElement<T>;
    }
    export function createDataViewWithFilter<T>(data, filter, options: ICreateDataViewOptions<T>){
        var dataView = new Slick.Data.DataView({ inlineFilters: true });
        if(!options.containerFinder){
            throw 'containerFinder required';
        }
        dataView['container'] = options.containerFinder();
        dataView.beginUpdate();
        dataView.setItems(data);
        dataView.setFilter(filter);
        dataView.endUpdate();
        if(options && options.addStandardRowHandling){
            addStandardRowHandling(dataView, options);
        }
        return dataView;
    }

    export function addStandardRowHandling<T>(dataView:  Slick.Data.DataView<T>, options: ICreateDataViewOptions<T>){
        if(!options.containerFinder){
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
}
