import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from '../models/theme.enum';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  protected currentTheme = new BehaviorSubject(Theme.Light);
  currentTheme$ = this.currentTheme.asObservable();

  changeTheme(theme: Theme): void {
    this.currentTheme.next(theme);
  }
}
