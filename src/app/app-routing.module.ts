import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreenOneComponent } from './screen-one/screen-one.component';
import { ScreenThreeComponent } from './screen-three/screen-three.component';
import { ScreenTwoComponent } from './screen-two/screen-two.component';
import { TelemetryComponent } from './telemetry/telemetry.component';

const routes: Routes = [
{ path: '', redirectTo: 'screen-one', pathMatch: 'full' },
{ path: 'screen-one', component: ScreenOneComponent },
{ path: 'screen-two', component: ScreenTwoComponent },
{ path: 'screen-three', component: ScreenThreeComponent },
{ path: 'telemetry', component: TelemetryComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
