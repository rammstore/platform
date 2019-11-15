import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification, NotificationOptions } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  protected notificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject([]);

  constructor() { }

  /**
   * Get notifications to display
   * @returns {Notification[]}
   */
  get(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  open( text: string, options?: NotificationOptions ): void {
    const notification: Notification = new Notification(text, options);

    const notifications: Notification[] = this.notificationsSubject.getValue();
    notifications.push(notification);
    this.notificationsSubject.next(notifications);

    // automatically close notification after duration time if auto close is not disabled
    if (notification.options.autoClose) {
      setTimeout(() => {
        this.close(notification);
      }, notification.options.duration);
    }
  }

  close(notification: Notification): void {
    this.notificationsSubject.next(this.notificationsSubject.getValue().slice(1));
  }
}
