import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Board, Column, Task, TaskOption, TaskView } from 'src/app/models/board.model';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';
import { ViewTaskModalComponent } from '../view-task-modal/view-task-modal.component';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.scss']
})
export class ProjectBoardComponent implements OnInit, OnDestroy, OnChanges {

  darkMode = false;
  colors = ['#49C4E5', '#8471F2', '#67E2AE']
  @Input() activeBoard!: Board;
  columns:string[] = [];
  protected sub = new Subscription();
  constructor(private themeService: ThemeService, private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    const col = changes['activeBoard'].currentValue.columns as Column[];
    if (!!col.length) {
      this.columns = col.map(c => c.name);
    }

  }

  ngOnInit(): void {
    this.sub.add(this.themeService.currentTheme$
    .subscribe(theme => this.darkMode = theme === Theme.Dark));
  }

  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }

  viewTask(task: Task, column: string): void {
    const dialogRef = this.dialog.open(ViewTaskModalComponent, {
      data: { task, columns: this.columns, column } as TaskView,
    });

    dialogRef.afterClosed().subscribe((option: TaskOption) => {

      const state = dialogRef.componentInstance;
      if (!state.reset) {
        return;
      }
      this.updateBoard(column, task);

      if (!option) {
        return;
      }

      if (option === TaskOption.Edit) {

      }

      if (option === TaskOption.Delete) {

      }
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
