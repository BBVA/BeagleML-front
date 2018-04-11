import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'md-dialog-confirm',
  template: '<h2 mat-dialog-title>{{ data.title }}</h2>\n' +
  '<md-dialog-content>{{ data.description }}</md-dialog-content>\n' +
  '<md-dialog-actions>\n' +
  '  <button md-button md-dialog-close>No</button>\n' +
  '  <!-- The md-dialog-close directive optionally accepts a value as a result for the dialog. -->\n' +
  '  <button md-button [md-dialog-close]="true">Yes</button>\n' +
  '</md-dialog-actions>',
})

export class DialogConfirmComponent {
  constructor(@Inject(MD_DIALOG_DATA) public data: any) {
  }
}
