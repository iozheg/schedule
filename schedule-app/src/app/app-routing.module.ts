import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarwashSearchComponent } from './checkin/carwash-search.component';
import { ScheduleChoiceComponent } from './checkin/schedule-choice.component';

const routes: Routes = [
  { path: 'schedules', component: ScheduleChoiceComponent},
  { path: '', component: CarwashSearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

//export const routedComponents CarwashSearchComponent];