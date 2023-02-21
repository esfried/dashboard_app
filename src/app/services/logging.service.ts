import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  isEnabled = true
 
  log(...args: any[]) {
    if (this.isEnabled) {
      console.log(...args);
    }
  }

  warn(...args: any[]) {
    if (this.isEnabled) {
      console.warn(...args);
    }
  }

  error(...args: any[]) {
    if (this.isEnabled) {
      console.error(...args);
    }
  }
}
