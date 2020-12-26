import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationRatingsRatedComponent } from './specification-ratings-rated.component';

describe('SpecificationRatingsRatedComponent', () => {
  let component: SpecificationRatingsRatedComponent;
  let fixture: ComponentFixture<SpecificationRatingsRatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificationRatingsRatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationRatingsRatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
