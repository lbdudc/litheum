import RepositoryFactory from "@/repositories/RepositoryFactory";

const intervalStyleNames = [
  "boldGreenPolygon",
  "lightGreenPolygon",
  "yellowGreenPolygon",
  "yellowPolygon",
  "lightOrangePolygon",
  "boldOrangePolygon",
  "redPolygon",
];

export default class Overlay {
  constructor(overlaySpec) {
    this._id = overlaySpec.options.id;
    this._repository = RepositoryFactory.get(
      overlaySpec.options.id.split("-")[0] + "entityrepository"
    );
    this._paginated = overlaySpec.options.paginated;
    this._bounds = null;
    this._intervalValues = null;
  }
  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get repository() {
    return this._repository;
  }

  set repository(value) {
    this._repository = value;
  }

  get isPaginated() {
    return this._paginated;
  }

  set isPaginated(value) {
    this._paginated = value;
  }

  get bounds() {
    return this._bounds;
  }

  set bounds(value) {
    this._bounds = value;
  }

  get intervalValues() {
    return this._intervalValues;
  }

  set intervalValues(value) {
    Object.keys(value).forEach((demandType) => {
      value[demandType].forEach(
        (el, idx) => (el.style = intervalStyleNames[idx])
      );
    });
    this._intervalValues = value;
  }

  async getData(map, geometriesToMaintain) {
    const data = await this.repository.getData();
    map
      .getVisibleOverlays()[0]
      .getLayer()
      .then((layer) => {
        const dataObj = {};
        data.forEach((item) => (dataObj[item.id] = item));
        layer.eachLayer((subLayer) => {
          const foundFeatureProps = dataObj[subLayer.feature.id];
          if (foundFeatureProps) {
            subLayer.feature.properties = Object.assign({}, foundFeatureProps);
          } else {
            subLayer.feature.properties = null;
          }
        });
      });
  }

  async fetchIntervalValues(options) {
    this.intervalValues = await this.repository.getIntervalValues(options);
    return this.intervalValues;
  }

  async fetchLayerBounds() {
    this.bounds = await this.repository.getMaxBounds();
    return this.bounds;
  }

  getGraphicsData(refCat) {
    return null;
  }

  recalcGeomData(newVals) {
    return this.repository.recalcGeomData(newVals);
  }
}
