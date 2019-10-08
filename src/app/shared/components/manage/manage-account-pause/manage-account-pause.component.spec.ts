import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccountPauseComponent } from './manage-account-pause.component';

describe('ManageAccountPauseComponent', () => {
  let component: ManageAccountPauseComponent;
  let fixture: ComponentFixture<ManageAccountPauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAccountPauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccountPauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
