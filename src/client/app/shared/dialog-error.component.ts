import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'md-dialog-error',
  template: '{{ data.description }}',
})

export class DialogErrorComponent {
  constructor(@Inject(MD_DIALOG_DATA) public data: any) {
  }
}
