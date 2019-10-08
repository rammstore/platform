import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsDetailsPositionsComponent } from './investments-details-positions.component';

describe('InvestmentsDetailsPositionsComponent', () => {
  let component: InvestmentsDetailsPositionsComponent;
  let fixture: ComponentFixture<InvestmentsDetailsPositionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentsDetailsPositionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsDetailsPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
