import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountResultsComponent } from './account-results.component';

describe('AccountResultsComponent', () => {
  let component: AccountResultsComponent;
  let fixture: ComponentFixture<AccountResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
