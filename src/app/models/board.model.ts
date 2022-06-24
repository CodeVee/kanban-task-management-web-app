export interface DeleteView {
  name: string;
  isBoard: boolean;
}

export enum TaskOption {
  Edit = 'Edit',
  Delete = 'Delete'
}

export interface ApiResponse<T> {
  message: string;
  succeeded: boolean;
  data: T;
}

export interface IReadBoard {
  id: string
  name: string;
}

export interface IActiveBoard extends IReadBoard {
  columns: IReadColumn[];
}

export interface IReadColumn {
  id: string;
  name: string;
  tasks: IReadTask[];
}

export interface IStatus {
  id: string;
  name: string;
}

export interface IReadTask {
  id: string;
  title: string;
  description: string;
  status: IStatus;
  subtasks: IReadSubtask[];
}

export interface IReadSubtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface IBoardView {
  board: ICreateBoard
}

export interface ICreateBoard {
  id: string;
  name: string;
  columns: ICreateColumn[];
}

export interface ICreateColumn {
  id: string;
  name: string;
}

export interface IDataColumn extends ICreateColumn { }

export interface ICreateTask {
  id: string;
  title: string;
  description: string;
  status: string;
  subtasks: ICreateSubtask[];
}

export interface ICreateSubtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface ITaskView {
  task: ICreateTask
  columns: IDataColumn[]
}

export const DefaultActiveBoard: IActiveBoard = { id: '', name: '', columns: []}
