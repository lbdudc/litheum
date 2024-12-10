import Plotly from "plotly.js-dist";
import i18n from "@/plugins/i18n";
import * as esLocale from "plotly.js-locales/es";
import * as glLocale from "plotly.js-locales/gl";
import * as glDictionary from "./gl-locale-dictionary";

Plotly.register(esLocale);

glLocale.dictionary = glDictionary;
Plotly.register(glLocale);

const ylabels = [
  0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750,
  800, 850, 900, 1000, 1050, 1100,
];
const ylabels2 = [0, 5, 10, 15, 20, 25, 30, 35, 40];

export async function showDemandGraphic(id, demand, fullScreen) {
  const monthLabels = Array.from({ length: 12 }, (_, index) =>
    i18n.t(`graphics.months.${index}`)
  ).map((el) => el.slice(0, 3));

  const trace1 = _createDemandTrace(
    monthLabels,
    demand.hhl_t,
    i18n.t("graphics.radiation.hhl_t"),
    "lightseagreen"
  );
  const trace2 = _createDemandTrace(
    monthLabels,
    demand.ihg_t,
    i18n.t("graphics.radiation.ihg_t"),
    "tomato"
  );
  const trace3 = _createDemandTrace(
    monthLabels,
    demand.dsg_t,
    i18n.t("graphics.radiation.dsg_t"),
    "darkorange"
  );
  const trace4 = _createDemandTrace(
    monthLabels,
    demand.hhl_v,
    i18n.t("graphics.radiation.hhl_v"),
    "gold"
  );
  const trace5 = _createDemandTrace(
    monthLabels,
    demand.heating_t,
    i18n.t("graphics.radiation.heating_t"),
    "silver"
  );
  const trace7 = _createDemandTrace(
    monthLabels,
    demand.heat_storage,
    i18n.t("graphics.radiation.heat_storage"),
    "lightgreen"
  );

  const data = [trace1, trace2, trace3, trace4, trace5, trace7];
  const layout = {
    title: i18n.t("graphics.demand.title"),
    hovermode: "closest",
    showlegend: fullScreen,
    legend: {
      x: 0.5,
      y: 1.15,
      orientation: "h",
      yanchor: "top",
      xanchor: "center",
    },
    yaxis: {
      tickformat: "(",
      dtick: 20,
      gridcolor: "rgba(245, 190, 109, 0.4)",
      tickcolor: "black",
    },
    xaxis: {
      tickcolor: "black",
      tickangle: -55,
    },
    barmode: "relative",
    autosize: true,
    height: !fullScreen ? 320 : "",
    margin: !fullScreen ? { t: 35, b: 35, l: 40, r: 35 } : {},
  };
  var config = {
    responsive: true,
    staticPlot: false,
    locale: i18n.locale.toLowerCase(),
    displayModeBar: fullScreen,
    modeBarButtons: [["toImage", "zoomIn2d", "zoomOut2d", "autoScale2d"]],
  };
  return await Plotly.newPlot(id, data, layout, config);
}

