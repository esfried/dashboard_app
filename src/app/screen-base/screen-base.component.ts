import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HubRequestCommand, HubResponse } from '../services/HubCommand';
import { SignalRService } from '../services/signal-r.service';

@Component({
  template: '',
})
export abstract class ScreenBaseComponent  {
  @Input() requestCommand!: HubRequestCommand;
  @Input() responseCommand!: HubResponse;

  data$!: Observable<any>;
  status$!: Observable<any>;

  constructor(private signalRService: SignalRService) { }

  ngOnInit() {
    this.signalRService.startConnection(this.requestCommand);
    this.data$ = this.signalRService.on(HubResponse[this.responseCommand]);
    this.status$ = this.signalRService.connectionStatusSubject
  }

  ngOnDestroy() {
    this.signalRService.stopConnection();
  }
}
