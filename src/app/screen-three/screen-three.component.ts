
import { Component } from '@angular/core';
import { ScreenBaseComponent } from '../screen-base/screen-base.component';
import { HubRequestCommand, HubResponse } from '../services/HubCommand';
import { SignalRService } from '../services/signal-r.service';

@Component({
  templateUrl: './screen-three.component.html',
  styleUrls: ['./screen-three.component.less', '../shared.less']
})
export class ScreenThreeComponent extends ScreenBaseComponent {
  constructor(signalRService: SignalRService) {
    super(signalRService)
    this.requestCommand = HubRequestCommand.Request_For_Screen_Three_Data;
    this.responseCommand = HubResponse.Response_For_Screen_Three_Data;
  }
}