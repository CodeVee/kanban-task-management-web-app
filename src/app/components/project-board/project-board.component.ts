import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Board } from 'src/app/models/board.model';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.scss']
})
export class ProjectBoardComponent implements OnInit, OnDestroy {

  darkMode = false;
  colors = ['#49C4E5', '#8471F2', '#67E2AE']
  @Input() activeBoard!: Board;
  protected sub = new Subscription();
  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.sub = this.themeService.currentTheme$
    .subscribe(theme => this.darkMode = theme === Theme.Dark);
  }

  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }
}
