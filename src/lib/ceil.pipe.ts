import { Pipe,PipeTransform } from '@angular/core' ;
@Pipe({
    name:'ceil'
})
export class Ceil implements PipeTransform{
    constructor(){

    }

    transform(value:number,limit:number){
        return Math.ceil(value/limit) ;
    }
}