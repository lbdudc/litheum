import GeometrySelection from "./GeometrySelection";
import app from "@/main.js";
import { getFeatureData } from "../utils/utils";
export default class GroupSelection extends GeometrySelection {
  constructor() {
    super();
    this._selectedGeometries = {};
    this._idQueue = [];
    this._data = null;
    this._id = "group";
  }

  get id() {
    return this._id;
  }

  get selectedGeometries() {
    return this._selectedGeometries;
  }

  set selectedGeometries(value) {
    this._selectedGeometries = value;
  }

  get idQueue() {
    return this._idQueue;
  }

  set idQueue(value) {
    this._idQueue = value;
  }

  get selectedGeom() {
    // se ha de devolver tambien un data: data retrieved from server
    return {
      layer: this._selectedGeometries[this._idQueue[0]],
      data: this._data,
    };
  }

  set data(data) {
    this._data = data;
  }

  async onGeometrySelected(layer, repository, updateLayerStyleFunc) {
    // reset style on last clicked
    if (
      Object.entries(this.selectedGeometries).length < 200 ||
      this.selectedGeometries[layer.feature.id] != null
    ) {
      this._resetLastSelected(updateLayerStyleFunc);
    }
    // if already present we need to shift it up the queue
    if (this.selectedGeometries[layer.feature.id] != null) {
      this.idQueue = this.idQueue.filter((el) => el != layer.feature.id);
      this._setLayerLastSelectedFlagsValues(layer, true);
      this.idQueue.unshift(layer.feature.properties.id);
      await this._updateLastSelectedDataField(layer, repository);
    }
    if (Object.entries(this.selectedGeometries).length < 200) {
      this._setLayerLastSelectedFlagsValues(layer, true);
      this.idQueue.unshift(layer.feature.properties.id);
      app.$set(this.selectedGeometries, layer.feature.id, layer);
      layer.bringToFront();
      await this._updateLastSelectedDataField(layer, repository);
    }
    updateLayerStyleFunc(layer);
  }

  async onRemoveGeometry(layer, updateLayerStyleFunc, repository) {
    this._setLayerLastSelectedFlagsValues(layer, false);
    updateLayerStyleFunc(layer);
    const id = layer.feature.id;
    this.idQueue = this.idQueue.filter((el) => el != id);
    app.$delete(this.selectedGeometries, id);
    if (this._data.id == id) {
      if (this.idQueue.length > 0) {
        await this._updateLastSelectedDataField(
          this.selectedGeometries[this.idQueue[0]],
          repository
        );
        this._setLayerLastSelectedFlagsValues(
          this.selectedGeometries[this.idQueue[0]],
          true
        );
        updateLayerStyleFunc(this.selectedGeometries[this.idQueue[0]]);
      } else {
        this._data = null;
      }
    }
  }

  onCenterView(layer, updateLayerStyleFunc, repository) {
    this._resetLastSelected(updateLayerStyleFunc);
    //set layer as first on queue
    this.idQueue = this.idQueue.filter((el) => el != layer.feature.id);
    this.idQueue.unshift(layer.feature.properties.id);

    this._updateLastSelectedDataField(layer, repository);

    layer.feature.properties.isLastSelected = true;
    updateLayerStyleFunc(layer);
  }

  onGeometrySelectedGroupally(layer, updateLayerStyleFunc) {
    if (Object.entries(this.selectedGeometries).length < 200) {
      layer.feature.properties.isSelected = true;
      this.idQueue.push(layer.feature.properties.id);
      app.$set(this.selectedGeometries, layer.feature.id, layer);
      layer.bringToFront();
    }
    updateLayerStyleFunc(layer);
  }

  removeAllGeometries() {
    this.idQueue = [];
    Object.entries(this.selectedGeometries).forEach(([_, geom]) => {
      this._setLayerLastSelectedFlagsValues(geom, false);
    });
    this._data = null;
    app.$set(this, "selectedGeometries", {});
  }

  resetStyles(updateLayerStyleFunc) {
    if (this.selectedGeom?.layer?.feature.hasBeenRecalc) {
      this._data.cooling = this.selectedGeom.layer.feature.properties.cooling;
      this._data.heating = this.selectedGeom.layer.feature.properties.heating;
      this._data.lighting = this.selectedGeom.layer.feature.properties.lighting;
    }
    Object.entries(this.selectedGeometries).forEach(([_, geom]) => {
      updateLayerStyleFunc(geom);
    });
  }
  async _updateLastSelectedDataField(layer, repository) {
    const data = await getFeatureData(layer, repository);
    if (layer.feature.hasBeenRecalc) {
      data.cooling = layer.feature.properties.cooling;
      data.heating = layer.feature.properties.heating;
      data.lighting = layer.feature.properties.lighting;
    }
    this.data = data;
  }

  _setLayerLastSelectedFlagsValues(layer, isLastSelected) {
    layer.feature.properties.isLastSelected = isLastSelected;
    layer.feature.properties.isSelected = isLastSelected;
  }

  _resetLastSelected(updateLayerStyleFunc) {
    if (this.selectedGeometries[this.idQueue[0]]) {
      this.selectedGeometries[
        this.idQueue[0]
      ].feature.properties.isLastSelected = false;
      updateLayerStyleFunc(this.selectedGeometries[this.idQueue[0]]);
    }
  }
}
