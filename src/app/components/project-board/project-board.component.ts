import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DeleteView, IActiveBoard, ICreateTask, IDataColumn, IReadColumn, IReadTask, ITaskView, TaskOption } from 'src/app/models/board.model';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { ViewTaskModalComponent } from '../view-task-modal/view-task-modal.component';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.scss']
})
export class ProjectBoardComponent implements OnInit, OnDestroy {

  darkMode = false;
  colors = ['#49C4E5', '#8471F2', '#67E2AE'];

  @Input() activeBoard!: IActiveBoard;
  @Output() columnAdd = new EventEmitter<void>();
  @Output() taskUpdate = new EventEmitter<void>();
  @Output() positionChange = new EventEmitter<ICreateTask>();
  @Output() taskDelete = new EventEmitter<string>();

  protected sub = new Subscription();

  constructor(private themeService: ThemeService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.sub.add(this.themeService.currentTheme$
    .subscribe(theme => this.darkMode = theme === Theme.Dark));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  drop(event: CdkDragDrop<IReadTask[]>, column: IReadColumn) {
    const readTask = event.item.data as IReadTask;
    const { id, title, description, status, subtasks }  = readTask;
    const task: ICreateTask = { id, title, description, status: column.id, subtasks };
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.positionChange.emit(task);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  addColumn(): void {
    this.columnAdd.emit();
  }

  viewTask(readTask: IReadTask): void {
    const columns = this.activeBoard.columns.map(c => ({id: c.id, name: c.name} as IDataColumn));
    const { id, title, description, status, subtasks }  = readTask;

    const task: ICreateTask = { id, title, description, status: status.id, subtasks };
    const dialogRef = this.dialog.open(ViewTaskModalComponent, {
      data: { task, columns } as ITaskView,
    });

    dialogRef.afterClosed().subscribe((option: TaskOption) => {

      const state = dialogRef.componentInstance;
      if (!state.reset && !option) {
        return;
      }
      this.taskUpdate.emit();

      if (!option) {
        return;
      }

      if (option === TaskOption.Edit) {
        this.editTask(task);
      }

      if (option === TaskOption.Delete) {
        this.deleteTask(task);
      }
    });


  }

  private editTask(task: ICreateTask): void {
    const columns = this.activeBoard.columns.map(c => ({id: c.id, name: c.name}));

    const dialogRef = this.dialog.open(TaskModalComponent, {
      data: { task, columns } as ITaskView,
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {

      if (!success) {
        return;
      }
      this.taskUpdate.emit();
    });
  }

  private deleteTask(task: ICreateTask): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: { name: task.title, isBoard: false } as DeleteView,
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {

      if (!success) {
        return;
      }
      this.taskDelete.emit(task.id);
    });
  }
}
