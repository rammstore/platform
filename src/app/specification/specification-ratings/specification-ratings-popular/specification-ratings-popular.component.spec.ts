import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationRatingsPopularComponent } from './specification-ratings-popular.component';

describe('SpecificationRatingsPopularComponent', () => {
  let component: SpecificationRatingsPopularComponent;
  let fixture: ComponentFixture<SpecificationRatingsPopularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificationRatingsPopularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationRatingsPopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
