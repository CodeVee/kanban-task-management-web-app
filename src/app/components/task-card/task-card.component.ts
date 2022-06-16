import { Component, Input } from '@angular/core';
import { SubTask, Task } from 'src/app/models/board.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {

  @Input() task!: Task;

  calculateCompleted(subtasks: SubTask[]): number {
    return subtasks.filter(s => s.isCompleted).length;
  }

}
