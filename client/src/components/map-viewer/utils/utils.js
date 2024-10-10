import i18n from "@/plugins/i18n";

function onHover(map, layer) {
  layer.eachLayer((feature) => {
    feature.unbindPopup();
    let html = `
    <div>
      <table>
        <tr>
          <td>${i18n.t("selectors.indicators.heating")}: </td>
          <td>${feature.feature.properties.heating}</td>
        </tr>
        <tr>
          <td>${i18n.t("selectors.indicators.cooling")}: </td>
          <td>${feature.feature.properties.cooling}</td>
        </tr>
        <tr>
          <td>${i18n.t("selectors.indicators.lighting")}: </td>
          <td>${feature.feature.properties.lighting}</td>
        </tr>
        `;
    html += feature.feature.properties?.tc
      ? `<tr>
          <td>${i18n.t("selectors.recalculate.tc.label")}: </td>
          <td>${i18n.t(
            "selectors.recalculate.tc." + feature.feature.properties.tc
          )}</td>
        </tr>
        <tr>
          <td>${i18n.t("selectors.recalculate.ct.label")}: </td>
          <td>${i18n.t(
            "selectors.recalculate.ct." + feature.feature.properties.ct
          )}</td>
        </tr>
      </table>
    </div>`
      : `</table>
    </div>`;
    feature.bindPopup(html, { autoPan: false });
  });

  layer.addEventListener("mouseout", () => {
    const lMap = map.getLeafletMap();
    lMap.closePopup();
  });

  layer.addEventListener("mouseover", (e) => {
    const lMap = map.getLeafletMap();
    lMap.closePopup();
    e.layer.openPopup();
  });
}

function removeOnHover(map, layer) {
  const lMap = map.getLeafletMap();
  lMap.closePopup();

  layer.eachLayer((feature) => {
    feature.unbindPopup();
  });

  layer.removeEventListener("mouseout");

  layer.removeEventListener("mouseover");
}

async function checkForIntervalsValuesChange(
  results,
  overrideLimit,
  map,
  intervalValues
) {
  const interval = intervalValues;
  // if any of the limits have changed set the new limit value
  if (overrideLimit.length > 0) {
    await overrideLimit.forEach(async (el) => {
      interval[el][0].minValue = interval[el][interval[el].length - 1].maxValue;
      interval[el][interval[el].length - 1].maxValue = 0;
      const l = await map.getVisibleOverlays()[0].getLayer();

      l.eachLayer((subLayer) => {
        interval[el][0].minValue =
          subLayer.feature.properties[el] < interval[el][0].minValue
            ? subLayer.feature.properties[el]
            : interval[el][0].minValue;
        interval[el][interval[el].length - 1].maxValue =
          subLayer.feature.properties[el] >
          interval[el][interval[el].length - 1].maxValue
            ? subLayer.feature.properties[el]
            : interval[el][interval[el].length - 1].maxValue;
      });
    });
  }
  results.forEach((newVals) => {
    for (const key in intervalValues) {
      interval[key][0].minValue =
        interval[key][0].minValue > newVals[key]
          ? newVals[key]
          : interval[key][0].minValue;
      interval[key][interval[key].length - 1].maxValue =
        interval[key][interval[key].length - 1].maxValue < newVals[key]
          ? newVals[key]
          : interval[key][interval[key].length - 1].maxValue;
    }
  });

  return interval;
}

async function getFeatureData(layer, repository) {
  let data = {};
  const res = await repository.getDataFromItem(layer.feature.id);

  return res.data;
}

export {
  onHover,
  removeOnHover,
  checkForIntervalsValuesChange,
  getFeatureData,
};
