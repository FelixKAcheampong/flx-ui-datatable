# Populate database lists in a datatable with pagination,search, buttons, data exports and more in just 1 minute

## AUTHOR
Felix Kakra Acheampong from (`Orcons Systems`) Ghana

### FEATURES
-[X] Database items display view
-[X] Select input pagination
-[X] Next and previous pagination with tooltip
-[X] Database search input bar and button
-[X] Add button if `hasAddButton` is set to `true`
-[X] Buttons in each item row if `hasActionButtons` is set to `true`. Note that the maximum number of buttons in each row is 3. Exceeding the number will not have an event attached to it.

## VERSION
V 1.0.6

## SUPPORT
Angular 6.

### Installation
You can install ***flx-ui-datatable*** using npm
```bash
    npm install flx-ui-datatable
```

# EXTERNAL LIBARIES
To enable document print work. Add the two links to your angular.json, or your index.html
```html
  <script type="text/javascript" src="https://printjs-4de6.kxcdn.com/print.min.js"></script>
  <link rel="stylesheet" type="text/css" src="https://printjs-4de6.kxcdn.com/print.min.css"> 
```

## Usage
```html
<flx-ui-datatable
    [headers]="['Fullname','Email','Phone Number','Address']"
    [dataKeys]="['FULLNAME','MOBILENUMBER','GENDER','DESCRIPTION']"
    [dataUrl]="'http://domain/?something=something'"
    [dataSrcKey]="'data'"
    [actionButtons]="[{text:'Edit',icon:'fa fa-edit',class:'btn btn-danger'}]"
    [limit]="10"
    [hasAddButton]="true"
    [searchPlaceholder]="'Enter description to search'"
    (firstActionButtonClicked)="fButtonClicked($event)">
</flx-ui-datatable>
```

## NOTE
If data from api is `Array<Object>` (`[{},{}]`), Then do not specify `[dataSrcKey]`,
If data from api is `JSON Object` `{'status':200,'data':[{},{}]}` with `data` key holding
your database records, then set `[dataSrcKey]` to `data` ;

## Properties
- `headers` (`Array<string>`) - Array of strings containing table headers. Headers for the table;
- `dataKeys` (`Array<string>`) - Array of strings containing keys from API to display;
-  `dataSrcKey` (`string`) - Data items to read from response payload if data is a `JSON OBJECT` ;
- `hasActionButtons` (`boolean`) - Boolean to specify if datatable has action buttons in each row. Default is `false`;
- `enableDataExports` (`boolean`) Enable table data export
- `dataExportsConfig` (`{}`) configure which type of document to show export.
    (`{exportsTo:[],title:'',dataColumns:[]}}`).
    `exportsTo` (`Array<string>`) (`print|word|pdf|excel`). You can enable more than two or all of them.
    `title` (`string`) Title to show on the export popup menu.
    `dataColumns` (`Array<string>`) Data keys to include in the export. If not specified, this will export document using `dataKeys` (`Input`) by default.
- `hideNumbers` (`boolean`) - Determine if datatable should be numbered. Default is `true`;
- `enableMultipleSelection` (`boolean`) - Set to true to enable multiple deletion on the datatable. Also set `multipleSelectKey` to push all the seleted items in an array. Default is `false` ;
- `hasAddButton` (`boolean`) Show add button. Default is false. Default is `false`;
- `dataUrl` (`string`) Api url to load data from. This is a `GET` http request;
- `searchPlaceholder` (`string`) Change placeholder of the search input;
- `actionButtons` (`Array<Object>`). Action buttons to display in each datatable row. 
- `spinnerSrc` (`string`) spinner image/gif to show when loading data from API.
- `showBottomInfo` (`boolean`) Show table bottom info. This include (`Total items`,`Total pagination in the table`,`Number of items per pagination`)
    `{text:'View'}` This will display a button in each datatable row with a text lable `View`
    Advance
    `{text:'View',background:'',textColor:'',icon:'',iconPosition:''`}
    `text` Text to display in the button.
    `background` Change background-color of the button
    `textColor` Change textcolor of the button
    `icon` Add icon to the button. icon can be from fontawsome or bootstrap glyphicons. example icon:'fa fa-user'
    `iconPosition` Icon position. Default is `left`
