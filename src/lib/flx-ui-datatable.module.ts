import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms' ;
import { FlxUiDatatableComponent } from './flx-ui-datatable.component' ;
import { HttpModule } from '@angular/http' ;
import { FlxUiDatatableService } from './flx-ui-datatable.service' ;
import { Ceil } from './ceil.pipe' ;

@NgModule({
  imports: [
    CommonModule,ReactiveFormsModule,HttpModule
  ],
  declarations: [
    FlxUiDatatableComponent,Ceil
  ],
  exports:[FlxUiDatatableComponent,Ceil],
  providers:[FlxUiDatatableService]
})
export class FlxUiDatatableModule {
  
}
