import { Component, Input,Output,EventEmitter, OnInit,AfterViewInit } from '@angular/core';
import { FormGroup,Validators,FormBuilder} from '@angular/forms' ;
import { FlxUiDatatableService } from './flx-ui-datatable.service' ;
import { AsyncPipe } from '@angular/common' ;
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
declare var printJS: any ;
@Component({
  selector:'flx-ui-datatable',
  templateUrl:'flx-ui-datatable.component.html',
  styleUrls:['flx-ui-datatable.component.css']
})
export class FlxUiDatatableComponent implements OnInit,AfterViewInit{
  @Input() classes: any = {} ;//{addButton|tableHeader|tableData|exportButton|SearchBar|tableType}
  @Input() headers: Array<string> = [] ; // Table headers (v: 1.0.0) 
  @Input() dataKeys: Array<string> = [] ; // Data keys to populate.  (v: 1.0.0)
  @Input() enableDataExports: boolean = false ;//Default to false; (v: 1.0.1)
  @Input() dataExportsConfig: any = {} ;// data exports configuration: {exportsTo:['print','word','pdf','excel'],title:'Exports data',dataColumns:[]}} Data columns to export
  @Input() showBottomInfo: false ; // To enable table bottom information
  @Input() searchKeys = [] ; // Keys to search for search optimization.  (v: 1.0.0)
  @Input() dataSrcKey: string = '' // Data to read from json response.  (v: 1.0.0)
  @Input() hasActionButtons: boolean = false ; //specify if datatable should have and add button. (v: 1.0.0)
  @Input() hideNumbers: boolean = false ; //specify if the numbers.  (v: 1.0.0)
  @Input() enableMultipleSelection: boolean = false ; // Enable multiple select input box to appear. (v: 1.0.0) enableMultipleDelete renamed to enableMultipleSelection in (v:1.0.1)
  @Input() multipleSelectKey: string = '' ; // Specify which key to select. (v:1.0.0) multipleDeleteKey renamed to multipleSelectKey in (v:1.0.0) ;
  @Input() hasAddButton: boolean = false ; // Enable to show add button on the header. (v: 1.0.0)
  @Input() dataUrl: string = '' ; // Url to load table data. (v: 1.0.0)
  @Input() multipleSelectButton = { text: 'Selected', icon: '' }; // Change text and icon on multiple select button. (v: 1.0.1)
  @Input() searchPlaceholder: string = 'Enter name to search' ; // Change search bar placeholder. (v: 1.0.0)
  @Input() actionHeader: string = 'Actions' ; // Change text for action buttons header. (v: 1.0.0)
  @Input() limit: number = 20 ; // Specify number of items per pagination. (v: 1.0.0)
  @Input() spinnerSrc: any = '' ; // Spinner to show when loading data from API. (v: 1.0.1)
  @Input() actionButtons: Array<Object> = [] ; // Specify action buttons. Make sure to set hasActionButtons to true if you want to show button in the table row. (v: 1.0.0)
  @Input() paginationButtons: any = {background:'#dddddd',textColor:'#335599'} ; // Change button button background and textColor. (v: 1.0.0)
  @Input() tableHeader: any = {background:'#ffffff',textColor:'#335599'} ; // Change table header background and text color. (v: 1.0.0)
  @Input() searchButton: any = {background:'#cccccc',textColor:'#335599'} ; // Change background and text color of the search button. (v: 1.0.0)
  @Input() addButton: any = {} ; //Change background and text color of the add button. (v: 1.0.0)
  @Input() searchBar: any = {borderSize:'1px',borderColor:'#ccc',background:'#ffffff',textColor:'#000000'} ; // Change background and text color of the search bar. (v: 1.0.0)
  @Output() firstActionButtonClicked: EventEmitter<any> = new EventEmitter<any>() ; // Handle first action button. (v: 1.0.0)
  @Output() secondActionButtonClicked: EventEmitter<any> = new EventEmitter<any>() ; // Handle second action button. (v: 1.0.0)
  @Output() thirdActionButtonClicked: EventEmitter<any> =   new EventEmitter<any>() ; // Handle third action button. (v: 1.0.0)
  @Output() multipleSelectClicked: EventEmitter<any> = new EventEmitter<any>() ; // Handle multiple select button. (v: 1.0.0)
  @Output() addButtonClicked: EventEmitter<any> = new EventEmitter<any>() ; // Handle add button. (v: 1.0.0)
  isExportAll: boolean = false ;
  searchForm: FormGroup ;
  tData: any = [] ;
  behavior: BehaviorSubject<any> = new BehaviorSubject([]);
  //Keep track of current data after search. If search string is empty set current view data
  public searchDataTempOffset = [];
  //Data to display in the table based on offset
  public displayData = this.behavior.asObservable(); 
  //Keep track of pagination numbers
  public offset = 1;
  constructor(public __form: FormBuilder,public service: FlxUiDatatableService){

  }     

