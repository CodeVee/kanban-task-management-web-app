import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  exports: [
    MatDialogModule,
    MatMenuModule,
  ],
})
export class MaterialModule {}
