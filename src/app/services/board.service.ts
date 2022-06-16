import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap, map, BehaviorSubject, Subject } from 'rxjs';
import { Board, BoardResponse, DefaultBoard } from '../models/board.model';

@Injectable({ providedIn: 'root' })
export class BoardService {

  private jsonURL = 'assets/data.json';
  private boardsKey = 'kanban-boards';
  private boardKey = 'kanban-active-board';
  private boards: Board[] = [];
  protected activeBoard = DefaultBoard;
  constructor(private http: HttpClient) { }

  getAllBoards(): Observable<Board[]> {
    if (this.boards.length) {
      return of(this.boards);
    }

    const boardsStr = localStorage.getItem(this.boardsKey) || '';
    if (boardsStr) {
      const boards = JSON.parse(boardsStr) as Board[];

      if (!!boards && !!boards.length) {
        this.boards = boards;
        return of(this.boards);
      }
    }


    return this.http.get<BoardResponse>(this.jsonURL).pipe(
      tap(res => {
        this.boards = res.boards;
        const strValue = JSON.stringify(this.boards);
        localStorage.setItem(this.boardsKey, strValue);
      }),
      map(res => res.boards));
  }

  getActiveBoard(): Observable<Board> {

    if (!!this.activeBoard.name) {
      return of(this.activeBoard);
    }

    const boardStr = localStorage.getItem(this.boardKey) || '';
    if (boardStr) {
      const board = JSON.parse(boardStr) as Board;

      if (!!board) {
        this.activeBoard = board;
        return of(this.activeBoard);
      }
    }


    return of(DefaultBoard);
  }

  updateBoards(boards: Board[]): void {
    this.boards = boards;
    const strValue = JSON.stringify(this.boards);
    localStorage.setItem(this.boardsKey, strValue);
  }

  updateBoard(board: Board): void {
    this.activeBoard = board;
    const strValue = JSON.stringify(this.activeBoard);
    localStorage.setItem(this.boardKey, strValue);
  }
}
