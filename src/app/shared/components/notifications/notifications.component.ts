import { Component } from '@angular/core';
import { style, trigger, animate, transition} from '@angular/animations';
import { NotificationsService } from '@app/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [
    trigger('notificationAnimation', [
      // Animation of appear
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(200)
      ]),
      // Animation of disappear
      transition(':leave', [
        animate(200, style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]

})
export class NotificationsComponent {
  constructor(
    public notificationService: NotificationsService
  ) { }
}
