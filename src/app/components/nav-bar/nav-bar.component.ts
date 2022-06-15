import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Board } from 'src/app/models/board.model';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {

  @Input() opened!: boolean;
  @Input() activeBoard!: Board;
  @Output() taskAdd = new EventEmitter<void>();
  @Output() boardEdit = new EventEmitter<void>();
  @Output() boardDelete = new EventEmitter<void>();
  darkMode = false;
  protected sub = new Subscription();

  constructor(private themeService: ThemeService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.sub = this.themeService.currentTheme$.subscribe(theme => this.darkMode = theme === Theme.Dark)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addTask(): void {
    this.taskAdd.emit();
  }
  editBoard(): void {
    this.boardEdit.emit();
  }
  deleteBoard(): void {
    this.boardDelete.emit();
  }

}
