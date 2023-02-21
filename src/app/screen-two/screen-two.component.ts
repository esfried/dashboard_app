
import { Component } from '@angular/core';
import { ScreenBaseComponent } from '../screen-base/screen-base.component';
import { HubRequestCommand, HubResponse } from '../services/HubCommand';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-screen-two',
  templateUrl: './screen-two.component.html',
  styleUrls: ['./screen-two.component.less', '../shared.less']
})
export class ScreenTwoComponent extends ScreenBaseComponent {
  constructor(signalRService: SignalRService) {
    super(signalRService)
    this.requestCommand = HubRequestCommand.Request_For_Screen_Two_Data;
    this.responseCommand = HubResponse.Response_For_Screen_Two_Data;
  }
}