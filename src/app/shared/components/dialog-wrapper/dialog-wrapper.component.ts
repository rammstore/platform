import {Component, Input} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-dialog-wrapper',
  templateUrl: './dialog-wrapper.component.html',
  styleUrls: ['./dialog-wrapper.component.scss']
})
export class DialogWrapperComponent{
  @Input() titleText: string;
  @Input() modalRef: BsModalRef;
}