  /**
   * 
   * @param checked Export all selection
   */
  checkToExportOption(checked:boolean){
    this.isExportAll = checked ;
  }

  /**
   * 
   * @param exportType Export type: print|pdf|excel|word
   */
  exportDocumentsAs(exportType:string){
    let loading: HTMLDivElement = <HTMLDivElement> document.getElementById("export_loading") ;
    loading.style.display = 'block' ;
    let headers = (!this.dataExportsConfig.dataColumns || this.dataExportsConfig.dataColumns.length<1) ? this.dataKeys : this.dataExportsConfig.dataColumns ;
    let dataToExport = (!this.isExportAll) ? this.displayData : this.service.flxData ;
    
    //Subscribe to data
    dataToExport.subscribe((data) => {              
        let arrayObj: Array<any> = [] ;
        //Loop and push data
        for(let d of data){
            let obj: any = {} ;
            for(let h=0;h<headers.length;h++){
                obj[headers[h]] = d[headers[h]] ;
            }
            arrayObj.push(obj) ;
        }
        if(exportType=='print'){
            try{
            printJS({printable:arrayObj,properties:headers,type:'json'}) ;
            loading.style.display = 'none' ;
            }catch(e){
            loading.style.display = 'none' ;
                console.log('PrintJS not found. Add `https://printjs-4de6.kxcdn.com/print.min.js` to your index.html or add as part of angular.json script') ;
            }
        }else{
            let extension = (exportType=='pdf') ? 'pdf': (exportType=='excel') ? 'xlsx': 'docx'
            let pageId = (exportType=='pdf') ? 3: (exportType=='excel') ? 5: 4 ;

            let requestData: any = {"data":JSON.stringify(arrayObj)}
            this.service.postData('http://exporter.azurewebsites.net/api/export/ExportFromJSON/',pageId,requestData).subscribe((resp) =>{
                var download = 'http://exporter.azurewebsites.net/api/export/GetFile/' + resp ;
                download += "?fileName=andrei&extension="+ extension;
                window.location.href = download ;
                loading.style.display = 'none' ;
            },(e => {
                console.log('file export error',e) ;
            }))
        }
        
    }).unsubscribe() ;    
  }

  JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link: any = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

  /**
   * 
   * @param newData 
   */
  changeDisplayData(newData) {
    this.behavior.next(newData);
  }

  ngOnInit(){
      this.searchForm = this.__form.group({
          searchString:['',Validators.required]
      });
      this.searchForm = this.__form.group({
        searchString: ['', Validators.required]
    });
    this.service.limit = this.limit;
    this.service.setDataUrl(this.dataUrl);
    this.service.setDataSrcKey(this.dataSrcKey);
    this.service.loadFlxDataTableData();
      this.service.flxData.subscribe((resp) => {
        this.tData = resp ;
        let obj: Array<any> = [];
        if (this.tData.length > this.limit) {
            for (let i = 0; i < this.limit; i++) {
                obj.push(this.tData[i]);
            }
            this.service.dataOffset = this.limit;
        }
        else {
            let counter: number = 0;
            for (let i = 0; i < this.tData.length; i++) {
                obj.push(this.tData[i]);
                counter++;
            }
            this.service.dataOffset = obj.length;
        }
        this.searchDataTempOffset = obj;
        this.changeDisplayData(obj);
    })
  }

  ngAfterViewInit(){
// alert(window.innerWidth)
  }

  actionButtonClicked(index:number,buttonIndex:number){
    if (buttonIndex == 0) {
        return this.firstActionButtonClicked.emit({ index: index, data: this.tData[index] });
    }
    else if (buttonIndex == 1) {
        return this.secondActionButtonClicked.emit({ index: index, data: this.tData[index] });
    }
    else {
        this.thirdActionButtonClicked.emit({ index: index, data: this.tData[index] });
    }
  }

