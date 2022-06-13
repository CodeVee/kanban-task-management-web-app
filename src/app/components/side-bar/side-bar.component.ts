import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  @Input() opened!: boolean;
  @Output() close = new EventEmitter<void>();
  boards = [
    { name: 'Platform Launch', active: true, },
    { name: 'Marketing Plan', active: false, },
    { name: 'Roadmap', active: false, },
  ]

  collapseSidebar(): void {
    this.close.emit();
  }

}
