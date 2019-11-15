declare type NotificationType = 'success' | 'error' | 'warning';

export class NotificationOptions {
// type of notification
  type?: NotificationType = 'success';
  // duration in seconds
  duration?: number = 3000;
  // should it close automatically after duration time or not
  autoClose?: boolean = true;
}
