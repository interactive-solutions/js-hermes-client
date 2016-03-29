"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var interactivesolutions_ts_stdlib_1 = require("interactivesolutions-ts-stdlib");
var HermesClient = (function (_super) {
    __extends(HermesClient, _super);
    function HermesClient(options) {
        _super.call(this);
        this.options = options;
        this.connected = false;
        this.authenticationInProgress = false;
        this.authenticated = false;
    }
    Object.defineProperty(HermesClient.prototype, "connection", {
        get: function () {
            return this._connection;
        },
        enumerable: true,
        configurable: true
    });
    HermesClient.prototype.connect = function () {
        var hermesUri = this.options.hermesUri ? this.options.hermesUri : 'localhost';
        this._connection = io.connect(hermesUri, { transports: ['websocket'] });
        this._connection.on('connect', this.onConnected.bind(this));
        this._connection.on('disconnect', this.onDisconnected.bind(this));
        this._connection.on('user:authenticated', this.onAuthenticated.bind(this));
    };
    HermesClient.prototype.disconnect = function () {
        this._connection.close();
    };
    HermesClient.prototype.authenticate = function (accessToken) {
        if (this.authenticationInProgress || this.authenticated) {
            return;
        }
        this.authenticationInProgress = true;
        this._connection.emit('user:authenticate', accessToken);
    };
    HermesClient.prototype.subscribe = function (event) {
        this._connection.on(event, this.onEvent.bind(this, event));
    };
    HermesClient.prototype.unsubscribe = function (event) {
        this._connection.removeListener(event);
    };
    HermesClient.prototype.send = function (event, data) {
        this._connection.emit(event, data);
    };
    HermesClient.prototype.onEvent = function (event, data) {
        this.emit(event, data);
    };
    HermesClient.prototype.onConnected = function () {
        if (this.connected) {
            this.emit('hermes:reconnected');
        }
        else {
            this.connected = true;
            this.emit('hermes:connected');
        }
    };
    HermesClient.prototype.onDisconnected = function () {
        this.authenticated = false;
        this.emit('hermes:disconnected');
    };
    HermesClient.prototype.onAuthenticated = function (result) {
        this.authenticationInProgress = false;
        if (result.success) {
            this.authenticated = true;
        }
        this.emit('user:authenticated', result);
    };
    return HermesClient;
}(interactivesolutions_ts_stdlib_1.EventManager));
exports.HermesClient = HermesClient;
//# sourceMappingURL=hermes-client.js.map