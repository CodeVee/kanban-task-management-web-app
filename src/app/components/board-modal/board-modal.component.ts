import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Board, BoardView, Column, Task } from 'src/app/models/board.model';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-board-modal',
  templateUrl: './board-modal.component.html',
  styleUrls: ['./board-modal.component.scss']
})
export class BoardModalComponent implements OnInit, OnDestroy {

  board: Board;
  darkMode = false;
  editMode = false;

  form!: FormGroup<BoardForm>;
  nameCtrl!: FormControl<string>;
  columnsCtrl!: FormArray<FormGroup<ColumnForm>>;

  protected sub = new Subscription();

  constructor(private themeService: ThemeService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BoardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BoardView) {
    this.board = data.board;
    this.editMode = !!this.board.name;
  }

  ngOnInit(): void {
    this.sub = this.themeService.currentTheme$.subscribe(theme => this.darkMode = theme === Theme.Dark)
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private initializeForm(): void {
    this.nameCtrl = new FormControl(this.board.name, { nonNullable: true, validators: Validators.required});
    this.columnsCtrl = this.fb.array<FormGroup<ColumnForm>>([]);
    this.board.columns.forEach(column => {
      const group = this.fb.nonNullable.group({
        name: [column.name, Validators.required],
        tasks: [column.tasks]
      });
      this.columnsCtrl.push(group);
    })

    this.form = this.fb.group({
      name: this.nameCtrl,
      columns: this.columnsCtrl
    });
  }

  addColumn(): void {
    const group = this.fb.nonNullable.group({
      name: ['', Validators.required],
      tasks: [[] as Task[]]
    })
    this.columnsCtrl.push(group);
  }

  removeColumn(index: number): void {
    this.columnsCtrl.removeAt(index);
  }

  submit(): void {

    const values = this.form.value;

    this.board.name = values.name!;
    this.board.columns = values.columns?.map(c => ({ tasks: c.tasks, name: c.name } as Column)) || [];

    this.dialogRef.close(true);
  }
}

interface BoardForm {
  name: FormControl<string>;
  columns: FormArray<FormGroup<ColumnForm>>
}

interface ColumnForm {
  name: FormControl<string>;
  tasks: FormControl<Task[]>;
}
