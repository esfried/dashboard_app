import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScreenOneComponent } from './screen-one/screen-one.component';
import { ScreenTwoComponent } from './screen-two/screen-two.component';
import { ScreenThreeComponent } from './screen-three/screen-three.component';
import { MenuComponent } from './menu/menu.component';
import { TelemetryComponent } from './telemetry/telemetry.component';
import { ConnectionStatusComponent } from './connection-status/connection-status.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ConnectionStatusComponent,
    MenuComponent,
    ScreenOneComponent,
    ScreenTwoComponent,
    ScreenThreeComponent,
    TelemetryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
