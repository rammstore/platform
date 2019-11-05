import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingPopularComponent } from './rating-popular.component';

describe('RatingPopularComponent', () => {
  let component: RatingPopularComponent;
  let fixture: ComponentFixture<RatingPopularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingPopularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingPopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
