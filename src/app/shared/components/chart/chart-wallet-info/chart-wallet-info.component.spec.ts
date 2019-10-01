import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartWalletInfoComponent } from './chart-wallet-info.component';

describe('ChartWalletInfoComponent', () => {
  let component: ChartWalletInfoComponent;
  let fixture: ComponentFixture<ChartWalletInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartWalletInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartWalletInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
