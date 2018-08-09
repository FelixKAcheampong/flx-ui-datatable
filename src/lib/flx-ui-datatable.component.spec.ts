import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlxUiDatatableComponent } from './flx-ui-datatable.component';

describe('FlxUiDatatableComponent', () => {
  let component: FlxUiDatatableComponent;
  let fixture: ComponentFixture<FlxUiDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlxUiDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlxUiDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
