import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Theme } from 'src/app/models/theme.enum';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-theme-toggler',
  templateUrl: './theme-toggler.component.html',
  styleUrls: ['./theme-toggler.component.scss']
})
export class ThemeTogglerComponent implements OnInit, OnDestroy {

  toggleCtrl = new FormControl(false);
  protected sub = new Subscription();
  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.sub = this.toggleCtrl.valueChanges.subscribe(darkMode => {
      if (darkMode) {
        this.themeService.changeTheme(Theme.Dark)
      }

      if (!darkMode) {
        this.themeService.changeTheme(Theme.Light)
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
