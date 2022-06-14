import { Component, Input, OnInit } from '@angular/core';
import { SubTask, Task } from '../../models/board.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {

  @Input() task!: Task;
  constructor() { }

  ngOnInit(): void {
  }

  calculateCompleted(subtasks: SubTask[]): number {
    return subtasks.filter(s => s.isCompleted).length;
  }

}
