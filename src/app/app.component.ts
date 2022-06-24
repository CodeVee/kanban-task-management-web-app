import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { BoardModalComponent } from './components/board-modal/board-modal.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import {
  DefaultActiveBoard, DeleteView, IBoardView, ICreateBoard,
  ICreateTask, IDataColumn, IReadBoard, ITaskView
} from './models/board.model';
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
  boards: IReadBoard[] = [];
  activeBoard = DefaultActiveBoard;
  protected sub = new Subject<void>();

  constructor(private themeService: ThemeService,
    private boardService: BoardService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.themeService.currentTheme$.pipe(takeUntil(this.sub))
    .subscribe(theme => this.theme = theme);

    this.loadBoards();
  }

  private loadBoards(): void {
    this.boardService.getBoards().pipe(takeUntil(this.sub))
    .subscribe(boards => this.boards = boards)
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
  updateActiveBoard(board: IReadBoard): void {
    this.boardService.getBoardTasks(board).pipe(takeUntil(this.sub))
    .subscribe(board => this.activeBoard = board)
  }

  addBoard(): void {
    const board: ICreateBoard = { ...DefaultActiveBoard };
    const dialogRef = this.dialog.open(BoardModalComponent, {
      data: { board } as IBoardView,
    });

    dialogRef.afterClosed().pipe(takeUntil(this.sub))
    .subscribe((res: IReadBoard) => {
      if (!res) {
        return;
      }

      this.loadBoards();
      this.updateActiveBoard(res);
    });
  }

  editBoard(): void {
    const board = { ...this.activeBoard};
    const dialogRef = this.dialog.open(BoardModalComponent, {
      data: { board } as IBoardView,
    });

    dialogRef.afterClosed().pipe(takeUntil(this.sub))
    .subscribe((res: IReadBoard) => {
      if (!res) {
        return;
      }

      this.loadBoards();
      this.updateActiveBoard(res);
    });
  }

  deleteBoard(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: { name: this.activeBoard.name, isBoard: true } as DeleteView,
    });

    dialogRef.afterClosed().pipe(takeUntil(this.sub))
    .subscribe((success: boolean) => {

      if (!success) {
        return;
      }

      this.boardService.deleteBoard(this.activeBoard.id).pipe(takeUntil(this.sub))
      .subscribe(res => {
        this.activeBoard = DefaultActiveBoard;
        this.loadBoards();
      });
    });
  }

  addTask(): void {
    const task: ICreateTask = { id: '', title: '', status: '', description: '', subtasks: []}
    const columns = this.activeBoard.columns.map(c =>  ({ id: c.id, name: c.name}) as IDataColumn );
    const dialogRef = this.dialog.open(TaskModalComponent, {
      data: { task, columns } as ITaskView,
    });

    dialogRef.afterClosed().pipe(takeUntil(this.sub))
    .subscribe((success: boolean) => {

      if (!success) {
        return;
      }
      this.refreshActiveBoard();
    });
  }

  editTask(task: ICreateTask): void {
    this.boardService.editTask(task).pipe(takeUntil(this.sub))
    .subscribe(() => this.refreshActiveBoard())
  }

  deleteTask(taskId: string): void {
    this.boardService.deleteTask(taskId).pipe(takeUntil(this.sub))
    .subscribe(() => this.refreshActiveBoard())
  }

  refreshActiveBoard(): void {
    const board: IReadBoard = { id: this.activeBoard.id, name: this.activeBoard.name}
    this.updateActiveBoard(board);
  }
}
