import { Component, OnInit } from '@angular/core';
import { StrategyService } from '../../shared/services/strategy.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-strategy-pause',
  templateUrl: './strategy-pause.component.html',
  styleUrls: ['./strategy-pause.component.scss']
})
export class StrategyPauseComponent implements OnInit {

  constructor(
    private strategyService: StrategyService,
    public modalRef: BsModalRef,
  ) { }

  ngOnInit() {
  }

  pause(): void {
    this.strategyService.pause(this.modalRef.content.strategy.id).subscribe(() => {
      this.modalRef.hide();
    });
  }
}
