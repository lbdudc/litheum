const selectionViewControllers = {};

const viewControllerFiles = require.context(".", true, /\.js$/);

viewControllerFiles.keys().forEach((filename) => {
  Object.keys(viewControllerFiles(filename)).forEach((key) => {
    //Format key from './Filename.js' to 'Filename'
    let nameParts = filename.split("/");
    let relativeName = nameParts[nameParts.length - 1];
    let selectionViewKey = relativeName.replace(".js", "").toLowerCase();
    selectionViewControllers[selectionViewKey] =
      viewControllerFiles(filename)[key];
  });
});

export default {
  get: (name) => selectionViewControllers[name.toLowerCase()],
};
