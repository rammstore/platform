import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartYieldTableComponent } from './chart-yield-table.component';

describe('ChartYieldTableComponent', () => {
  let component: ChartYieldTableComponent;
  let fixture: ComponentFixture<ChartYieldTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartYieldTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartYieldTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
