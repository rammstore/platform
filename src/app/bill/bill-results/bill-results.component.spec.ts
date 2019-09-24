import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillResultsComponent } from './bill-results.component';

describe('BillResultsComponent', () => {
  let component: BillResultsComponent;
  let fixture: ComponentFixture<BillResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