- `multipleSelectButton` (`{text:'',icon:''}`) 

## ADVANCE
- `dataSrcKey` Example.
    If data response is `{status:200,data:[...]}`, then set `dataSrcKey` to `data`
    Else if response is `[...]`, then leave `dataSrcKey` empty or do not set it.
- `limit` (`string`) Number of items per pagination.
- `paginationButtons` (`{}`) pagination buttons style
    `{background:'',textColor:''}` Change background-color and text-color of the pagination buttons;
- `tableHeader` (`{}`) Change table header background-color and text-color
    `{background:'',textColor:''}` ;
- `searchButton` (`{}`) Change background and text color of the search button
    Example `{background:'#cccccc',textColor:'#335599'}` ;
- `addButton` (`{}`) Change background and text color of add button
    Example `{background:'#335599',textColor:'#ffffff'}` ;
- `searchBar` (`{}`) Change search input bar style
    Example `{borderSize:'1px',borderColor:'#ccc',background:'#ffffff',textColor:'#000000'}`
- `tableType` (`string`) Default is table-striped. Change it to any table type class ;
- `actionHeader` (`string`) Table button header text. Default is `Actions`

## ADDING CUSTOME CSS CLASSES TO CHANGE VIEW DIMENSION AND COLORS
- `classes`(`{}`): {
    `paginationselect`: Pagination select class;
    `addButton`: Add button class;
    `exportButton`: Export button right class;
    `tableType`: Table class. Example `table-striped|table-hover`;
    `tableHeader`: Table header class;
    `tableData`: Table td class;
    `SearchBar`: Search bar class;
    `reloadbutton`: Reload button class
} ;

## SEARCH OPIMIZATION
By default this library search through all `DataKeys` and if match is found result output to the table.
This can be controlled by specifying which `DataKeys` to search. Example `[DataKeys]="['FULLNAME']`.
This will only search through FULLNAME column datakey rather than searching multiple of datakey columns.

## EVENTS
- `firstActionButtonClicked()` `({index:number,data:Object})` First button in a row click.
        `index` = The position of the clicked item
        `data` = All data in the item position;
- `secondActionButtonClicked()` Second button in a row click.
        `index` = The position of the clicked item
        `data` = All data in the item position;
- `thirdActionButtonClicked()` Third button in a row click.
        `index` = The position of the clicked item
        `data` = All data in the item position;
- `mutipleSelectionClicked()` (`Array<any>`) Multiple item deletion click.
        Returns an array of data giving in `multipleDeleteKey` variable.
        You can send this data to using your own DELETE request to
        perform deletion from your Database.
- `addButtonClicked` Handle add button.



## API
```typescript
import { FlxUiDatatableModule,FlxUiDataTable } from 'flx-ui-datatable' ;
    //In your app @ngModuel imports
    imports:[FlxUiDatatableModule],
    providers:[FlxUiDataTable]

    //In your page.ts file
    import { FlxUiDataTable } from 'flx-ui-datatable' ;
    constructor(public dataService:FlxUiDataTable){}

    //To reload data from your API
     this.dataService.flxReloadData() ;

    //To cancel http request to your API
     this.dataService.abortRequest() ;

    //To get all the data
    this.dataService.flxDatatableData.subscribe((data) => {
       // data is
        data ;
    }) ;
```

#
In this sample, `FULLNAME` will be read from API response payload for `Fullname table header column`

## CONTRIBUTING
Contributions are welcome. You can start by checking and bug or the way this can be improved by 
emailing to felixacheampong18@gmail.com

Click to watch video
[![Watch the video](http://byfgroupgh.com/images/video_thumbnail.jpg)](https://youtu.be/i-WT_EUbjys)