import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsClosedComponent } from './investments-closed.component';

describe('InvestmentsClosedComponent', () => {
  let component: InvestmentsClosedComponent;
  let fixture: ComponentFixture<InvestmentsClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentsClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
