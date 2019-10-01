import { Component, OnInit } from '@angular/core';
import { StrategyService } from '../../shared/services/strategy.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Strategy } from '@app/models';

@Component({
  selector: 'app-strategy-pause',
  templateUrl: './strategy-pause.component.html',
  styleUrls: ['./strategy-pause.component.scss']
})
export class StrategyPauseComponent {
  strategy: Strategy;

  constructor(
    private strategyService: StrategyService,
    public modalRef: BsModalRef,
  ) { }

  pause(): void {
    this.strategyService.pause(this.strategy.id).subscribe(() => {
      this.strategy.pause();
      this.modalRef.hide();
    });
  }
}
