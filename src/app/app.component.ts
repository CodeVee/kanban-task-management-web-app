import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Board, DefaultBoard } from './models/board.model';
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

  constructor(private themeService: ThemeService, private boardService: BoardService) { }

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
}
