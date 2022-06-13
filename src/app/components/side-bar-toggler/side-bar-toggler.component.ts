import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-side-bar-toggler',
  templateUrl: './side-bar-toggler.component.html',
  styleUrls: ['./side-bar-toggler.component.scss']
})
export class SideBarTogglerComponent {

  @Output() open = new EventEmitter<void>();

  expandSidebar(): void {
    this.open.emit();
  }

}
