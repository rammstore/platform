import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule, ModalModule, PopoverModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentTabsComponent } from './components/content-tabs/content-tabs.component';
import { RouterModule } from '@angular/router';
import { DialogWrapperComponent } from './components/dialog-wrapper/dialog-wrapper.component';

@NgModule({
  declarations: [ContentTabsComponent, DialogWrapperComponent],
  imports: [
    CommonModule,
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    PopoverModule,
    BsDropdownModule,
    ModalModule,
    ReactiveFormsModule,
    ContentTabsComponent,
    DialogWrapperComponent,
    RouterModule
  ]
})
export class SharedModule { }
