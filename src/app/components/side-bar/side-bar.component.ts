import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Board } from 'src/app/models/board.model';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  @Input() boards!: Board[];
  @Input() activeBoard!: Board;
  @Input() opened!: boolean;
  @Output() close = new EventEmitter<void>();
  @Output() selected = new EventEmitter<Board>();

  collapseSidebar(): void {
    this.close.emit();
  }

  selectBoard(board: Board): void {
    this.selected.emit(board);
  }

}
