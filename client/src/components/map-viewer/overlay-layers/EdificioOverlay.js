import {
  updateLayerData,
  boundingBoxIntersects,
  incrementBBox,
} from "./utils/pagination-utils";
import Overlay from "./Overlay";

export default class EdificioOverlay extends Overlay {
  constructor(overlaySpec) {
    super(overlaySpec);
    this._name = "edificio-geom";
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  async getData(map, geometriesToMaintain) {
    const bbox = map.getLeafletMap().getBounds();
    const augmentedBBox = incrementBBox(
      bbox.getWest(),
      bbox.getEast(),
      bbox.getSouth(),
      bbox.getNorth()
    );

    if (boundingBoxIntersects(this.bounds, augmentedBBox)) {
      const options = {
        params: {
          xmin: augmentedBBox.xmin,
          xmax: augmentedBBox.xmax,
          ymin: augmentedBBox.ymin,
          ymax: augmentedBBox.ymax,
        },
      };
      const data = await this.repository.getData(options);
      const layer = await map.getVisibleOverlays()[0].getLayer();

      //check if layer is still selected
      if (map.options.layers[this.name].options.selected) {
        updateLayerData(layer, data, geometriesToMaintain);
      }
    }
  }

  async getGraphicsData(refCat) {
    return await this.repository.getGraphicsData(refCat);
  }
}
