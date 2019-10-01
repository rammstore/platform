import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-specification-info-block',
  templateUrl: './specification-info-block.component.html',
  styleUrls: ['./specification-info-block.component.scss']
})
export class SpecificationInfoBlockComponent {
  @Input() data: any;
}
