import { Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { BehaviorSubject, delay, interval, Observable, of, retry, Subject, Subscription, takeUntil } from 'rxjs'
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
  public connectionId: any
  public connectionStatusSubject = new BehaviorSubject<string>('')
  public currentStatus: ConnectionStatus = ConnectionStatus.disconnected
  private destroyed$ = new Subject<void>()
  private hubConnection!: signalR.HubConnection
  private hubUrl = 'http://localhost:5008/dashboard'
  public isPingEnabled: boolean = true
  private pingTimer$!: any
  private reconnectAttempt$: any
  public subscribedScreen: HubRequestCommand = HubRequestCommand.Unknown

  constructor(private loggingService: LoggingService) {
    this.createConnection()
    this.setConnectionStatus(ConnectionStatus.disconnected)
  }

  private clearPingTimer() {
    if (this.pingTimer$)
      clearInterval(this.pingTimer$)
  }

  private createConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect({ nextRetryDelayInMilliseconds: retryContext => 5000 })
      .build()
  }

  public on<T>(eventName: string): Observable<T> {
    console.log(eventName)
    return new Observable<T>(observer => {
      this.hubConnection.on(eventName, (data: T) => {
        console.log(data)
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
        this.subscribedScreen = screen
        //this.subscribeToScreen(this.connectionId, screen)
        this.startPingInterval()
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
      // this.subscribeToScreen(this.connectionId, screen)
      this.startPingInterval()
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

  /*private subscribeToScreen(connectionId: string, screen: HubRequestCommand) {
    this.loggingService.log('subscribeToScreen', connectionId, HubRequestCommand[screen])
    this.hubConnection.invoke('SubscribeToScreen', connectionId, screen)
      .then(() => {
        this.subscribedScreen = screen
        this.loggingService.log('subscribed to screen', connectionId, HubRequestCommand[this.subscribedScreen])
      })
  }
*/

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
    this.clearPingTimer()

    if (this.reconnectAttempt$)
      this.reconnectAttempt$.unsubscribe()
  }

  // Set the status connection to be show in another component as string
  setConnectionStatus(status: ConnectionStatus) {
    this.currentStatus = status

    if (status === ConnectionStatus.connected)
      this.connectionId = this.hubConnection.connectionId;
    else
      this.connectionId = ConnectionStatus[status]

    this.connectionStatusSubject.next(ConnectionStatus[status])
  }

  // Ping subscribe automatically if necessary
  private startPingInterval(): void {
    this.ping()
    this.clearPingTimer()

    // const pingInterval = interval(300000); // 5 minutes in milliseconds
    const pingInterval = 5 * 1000; // 15 secs
    this.pingTimer$ = setInterval(() => this.ping(), pingInterval)
  }

  private ping(): void {
    if (this.isPingEnabled) {
      console.log('ping', this.connectionId, ConnectionStatus[this.currentStatus], HubRequestCommand[this.subscribedScreen])
      if (this.currentStatus == ConnectionStatus.connected) {
        console.log('sending ping', this.connectionId, ConnectionStatus[this.currentStatus], HubRequestCommand[this.subscribedScreen])
        this.hubConnection.invoke('Ping', this.connectionId, this.subscribedScreen)
          .then(() => {
            this.loggingService.log('Ping Sent', this.connectionId, this.subscribedScreen)
          })
          .catch((error) => {
            console.error(`Failed to send Ping command: ${error}`)
            this.startPingInterval()
          })
      }
    } else
      console.log('ping is disabled')
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
