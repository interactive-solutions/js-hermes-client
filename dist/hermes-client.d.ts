import { EventManager } from "interactivesolutions-ts-stdlib";
export interface HermesClientOpts {
    hermesUri?: string;
}
export declare class HermesClient extends EventManager {
    private options;
    private _connection;
    private connected;
    private authenticationInProgress;
    private authenticated;
    constructor(options: HermesClientOpts);
    connection: SocketIOClient.Socket;
    connect(): void;
    disconnect(): void;
    authenticate(accessToken: string): void;
    subscribe(event: string): void;
    unsubscribe(event: string): void;
    send(event: string, data: any): void;
    private onEvent(event, data);
    private onConnected();
    private onDisconnected();
    private onAuthenticated(result);
}
