import { Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';
import { Column, SubTask, Task, TaskOption, TaskView } from 'src/app/models/board.model';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-view-task-modal',
  templateUrl: './view-task-modal.component.html',
  styleUrls: ['./view-task-modal.component.scss']
})
export class ViewTaskModalComponent implements OnInit, OnDestroy {

  task: Task;
  darkMode = false;
  columns: string[] = [];
  column = '';
  opened = false;
  reset = false;
  @ViewChildren(MatMenuTrigger) triggers!: QueryList<MatMenuTrigger>;
  protected sub = new Subscription();
  constructor(private themeService: ThemeService,
    private dialogRef: MatDialogRef<ViewTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskView) {
    this.task = data.task;
    this.columns = data.columns;
    this.column = data.column;
  }

  ngOnInit(): void {
    this.sub = this.themeService.currentTheme$.subscribe(theme => this.darkMode = theme === Theme.Dark)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  updateSubtask(subtask: SubTask): void {
    const subTask = this.task.subtasks.find(c => c.title == subtask.title)!;
    subTask.isCompleted = !subTask.isCompleted;
  }

  updateStatus(status: string): void {
    this.task.status = status;
    this.column = status;
    this.reset = true;
  }

  calculateCompleted(subtasks: SubTask[]): number {
    return subtasks.filter(s => s.isCompleted).length;
  }

  openDropdown(): void {
    this.triggers.last.openMenu();
  }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

  editTask(): void {
    this.dialogRef.close(TaskOption.Edit)
  }

  deleteTask(): void {
    this.dialogRef.close(TaskOption.Delete)
  }
}
