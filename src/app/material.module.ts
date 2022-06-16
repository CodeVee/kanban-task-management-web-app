import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop'

@NgModule({
  exports: [
    MatDialogModule,
    MatMenuModule,
    DragDropModule,
  ],
})
export class MaterialModule {}
