import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsProfileChangeComponent } from './investments-profile-change.component';

describe('InvestmentsProfileChangeComponent', () => {
  let component: InvestmentsProfileChangeComponent;
  let fixture: ComponentFixture<InvestmentsProfileChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentsProfileChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsProfileChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
