import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingRatedComponent } from './rating-rated.component';

describe('RatingRatedComponent', () => {
  let component: RatingRatedComponent;
  let fixture: ComponentFixture<RatingRatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingRatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingRatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
