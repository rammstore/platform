import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule, PopoverModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  exports: [
    CommonModule,
    PopoverModule,
    BsDropdownModule
  ]
})
export class SharedModule { }
