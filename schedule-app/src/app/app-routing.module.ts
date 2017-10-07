import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarwashSearchComponent } from './checkin/carwash-search/carwash-search.component';
import { ScheduleChoiceComponent } from './checkin/schedule-choice/schedule-choice.component';
import { TimeChoiceComponent } from './checkin/time-choice/time-choice.component';
import { FinishCheckinComponent } from './checkin/finish-checkin/finish-checkin.component';

const routes: Routes = [
  { path: 'schedules/time', component: TimeChoiceComponent},
  { path: 'schedules/checkin', component: FinishCheckinComponent},
  { path: 'schedules', component: ScheduleChoiceComponent},
  { path: '', component: CarwashSearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

//export const routedComponents CarwashSearchComponent];