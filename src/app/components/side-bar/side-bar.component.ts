import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IActiveBoard, IReadBoard } from 'src/app/models/board.model';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  @Input() boards!: IReadBoard[];
  @Input() activeBoard!: IActiveBoard;
  @Input() opened!: boolean;
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<void>();
  @Output() selected = new EventEmitter<IReadBoard>();

  collapseSidebar(): void {
    this.close.emit();
  }

  addBoard(): void {
    this.add.emit();
  }

  selectBoard(board: IReadBoard): void {
    this.selected.emit(board);
  }

}