  addButtonClick(){
    this.addButtonClicked.emit() ;
  }

  confirmDelete(){
    return this.multipleSelectClicked.emit(this.service.multipleDeletion);
  }

  addRemove(checked:boolean){
    if (checked) {
        this.displayData.subscribe((data) => {
            let counter: number = 0;
            for (let i of data) {
                try {
                    this.service.multipleDeletion.push(i[this.multipleSelectKey]);
                }
                catch (e) { }
            }
           // console.log(this.service.multipleDeletion) ;
        });
    }
    else {
        this.service.multipleDeletion = [];
    }        
  }

  addRemoveDeleteItem(dataKeyvalue:any, index:number, selected:boolean){
    if (!selected) {
        for (var i = 0; i < this.service.multipleDeletion.length; i++) {
            if (dataKeyvalue == this.service.multipleDeletion[i]) {
                this.service.multipleDeletion.splice(i, 1);
                break;
            }
        }
    }
    else {
        this.displayData.subscribe((resp) => {
            this.service.multipleDeletion.push(resp[index][this.multipleSelectKey]);
        });
    }
   // console.log('left '+dataKeyvalue,this.service.multipleDeletion) ;
  }

  getSearchColumns(){
    return (this.hasAddButton) ? (this.enableDataExports) ? 'col-md-6 search-container' : 'col-md-7 search-container' :
    (this.enableDataExports) ? 'col-md-7 search-container' : 'col-md-8 search-container';
  }

  disablePrevtButton(){
      return Math.ceil(this.service.dataOffset/this.limit)<=1 ;
  }

  disableNextButton(){
      return Math.ceil(this.service.dataOffset/this.limit)==Math.ceil(this.service.totalItems/this.limit) ;
  }

  nextPrevItem(type:string){
    if (type == 'prev') {
        this.paginateDatatableRecord((this.service.dataOffset - this.limit) - this.limit);
    }
    else {
        if (this.service.dataOffset < this.limit) {
            this.paginateDatatableRecord(this.service.dataOffset + (this.limit - 1));
        }
        else {
            this.paginateDatatableRecord(this.service.dataOffset);
        }
    }
  }

  filterData(searchString = '') {
    this.changeDisplayData([]);
    this.service.flxData.subscribe((data) => {
        let searchResults: Array<any> = [];
        //If no string provided. Register all the previous data to the dataset
        if (searchString.trim() == '') {
            this.changeDisplayData(this.searchDataTempOffset);
            return;
        }
        //Check if searchKeys are set else use dataKeys as searchKeys
        let searchKeys: Array<string> = (this.searchKeys.length < 1) ? this.dataKeys : this.searchKeys;
        for (let i = 0; i < searchKeys.length; i++) {
            //Variable to check if a data is found
            let found = -1;
            for (let x = 0; x < data.length; x++) {
                if (data[x][searchKeys[i]].toLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1) {
                    found = x;
                    break;
                }
            }
            //If found push the index of the data to the searchResults variable
            if (found > -1) {
                searchResults.push(data[found]);
            }
        }
        //Register the results to the dataset
        this.changeDisplayData(searchResults);
    });
    }

    paginateDatatable(value) {
        this.paginateDatatableRecord(value);
    }

    /**
     *
     * @param value pagination number
     * Perform pagination to the dataset
     * @return
     */
    paginateDatatableRecord(value) {
        let num:number = parseInt(value);
        if (num <= 0) {
            this.offset = 1;
            this.service.dataOffset = this.limit;
        }
        else {
            if (value != 'all') {
                this.offset = num + 1;
                this.service.dataOffset = num + this.limit;
            }
            else {
                this.offset = 1;
            }
        }
        this.service.flxData.subscribe((data) => {
            if (value !== 'all') {
                let paginateResult: Array<any> = [];
                for (let i = value; i < (this.limit + parseInt(value)); i++) {
                    if (data[i]) {
                        paginateResult.push(data[i]);
                    }
                }
                if (paginateResult.length > 0) {
                    this.changeDisplayData(paginateResult);
                }
            }
            else {
                this.changeDisplayData(data);
                this.searchDataTempOffset = data;
            }
        });
    }
}