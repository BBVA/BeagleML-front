import { NgModule } from '@angular/core';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdExpansionModule,
  MdSlideToggleModule,
  MdToolbarModule,
  MdIconModule,
  MdMenuModule,
  MdSnackBarModule,
  MdGridListModule,
  MdCardModule,
  MdTabsModule,
  MdProgressBarModule,
  MdDialogModule
} from '@angular/material';

@NgModule({
  imports: [MdButtonModule, MdCheckboxModule, MdExpansionModule, MdSlideToggleModule, MdToolbarModule, MdIconModule, MdMenuModule, MdTabsModule,
    MdSnackBarModule, MdGridListModule, MdCardModule, MdProgressBarModule, MdDialogModule],
  exports: [MdButtonModule, MdCheckboxModule, MdExpansionModule, MdSlideToggleModule, MdToolbarModule, MdIconModule, MdMenuModule, MdTabsModule,
    MdSnackBarModule, MdGridListModule, MdCardModule, MdProgressBarModule, MdDialogModule],
})

export class MaterialModule { }
