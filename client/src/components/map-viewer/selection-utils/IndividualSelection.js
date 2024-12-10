import GeometrySelection from "./GeometrySelection";
import { getFeatureData } from "../utils/utils";

export default class IndividualSelection extends GeometrySelection {
  constructor() {
    super();
    this._selectedGeom = null;
    this._id = "individual";
  }

  get id() {
    return this._id;
  }

  get selectedGeom() {
    return this._selectedGeom;
  }

  set selectedGeom(value) {
    this._selectedGeom = value;
  }

  get selectedGeometries() {
    if (this._selectedGeom) {
      const key = this._selectedGeom.layer.feature.id;
      return { [key]: this._selectedGeom.layer };
    } else {
      return {};
    }
  }

  async onGeometrySelected(layer, repository, updateLayerStyleFunc) {
    if (this.selectedGeom) {
      this.selectedGeom.layer.feature.properties.isHighlighted = false;
      updateLayerStyleFunc(this.selectedGeom.layer);
    }
    if (
      this.selectedGeom?.layer.feature.properties.id ==
      layer.feature.properties.id
    ) {
      this.selectedGeom = null;
    } else {
      layer.feature.properties.isHighlighted = true;
      layer.bringToFront();
      const data = await getFeatureData(layer, repository);
      if (layer.feature.hasBeenRecalc) {
        data.cooling = layer.feature.properties.cooling;
        data.heating = layer.feature.properties.heating;
        data.lighting = layer.feature.properties.lighting;
      }
      this.selectedGeom = {
        data: data,
        layer: layer,
      };
      updateLayerStyleFunc(this.selectedGeom.layer);
    }
  }

  resetStyles(updateLayerStyleFunc) {
    if (this.selectedGeom?.layer) {
      if (this.selectedGeom.layer.feature.hasBeenRecalc) {
        this.selectedGeom.data.cooling =
          this.selectedGeom.layer.feature.properties.cooling;
        this.selectedGeom.data.heating =
          this.selectedGeom.layer.feature.properties.heating;
        this.selectedGeom.data.lighting =
          this.selectedGeom.layer.feature.properties.lighting;
      }
      updateLayerStyleFunc(this.selectedGeom.layer);
    }
  }
}
