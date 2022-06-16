import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DeleteView } from 'src/app/models/board.model';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit, OnDestroy {

  name: string;
  darkMode = false;
  isBoard = false;

  protected sub = new Subscription();

  constructor(private themeService: ThemeService,
    private dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteView) {
    this.name = data.name;
    this.isBoard = data.isBoard;
  }

  ngOnInit(): void {
    this.sub = this.themeService.currentTheme$.subscribe(theme => this.darkMode = theme === Theme.Dark)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  remove(): void {
    this.dialogRef.close(true)
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

}
