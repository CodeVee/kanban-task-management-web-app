import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IBoardView, ICreateBoard, ICreateColumn, IReadBoard } from 'src/app/models/board.model';
import { Theme } from 'src/app/models/theme.enum';
import { BoardService } from 'src/app/services/board.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-board-modal',
  templateUrl: './board-modal.component.html',
  styleUrls: ['./board-modal.component.scss']
})
export class BoardModalComponent implements OnInit, OnDestroy {

  board: ICreateBoard;
  darkMode = false;
  editMode = false;

  form!: FormGroup<BoardForm>;
  nameCtrl!: FormControl<string>;
  columnsCtrl!: FormArray<FormGroup<ColumnForm>>;

  protected sub = new Subscription();

  constructor(private themeService: ThemeService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BoardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IBoardView,
    private boardService: BoardService,
    ) {
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
        id: column.id,
        name: [column.name, Validators.required],
      });
      this.columnsCtrl.push(group);
    })

    this.form = this.fb.nonNullable.group({
      id: this.board.id,
      name: this.nameCtrl,
      columns: this.columnsCtrl
    });
  }

  addColumn(): void {
    const group = this.fb.nonNullable.group({
      id: '',
      name: ['', Validators.required]
    })
    this.columnsCtrl.push(group);
  }

  removeColumn(index: number): void {
    this.columnsCtrl.removeAt(index);
  }

  submit(): void {

    const { id, name, columns} = this.form.value;

    const req: ICreateBoard = {
      id: id as string,
      name: name as string,
      columns: columns as ICreateColumn[]
    }

    if (this.editMode) {
      this.boardService.editBoard(req).pipe()
      .subscribe(res => this.dialogRef.close({ id: res, name } as IReadBoard))
    }

    if (!this.editMode) {
      this.boardService.createBoard(req).pipe()
      .subscribe(res => this.dialogRef.close({ id: res, name } as IReadBoard))
    }
  }
}

interface BoardForm {
  id: FormControl<string>;
  name: FormControl<string>;
  columns: FormArray<FormGroup<ColumnForm>>
}

interface ColumnForm {
  id: FormControl<string>;
  name: FormControl<string>;
}
