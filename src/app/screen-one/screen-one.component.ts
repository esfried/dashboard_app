import { Component } from '@angular/core';
import { ScreenBaseComponent } from '../screen-base/screen-base.component';
import { HubRequestCommand, HubResponse } from '../services/HubCommand';
import { SignalRService } from '../services/signal-r.service';

@Component({
  templateUrl: './screen-one.component.html',
  styleUrls: ['./screen-one.component.less', '../shared.less']
})
export class ScreenOneComponent extends ScreenBaseComponent {
  constructor(signalRService: SignalRService) {
    super(signalRService)
    this.requestCommand = HubRequestCommand.Request_For_Screen_One_Data;
    this.responseCommand = HubResponse.Response_For_Screen_One_Data;
  }
}
