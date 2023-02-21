import { Component } from '@angular/core';
import { ScreenBaseComponent } from '../screen-base/screen-base.component';
import { HubRequestCommand, HubResponse } from '../services/HubCommand';
import { SignalRService } from '../services/signal-r.service';

@Component({
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.less','../shared.less']
})
export class TelemetryComponent extends ScreenBaseComponent {
  constructor(signalRService: SignalRService) {
    super(signalRService)
    this.requestCommand = HubRequestCommand.Request_For_Telemetry_Data;
    this.responseCommand = HubResponse.Response_For_Telemetry_Data;
  }

  getEnumText(id:any) {
    return HubRequestCommand[id]
  }
}
