import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  @Input() opened!: boolean;
  @Output() close = new EventEmitter<void>();
  count = 3;
  active = true;
  boards = [
    { name: 'Platform Launch', active: true, },
    { name: 'Marketing Plan', active: false, },
    { name: 'Roadmap', active: false, },
  ]
  constructor() { }

  ngOnInit(): void {
  }

  collapseSidebar(): void {
    this.close.emit();
  }

}
