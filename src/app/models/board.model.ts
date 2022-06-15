export interface BoardResponse {
  boards: Board[]
}

export interface Board {
  name: string;
  columns: Column[];
}

export const DefaultBoard: Board = { name: '', columns: []}

export interface BoardView {
  board: Board
}
export interface Column {
  name: string;
  tasks: Task[];
}

export interface Task {
  title: string;
  description: string;
  status: string;
  subtasks: SubTask[];
}

export interface SubTask {
  title: string;
  isCompleted: boolean;
}

export interface TaskBase {
  task: Task;
}

export interface TaskSubmit extends TaskBase {
  edit: boolean;
}

export interface TaskView extends TaskBase {
  columns: string[];
  column: string;
}

export enum TaskOption {
  Edit = 'Edit',
  Delete = 'Delete'
}
