import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';
import { ICreateSubtask, ICreateTask, IDataColumn, IReadTask, ITaskView } from 'src/app/models/board.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent implements OnInit, OnDestroy {

  task: ICreateTask;
  darkMode = false;
  editMode = false;
  opened = false;

  columns: IDataColumn[];
  selectedStatus: IDataColumn = { id: '', name: ''};

  form!: FormGroup<TaskForm>;
  titleCtrl!: FormControl<string>;
  descriptionCtrl!: FormControl<string>;
  statusCtrl!: FormControl<string>;
  subtasksCtrl!: FormArray<FormGroup<SubTaskForm>>;


  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  protected sub = new Subscription();

  constructor(private themeService: ThemeService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITaskView,
    private boardService: BoardService,) {
    this.task = data.task;
    this.columns = data.columns;
    this.editMode = !!this.task.title;
  }

  ngOnInit(): void {
    this.sub = this.themeService.currentTheme$.subscribe(theme => this.darkMode = theme === Theme.Dark)
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private initializeForm(): void {
    this.titleCtrl = new FormControl(this.task.title, { nonNullable: true, validators: Validators.required});
    this.descriptionCtrl = new FormControl(this.task.description, { nonNullable: true });
    this.statusCtrl = new FormControl(this.task.status, { nonNullable: true, validators: Validators.required});
    this.subtasksCtrl = this.fb.array<FormGroup<SubTaskForm>>([]);
    this.task.subtasks.forEach(subtask => {
      const group = this.fb.nonNullable.group({
        id: subtask.id,
        isCompleted: subtask.isCompleted,
        title: [subtask.title, Validators.required]
      });
      this.subtasksCtrl.push(group);
    })

    this.form = this.fb.nonNullable.group({
      id: this.task.id,
      title: this.titleCtrl,
      description: this.descriptionCtrl,
      status: this.statusCtrl,
      subtasks: this.subtasksCtrl
    });

    if (this.task.status) {
      const column = this.columns.find(c => c.id === this.task.status)!;
      this.updateStatus(column);
    }
  }

  updateStatus(status: IDataColumn): void {
    this.statusCtrl.setValue(status.id);
    this.selectedStatus = status;
  }

  addSubtask(): void {
    const group = this.fb.nonNullable.group({
      id: '',
      isCompleted: false,
      title: ['', Validators.required]
    })
    this.subtasksCtrl.push(group);
  }

  removeSubtask(index: number): void {
    this.subtasksCtrl.removeAt(index);
  }

  openDropdown(): void {
    this.trigger.openMenu();
  }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

  submit(): void {
    const { id, title, description, status, subtasks } = this.form.value;

    const req: ICreateTask = {
      id: id as string,
      title: title as string,
      description: description as string,
      status: status as string,
      subtasks: subtasks as ICreateSubtask[]
    }

    if (this.editMode) {
      this.boardService.editTask(req).pipe()
      .subscribe(res => this.dialogRef.close({ id: res, title, description } as IReadTask))
    }

    if (!this.editMode) {
      this.boardService.createTask(req).pipe()
      .subscribe(res => this.dialogRef.close({ id: res, title, description } as IReadTask))
    }
  }
}

interface TaskForm {
  id: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<string>;
  subtasks: FormArray<FormGroup<SubTaskForm>>
}

interface SubTaskForm {
  id: FormControl<string>;
  title: FormControl<string>;
  isCompleted: FormControl<boolean>;
}
