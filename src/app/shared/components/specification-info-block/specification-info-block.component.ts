import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-specification-info-block',
  templateUrl: './specification-info-block.component.html',
  styleUrls: ['./specification-info-block.component.scss']
})
export class SpecificationInfoBlockComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
