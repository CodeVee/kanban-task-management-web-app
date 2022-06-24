import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse, IActiveBoard, ICreateBoard, ICreateTask, IReadBoard, IReadColumn } from '../models/board.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class BoardService {

  protected boardUrl = `${environment.api_url}boards/`;
  protected taskUrl = `${environment.api_url}tasks/`;

  protected headers: HttpHeaders = new HttpHeaders()
  .set('Content-Type', 'application/json');

  protected options = {
    headers: this.headers
  }
  constructor(private http: HttpClient) { }

  getBoards(): Observable<IReadBoard[]> {
    return this.http.get<ApiResponse<IReadBoard[]>>(this.boardUrl)
    .pipe(map(res => res.data));
  }

  getBoardTasks(board: IReadBoard): Observable<IActiveBoard> {
    const { id, name } = board;
    const url = `${this.boardUrl}${id}/tasks`;
    return this.http.get<ApiResponse<IReadColumn[]>>(url)
    .pipe(map(res => ({ id, name, columns: res.data} as IActiveBoard)));
  }

  createBoard(req: ICreateBoard): Observable<string> {
    return this.http.post<ApiResponse<string>>(this.boardUrl, req, this.options)
    .pipe(map(res => res.data));
  }

  editBoard(req: ICreateBoard): Observable<string> {
    return this.http.patch<ApiResponse<string>>(this.boardUrl + req.id, req, this.options)
    .pipe(map(res => res.data));
  }

  deleteBoard(boardId: string): Observable<string> {
    return this.http.delete<ApiResponse<string>>(this.boardUrl + boardId)
    .pipe(map(res => res.data));
  }

  createTask(req: ICreateTask): Observable<string> {
    return this.http.post<ApiResponse<string>>(this.taskUrl, req, this.options)
    .pipe(map(res => res.data));
  }

  editTask(req: ICreateTask): Observable<string> {
    return this.http.patch<ApiResponse<string>>(this.taskUrl + req.id, req, this.options)
    .pipe(map(res => res.data));
  }

  deleteTask(taskId: string): Observable<string> {
    return this.http.delete<ApiResponse<string>>(this.taskUrl + taskId)
    .pipe(map(res => res.data));
  }
}
