import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDataViewInvestmentClosedComponent } from './mobile-data-view-investment-closed.component';

describe('MobileDataViewInvestmentClosedComponent', () => {
  let component: MobileDataViewInvestmentClosedComponent;
  let fixture: ComponentFixture<MobileDataViewInvestmentClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileDataViewInvestmentClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDataViewInvestmentClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
