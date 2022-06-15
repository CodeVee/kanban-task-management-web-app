import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Board, Task, TaskSubmit, TaskView } from 'src/app/models/board.model';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';
import { TaskModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {

  @Input() opened!: boolean;
  @Input() activeBoard!: Board;
  darkMode = false;
  protected sub = new Subscription();

  constructor(private themeService: ThemeService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.sub = this.themeService.currentTheme$.subscribe(theme => this.darkMode = theme === Theme.Dark)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addTask(): void {
    const task: Task = { title: '', status: '', description: '', subtasks: []}
    const columns = this.activeBoard.columns.map(c => c.name);
    const column = '';
    const dialogRef = this.dialog.open(TaskModalComponent, {
      data: { task, columns, column } as TaskView,
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {

      if (!success) {
        return;
      }

      const newColumn = this.activeBoard.columns.find(c => c.name === task.status)!;
      newColumn.tasks = [...newColumn.tasks, task];
    });
  }

}
