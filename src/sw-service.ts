import { autoinject } from "aurelia-framework";

@autoinject
export class SwService {
  private _registrationDone: boolean;
  private _registration: ServiceWorkerRegistration;

  private _newServiceWorker: ServiceWorker;

  constructor() {}

  updateAvailable: boolean;
  newServiceWorkerState: string;

  async registerServiceWorker(addUpdateFunc: boolean) {
    if (this._registrationDone) {
      return;
    }
    if (navigator.serviceWorker == void(0)) {
      return;
    }

    this._registrationDone = true;
    this._registration = await navigator.serviceWorker.register("/service-worker.js");

    if (addUpdateFunc) {
      this.addUpdateFunc();
    }
  }

  executeUpdate() {
    this._newServiceWorker.postMessage({
      type: "SKIP_WAITING"
    });
  }

  private addUpdateFunc() {
    this._registration.onupdatefound = () => {
      this.setNewServiceWorker(this._registration.installing);
    }

    if (this._registration.waiting) {
      this.setNewServiceWorker(this._registration.waiting);
    }
  }
  private setNewServiceWorker(newServiceWorker: ServiceWorker) {
    this._newServiceWorker = newServiceWorker;

    this._newServiceWorker.onstatechange = () => {
      this.updateNewServiceWorkerState();
      this.checkStateInstalled();
      this.checkStateActivated();
    }

    this.updateNewServiceWorkerState();
    this.checkStateInstalled();
  }

  private checkStateInstalled() {
    if (this._newServiceWorker.state == "installed") {
      this.updateAvailable = true;
    }
  }
  private checkStateActivated() {
    if (this._newServiceWorker.state == "activated") {
      location.reload();
    }
  }
  private updateNewServiceWorkerState() {
    this.newServiceWorkerState = this._newServiceWorker.state;
  }
}