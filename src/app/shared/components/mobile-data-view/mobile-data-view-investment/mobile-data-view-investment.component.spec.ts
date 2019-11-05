import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDataViewInvestmentComponent } from './mobile-data-view-investment.component';

describe('MobileDataViewInvestmentComponent', () => {
  let component: MobileDataViewInvestmentComponent;
  let fixture: ComponentFixture<MobileDataViewInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileDataViewInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDataViewInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
