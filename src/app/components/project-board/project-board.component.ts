import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Board, DeleteView, Task, TaskOption, TaskView } from 'src/app/models/board.model';
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

  @Input() activeBoard!: Board;
  @Output() columnAdd = new EventEmitter<void>();

  protected sub = new Subscription();

  constructor(private themeService: ThemeService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.sub.add(this.themeService.currentTheme$
    .subscribe(theme => this.darkMode = theme === Theme.Dark));
  }

  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }

  addColumn(): void {
    this.columnAdd.emit();
  }

  viewTask(task: Task, column: string): void {
    const columns = this.activeBoard.columns.map(c => c.name);
    const dialogRef = this.dialog.open(ViewTaskModalComponent, {
      data: { task, columns, column } as TaskView,
    });

    dialogRef.afterClosed().subscribe((option: TaskOption) => {

      const state = dialogRef.componentInstance;
      if (!state.reset && !option) {
        return;
      }
      this.updateBoard(column, task);

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

  private editTask(task:Task): void {
    const columns = this.activeBoard.columns.map(c => c.name);
    const column = task.status;

    const dialogRef = this.dialog.open(TaskModalComponent, {
      data: { task, columns, column } as TaskView,
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {

      if (!success) {
        return;
      }

      this.updateBoard(column, task);
    });
  }

  private deleteTask(task:Task): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: { name: task.title, isBoard: false } as DeleteView,
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {

      if (!success) {
        return;
      }

      const column = this.activeBoard.columns.find(c => c.name === task.status)!;
      column.tasks = column.tasks.filter(d => !(d.title === task.title));
    });
  }


  private updateBoard(column: string, task: Task) {
    if (task.status === column) {
      return;

    }
    const oldColumn = this.activeBoard.columns.find(c => c.name === column)!;
    oldColumn.tasks = oldColumn.tasks.filter(d => !(d.title === task.title));

    const newColumn = this.activeBoard.columns.find(c => c.name === task.status)!;
    newColumn.tasks = [...newColumn.tasks, task];
  }
}
