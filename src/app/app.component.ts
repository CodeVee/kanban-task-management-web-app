import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { BoardModalComponent } from './components/board-modal/board-modal.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { Board, BoardView, DefaultBoard, Task, TaskView } from './models/board.model';
import { Theme } from './models/theme.enum';
import { BoardService } from './services/board.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme!: Theme;
  opened = true;
  boards: Board[] = [];
  activeBoard = DefaultBoard;
  protected sub = new Subject<void>();

  constructor(private themeService: ThemeService,
    private boardService: BoardService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.themeService.currentTheme$.pipe(takeUntil(this.sub))
    .subscribe(theme => this.theme = theme);

    this.boardService.getAllBoards().pipe(takeUntil(this.sub))
    .subscribe(boards => {
      this.boards = boards;
      this.activeBoard = boards[0];
    });
  }

  ngOnDestroy(): void {
    this.sub.next();
    this.sub.complete();
  }

  updateTheme(theme: Theme): void {
    this.themeService.changeTheme(theme);
  }

  closeSideBar(): void {
    this.opened = false;
  }
  openSideBar(): void {
    this.opened = true;
  }
  updateActiveBoard(board: Board): void {
    this.activeBoard = board;
  }

  addBoard(): void {
    const board: Board = { ...DefaultBoard };
    const dialogRef = this.dialog.open(BoardModalComponent, {
      data: { board } as BoardView,
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (!success) {
        return;
      }

      this.boards.push(board);
    });
  }

  editBoard(): void {
    const dialogRef = this.dialog.open(BoardModalComponent, {
      data: { board: this.activeBoard } as BoardView,
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (!success) {
        return;
      }
    });
  }

  deleteBoard(): void {

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
