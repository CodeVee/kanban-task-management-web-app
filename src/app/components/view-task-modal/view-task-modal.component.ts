import { Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';
import { ICreateSubtask, ICreateTask, IDataColumn, ITaskView, TaskOption } from 'src/app/models/board.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-view-task-modal',
  templateUrl: './view-task-modal.component.html',
  styleUrls: ['./view-task-modal.component.scss']
})
export class ViewTaskModalComponent implements OnInit, OnDestroy {

  task: ICreateTask;
  darkMode = false;
  columns: IDataColumn[];
  activeStatus: IDataColumn = { id: '', name: ''}
  opened = false;
  reset = false;
  @ViewChildren(MatMenuTrigger) triggers!: QueryList<MatMenuTrigger>;
  protected sub = new Subscription();
  constructor(private themeService: ThemeService,
    private dialogRef: MatDialogRef<ViewTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITaskView,
    private boardService: BoardService) {
    this.task = data.task;
    this.columns = data.columns;
  }

  ngOnInit(): void {
    const sub = this.themeService.currentTheme$.subscribe(theme => this.darkMode = theme === Theme.Dark);
    this.sub.add(sub);
    this.setActiveStatus();
  }

  private setActiveStatus(): void {
    const status = this.columns.find(c => c.id === this.task.status)!;
    this.activeStatus = status;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  updateSubtask(subtask: ICreateSubtask): void {
    const subTask = this.task.subtasks.find(c => c.id == subtask.id)!;
    subTask.isCompleted = !subTask.isCompleted;
    this.updateTask();
  }

  updateStatus(status: IDataColumn): void {
    this.task.status = status.id;
    this.setActiveStatus();
    this.updateTask();
  }

  private updateTask(): void {
    const sub = this.boardService.editTask(this.task)
    .subscribe(() => this.reset = true);
    this.sub.add(sub);
  }

  calculateCompleted(subtasks: ICreateSubtask[]): number {
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
