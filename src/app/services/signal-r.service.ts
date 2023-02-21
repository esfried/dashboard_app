import { Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { BehaviorSubject, delay, Observable, of, retry, Subject, takeUntil } from 'rxjs'
import { HubRequestCommand } from './HubCommand'
import { LoggingService } from './logging.service'

enum ConnectionStatus {
  connecting = 0,
  connected = 1,
  disconnected = 2,
  reconnecting = 3
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public connectionStatusSubject = new BehaviorSubject<string>('')
  private destroyed$ = new Subject<void>()
  private hubConnection!: signalR.HubConnection
  private hubUrl = 'http://localhost:5008/dashboard'
  private reconnectAttempt$: any
  //private reconnectTimer$: any

  constructor(private loggingService: LoggingService) {
    this.createConnection()
    this.setConnectionStatus(ConnectionStatus.disconnected)
  }

  /*private clearReconnectTimer() {
    if (this.reconnectTimer$)
      clearTimeout(this.reconnectTimer$)
  }*/

  private createConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect({ nextRetryDelayInMilliseconds: retryContext => 5000 })
      .build()
  }

  public on<T>(eventName: string): Observable<T> {
    return new Observable<T>(observer => {
      this.hubConnection.on(eventName, (data: T) => {
        observer.next(data)
      })
      return () => {
        this.hubConnection.off(eventName)
      }
    }).pipe(takeUntil(this.destroyed$))
  }

  public startConnection(screen: HubRequestCommand): void {
    this.loggingService.log('startConnection')
    this.setConnectionStatus(ConnectionStatus.connecting)

    this.hubConnection.start()
      .then(() => {
        this.setConnectionStatus(ConnectionStatus.connected)
        this.subscribeToScreen(screen)
      })
      .catch(err => {
        this.stopConnection()
        console.error('Error while starting SignalR connection: ' + err)
        this.tryAgain(screen)

      })

    this.hubConnection.onclose(() => {
      this.loggingService.log('onclose')
      this.setConnectionStatus(ConnectionStatus.disconnected)
    })

    this.hubConnection.onreconnected(() => {
      this.loggingService.log('onreconnected')
      this.setConnectionStatus(ConnectionStatus.connected)
      this.subscribeToScreen(screen)
    })

    this.hubConnection.onreconnecting(() => {
      this.loggingService.log('onreconnecting')
      this.setConnectionStatus(ConnectionStatus.reconnecting)
    })

    // Add this code to handle the destruction of the service gracefully
    this.destroyed$.subscribe(() => {
      this.loggingService.log('destroyed$')
      this.setConnectionStatus(ConnectionStatus.disconnected)
      this.stopConnection()
    })
  }

  private subscribeToScreen(screen: HubRequestCommand) {
    this.loggingService.log('subscribeToScreen')
    this.hubConnection.invoke('SubscribeToScreen', screen)
    .then(()=> this.loggingService.log('subscribed to screen', screen))
  }

  public stopConnection(): void {
    this.loggingService.log('stopConnection')
    this.setConnectionStatus(ConnectionStatus.disconnected)
    this.hubConnection.stop().catch(err => console.error('Error while stopping SignalR connection: ' + err))
  }

  // Avoid memory leaks if the component or service is destroyed abruptly
  public ngOnDestroy(): void {
    this.loggingService.log('ngOnDestroy')
    this.destroyed$.next()
    this.destroyed$.complete()
   // this.clearReconnectTimer()

    if(this.reconnectAttempt$)
      this.reconnectAttempt$.unsubscribe()
  }

  // Set the status connection to be show in another component as string
  setConnectionStatus(status: ConnectionStatus) {
    this.connectionStatusSubject.next(ConnectionStatus[status])
  }

  tryAgain(screen: HubRequestCommand) {
    this.loggingService.log('tryAgain')
    //this.clearReconnectTimer()
    //this.reconnectTimer$ = setTimeout(() => this.startConnection(screen), 5000)
    //
    this.reconnectAttempt$ = retry(2)(of('')).pipe(delay(5000)).subscribe(() => {
      this.startConnection(screen) // Retry the connection after 5 seconds
     })
  }
}
