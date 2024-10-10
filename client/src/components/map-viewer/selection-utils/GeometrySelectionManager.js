import SelectionViewControllerFactory from "./GeometrySelectionFactory";

let currentSelection = null;
let individualSelection = null;
let groupalSelection = null;

export function initSelectionControllers() {
  const individualConstructor = SelectionViewControllerFactory.get(
    "IndividualSelection"
  );
  individualSelection = new individualConstructor();

  const groupalConstructor =
    SelectionViewControllerFactory.get("GroupSelection");
  groupalSelection = new groupalConstructor();
}

export function getCurrentSelectionController() {
  return currentSelection;
}

/**
 *
 * @param {*} view 0 if individual, 1 if groupal
 */
export function setSelectionControllerByView(view, updateLayerStyleFunc) {
  if (view == 0) {
    currentSelection = individualSelection;
  } else {
    currentSelection = groupalSelection;
  }

  if (updateLayerStyleFunc) {
    currentSelection.resetStyles(updateLayerStyleFunc);
  }

  return currentSelection;
}

export function initSelectionManager(defaultView = 0) {
  initSelectionControllers();
  setSelectionControllerByView(defaultView);
  return currentSelection;
}
