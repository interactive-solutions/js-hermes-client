/**
 * @author Erik Norgren <erik.norgren@interactivesolutions.se>
 * @copyright Interactive Solutions
 */

export interface HermesClientOpts {
  hermesUri?:string;
}

interface AuthenticationResult {
  success:boolean;
}

export class HermesClient extends is.stdlib.EventManager {
  private _connection:SocketIOClient.Socket;

  private connected:boolean = false;
  private authenticationInProgress:boolean = false;
  private authenticated:boolean = false;

  constructor(private options:HermesClientOpts) {}

  connect():void {
    var hermesUri = this.options.hermesUri ? this.options.hermesUri : 'localhost';

    this._connection = io.connect(hermesUri, {transports: ['websocket']});

    this._connection.on('connect', this.onConnected.bind(this));
    this._connection.on('disconnect', this.onDisconnected.bind(this));
    this._connection.on('user:authenticated', this.onAuthenticated.bind(this));
  }

  get connection():SocketIOClient.Socket {
    return this._connection;
  }

  /**
   * Authenticate against Hermes
   */
  authenticate(accessToken:string):void {
    if (this.authenticationInProgress || this.authenticated) {
      return;
    }

    this.authenticationInProgress = true;
    this._connection.emit('user:authenticate', accessToken);
  }

  /**
   * Called on connected to Hermes
   */
  private onConnected():void {
    if (this.connected) {
      this.emit('hermes:reconnected');
    } else {
      this.connected = true;
      this.emit('hermes:connected');
    }
  }

  /**
   * Called on disconnected from Hermes
   */
  private onDisconnected():void {
    this.authenticated = false;
    this.emit('hermes:disconnected');
  }

  /**
   * Called after receiving an authentication from Hermes
   *
   * @param result
   */
  private onAuthenticated(result:AuthenticationResult):void {
    this.authenticationInProgress = false;

    if (result.success) {
      this.authenticated = true;
    }

    this.emit('user:authenticated', result);
  }
}