export async function showRadiationGraphic(
  id,
  radiation,
  fullScreen,
  currentMonth
) {
  const monthLabels = Array.from({ length: 12 }, (_, index) =>
    i18n.t(`graphics.months.${index}`)
  );
  const layout = {
    title: i18n.t("graphics.radiation.title"),
    showlegend: fullScreen,
    legend: {
      x: 0.5,
      y: 1.15,
      orientation: "h",
      yanchor: "top",
      xanchor: "center",
    },
    grid: {
      rows: 1,
      columns: fullScreen ? 12 : 1,
      subplots: [[]],
      pattern: "independent",
    },
    yaxis: {
      title: {
        text: i18n.t("graphics.radiation.yAxisLabel"),
      },
      range: [ylabels[0], ylabels[ylabels.length - 1]],
      fixedrange: true,
      nticks: ylabels.length,
      dtick: 50,
      zerolinecolor: "#EE9E00",
      gridcolor: "rgba(245, 190, 109, 0.4)",
      rangemode: "nonnegative",
      tickcolor: "black",
      linecolor: "rgba(245, 190, 109, 0.4)",
    },
    yaxis2: {
      title: { text: i18n.t("graphics.radiation.yAxis2Label") },
      range: [ylabels2[0], ylabels2[ylabels.length - 1]],
      fixedrange: true,
      anchor: !fullScreen ? "x" : "x13",
      overlaying: "y",
      zerolinecolor: "#66000000",
      side: "right",
      tickcolor: "black",
      tickmode: fullScreen ? "sync" : "linear",
      showgrid: false,
      linecolor: "rgba(245, 190, 109, 0.4)",
    },
    hovermode: "closest",
    height: !fullScreen ? 320 : "",
    margin: !fullScreen ? { t: 35, b: 50 } : {},
    plot_bgcolor: "white",
  };
  let data = [];
  const xTickvals = [0, 6, 12, 18, 23];
  const tickText = [0, 6, 12, 18, 24];
  const max = fullScreen ? 12 : 1;
  for (let j = 0; j < max; j++) {
    const subplotIndex = j + 2;
    const subplotId = `x${subplotIndex}y`;
    const monthToDisplay = fullScreen ? j : currentMonth;
    data.push(
      ..._createRadiationTraces(
        radiation.solar[monthToDisplay + 1],
        radiation.tin[monthToDisplay + 1],
        radiation.tout[monthToDisplay + 1],
        subplotIndex
      )
    );
    Object.defineProperty(layout, `xaxis${subplotIndex}`, {
      value: {
        tickvals: xTickvals,
        ticktext: tickText,
        zeroline: false,
        gridcolor: "rgba(245, 190, 109, 0.4)",
        tickcolor: "black",
        linecolor: "rgba(245, 190, 109, 0.4)",
        mirror: true,
        title: {
          text: `${i18n.t("graphics.radiation.xAxisLabel")} <br> ${
            monthLabels[monthToDisplay]
          }`,
          font: {
            family: "Courier New, monospace",
            size: 9,
            color: "black",
          },
        },
      },
      writable: true,
      enumerable: true,
      configurable: true,
    });
    layout.grid.subplots[0].push(subplotId);
  }
  var config = {
    responsive: true,
    staticPlot: false,
    pattern: "independent",
    displayModeBar: fullScreen,
    modeBarButtons: [["toImage", "zoomIn2d", "zoomOut2d", "autoScale2d"]],
  };
  return await Plotly.newPlot(id, data, layout, config);
}

function _createDemandTrace(months, values, hovertext, color, type = "bar") {
  return {
    name: hovertext,
    x: months,
    y: values,
    type: type,
    mode: "lines",
    textposition: "none",
    text: Array(months.length).fill(`${hovertext} wh/m²`),
    hoverinfo: "y+text",
    marker: {
      color: color,
      opacity: 0.7,
    },
  };
}

function _createRadiationTraces(solarRadiation, tin, tout, x) {
  const xaxis = `x${x}`;
  const dayHours = Array.from({ length: 25 }, (_, index) => index);
  const trace2 = {
    name: i18n.t("graphics.radiation.solar_radiation"),
    x: dayHours,
    y: solarRadiation,
    textposition: "none",
    legendgroup: i18n.t("graphics.radiation.solar_radiation"),
    hoverinfo: "y+text",
    text: Array(dayHours.length).fill(
      `W/m² ${i18n.t("graphics.radiation.solar_radiation")}`
    ),
    fill: "tozeroy",
    type: "scatter",
    mode: "none",
    showlegend: x == 2,
    xaxis: xaxis,
    fillcolor: "#EE9E00",
  };
  const trace3 = {
    name: i18n.t("graphics.radiation.t_in"),
    x: dayHours,
    y: tin,
    textposition: "none",
    hoverinfo: "y+text",
    legendgroup: i18n.t("graphics.radiation.t_in"),
    showlegend: x == 2,
    text: Array(dayHours.length).fill(
      `ºC ${i18n.t("graphics.radiation.t_in")}`
    ),
    type: "scatter",
    xaxis: xaxis,
    yaxis: "y2",
    marker: {
      color: "#4D77CB",
    },
  };
  const trace4 = {
    name: i18n.t("graphics.radiation.t_out"),
    x: dayHours,
    y: tout,
    textposition: "none",
    legendgroup: i18n.t("graphics.radiation.t_out"),
    showlegend: x == 2,
    hoverinfo: "y+text",
    text: Array(dayHours.length).fill(
      `ºC ${i18n.t("graphics.radiation.t_out")}`
    ),
    type: "scatter",
    xaxis: xaxis,
    yaxis: "y2",
    marker: {
      color: "black",
    },
  };
  return [trace2, trace3, trace4];
}
