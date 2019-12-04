import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  scroll(id: string, group?) {
    if (group) {
      group.isOpen = true;
      setTimeout(() => {
        document.getElementById(id).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    } else {
      document.getElementById(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
