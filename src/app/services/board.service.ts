import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap, map } from 'rxjs';
import { Board, BoardResponse } from '../models/board.model';

@Injectable({ providedIn: 'root' })
export class BoardService {

  private jsonURL = 'assets/data.json';
  private boards: Board[] = [];
  constructor(private http: HttpClient) { }

  getAllBoards(): Observable<Board[]> {
    if (this.boards.length) {
      return of(this.boards);
    }
    return this.http.get<BoardResponse>(this.jsonURL).pipe(
      tap(res => this.boards = res.boards),
      map(res => res.boards));
  }
}
