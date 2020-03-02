import { NotificationOptions } from '@app/models/notification-options';

export class Notification {
  text: string;
  options?: NotificationOptions;

  constructor(
    text: string,
    options?: NotificationOptions
  ) {
    this.options =  options || new NotificationOptions();
    this.text = text;
  }
}
