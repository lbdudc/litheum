import Overlay from "./Overlay";

export default class CeldaOverlay extends Overlay {
  constructor(overlaySpec) {
    super(overlaySpec);
    this._name = "celda-geom";
  }
}
