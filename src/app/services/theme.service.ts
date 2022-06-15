import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from '../models/theme.enum';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  key = 'kanban-theme';
  protected currentTheme = new BehaviorSubject(Theme.Light);
  currentTheme$ = this.currentTheme.asObservable();

  changeTheme(theme: Theme): void {
    this.currentTheme.next(theme);
    localStorage.setItem(this.key, theme);
  }
}
