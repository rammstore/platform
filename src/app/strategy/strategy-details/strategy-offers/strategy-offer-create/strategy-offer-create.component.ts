import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/internal/operators';
import {Strategy} from '@app/models';
import {DataService} from '@app/services/data.service';
import {BsModalRef} from 'ngx-bootstrap';
import {Subject} from 'rxjs';
import {NotificationsService} from "@app/services/notifications.service";

@Component({
  selector: 'app-strategy-offer-create',
  templateUrl: './strategy-offer-create.component.html',
  styleUrls: ['./strategy-offer-create.component.scss']
})
export class StrategyOfferCreateComponent implements OnInit {
  form: FormGroup;

  @Input()
  strategy: Strategy;

  destroy$ = new Subject();
  onClose: Subject<boolean>;

  constructor(
    public fb: FormBuilder,
    public bsModalRef: BsModalRef,
    public notificationsService: NotificationsService,
    public dataService: DataService) {
  }

  ngOnInit() {
    this.onClose = new Subject();

    this.form = this.fb.group({
      fee: [25, [Validators.min(0), Validators.max(50)]],
      commission: [0, [Validators.min(0), Validators.max(100)]],
      type: [true],
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    
    if (!this.form.valid) {
      return;
    }
    const strategy: any = {
      FeeRate: Number(this.form.get('fee').value / 100),
      CommissionRate: Number(this.form.get('commission').value)
    };

    const type: boolean = this.form.get('type').value;

    this.dataService.addOffer(this.strategy.id, strategy.FeeRate, strategy.CommissionRate)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (newStrategy: Strategy) => {
          if (type) {
            this.dataService.setPublicOffer(this.strategy.id, newStrategy['OfferID']).subscribe();
          }
          this.notificationsService.open('notify.strategy.offer.create');
          this.onClose.next(true);
          this.bsModalRef.hide();
        },
        error => {
          // this.notificationsService.open('Error');
        }
      );
  }

  close() {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
