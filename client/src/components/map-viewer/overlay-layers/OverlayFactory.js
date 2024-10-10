const overlays = {};

const overlayFiles = require.context(".", true, /\.js$/);

overlayFiles.keys().forEach((filename) => {
  Object.keys(overlayFiles(filename)).forEach((key) => {
    //Format key from './Filename.js' to 'Filename'
    let nameParts = filename.split("/");
    let relativeName = nameParts[nameParts.length - 1];
    let overlayKey = relativeName.replace(".js", "").toLowerCase();
    overlays[overlayKey] = overlayFiles(filename)[key];
  });
});

export default {
  get: (name) => overlays[name.toLowerCase()],
};
