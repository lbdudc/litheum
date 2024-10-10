export function updateLayerData(layer, data, geometriesToMaintain) {
  if (Object.keys(layer._layers) == 0) {
    layer.addData(data);
  } else {
    const dataObj = {};
    data.features.forEach((item) => (dataObj[item.id] = item));
    layer.eachLayer((subLayer) => {
      const found = dataObj[subLayer.feature.id];
      if (
        found ||
        subLayer.feature.hasBeenRecalc ||
        geometriesToMaintain[subLayer.feature.id] != null
      ) {
        delete dataObj[subLayer.feature.id];
      } else {
        if (subLayer.isPopupOpen()) {
          subLayer.closePopup();
        }
        layer.removeLayer(subLayer);
      }
    });

    const newFeatures = Object.values(dataObj);
    layer.addData(newFeatures);
  }
}

export function boundingBoxIntersects(bbox1, bbox2) {
  const bbox1L = L.latLngBounds(
    L.latLng(bbox1.ymin, bbox1.xmin),
    L.latLng(bbox1.ymax, bbox1.xmax)
  );
  const bbox2L = L.latLngBounds(
    L.latLng(bbox2.ymin, bbox2.xmin),
    L.latLng(bbox2.ymax, bbox2.xmax)
  );

  return bbox1L.intersects(bbox2L);
}

export function incrementBBox(xmin, xmax, ymin, ymax) {
  var incrementoNorteSur = (ymax - ymin) * 0.3;
  var incrementoEsteOeste = (xmax - xmin) * 0.3;

  var augmentedXmin = xmin - incrementoEsteOeste;
  var aumentedXmax = xmax + incrementoEsteOeste;
  var augmentedYmin = ymin - incrementoNorteSur;
  var augmentedYmax = ymax + incrementoNorteSur;

  return {
    xmin: augmentedXmin,
    xmax: aumentedXmax,
    ymin: augmentedYmin,
    ymax: augmentedYmax,
  };
}
