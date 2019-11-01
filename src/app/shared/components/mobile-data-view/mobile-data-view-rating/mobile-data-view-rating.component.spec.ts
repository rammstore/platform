import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDataViewRatingComponent } from './mobile-data-view-rating.component';

describe('MobileDataViewRatingComponent', () => {
  let component: MobileDataViewRatingComponent;
  let fixture: ComponentFixture<MobileDataViewRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileDataViewRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDataViewRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
