import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.less']
})
export class ConnectionStatusComponent {
  status$!: Observable<any>;

  constructor(private signalRService: SignalRService) {
   this.status$ = signalRService.connectionStatusSubject
  }
  
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
 }
