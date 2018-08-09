import { Injectable} from '@angular/core' ;
import { FlxUiDatatableService } from './flx-ui-datatable.service' ;
import { BehaviorSubject,Observable } from 'rxjs';
@Injectable()
export class FlxUiDataTable{
    behavior: BehaviorSubject<any> = new BehaviorSubject([]);
    flxDatatableData = this.behavior.asObservable();
    constructor(private service: FlxUiDatatableService){
        this.service.flxData.subscribe((resp) => {
            this.ChangeData(resp);
        });
    }

    /**
     * 
     * @param data Change table data with new data
     */
    ChangeData(data) {
        this.behavior.next(data);
    }

    /**
     * Reload data from api: void
     */
    public reloadData(): void{
        this.service.loadFlxDataTableData() ;
    }

    public abortRequest(){
        this.service.cancelLoading() ;
    }
}