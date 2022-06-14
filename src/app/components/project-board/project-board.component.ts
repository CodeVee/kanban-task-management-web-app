import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.scss']
})
export class ProjectBoardComponent implements OnInit, OnDestroy {

  darkMode = false;
  columns = [1, 2, 3, 4, 5];
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
