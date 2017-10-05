import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarwashSearchComponent } from './checkin/carwash-search/carwash-search.component';
import { ScheduleChoiceComponent } from './checkin/schedule-choice/schedule-choice.component';
import { TimeChoiceComponent } from './checkin/time-choice/time-choice.component';

const routes: Routes = [
  { path: 'schedules/time', component: TimeChoiceComponent},
  { path: 'schedules', component: ScheduleChoiceComponent},
  { path: '', component: CarwashSearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

//export const routedComponents CarwashSearchComponent];