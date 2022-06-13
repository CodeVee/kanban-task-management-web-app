import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Theme } from './models/theme.enum';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme!: Theme;
  opened = true;
  protected sub = new Subject<void>();

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.currentTheme$.pipe(takeUntil(this.sub))
    .subscribe(theme => this.theme = theme);
  }

  ngOnDestroy(): void {
    this.sub.next();
    this.sub.complete();
  }

  updateTheme(theme: Theme): void {
    this.themeService.changeTheme(theme);
  }

  closeSideBar(): void {
    this.opened = false;
  }
  openSideBar(): void {
    this.opened = true;
  }
}
