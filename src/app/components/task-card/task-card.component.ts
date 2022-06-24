import { Component, Input } from '@angular/core';
import { ICreateSubtask, IReadTask } from 'src/app/models/board.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {

  @Input() task!: IReadTask;

  calculateCompleted(subtasks: ICreateSubtask[]): number {
    return subtasks.filter(s => s.isCompleted).length;
  }

}
