import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingAllComponent } from './rating-all.component';

describe('RatingAllComponent', () => {
  let component: RatingAllComponent;
  let fixture: ComponentFixture<RatingAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
