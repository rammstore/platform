import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsDetailsDealsComponent } from './investments-details-deals.component';

describe('InvestmentsDetailsDealsComponent', () => {
  let component: InvestmentsDetailsDealsComponent;
  let fixture: ComponentFixture<InvestmentsDetailsDealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentsDetailsDealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsDetailsDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
