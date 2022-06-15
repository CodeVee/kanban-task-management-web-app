import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';
import { SubTask, Task, TaskSubmit, TaskView } from 'src/app/models/board.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent implements OnInit, OnDestroy {

  task: Task;
  darkMode = false;
  editMode = false;
  opened = false;

  column: string;
  columns: string[];

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
    @Inject(MAT_DIALOG_DATA) public data: TaskView) {
    this.task = data.task;
    this.column = data.column;
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
    this.subtasksCtrl = this.fb.array<FormGroup<SubTaskForm>>([], Validators.required);
    this.task.subtasks.forEach(subtask => {
      const group = this.fb.nonNullable.group({
        isCompleted: subtask.isCompleted,
        title: [subtask.title, Validators.required]
      });
      this.subtasksCtrl.push(group);
    })

    if (this.editMode) {
      this.subtasksCtrl.setValue(this.task.subtasks);
    }

    this.form = this.fb.group({
      title: this.titleCtrl,
      description: this.descriptionCtrl,
      status: this.statusCtrl,
      subtasks: this.subtasksCtrl
    });
  }

  updateStatus(status: string): void {
    this.statusCtrl.setValue(status);
  }

  addSubtask(): void {
    const group = this.fb.nonNullable.group({
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

    const values = this.form.value;

    this.task.title = values.title!;
    this.task.description = values.description!;
    this.task.status = values.status!;
    this.task.subtasks = values.subtasks?.map(c => ({ isCompleted: c.isCompleted, title: c.title } as SubTask)) || [];

    this.dialogRef.close(true);
  }
}

interface TaskForm {
  title: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<string>;
  subtasks: FormArray<FormGroup<SubTaskForm>>
}

interface SubTaskForm {
  title: FormControl<string>;
  isCompleted: FormControl<boolean>;
}
