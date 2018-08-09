import { Injectable } from '@angular/core' ;
import { Http,Headers,Response} from '@angular/http' ;
import { map } from 'rxjs/operators' ;
import { Observable,pipe,BehaviorSubject,Subscription } from 'rxjs';
@Injectable()
export class FlxUiDatatableService{
  //User data API url
  private dataUrl: string = '' ;
  public behavior: BehaviorSubject<any> = new BehaviorSubject<any>([]) ;
  //Hold all data from API
  public flxData = this.behavior.asObservable();  
  //Header select pagination
  public pagination: Array<Object> = [] ;
  //Hold total items loaded from API
  public totalItems: number = 0 ;
  //Keep track of current pagination offset
  public dataOffset: number = 0 ;
  //User defined limit for number of items per pagination
  public limit: number = 20 ;
  //Data source key to read from API payload response
  public dataSrcKey:string = '';
  //Hold items selected for multiple select
  multipleDeletion:Array<any> = [] ;
  //Hold subscription of api calls which can be canced by calling cancelLoading() 
  loader: Subscription ;  
  //Keep track if API call is completed
  loadFinish: boolean = false ;
  constructor(public http: Http){
      
  }

  //GET request to user's API url
  /**
   * 
   * @param url User api rul
   */
  public getData(url:string): Observable<any>{
      let headers: Headers = new Headers() ;
      headers.append('Content-Type','application/x-www-form-urlencoded') ;
      return this.http.get(url,{headers:headers}).pipe(map((response: Response) => response.json())) ;
  }

  //Post request for data export
  /**
   * 
   * @param url Service api url
   * @param id Datatype id to export
   * @param data Data to export
   */
  public postData(url:string,id:any,data:string): Observable<any>{
    let headers: Headers = new Headers() ;
    headers.append('Content-Type','application/json; charset=utf-8') ;
    return this.http.post(url+id,data,{headers:headers}).pipe(map((resp: Response) => resp.json())) ;
  }

  /**
   * 
   * @param dataUrl Set dataurl
   */
  public setDataUrl(dataUrl:string):void{
    this.dataUrl = dataUrl ;
  }

  //Get data url 
  private getDataUrl():string{
    return this.dataUrl ;
  }

  /**
   * 
   * @param data Register new data from user API
   */
  public chageDataTable(data:any){
    this.behavior.next(data) ;
  }

  /**
   * 
   * @param numberOfList Total number of list
   * @param limit Pagination limit
   */
  private createPagination(numberOfList:number,limit:number): Array<Object>{
    let obj: Array<Object> = [] ;
    let counter: number = 1 ;
    for(let i=0;i<numberOfList;i+=limit){
        obj.push({label:counter,value:i}) ;
        counter++ ;
    }
    obj.push({ label: 'All', value: 'all' });
    return obj ;
  }

  //Event to load data from users api
  public loadFlxDataTableData(){
    this.loadFinish = false ;
      this.loader = this.getData(this.dataUrl).subscribe((responseData) => {
          try{
              this.multipleDeletion = [] ;
              var data = (this.dataSrcKey) ? responseData[this.dataSrcKey] : responseData;
              this.chageDataTable(data) ;
              this.totalItems = data.length ;
              this.pagination = this.createPagination(data.length, this.limit);
              this.dataOffset = 1;
              this.loadFinish = true;
          }catch(e){
              console.log('Api data error',e) ;
          }
      },(e => {
          this.loadFinish = true ;
      }))
  }

  //Cancel api GET request to api
  public cancelLoading(){
    this.loader.unsubscribe() ;
  }  

  //Set source key to read from payload response JSON
  setDataSrcKey(srcKey:string):void {
    this.dataSrcKey = srcKey;
  }
}