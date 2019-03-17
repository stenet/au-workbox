import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { SwService } from "sw-service";

@autoinject
export class Sw {
  constructor(
    private swService: SwService
  ) {}

  @bindable addUpdateFunc: boolean;

  @computedFrom("swService.newServiceWorkerState")
  get newServiceWorkerState(): string {
    return this.swService.newServiceWorkerState;
  }

  @computedFrom("swService.updateAvailable")
  get updateAvailable(): boolean {
    return this.swService.updateAvailable;
  }

  bind() {
    this.swService.registerServiceWorker(this.addUpdateFunc);
  }

  executeUpdate() {
    this.swService.executeUpdate();
  }
}