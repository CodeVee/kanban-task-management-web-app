import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {

  header = 'Review results of usability tests and iterate';
  done = 1;
  total = 1;
  constructor() { }

  ngOnInit(): void {
  }

}
