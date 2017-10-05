import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MdToolbarModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdMenuModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { MdDatepickerModule } from '@angular/material';
import { MdNativeDateModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppNavComponent } from './app-nav/app-nav.component';
import { CarwashSearchComponent } from './checkin/carwash-search/carwash-search.component';
import { ScheduleChoiceComponent } from './checkin/schedule-choice/schedule-choice.component';
import { TimeChoiceComponent } from './checkin/time-choice/time-choice.component';

import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    CarwashSearchComponent,
    ScheduleChoiceComponent,
    TimeChoiceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    MdToolbarModule,
    MdButtonModule,
    MdMenuModule,
    MdInputModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdCardModule,
    MatButtonToggleModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
