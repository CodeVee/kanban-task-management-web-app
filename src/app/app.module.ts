import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThemeTogglerComponent } from './components/theme-toggler/theme-toggler.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { MaterialModule } from './material.module';
import { SideBarTogglerComponent } from './components/side-bar-toggler/side-bar-toggler.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { ProjectBoardComponent } from './components/project-board/project-board.component';

@NgModule({
  declarations: [
    AppComponent,
    ThemeTogglerComponent,
    SideBarComponent,
    SideBarTogglerComponent,
    NavBarComponent,
    TaskCardComponent,
    ProjectBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
