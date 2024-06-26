/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
Format = function (editorUi, container) {
  this.editorUi = editorUi;
  this.container = container;
 
};

/**
 * Returns information about the current selection.
 */
Format.prototype.labelIndex = 0;

/**
 * Returns information about the current selection.
 */
Format.prototype.currentIndex = 0;

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.init = function () {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;

  this.update = mxUtils.bind(this, function (sender, evt) {
    this.clearSelectionState();
    this.refresh();
    //this.multisitetab();
  });

  graph.getSelectionModel().addListener(mxEvent.CHANGE, this.update);
  graph.addListener(mxEvent.EDITING_STARTED, this.update);
  graph.addListener(mxEvent.EDITING_STOPPED, this.update);
  graph.getModel().addListener(mxEvent.CHANGE, this.update);
  graph.addListener(
    mxEvent.ROOT,
    mxUtils.bind(this, function () {
      this.refresh();
      //this.multisitetab();
    })
  );

  this.refresh();
  // this.multisitetab();
};

/**
 * Returns information about the current selection.
 */
Format.prototype.clearSelectionState = function () {
  this.selectionState = null;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.getSelectionState = function () {
  if (this.selectionState == null) {
    this.selectionState = this.createSelectionState();
  }

  return this.selectionState;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.createSelectionState = function () {
  var cells = this.editorUi.editor.graph.getSelectionCells();
  var result = this.initSelectionState();

  for (var i = 0; i < cells.length; i++) {
    this.updateSelectionStateForCell(result, cells[i], cells);
  }

  return result;
};

    // Create a new object for "Unassigned"
    const unassignedLevel = {
      "key": "unassigned",
      "name": "Unassigned"
    };

    // Add the "Unassigned" object to the array
    arrayoflevelsObjects.push(unassignedLevel);
/**
 * Returns information about the current selection.
 */
Format.prototype.initSelectionState = function () {
  return {
    vertices: [],
    edges: [],
    x: null,
    y: null,
    width: null,
    height: null,
    style: {},
    containsImage: false,
    containsLabel: false,
    fill: true,
    glass: true,
    rounded: true,
    comic: true,
    autoSize: false,
    image: true,
    shadow: true,
  };
};

/**
 * Returns information about the current selection.
 */
Format.prototype.updateSelectionStateForCell = function (result, cell, cells) {
  var graph = this.editorUi.editor.graph;

  if (graph.getModel().isVertex(cell)) {
    result.vertices.push(cell);
    var geo = graph.getCellGeometry(cell);

    if (geo != null) {
      if (geo.width > 0) {
        if (result.width == null) {
          result.width = geo.width;
        } else if (result.width != geo.width) {
          result.width = "";
        }
      } else {
        result.containsLabel = true;
      }

      if (geo.height > 0) {
        if (result.height == null) {
          result.height = geo.height;
        } else if (result.height != geo.height) {
          result.height = "";
        }
      } else {
        result.containsLabel = true;
      }

      if (!geo.relative || geo.offset != null) {
        var x = geo.relative ? geo.offset.x : geo.x;
        var y = geo.relative ? geo.offset.y : geo.y;

        if (result.x == null) {
          result.x = x;
        } else if (result.x != x) {
          result.x = "";
        }

        if (result.y == null) {
          result.y = y;
        } else if (result.y != y) {
          result.y = "";
        }
      }
    }
  } else if (graph.getModel().isEdge(cell)) {
    result.edges.push(cell);
  }

  var state = graph.view.getState(cell);

  if (state != null) {
    result.autoSize = result.autoSize || this.isAutoSizeState(state);
    result.glass = result.glass && this.isGlassState(state);
    result.rounded = result.rounded && this.isRoundedState(state);
    result.comic = result.comic && this.isComicState(state);
    result.image = result.image && this.isImageState(state);
    result.shadow = result.shadow && this.isShadowState(state);
    result.fill = result.fill && this.isFillState(state);

    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
    result.containsImage = result.containsImage || shape == "image";

    for (var key in state.style) {
      var value = state.style[key];

      if (value != null) {
        if (result.style[key] == null) {
          result.style[key] = value;
        } else if (result.style[key] != value) {
          result.style[key] = "";
        }
      }
    }
  }
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isFillState = function (state) {
  return (
    state.view.graph.model.isVertex(state.cell) ||
    mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == "arrow" ||
    mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == "flexArrow"
  );
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isGlassState = function (state) {
  var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

  return (
    shape == "label" ||
    shape == "rectangle" ||
    shape == "internalStorage" ||
    shape == "ext" ||
    shape == "umlLifeline" ||
    shape == "swimlane" ||
    shape == "process"
  );
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isRoundedState = function (state) {
  var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

  return (
    shape == "label" ||
    shape == "rectangle" ||
    shape == "internalStorage" ||
    shape == "corner" ||
    shape == "parallelogram" ||
    shape == "swimlane" ||
    shape == "triangle" ||
    shape == "trapezoid" ||
    shape == "ext" ||
    shape == "step" ||
    shape == "tee" ||
    shape == "process" ||
    shape == "link" ||
    shape == "rhombus" ||
    shape == "offPageConnector" ||
    shape == "loopLimit" ||
    shape == "hexagon" ||
    shape == "manualInput" ||
    shape == "curlyBracket" ||
    shape == "singleArrow" ||
    shape == "doubleArrow" ||
    shape == "flexArrow" ||
    shape == "card" ||
    shape == "umlLifeline"
  );
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isComicState = function (state) {
  var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

  return (
    mxUtils.indexOf(
      [
        "label",
        "rectangle",
        "internalStorage",
        "corner",
        "parallelogram",
        "note",
        "collate",
        "swimlane",
        "triangle",
        "trapezoid",
        "ext",
        "step",
        "tee",
        "process",
        "link",
        "rhombus",
        "offPageConnector",
        "loopLimit",
        "hexagon",
        "manualInput",
        "singleArrow",
        "doubleArrow",
        "flexArrow",
        "card",
        "umlLifeline",
        "connector",
        "folder",
        "component",
        "sortShape",
        "cross",
        "umlFrame",
        "cube",
        "isoCube",
        "isoRectangle",
      ],
      shape
    ) >= 0
  );
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isAutoSizeState = function (state) {
  return mxUtils.getValue(state.style, mxConstants.STYLE_AUTOSIZE, null) == "1";
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isImageState = function (state) {
  var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

  return shape == "label" || shape == "image";
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isShadowState = function (state) {
  var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

  return shape != "image";
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.clear = function () {
  this.container.innerHTML = "";

  // Destroy existing panels
  if (this.panels != null) {
    for (var i = 0; i < this.panels.length; i++) {
      this.panels[i].destroy();
    }
  }

  this.panels = [];
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.refresh = function () {
  // Performance tweak: No refresh needed if not visible
  if (this.container.style.width == "0px") {
    return;
  }

  this.clear();
  var ui = this.editorUi;
  var graph = ui.editor.graph;

  var div = document.createElement("div");
  div.style.whiteSpace = "nowrap";
  div.style.color = "rgb(112, 112, 112)";
  div.style.textAlign = "left";
  div.style.cursor = "default";

  var label = document.createElement("div");

  label.style.borderBottom = "1px solid #c0c0c0";
  label.style.borderWidth = "1px";
  label.style.textAlign = "center";
  label.style.fontWeight = "bold";
  label.style.overflow = "hidden";
  label.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
  label.style.paddingTop = "8px";
  label.style.height = mxClient.IS_QUIRKS ? "34px" : "25px";
  label.style.width = "100%";
  label.className = "customebgcolor";

  this.container.appendChild(div);

  if (graph.isSelectionEmpty()) {
    //label.innerHTML = 'Floor Plan Settings <i class="far fa-question-circle" title="helpText"></i>';//edit

    //div.appendChild(label);

    this.panels.push(new DiagramFormatPanel(this, ui, div));
  } else if (graph.isEditing()) {
    mxUtils.write(label, mxResources.get("text"));
    div.appendChild(label);
    this.panels.push(new TextFormatPanel(this, ui, div));
  } else {
    var containsLabel = this.getSelectionState().containsLabel;
    var currentLabel = null;
    var currentPanel = null;

    var addClickHandler = mxUtils.bind(this, function (elt, panel, index) {
      var clickHandler = mxUtils.bind(this, function (evt) {
        if (currentLabel != elt) {
          if (containsLabel) {
            this.labelIndex = index;
          } else {
            this.currentIndex = index;
          }

          if (currentLabel != null) {
            currentLabel.style.backgroundColor = "#d7d7d7";
            //currentLabel.style.borderBottomWidth = '1px';
          }

          currentLabel = elt;
          currentLabel.style.backgroundColor = "";
          //currentLabel.style.borderBottomWidth = '0px';

          if (currentPanel != panel) {
            if (currentPanel != null) {
              currentPanel.style.display = "none";
            }

            currentPanel = panel;
            currentPanel.style.display = "";
          }
        }
      });

      mxEvent.addListener(elt, "click", clickHandler);

      if (index == (containsLabel ? this.labelIndex : this.currentIndex)) {
        // Invokes handler directly as a workaround for no click on DIV in KHTML.
        clickHandler();
      }
    });

    var idx = 0;

    label.style.backgroundColor = "#d7d7d7";
    //label.style.borderLeftWidth = '1px';
    //label.style.width = (containsLabel) ? '50%' : '33.3%';
    //label.style.width = (containsLabel) ? '50%' : '33.3%';
    label.style.textAlign = "center";
    var label2 = label.cloneNode(false);
    var label3 = label2.cloneNode(false);

    // Workaround for ignored background in IE
    label2.style.backgroundColor = "#d7d7d7";
    label2.style.padding = "8px 5px 0px 5px";
    label3.style.backgroundColor = "#d7d7d7";

    var labelLegend = document.createElement("div");

    labelLegend.style.borderBottom = "1px solid #c0c0c0";
    labelLegend.style.borderWidth = "1px";
    labelLegend.style.textAlign = "center";
    labelLegend.style.fontWeight = "bold";
    labelLegend.style.overflow = "hidden";
    labelLegend.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
    labelLegend.style.paddingTop = "8px";
    labelLegend.style.height = mxClient.IS_QUIRKS ? "34px" : "25px";
    labelLegend.style.width = "100%";
    labelLegend.className = "customebgcolor";

    // Style
    if (containsLabel) {
      label2.style.borderLeftWidth = "0px";
    } else {
      label.style.borderLeftWidth = "0px";
      label.className = " customebgcolor";
      label.innerHTML =
        "Booth Settings <i class=\"far fa-question-circle\" title=\"Set the Booth Number, Details, and Exhibitor Assignment here. Be sure to click 'Apply Booth Settings' to apply any changes in this section, and click 'Save' to publish these changes to the live floor plan. \"></i>";
      labelLegend.innerHTML =
        "Legend Label <i class=\"far fa-question-circle\" title=\"Use this setting to \"group\" or 'categorize' booths together on the interactive floor plan. Users will be able to view and identify booths tagged with these labels. Note you also have the option to override the booth color settings above with a legend label color.\n Be sure to click 'Apply Legend Label' to apply any changes in this section, and click 'Save' to publish these changes to the live floor plan.\"></i>";

      var cell = graph.getSelectionCells();
      //  if(cell.length == 1){
      div.appendChild(label);
      //  }
      var stylePanel = div.cloneNode(false);

      stylePanel.style.display = "none";
      this.panels.push(new StyleFormatPanel(this, ui, stylePanel));

      //if (!ss.containsImage && (ss.style.shape == 'rectangle' || ss.style.shape == 'ellipse'))

      this.container.appendChild(stylePanel);

      addClickHandler(label, stylePanel, idx++);
      addClickHandler(labelLegend, stylePanel, idx++);
    }
  }
};

/**
 * Base class for format panels.
 */
BaseFormatPanel = function (format, editorUi, container) {
  this.format = format;
  this.editorUi = editorUi;
  this.container = container;
  this.listeners = [];
};

/**
 * Adds the given color option.
 */
BaseFormatPanel.prototype.getSelectionState = function () {
  var graph = this.editorUi.editor.graph;
  var cells = graph.getSelectionCells();
  var shape = null;

  for (var i = 0; i < cells.length; i++) {
    var state = graph.view.getState(cells[i]);

    if (state != null) {
      var tmp = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

      if (tmp != null) {
        if (shape == null) {
          shape = tmp;
        } else if (shape != tmp) {
          return null;
        }
      }
    }
  }

  return shape;
};

/**
 * Install input handler.
 */
BaseFormatPanel.prototype.installInputHandler = function (
  input,
  key,
  defaultValue,
  min,
  max,
  unit,
  textEditFallback,
  isFloat
) {
  unit = unit != null ? unit : "";
  isFloat = isFloat != null ? isFloat : false;

  var ui = this.editorUi;
  var graph = ui.editor.graph;

  min = min != null ? min : 1;
  max = max != null ? max : 999;

  var selState = null;
  var updating = false;

  var update = mxUtils.bind(this, function (evt) {
    var value = isFloat ? parseFloat(input.value) : parseInt(input.value);

    // Special case: angle mod 360
    if (!isNaN(value) && key == mxConstants.STYLE_ROTATION) {
      // Workaround for decimal rounding errors in floats is to
      // use integer and round all numbers to two decimal point
      value = mxUtils.mod(Math.round(value * 100), 36000) / 100;
    }

    value = Math.min(max, Math.max(min, isNaN(value) ? defaultValue : value));

    if (graph.cellEditor.isContentEditing() && textEditFallback) {
      if (!updating) {
        updating = true;

        if (selState != null) {
          graph.cellEditor.restoreSelection(selState);
          selState = null;
        }

        textEditFallback(value);
        input.value = value + unit;

        // Restore focus and selection in input
        updating = false;
      }
    } else if (
      value !=
      mxUtils.getValue(this.format.getSelectionState().style, key, defaultValue)
    ) {
      if (graph.isEditing()) {
        graph.stopEditing(true);
      }

      graph.getModel().beginUpdate();
      try {
        graph.setCellStyles(key, value, graph.getSelectionCells());

        // Handles special case for fontSize where HTML labels are parsed and updated
        if (key == mxConstants.STYLE_FONTSIZE) {
          var cells = graph.getSelectionCells();

          for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];

            // Changes font tags inside HTML labels
            if (graph.isHtmlLabel(cell)) {
              var div = document.createElement("div");
              div.innerHTML = graph.convertValueToString(cell);
              var elts = div.getElementsByTagName("font");

              for (var j = 0; j < elts.length; j++) {
                elts[j].removeAttribute("size");
                elts[j].style.fontSize = value + "px";
              }

              graph.cellLabelChanged(cell, div.innerHTML);
            }
          }
        }
      } finally {
        graph.getModel().endUpdate();
      }

      ui.fireEvent(
        new mxEventObject(
          "styleChanged",
          "keys",
          [key],
          "values",
          [value],
          "cells",
          graph.getSelectionCells()
        )
      );
    }

    input.value = value + unit;
    mxEvent.consume(evt);
  });

  if (textEditFallback && graph.cellEditor.isContentEditing()) {
    // KNOWN: Arrow up/down clear selection text in quirks/IE 8
    // Text size via arrow button limits to 16 in IE11. Why?
    mxEvent.addListener(input, "mousedown", function () {
      selState = graph.cellEditor.saveSelection();
    });

    mxEvent.addListener(input, "touchstart", function () {
      selState = graph.cellEditor.saveSelection();
    });
  }

  mxEvent.addListener(input, "change", update);
  mxEvent.addListener(input, "blur", update);

  return update;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createPanel = function () {
  var div = document.createElement("div");
  div.style.padding = "0px 0px 12px 18px";
  div.style.borderBottom = "1px solid #c0c0c0";

  return div;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createTitle = function (title) {
  var div = document.createElement("div");
  div.style.padding = "0px 0px 6px 0px";
  div.style.whiteSpace = "nowrap";
  div.style.overflow = "hidden";
  div.style.width = "200px";
  div.style.fontWeight = "bold";
  mxUtils.write(div, title);

  return div;
};

/**
 *
 */
BaseFormatPanel.prototype.createStepper = function (
  input,
  update,
  step,
  height,
  disableFocus,
  defaultValue
) {
  step = step != null ? step : 1;
  height = height != null ? height : 8;

  if (mxClient.IS_QUIRKS) {
    height = height - 2;
  } else if (mxClient.IS_MT || document.documentMode >= 8) {
    height = height + 1;
  }

  var stepper = document.createElement("div");
  mxUtils.setPrefixedStyle(stepper.style, "borderRadius", "3px");
  stepper.style.border = "1px solid rgb(192, 192, 192)";
  stepper.style.position = "absolute";

  var up = document.createElement("div");
  up.style.borderBottom = "1px solid rgb(192, 192, 192)";
  up.style.position = "relative";
  up.style.height = height + "px";
  up.style.width = "10px";
  up.className = "geBtnUp";
  stepper.appendChild(up);

  var down = up.cloneNode(false);
  down.style.border = "none";
  down.style.height = height + "px";
  down.className = "geBtnDown";
  stepper.appendChild(down);

  mxEvent.addListener(down, "click", function (evt) {
    if (input.value == "") {
      input.value = defaultValue || "2";
    }

    var val = parseInt(input.value);

    if (!isNaN(val)) {
      input.value = val - step;

      if (update != null) {
        update(evt);
      }
    }

    mxEvent.consume(evt);
  });

  mxEvent.addListener(up, "click", function (evt) {
    if (input.value == "") {
      input.value = defaultValue || "0";
    }

    var val = parseInt(input.value);

    if (!isNaN(val)) {
      input.value = val + step;

      if (update != null) {
        update(evt);
      }
    }

    mxEvent.consume(evt);
  });

  // Disables transfer of focus to DIV but also :active CSS
  // so it's only used for fontSize where the focus should
  // stay on the selected text, but not for any other input.
  if (disableFocus) {
    var currentSelection = null;

    mxEvent.addGestureListeners(
      stepper,
      function (evt) {
        // Workaround for lost current selection in page because of focus in IE
        if (mxClient.IS_QUIRKS || document.documentMode == 8) {
          currentSelection = document.selection.createRange();
        }

        mxEvent.consume(evt);
      },
      null,
      function (evt) {
        // Workaround for lost current selection in page because of focus in IE
        if (currentSelection != null) {
          try {
            currentSelection.select();
          } catch (e) {
            // ignore
          }

          currentSelection = null;
          mxEvent.consume(evt);
        }
      }
    );
  }

  return stepper;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createOption = function (
  label,
  isCheckedFn,
  setCheckedFn,
  listener
) {
  var div = document.createElement("div");
  div.style.padding = "6px 0px 1px 0px";
  div.style.whiteSpace = "nowrap";
  div.style.overflow = "hidden";
  div.style.width = "69px";
  div.style.height = mxClient.IS_QUIRKS ? "27px" : "18px";

  var cb = document.createElement("input");
  cb.setAttribute("type", "checkbox");

  cb.style.margin = "0px 6px 0px 0px";
  div.appendChild(cb);

  var span = document.createElement("span");
  mxUtils.write(span, label);
  div.appendChild(span);

  var applying = false;
  var value = isCheckedFn();

  var apply = function (newValue) {
    if (!applying) {
      applying = true;

      if (newValue) {
        cb.setAttribute("checked", "checked");
        cb.defaultChecked = true;

        cb.checked = true;
      } else {
        cb.removeAttribute("checked");
        cb.defaultChecked = false;

        cb.checked = false;
      }

      if (value != newValue) {
        value = newValue;

        // Checks if the color value needs to be updated in the model
        if (isCheckedFn() != value) {
          setCheckedFn(value);
        }
      }

      applying = false;
    }
  };

  mxEvent.addListener(div, "click", function (evt) {
    // Toggles checkbox state for click on label
    var source = mxEvent.getSource(evt);

    if (source == div || source == span) {
      cb.checked = !cb.checked;
    }

    apply(cb.checked);
  });

  apply(value);

  if (listener != null) {
    listener.install(apply);
    this.listeners.push(listener);
  }

  return div;
};

/**
 * The string 'null' means use null in values.
 */
BaseFormatPanel.prototype.createCellOption = function (
  label,
  key,
  defaultValue,
  enabledValue,
  disabledValue,
  fn,
  action,
  stopEditing
) {
  enabledValue =
    enabledValue != null ? (enabledValue == "null" ? null : enabledValue) : "1";
  disabledValue =
    disabledValue != null
      ? disabledValue == "null"
        ? null
        : disabledValue
      : "0";

  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;

  return this.createOption(
    label,
    function () {
      // Seems to be null sometimes, not sure why...
      var state = graph.view.getState(graph.getSelectionCell());

      if (state != null) {
        return (
          mxUtils.getValue(state.style, key, defaultValue) != disabledValue
        );
      }

      return null;
    },
    function (checked) {
      if (stopEditing) {
        graph.stopEditing();
      }

      if (action != null) {
        action.funct();
      } else {
        graph.getModel().beginUpdate();
        try {
          var value = checked ? enabledValue : disabledValue;
          graph.setCellStyles(key, value, graph.getSelectionCells());

          if (fn != null) {
            fn(graph.getSelectionCells(), value);
          }

          ui.fireEvent(
            new mxEventObject(
              "styleChanged",
              "keys",
              [key],
              "values",
              [value],
              "cells",
              graph.getSelectionCells()
            )
          );
        } finally {
          graph.getModel().endUpdate();
        }
      }
    },
    {
      install: function (apply) {
        this.listener = function () {
          // Seems to be null sometimes, not sure why...
          var state = graph.view.getState(graph.getSelectionCell());

          if (state != null) {
            apply(
              mxUtils.getValue(state.style, key, defaultValue) != disabledValue
            );
          }
        };

        graph.getModel().addListener(mxEvent.CHANGE, this.listener);
      },
      destroy: function () {
        graph.getModel().removeListener(this.listener);
      },
    }
  );
};

/**
 * Adds the given color option.
 */
BaseFormatPanel.prototype.createColorOption = function (
  label,
  getColorFn,
  setColorFn,
  defaultColor,
  listener,
  callbackFn,
  hideCheckbox
) {
  var div = document.createElement("div");
  div.style.padding = "6px 0px 1px 0px";
  div.style.whiteSpace = "nowrap";
  div.style.overflow = "hidden";
  div.style.width = "69px";
  div.style.height = mxClient.IS_QUIRKS ? "27px" : "18px";

  var cb = document.createElement("input");
  cb.setAttribute("type", "checkbox");
  cb.style.margin = "0px 6px 0px 0px";

  if (!hideCheckbox) {
    div.appendChild(cb);
  }

  var span = document.createElement("span");
  mxUtils.write(span, label);
  div.appendChild(span);

  var applying = false;
  var value = getColorFn();

  var btn = null;

  var apply = function (color, disableUpdate) {
    if (!applying) {
      applying = true;
      // console.log(color);
      btn.innerHTML =
        '<div style="width:' +
        (mxClient.IS_QUIRKS ? "30" : "36") +
        "px;height:12px;margin:3px;border:1px solid black;background-color:" +
        (color != null && color != mxConstants.NONE ? color : defaultColor) +
        ';"></div>';

      //  console.log(btn.innerHTML);

      // Fine-tuning in Firefox, quirks mode and IE8 standards
      if (mxClient.IS_MT || mxClient.IS_QUIRKS || document.documentMode == 8) {
        btn.firstChild.style.margin = "0px";
      }

      if (color != null && color != mxConstants.NONE) {
        cb.setAttribute("checked", "checked");
        cb.style.display = "none";
        cb.defaultChecked = true;
        cb.checked = true;
      } else {
        cb.setAttribute("checked", "checked");
        cb.style.display = "none";

        cb.defaultChecked = true;
        cb.checked = true;
      }

      btn.style.display = cb.checked || hideCheckbox ? "" : "none";

      if (callbackFn != null) {
        callbackFn(color);
      }

      if (!disableUpdate && (hideCheckbox || value != color)) {
        value = color;

        // Checks if the color value needs to be updated in the model
        if (hideCheckbox || getColorFn() != value) {
          setColorFn(value);
        }
      }

      applying = false;
    }
  };

  //	btn = mxUtils.button('', mxUtils.bind(this, function(evt)
  //	{
  //                jQuery("#colorpicker_"+label).val(value);
  //                //jQuery("#colorpicker_"+label).spectrum("set", value);
  //                jQuery("#colorpicker_"+label).click();
  //                //jQuery("#colorpicker_"+label).next().click();
  //                mxEvent.consume(evt);
  //	}));

  btn = mxUtils.button(
    "",
    mxUtils.bind(this, function (evt) {
      this.editorUi.pickColor(value, apply);
      applybutton;
      mxEvent.consume(evt);
    })
  );

  var colorpicker = document.createElement("input");
  colorpicker.id = "colorpicker_" + label;
  colorpicker.type = "color";
  //colorpicker.className = 'customepickcolor';
  colorpicker.style.display = "none";

  //        jQuery(colorpicker).change(function(){
  //
  //                console.log("valuechanged");
  //                var selectedcolor = jQuery(this).val();
  //                apply(selectedcolor);
  //                jQuery('.select2').select2();
  //        });

  //        mxEvent.addListener(colorpicker, 'change', function(evt)
  //	{
  //		console.log("valuechanged");
  //
  //                var selectedcolor = jQuery(this).val();
  //                apply(selectedcolor);
  //                jQuery('.select2').select2();
  //                mxEvent.consume(evt);
  //	});

  //div.appendChild(colorpicker);
  btn.style.position = "absolute";
  btn.id = label;
  btn.style.marginTop = "-4px";
  btn.style.right = mxClient.IS_QUIRKS ? "0px" : "56px"; //edit '0px' : '20px';
  btn.style.height = "22px";
  btn.className = "geColorBtn";

  btn.style.display = cb.checked || hideCheckbox ? "" : "none";

  div.appendChild(btn);

  //	mxEvent.addListener(div, 'click', function(evt)
  //	{
  //		var source = mxEvent.getSource(evt);
  //
  //		if (source == cb || source.nodeName != 'INPUT')
  //		{
  //			// Toggles checkbox state for click on label
  //			if (source != cb)
  //			{
  //				cb.checked = !cb.checked;
  //			}
  //
  //			// Overrides default value with current value to make it easier
  //			// to restore previous value if the checkbox is clicked twice
  //			if (!cb.checked && value != null && value != mxConstants.NONE &&
  //				defaultColor != mxConstants.NONE)
  //			{
  //				defaultColor = value;
  //			}
  //
  //			apply((cb.checked) ? defaultColor : mxConstants.NONE);
  //		}
  //	});

  apply(value, true);

  if (listener != null) {
    listener.install(apply);
    this.listeners.push(listener);
  }

  return div;
};

/**
 *
 */
BaseFormatPanel.prototype.createCellColorOption = function (
  label,
  colorKey,
  defaultColor,
  callbackFn,
  setStyleFn
) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;

  return this.createColorOption(
    label,
    function () {
      // Seems to be null sometimes, not sure why...
      var state = graph.view.getState(graph.getSelectionCell());

      if (state != null) {
        return mxUtils.getValue(state.style, colorKey, null);
      }

      return null;
    },
    function (color) {
      graph.getModel().beginUpdate();
      try {
        if (setStyleFn != null) {
          setStyleFn(color);
        }
        var cells = graph.getSelectionCells();

        jQuery.each(cells, function (cellindex, celldata) {
          var boothOwner = celldata.getAttribute("boothOwner", "");
          var legendlabels = celldata.getAttribute("legendlabels", "");
          var legendlabelscolorUn = celldata.getAttribute(
            "legendlabelscolorUn",
            ""
          );
          
          var occcolor = celldata.getAttribute("occ", "");
          var unoccolor = celldata.getAttribute("uno", "");

          var legendlabelscolorOcc = celldata.getAttribute(
            "legendlabelscolorOcc",
            ""
          );

          var legendlabelscolorOcc = celldata.getAttribute(
            "legendlabelscolorOcc",
            ""
          );
          graph.setCellStyles(colorKey, color, celldata);

          if (boothOwner != "none" && boothOwner != "") {
            if (legendlabels != "none" && legendlabels != "") {
              // graph.setCellStyles("fillColor", legendlabelscolorOcc, celldata);
            } else {
              if (colorKey == "occ") {
                graph.setCellStyles("fillColor", color, celldata);
              } else {
                // graph.setCellStyles("fillColor", color, celldata);
              }
            }
          } else {
  
            if (legendlabels != "none" && legendlabels != "") {
              graph.setCellStyles("fillColor", legendlabelscolorUn, celldata);
            } else {
              // graph.setCellStyles("fillColor", color, celldata);
              if (colorKey == "occ" && (boothOwner != "none" && boothOwner != "")) {
               
                 graph.setCellStyles("fillColor", color, celldata);
              }else if (colorKey == "uno") {
   
                graph.setCellStyles("fillColor", color, celldata);
              } else {
            
                // graph.setCellStyles("fillColor", color, celldata);
              }
            }
          }

          //                            var cellStyle = celldata.style;
          //
          //                            var tokens = (cellStyle != null) ? cellStyle.split(';') : [];
          //                            jQuery.each(tokens,function(index,value){
          //
          //
          //                                    var getboothname = (value != null) ? value.split('=') : [];
          //                                    if(getboothname[0]=="fillColor"){
          //
          //                                        if ((colorKey == 'occ' && exist) || (colorKey == 'uno' && !exist))
          //                                        {
          //                                           // console.log(color)
          //                                            celldata.style = cellStyle.replace(getboothname[0]+'='+getboothname[1], "fillColor="+color);
          //                                        }
          //
          //
          //
          //
          //                                    }
          //                            });

          ui.fireEvent(
            new mxEventObject(
              "styleChanged",
              "keys",
              [colorKey],
              "values",
              [color],
              "cells",
              celldata
            )
          );
        });
        //console.log("select2");
        jQuery(".select2").select2();
      } finally {
        graph.getModel().endUpdate();
      }
    },
    defaultColor || mxConstants.NONE,
    {
      install: function (apply) {
        this.listener = function () {
          // Seems to be null sometimes, not sure why...
          var state = graph.view.getState(graph.getSelectionCell());

          if (state != null) {
            apply(mxUtils.getValue(state.style, colorKey, null));
          }
        };

        graph.getModel().addListener(mxEvent.CHANGE, this.listener);
      },
      destroy: function () {
        graph.getModel().removeListener(this.listener);
      },
    },
    callbackFn
  );
};

/**
 *
 */
BaseFormatPanel.prototype.addArrow = function (elt, height) {
  height = height != null ? height : 10;

  var arrow = document.createElement("div");
  arrow.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
  arrow.style.padding = "6px";
  arrow.style.paddingRight = "4px";

  var m = 10 - height;

  if (m == 2) {
    arrow.style.paddingTop = 6 + "px";
  } else if (m > 0) {
    arrow.style.paddingTop = 6 - m + "px";
  } else {
    arrow.style.marginTop = "-2px";
  }

  arrow.style.height = height + "px";
  arrow.style.borderLeft = "1px solid #a0a0a0";
  arrow.innerHTML =
    '<img border="0" src="' +
    (mxClient.IS_SVG
      ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHBJREFUeNpidHB2ZyAGsACxDRBPIKCuA6TwCBB/h2rABu4A8SYmKCcXiP/iUFgAxL9gCi8A8SwsirZCMQMTkmANEH9E4v+CmsaArvAdyNFI/FlQ92EoBIE+qCRIUz168DBgsU4OqhinQpgHMABAgAEALY4XLIsJ20oAAAAASUVORK5CYII="
      : IMAGE_PATH + "/dropdown.png") +
    '" style="margin-bottom:4px;">';
  mxUtils.setOpacity(arrow, 70);

  var symbol = elt.getElementsByTagName("div")[0];

  if (symbol != null) {
    symbol.style.paddingRight = "6px";
    symbol.style.marginLeft = "4px";
    symbol.style.marginTop = "-1px";
    symbol.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
    mxUtils.setOpacity(symbol, 60);
  }

  mxUtils.setOpacity(elt, 100);
  elt.style.border = "1px solid #a0a0a0";
  elt.style.backgroundColor = "white";
  elt.style.backgroundImage = "none";
  elt.style.width = "auto";
  elt.className += " geColorBtn";
  mxUtils.setPrefixedStyle(elt.style, "borderRadius", "3px");

  elt.appendChild(arrow);

  return symbol;
};

/**
 *
 */
BaseFormatPanel.prototype.addUnitInput = function (
  container,
  unit,
  right,
  width,
  update,
  step,
  marginTop,
  disableFocus
) {
  marginTop = marginTop != null ? marginTop : 0;

  var input = document.createElement("input");
  input.style.position = "absolute";
  input.style.textAlign = "right";
  input.style.marginTop = "-2px";
  input.style.right = right + 12 + "px";
  input.style.width = width + "px";
  container.appendChild(input);

  var stepper = this.createStepper(input, update, step, null, disableFocus);
  stepper.style.marginTop = marginTop - 2 + "px";
  stepper.style.right = right + "px";
  container.appendChild(stepper);

  return input;
};

/**
 *
 */
BaseFormatPanel.prototype.createRelativeOption = function (
  label,
  key,
  width,
  handler,
  init
) {
  width = width != null ? width : 44;

  var graph = this.editorUi.editor.graph;
  var div = this.createPanel();
  div.style.paddingTop = "10px";
  div.style.paddingBottom = "10px";
  mxUtils.write(div, label);
  div.style.fontWeight = "bold";

  function update(evt) {
    if (handler != null) {
      handler(input);
    } else {
      var value = parseInt(input.value);
      value = Math.min(100, Math.max(0, isNaN(value) ? 100 : value));
      var state = graph.view.getState(graph.getSelectionCell());

      if (state != null && value != mxUtils.getValue(state.style, key, 100)) {
        // Removes entry in style (assumes 100 is default for relative values)
        if (value == 100) {
          value = null;
        }

        graph.setCellStyles(key, value, graph.getSelectionCells());
      }

      input.value = (value != null ? value : "100") + " %";
    }

    mxEvent.consume(evt);
  }

  var input = this.addUnitInput(
    div,
    "%",
    20,
    width,
    update,
    10,
    -15,
    handler != null
  );

  if (key != null) {
    var listener = mxUtils.bind(this, function (sender, evt, force) {
      if (force || input != document.activeElement) {
        var ss = this.format.getSelectionState();
        var tmp = parseInt(mxUtils.getValue(ss.style, key, 100));
        input.value = isNaN(tmp) ? "" : tmp + " %";
      }
    });

    mxEvent.addListener(input, "keydown", function (e) {
      if (e.keyCode == 13) {
        graph.container.focus();
        mxEvent.consume(e);
      } else if (e.keyCode == 27) {
        listener(null, null, true);
        graph.container.focus();
        mxEvent.consume(e);
      }
    });

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });
    listener();
  }

  mxEvent.addListener(input, "blur", update);
  mxEvent.addListener(input, "change", update);

  if (init != null) {
    init(input);
  }

  return div;
};

/**
 *
 */
BaseFormatPanel.prototype.addLabel = function (div, title, right, width) {
  width = width != null ? width : 61;

  var label = document.createElement("div");
  mxUtils.write(label, title);
  label.style.position = "absolute";
  label.style.right = right + "px";
  label.style.width = width + "px";
  label.style.marginTop = "6px";
  label.style.textAlign = "center";
  div.appendChild(label);
};

/**
 *
 */
BaseFormatPanel.prototype.addKeyHandler = function (input, listener) {
  mxEvent.addListener(
    input,
    "keydown",
    mxUtils.bind(this, function (e) {
      if (e.keyCode == 13) {
        this.editorUi.editor.graph.container.focus();
        mxEvent.consume(e);
      } else if (e.keyCode == 27) {
        if (listener != null) {
          listener(null, null, true);
        }

        this.editorUi.editor.graph.container.focus();
        mxEvent.consume(e);
      }
    })
  );
};

/**
 *
 */
BaseFormatPanel.prototype.styleButtons = function (elts) {
  for (var i = 0; i < elts.length; i++) {
    mxUtils.setPrefixedStyle(elts[i].style, "borderRadius", "3px");
    mxUtils.setOpacity(elts[i], 100);
    elts[i].style.border = "1px solid #a0a0a0";
    elts[i].style.padding = "4px";
    elts[i].style.paddingTop = "3px";
    elts[i].style.paddingRight = "1px";
    elts[i].style.margin = "1px";
    elts[i].style.width = "24px";
    elts[i].style.height = "20px";
    elts[i].className += " geColorBtn";
  }
};

/**
 * Adds the label menu items to the given menu and parent.
 */
BaseFormatPanel.prototype.destroy = function () {
  if (this.listeners != null) {
    for (var i = 0; i < this.listeners.length; i++) {
      this.listeners[i].destroy();
    }

    this.listeners = null;
  }
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel = function (format, editorUi, container) {
  BaseFormatPanel.call(this, format, editorUi, container);
  this.init();
};

mxUtils.extend(ArrangePanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.init = function () {
  var graph = this.editorUi.editor.graph;
  var ss = this.format.getSelectionState();

  this.container.appendChild(this.addLayerOps(this.createPanel()));
  // Special case that adds two panels
  this.addGeometry(this.container);
  this.addEdgeGeometry(this.container);

  if (!ss.containsLabel || ss.edges.length == 0) {
    this.container.appendChild(this.addAngle(this.createPanel()));
  }

  if (!ss.containsLabel && ss.edges.length == 0) {
    this.container.appendChild(this.addFlip(this.createPanel()));
  }

  if (ss.vertices.length > 1) {
    this.container.appendChild(this.addAlign(this.createPanel()));
    this.container.appendChild(this.addDistribute(this.createPanel()));
  }

  this.container.appendChild(this.addGroupOps(this.createPanel()));
};

/**
 *
 */
ArrangePanel.prototype.addLayerOps = function (div) {
  var ui = this.editorUi;

  var btn = mxUtils.button(mxResources.get("toFront"), function (evt) {
    ui.actions.get("toFront").funct();
  });

  btn.setAttribute(
    "title",
    mxResources.get("toFront") +
      " (" +
      this.editorUi.actions.get("toFront").shortcut +
      ")"
  );
  btn.style.width = "100px";
  btn.style.marginRight = "2px";
  div.appendChild(btn);

  var btn = mxUtils.button(mxResources.get("toBack"), function (evt) {
    ui.actions.get("toBack").funct();
  });

  btn.setAttribute(
    "title",
    mxResources.get("toBack") +
      " (" +
      this.editorUi.actions.get("toBack").shortcut +
      ")"
  );
  btn.style.width = "100px";
  div.appendChild(btn);

  return div;
};

/**
 *
 */
ArrangePanel.prototype.addGroupOps = function (div) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var cell = graph.getSelectionCell();
  var ss = this.format.getSelectionState();
  var count = 0;

  div.style.paddingTop = "8px";
  div.style.paddingBottom = "6px";

  if (graph.getSelectionCount() > 1) {
    btn = mxUtils.button(mxResources.get("group"), function (evt) {
      ui.actions.get("group").funct();
    });

    btn.setAttribute(
      "title",
      mxResources.get("group") +
        " (" +
        this.editorUi.actions.get("group").shortcut +
        ")"
    );
    btn.style.width = "202px";
    btn.style.marginBottom = "2px";
    div.appendChild(btn);
    count++;
  } else if (
    graph.getSelectionCount() == 1 &&
    !graph.getModel().isEdge(cell) &&
    !graph.isSwimlane(cell) &&
    graph.getModel().getChildCount(cell) > 0
  ) {
    btn = mxUtils.button(mxResources.get("ungroup"), function (evt) {
      ui.actions.get("ungroup").funct();
    });

    btn.setAttribute(
      "title",
      mxResources.get("ungroup") +
        " (" +
        this.editorUi.actions.get("ungroup").shortcut +
        ")"
    );
    btn.style.width = "202px";
    btn.style.marginBottom = "2px";
    div.appendChild(btn);
    count++;
  }

  if (
    graph.getSelectionCount() == 1 &&
    graph.getModel().isVertex(cell) &&
    graph.getModel().isVertex(graph.getModel().getParent(cell))
  ) {
    if (count > 0) {
      mxUtils.br(div);
    }

    btn = mxUtils.button(mxResources.get("removeFromGroup"), function (evt) {
      ui.actions.get("removeFromGroup").funct();
    });

    btn.setAttribute("title", mxResources.get("removeFromGroup"));
    btn.style.width = "202px";
    btn.style.marginBottom = "2px";
    div.appendChild(btn);
    count++;
  } else if (graph.getSelectionCount() > 0) {
    if (count > 0) {
      mxUtils.br(div);
    }

    btn = mxUtils.button(
      mxResources.get("clearWaypoints"),
      mxUtils.bind(this, function (evt) {
        this.editorUi.actions.get("clearWaypoints").funct();
      })
    );

    btn.setAttribute(
      "title",
      mxResources.get("clearWaypoints") +
        " (" +
        this.editorUi.actions.get("clearWaypoints").shortcut +
        ")"
    );
    btn.style.width = "202px";
    btn.style.marginBottom = "2px";
    div.appendChild(btn);

    count++;
  }

  if (graph.getSelectionCount() == 1) {
    if (count > 0) {
      mxUtils.br(div);
    }

    btn = mxUtils.button(
      mxResources.get("editData"),
      mxUtils.bind(this, function (evt) {
        this.editorUi.actions.get("editData").funct();
      })
    );

    btn.setAttribute(
      "title",
      mxResources.get("editData") +
        " (" +
        this.editorUi.actions.get("editData").shortcut +
        ")"
    );
    btn.style.width = "100px";
    btn.style.marginBottom = "2px";
    div.appendChild(btn);
    count++;

    btn = mxUtils.button(
      mxResources.get("editLink"),
      mxUtils.bind(this, function (evt) {
        this.editorUi.actions.get("editLink").funct();
      })
    );

    btn.setAttribute("title", mxResources.get("editLink"));
    btn.style.width = "100px";
    btn.style.marginLeft = "2px";
    btn.style.marginBottom = "2px";
    div.appendChild(btn);
    count++;
  }

  if (count == 0) {
    div.style.display = "none";
  }

  return div;
};

/**
 *
 */
ArrangePanel.prototype.addAlign = function (div) {
  var graph = this.editorUi.editor.graph;
  div.style.paddingTop = "6px";
  div.style.paddingBottom = "12px";
  div.appendChild(this.createTitle(mxResources.get("align")));

  var stylePanel = document.createElement("div");
  stylePanel.style.position = "relative";
  stylePanel.style.paddingLeft = "0px";
  stylePanel.style.borderWidth = "0px";
  stylePanel.className = "geToolbarContainer";

  if (mxClient.IS_QUIRKS) {
    div.style.height = "60px";
  }

  var left = this.editorUi.toolbar.addButton(
    "geSprite-alignleft",
    mxResources.get("left"),
    function () {
      graph.alignCells(mxConstants.ALIGN_LEFT);
    },
    stylePanel
  );
  var center = this.editorUi.toolbar.addButton(
    "geSprite-aligncenter",
    mxResources.get("center"),
    function () {
      graph.alignCells(mxConstants.ALIGN_CENTER);
    },
    stylePanel
  );
  var right = this.editorUi.toolbar.addButton(
    "geSprite-alignright",
    mxResources.get("right"),
    function () {
      graph.alignCells(mxConstants.ALIGN_RIGHT);
    },
    stylePanel
  );

  var top = this.editorUi.toolbar.addButton(
    "geSprite-aligntop",
    mxResources.get("top"),
    function () {
      graph.alignCells(mxConstants.ALIGN_TOP);
    },
    stylePanel
  );
  var middle = this.editorUi.toolbar.addButton(
    "geSprite-alignmiddle",
    mxResources.get("middle"),
    function () {
      graph.alignCells(mxConstants.ALIGN_MIDDLE);
    },
    stylePanel
  );
  var bottom = this.editorUi.toolbar.addButton(
    "geSprite-alignbottom",
    mxResources.get("bottom"),
    function () {
      graph.alignCells(mxConstants.ALIGN_BOTTOM);
    },
    stylePanel
  );

  this.styleButtons([left, center, right, top, middle, bottom]);
  right.style.marginRight = "6px";
  div.appendChild(stylePanel);

  return div;
};

/**
 *
 */
ArrangePanel.prototype.addFlip = function (div) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;
  div.style.paddingTop = "6px";
  div.style.paddingBottom = "10px";

  var span = document.createElement("div");
  span.style.marginTop = "2px";
  span.style.marginBottom = "8px";
  span.style.fontWeight = "bold";
  mxUtils.write(span, mxResources.get("flip"));
  div.appendChild(span);

  var btn = mxUtils.button(mxResources.get("horizontal"), function (evt) {
    graph.toggleCellStyles(mxConstants.STYLE_FLIPH, false);
  });

  btn.setAttribute("title", mxResources.get("horizontal"));
  btn.style.width = "100px";
  btn.style.marginRight = "2px";
  div.appendChild(btn);

  var btn = mxUtils.button(mxResources.get("vertical"), function (evt) {
    graph.toggleCellStyles(mxConstants.STYLE_FLIPV, false);
  });

  btn.setAttribute("title", mxResources.get("vertical"));
  btn.style.width = "100px";
  div.appendChild(btn);

  return div;
};

/**
 *
 */
ArrangePanel.prototype.addDistribute = function (div) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;
  div.style.paddingTop = "6px";
  div.style.paddingBottom = "12px";

  div.appendChild(this.createTitle(mxResources.get("distribute")));

  var btn = mxUtils.button(mxResources.get("horizontal"), function (evt) {
    graph.distributeCells(true);
  });

  btn.setAttribute("title", mxResources.get("horizontal"));
  btn.style.width = "100px";
  btn.style.marginRight = "2px";
  div.appendChild(btn);

  var btn = mxUtils.button(mxResources.get("vertical"), function (evt) {
    graph.distributeCells(false);
  });

  btn.setAttribute("title", mxResources.get("vertical"));
  btn.style.width = "100px";
  div.appendChild(btn);

  return div;
};

/**
 *
 */
ArrangePanel.prototype.addAngle = function (div) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;
  var ss = this.format.getSelectionState();

  div.style.paddingBottom = "8px";

  var span = document.createElement("div");
  span.style.position = "absolute";
  span.style.width = "70px";
  span.style.marginTop = "0px";
  span.style.fontWeight = "bold";

  var input = null;
  var update = null;
  var btn = null;

  if (ss.edges.length == 0) {
    mxUtils.write(span, mxResources.get("angle"));
    div.appendChild(span);

    input = this.addUnitInput(div, "°", 20, 44, function () {
      update.apply(this, arguments);
    });

    mxUtils.br(div);
    div.style.paddingTop = "10px";
  } else {
    div.style.paddingTop = "8px";
  }

  if (!ss.containsLabel) {
    var label = mxResources.get("reverse");

    if (ss.vertices.length > 0 && ss.edges.length > 0) {
      label = mxResources.get("turn") + " / " + label;
    } else if (ss.vertices.length > 0) {
      label = mxResources.get("turn");
    }

    btn = mxUtils.button(label, function (evt) {
      ui.actions.get("turn").funct();
    });

    btn.setAttribute(
      "title",
      label + " (" + this.editorUi.actions.get("turn").shortcut + ")"
    );
    btn.style.width = "202px";
    div.appendChild(btn);

    if (input != null) {
      btn.style.marginTop = "8px";
    }
  }

  if (input != null) {
    var listener = mxUtils.bind(this, function (sender, evt, force) {
      if (force || document.activeElement != input) {
        ss = this.format.getSelectionState();
        var tmp = parseFloat(
          mxUtils.getValue(ss.style, mxConstants.STYLE_ROTATION, 0)
        );
        input.value = isNaN(tmp) ? "" : tmp + "°";
      }
    });

    update = this.installInputHandler(
      input,
      mxConstants.STYLE_ROTATION,
      0,
      0,
      360,
      "°",
      null,
      true
    );
    this.addKeyHandler(input, listener);

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });
    listener();
  }

  return div;
};

/**
 *
 */
ArrangePanel.prototype.addGeometry = function (container) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var rect = this.format.getSelectionState();

  var div = this.createPanel();
  div.style.paddingBottom = "8px";

  var span = document.createElement("div");
  span.style.position = "absolute";
  span.style.width = "50px";
  span.style.marginTop = "0px";
  span.style.fontWeight = "bold";
  mxUtils.write(span, mxResources.get("size"));
  div.appendChild(span);

  var widthUpdate, heightUpdate, leftUpdate, topUpdate;
  var width = this.addUnitInput(div, "pt", 84, 44, function () {
    widthUpdate.apply(this, arguments);
  });
  var height = this.addUnitInput(div, "pt", 20, 44, function () {
    heightUpdate.apply(this, arguments);
  });

  var autosizeBtn = document.createElement("div");
  autosizeBtn.className = "geSprite geSprite-fit";
  autosizeBtn.setAttribute(
    "title",
    mxResources.get("autosize") +
      " (" +
      this.editorUi.actions.get("autosize").shortcut +
      ")"
  );
  autosizeBtn.style.position = "relative";
  autosizeBtn.style.cursor = "pointer";
  autosizeBtn.style.marginTop = "-3px";
  autosizeBtn.style.border = "0px";
  autosizeBtn.style.left = "52px";
  mxUtils.setOpacity(autosizeBtn, 50);

  mxEvent.addListener(autosizeBtn, "mouseenter", function () {
    mxUtils.setOpacity(autosizeBtn, 100);
  });

  mxEvent.addListener(autosizeBtn, "mouseleave", function () {
    mxUtils.setOpacity(autosizeBtn, 50);
  });

  mxEvent.addListener(autosizeBtn, "click", function () {
    ui.actions.get("autosize").funct();
  });

  div.appendChild(autosizeBtn);
  this.addLabel(div, mxResources.get("width"), 84);
  this.addLabel(div, mxResources.get("height"), 20);
  mxUtils.br(div);

  var wrapper = document.createElement("div");
  wrapper.style.paddingTop = "8px";
  wrapper.style.paddingRight = "20px";
  wrapper.style.whiteSpace = "nowrap";
  wrapper.style.textAlign = "right";
  var opt = this.createCellOption(
    mxResources.get("constrainProportions"),
    mxConstants.STYLE_ASPECT,
    null,
    "fixed",
    "null"
  );
  opt.style.width = "100%";
  wrapper.appendChild(opt);
  div.appendChild(wrapper);

  this.addKeyHandler(width, listener);
  this.addKeyHandler(height, listener);

  widthUpdate = this.addGeometryHandler(width, function (geo, value) {
    if (geo.width > 0) {
      geo.width = Math.max(1, value);
    }
  });
  heightUpdate = this.addGeometryHandler(height, function (geo, value) {
    if (geo.height > 0) {
      geo.height = Math.max(1, value);
    }
  });

  container.appendChild(div);

  var div2 = this.createPanel();
  div2.style.paddingBottom = "30px";

  var span = document.createElement("div");
  span.style.position = "absolute";
  span.style.width = "70px";
  span.style.marginTop = "0px";
  span.style.fontWeight = "bold";
  mxUtils.write(span, mxResources.get("position"));
  div2.appendChild(span);

  var left = this.addUnitInput(div2, "pt", 84, 44, function () {
    leftUpdate.apply(this, arguments);
  });
  var top = this.addUnitInput(div2, "pt", 20, 44, function () {
    topUpdate.apply(this, arguments);
  });

  mxUtils.br(div2);
  this.addLabel(div2, mxResources.get("left"), 84);
  this.addLabel(div2, mxResources.get("top"), 20);

  var listener = mxUtils.bind(this, function (sender, evt, force) {
    rect = this.format.getSelectionState();

    if (
      !rect.containsLabel &&
      rect.vertices.length == graph.getSelectionCount() &&
      rect.width != null &&
      rect.height != null
    ) {
      div.style.display = "";

      if (force || document.activeElement != width) {
        width.value = rect.width + (rect.width == "" ? "" : " pt");
      }

      if (force || document.activeElement != height) {
        height.value = rect.height + (rect.height == "" ? "" : " pt");
      }
    } else {
      div.style.display = "none";
    }

    if (
      rect.vertices.length == graph.getSelectionCount() &&
      rect.x != null &&
      rect.y != null
    ) {
      div2.style.display = "";

      if (force || document.activeElement != left) {
        left.value = rect.x + (rect.x == "" ? "" : " pt");
      }

      if (force || document.activeElement != top) {
        top.value = rect.y + (rect.y == "" ? "" : " pt");
      }
    } else {
      div2.style.display = "none";
    }
  });

  this.addKeyHandler(left, listener);
  this.addKeyHandler(top, listener);

  graph.getModel().addListener(mxEvent.CHANGE, listener);
  this.listeners.push({
    destroy: function () {
      graph.getModel().removeListener(listener);
    },
  });
  listener();

  leftUpdate = this.addGeometryHandler(left, function (geo, value) {
    if (geo.relative) {
      geo.offset.x = value;
    } else {
      geo.x = value;
    }
  });
  topUpdate = this.addGeometryHandler(top, function (geo, value) {
    if (geo.relative) {
      geo.offset.y = value;
    } else {
      geo.y = value;
    }
  });

  container.appendChild(div2);
};

/**
 *
 */
ArrangePanel.prototype.addGeometryHandler = function (input, fn) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var initialValue = null;

  function update(evt) {
    if (input.value != "") {
      var value = parseFloat(input.value);

      if (value != initialValue) {
        graph.getModel().beginUpdate();
        try {
          var cells = graph.getSelectionCells();

          for (var i = 0; i < cells.length; i++) {
            if (graph.getModel().isVertex(cells[i])) {
              var geo = graph.getCellGeometry(cells[i]);

              if (geo != null) {
                geo = geo.clone();
                fn(geo, value);

                graph.getModel().setGeometry(cells[i], geo);
              }
            }
          }
        } finally {
          graph.getModel().endUpdate();
        }

        initialValue = value;
        input.value = value + " pt";
      } else if (isNaN(value)) {
        input.value = initialValue + " pt";
      }
    }

    mxEvent.consume(evt);
  }

  mxEvent.addListener(input, "blur", update);
  mxEvent.addListener(input, "change", update);
  mxEvent.addListener(input, "focus", function () {
    initialValue = input.value;
  });

  return update;
};

/**
 *
 */
ArrangePanel.prototype.addEdgeGeometry = function (container) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var rect = this.format.getSelectionState();

  var div = this.createPanel();

  var span = document.createElement("div");
  span.style.position = "absolute";
  span.style.width = "70px";
  span.style.marginTop = "0px";
  span.style.fontWeight = "bold";
  mxUtils.write(span, mxResources.get("width"));
  div.appendChild(span);

  var widthUpdate, leftUpdate, topUpdate;
  var width = this.addUnitInput(div, "pt", 20, 44, function () {
    widthUpdate.apply(this, arguments);
  });

  mxUtils.br(div);
  this.addKeyHandler(width, listener);

  function widthUpdate(evt) {
    // Maximum stroke width is 999
    var value = parseInt(width.value);
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));

    if (
      value !=
      mxUtils.getValue(
        rect.style,
        "width",
        mxCellRenderer.prototype.defaultShapes["flexArrow"].prototype
          .defaultWidth
      )
    ) {
      graph.setCellStyles("width", value, graph.getSelectionCells());
      ui.fireEvent(
        new mxEventObject(
          "styleChanged",
          "keys",
          ["width"],
          "values",
          [value],
          "cells",
          graph.getSelectionCells()
        )
      );
    }

    width.value = value + " pt";
    mxEvent.consume(evt);
  }

  mxEvent.addListener(width, "blur", widthUpdate);
  mxEvent.addListener(width, "change", widthUpdate);

  container.appendChild(div);

  var listener = mxUtils.bind(this, function (sender, evt, force) {
    rect = this.format.getSelectionState();

    if (rect.style.shape == "link" || rect.style.shape == "flexArrow") {
      div.style.display = "";

      if (force || document.activeElement != width) {
        var value = mxUtils.getValue(
          rect.style,
          "width",
          mxCellRenderer.prototype.defaultShapes["flexArrow"].prototype
            .defaultWidth
        );
        width.value = value + " pt";
      }
    } else {
      div.style.display = "none";
    }
  });

  graph.getModel().addListener(mxEvent.CHANGE, listener);
  this.listeners.push({
    destroy: function () {
      graph.getModel().removeListener(listener);
    },
  });
  listener();
};

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel = function (format, editorUi, container) {
  BaseFormatPanel.call(this, format, editorUi, container);
  this.init();
};

mxUtils.extend(TextFormatPanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel.prototype.init = function () {
  this.container.style.borderBottom = "1px solid black";
  //this.addFont(this.container);
  this.addExhibitors(this.container);
};

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel.prototype.addFont = function (container) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;
  var ss = this.format.getSelectionState();

  var title = this.createTitle(mxResources.get("font"));
  title.style.paddingLeft = "0px";
  title.style.paddingTop = "10px";
  title.style.paddingBottom = "6px";
  container.appendChild(title);

  var stylePanel = this.createPanel();
  stylePanel.style.paddingTop = "2px";
  stylePanel.style.paddingBottom = "2px";
  stylePanel.style.position = "relative";
  stylePanel.style.marginLeft = "-2px";
  stylePanel.style.borderWidth = "0px";
  stylePanel.className = "geToolbarContainer";

  if (mxClient.IS_QUIRKS) {
    stylePanel.style.display = "block";
  }

  if (graph.cellEditor.isContentEditing()) {
    var cssPanel = stylePanel.cloneNode();

    var cssMenu = this.editorUi.toolbar.addMenu(
      mxResources.get("style"),
      mxResources.get("style"),
      true,
      "formatBlock",
      cssPanel
    );
    cssMenu.style.color = "rgb(112, 112, 112)";
    cssMenu.style.whiteSpace = "nowrap";
    cssMenu.style.overflow = "hidden";
    cssMenu.style.margin = "0px";
    this.addArrow(cssMenu);
    cssMenu.style.width = "192px";
    cssMenu.style.height = "15px";

    var arrow = cssMenu.getElementsByTagName("div")[0];
    arrow.style.cssFloat = "right";
    container.appendChild(cssPanel);
  }

  container.appendChild(stylePanel);

  var colorPanel = this.createPanel();
  colorPanel.style.marginTop = "8px";
  colorPanel.style.borderTop = "1px solid #c0c0c0";
  colorPanel.style.paddingTop = "6px";
  colorPanel.style.paddingBottom = "6px";

  var fontMenu = this.editorUi.toolbar.addMenu(
    "Helvetica",
    mxResources.get("fontFamily"),
    true,
    "fontFamily",
    stylePanel
  );
  fontMenu.style.color = "rgb(112, 112, 112)";
  fontMenu.style.whiteSpace = "nowrap";
  fontMenu.style.overflow = "hidden";
  fontMenu.style.margin = "0px";

  this.addArrow(fontMenu);
  fontMenu.style.width = "192px";
  fontMenu.style.height = "15px";

  // Workaround for offset in FF
  if (mxClient.IS_FF) {
    fontMenu.getElementsByTagName("div")[0].style.marginTop = "-18px";
  }

  var stylePanel2 = stylePanel.cloneNode(false);
  stylePanel2.style.marginLeft = "-3px";
  var fontStyleItems = this.editorUi.toolbar.addItems(
    ["bold", "italic", "underline"],
    stylePanel2,
    true
  );
  fontStyleItems[0].setAttribute(
    "title",
    mxResources.get("bold") +
      " (" +
      this.editorUi.actions.get("bold").shortcut +
      ")"
  );
  fontStyleItems[1].setAttribute(
    "title",
    mxResources.get("italic") +
      " (" +
      this.editorUi.actions.get("italic").shortcut +
      ")"
  );
  fontStyleItems[2].setAttribute(
    "title",
    mxResources.get("underline") +
      " (" +
      this.editorUi.actions.get("underline").shortcut +
      ")"
  );

  var verticalItem = this.editorUi.toolbar.addItems(
    ["vertical"],
    stylePanel2,
    true
  )[0];

  if (mxClient.IS_QUIRKS) {
    mxUtils.br(container);
  }

  container.appendChild(stylePanel2);

  this.styleButtons(fontStyleItems);
  this.styleButtons([verticalItem]);

  var stylePanel3 = stylePanel.cloneNode(false);
  stylePanel3.style.marginLeft = "-3px";
  stylePanel3.style.paddingBottom = "0px";

  var left = this.editorUi.toolbar.addButton(
    "geSprite-left",
    mxResources.get("left"),
    graph.cellEditor.isContentEditing()
      ? function () {
          document.execCommand("justifyleft", false, null);
        }
      : this.editorUi.menus.createStyleChangeFunction(
          [mxConstants.STYLE_ALIGN],
          [mxConstants.ALIGN_LEFT]
        ),
    stylePanel3
  );
  var center = this.editorUi.toolbar.addButton(
    "geSprite-center",
    mxResources.get("center"),
    graph.cellEditor.isContentEditing()
      ? function () {
          document.execCommand("justifycenter", false, null);
        }
      : this.editorUi.menus.createStyleChangeFunction(
          [mxConstants.STYLE_ALIGN],
          [mxConstants.ALIGN_CENTER]
        ),
    stylePanel3
  );
  var right = this.editorUi.toolbar.addButton(
    "geSprite-right",
    mxResources.get("right"),
    graph.cellEditor.isContentEditing()
      ? function () {
          document.execCommand("justifyright", false, null);
        }
      : this.editorUi.menus.createStyleChangeFunction(
          [mxConstants.STYLE_ALIGN],
          [mxConstants.ALIGN_RIGHT]
        ),
    stylePanel3
  );

  this.styleButtons([left, center, right]);

  if (graph.cellEditor.isContentEditing()) {
    var clear = this.editorUi.toolbar.addButton(
      "geSprite-removeformat",
      mxResources.get("removeFormat"),
      function () {
        document.execCommand("removeformat", false, null);
      },
      stylePanel2
    );
    this.styleButtons([clear]);
  }

  var top = this.editorUi.toolbar.addButton(
    "geSprite-top",
    mxResources.get("top"),
    this.editorUi.menus.createStyleChangeFunction(
      [mxConstants.STYLE_VERTICAL_ALIGN],
      [mxConstants.ALIGN_TOP]
    ),
    stylePanel3
  );
  var middle = this.editorUi.toolbar.addButton(
    "geSprite-middle",
    mxResources.get("middle"),
    this.editorUi.menus.createStyleChangeFunction(
      [mxConstants.STYLE_VERTICAL_ALIGN],
      [mxConstants.ALIGN_MIDDLE]
    ),
    stylePanel3
  );
  var bottom = this.editorUi.toolbar.addButton(
    "geSprite-bottom",
    mxResources.get("bottom"),
    this.editorUi.menus.createStyleChangeFunction(
      [mxConstants.STYLE_VERTICAL_ALIGN],
      [mxConstants.ALIGN_BOTTOM]
    ),
    stylePanel3
  );

  this.styleButtons([top, middle, bottom]);

  if (mxClient.IS_QUIRKS) {
    mxUtils.br(container);
  }

  container.appendChild(stylePanel3);

  // Hack for updating UI state below based on current text selection
  // currentTable is the current selected DOM table updated below
  var sub, sup, full, tableWrapper, currentTable, tableCell, tableRow;

  if (graph.cellEditor.isContentEditing()) {
    top.style.display = "none";
    middle.style.display = "none";
    bottom.style.display = "none";
    verticalItem.style.display = "none";

    full = this.editorUi.toolbar.addButton(
      "geSprite-justifyfull",
      null,
      function () {
        document.execCommand("justifyfull", false, null);
      },
      stylePanel3
    );
    this.styleButtons([
      full,
      (sub = this.editorUi.toolbar.addButton(
        "geSprite-subscript",
        mxResources.get("subscript") + " (Ctrl+,)",
        function () {
          document.execCommand("subscript", false, null);
        },
        stylePanel3
      )),
      (sup = this.editorUi.toolbar.addButton(
        "geSprite-superscript",
        mxResources.get("superscript") + " (Ctrl+.)",
        function () {
          document.execCommand("superscript", false, null);
        },
        stylePanel3
      )),
    ]);
    full.style.marginRight = "9px";

    var tmp = stylePanel3.cloneNode(false);
    tmp.style.paddingTop = "4px";
    var btns = [
      this.editorUi.toolbar.addButton(
        "geSprite-orderedlist",
        mxResources.get("numberedList"),
        function () {
          document.execCommand("insertorderedlist", false, null);
        },
        tmp
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-unorderedlist",
        mxResources.get("bulletedList"),
        function () {
          document.execCommand("insertunorderedlist", false, null);
        },
        tmp
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-outdent",
        mxResources.get("decreaseIndent"),
        function () {
          document.execCommand("outdent", false, null);
        },
        tmp
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-indent",
        mxResources.get("increaseIndent"),
        function () {
          document.execCommand("indent", false, null);
        },
        tmp
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-code",
        mxResources.get("html"),
        function () {
          graph.cellEditor.toggleViewMode();
        },
        tmp
      ),
    ];
    this.styleButtons(btns);
    btns[btns.length - 1].style.marginLeft = "9px";

    if (mxClient.IS_QUIRKS) {
      mxUtils.br(container);
      tmp.style.height = "40";
    }

    container.appendChild(tmp);
  } else {
    fontStyleItems[2].style.marginRight = "9px";
    right.style.marginRight = "9px";
  }

  // Label position
  var stylePanel4 = stylePanel.cloneNode(false);
  stylePanel4.style.marginLeft = "0px";
  stylePanel4.style.paddingTop = "8px";
  stylePanel4.style.paddingBottom = "4px";
  stylePanel4.style.fontWeight = "normal";

  mxUtils.write(stylePanel4, mxResources.get("position"));

  // Adds label position options
  var positionSelect = document.createElement("select");
  positionSelect.style.position = "absolute";
  positionSelect.style.right = "20px";
  positionSelect.style.width = "97px";
  positionSelect.style.marginTop = "-2px";

  var directions = [
    "topLeft",
    "top",
    "topRight",
    "left",
    "center",
    "right",
    "bottomLeft",
    "bottom",
    "bottomRight",
  ];
  var lset = {
    topLeft: [
      mxConstants.ALIGN_LEFT,
      mxConstants.ALIGN_TOP,
      mxConstants.ALIGN_RIGHT,
      mxConstants.ALIGN_BOTTOM,
    ],
    top: [
      mxConstants.ALIGN_CENTER,
      mxConstants.ALIGN_TOP,
      mxConstants.ALIGN_CENTER,
      mxConstants.ALIGN_BOTTOM,
    ],
    topRight: [
      mxConstants.ALIGN_RIGHT,
      mxConstants.ALIGN_TOP,
      mxConstants.ALIGN_LEFT,
      mxConstants.ALIGN_BOTTOM,
    ],
    left: [
      mxConstants.ALIGN_LEFT,
      mxConstants.ALIGN_MIDDLE,
      mxConstants.ALIGN_RIGHT,
      mxConstants.ALIGN_MIDDLE,
    ],
    center: [
      mxConstants.ALIGN_CENTER,
      mxConstants.ALIGN_MIDDLE,
      mxConstants.ALIGN_CENTER,
      mxConstants.ALIGN_MIDDLE,
    ],
    right: [
      mxConstants.ALIGN_RIGHT,
      mxConstants.ALIGN_MIDDLE,
      mxConstants.ALIGN_LEFT,
      mxConstants.ALIGN_MIDDLE,
    ],
    bottomLeft: [
      mxConstants.ALIGN_LEFT,
      mxConstants.ALIGN_BOTTOM,
      mxConstants.ALIGN_RIGHT,
      mxConstants.ALIGN_TOP,
    ],
    bottom: [
      mxConstants.ALIGN_CENTER,
      mxConstants.ALIGN_BOTTOM,
      mxConstants.ALIGN_CENTER,
      mxConstants.ALIGN_TOP,
    ],
    bottomRight: [
      mxConstants.ALIGN_RIGHT,
      mxConstants.ALIGN_BOTTOM,
      mxConstants.ALIGN_LEFT,
      mxConstants.ALIGN_TOP,
    ],
  };

  for (var i = 0; i < directions.length; i++) {
    var positionOption = document.createElement("option");
    positionOption.setAttribute("value", directions[i]);
    mxUtils.write(positionOption, mxResources.get(directions[i]));
    positionSelect.appendChild(positionOption);
  }

  stylePanel4.appendChild(positionSelect);

  // Writing direction
  var stylePanel5 = stylePanel.cloneNode(false);
  stylePanel5.style.marginLeft = "0px";
  stylePanel5.style.paddingTop = "4px";
  stylePanel5.style.paddingBottom = "4px";
  stylePanel5.style.fontWeight = "normal";

  mxUtils.write(stylePanel5, mxResources.get("writingDirection"));

  // Adds writing direction options
  // LATER: Handle reselect of same option in all selects (change event
  // is not fired for same option so have opened state on click) and
  // handle multiple different styles for current selection
  var dirSelect = document.createElement("select");
  dirSelect.style.position = "absolute";
  dirSelect.style.right = "20px";
  dirSelect.style.width = "97px";
  dirSelect.style.marginTop = "-2px";

  // NOTE: For automatic we use the value null since automatic
  // requires the text to be non formatted and non-wrapped
  var dirs = ["automatic", "leftToRight", "rightToLeft"];
  var dirSet = {
    automatic: null,
    leftToRight: mxConstants.TEXT_DIRECTION_LTR,
    rightToLeft: mxConstants.TEXT_DIRECTION_RTL,
  };

  for (var i = 0; i < dirs.length; i++) {
    var dirOption = document.createElement("option");
    dirOption.setAttribute("value", dirs[i]);
    mxUtils.write(dirOption, mxResources.get(dirs[i]));
    dirSelect.appendChild(dirOption);
  }

  stylePanel5.appendChild(dirSelect);

  if (!graph.isEditing()) {
    container.appendChild(stylePanel4);

    mxEvent.addListener(positionSelect, "change", function (evt) {
      graph.getModel().beginUpdate();
      try {
        var vals = lset[positionSelect.value];

        if (vals != null) {
          graph.setCellStyles(
            mxConstants.STYLE_LABEL_POSITION,
            vals[0],
            graph.getSelectionCells()
          );
          graph.setCellStyles(
            mxConstants.STYLE_VERTICAL_LABEL_POSITION,
            vals[1],
            graph.getSelectionCells()
          );
          graph.setCellStyles(
            mxConstants.STYLE_ALIGN,
            vals[2],
            graph.getSelectionCells()
          );
          graph.setCellStyles(
            mxConstants.STYLE_VERTICAL_ALIGN,
            vals[3],
            graph.getSelectionCells()
          );
        }
      } finally {
        graph.getModel().endUpdate();
      }

      mxEvent.consume(evt);
    });

    // LATER: Update dir in text editor while editing and update style with label
    // NOTE: The tricky part is handling and passing on the auto value
    container.appendChild(stylePanel5);

    mxEvent.addListener(dirSelect, "change", function (evt) {
      graph.setCellStyles(
        mxConstants.STYLE_TEXT_DIRECTION,
        dirSet[dirSelect.value],
        graph.getSelectionCells()
      );
      mxEvent.consume(evt);
    });
  }

  // Font size
  var input = document.createElement("input");
  input.style.textAlign = "right";
  input.style.marginTop = "4px";

  if (!mxClient.IS_QUIRKS) {
    input.style.position = "absolute";
    input.style.right = "32px";
  }

  input.style.width = "46px";
  input.style.height = mxClient.IS_QUIRKS ? "21px" : "17px";
  stylePanel2.appendChild(input);

  // Workaround for font size 4 if no text is selected is update font size below
  // after first character was entered (as the font element is lazy created)
  var pendingFontSize = null;

  var inputUpdate = this.installInputHandler(
    input,
    mxConstants.STYLE_FONTSIZE,
    Menus.prototype.defaultFontSize,
    1,
    999,
    " pt",
    function (fontsize) {
      pendingFontSize = fontsize;

      // Workaround for can't set font size in px is to change font size afterwards
      document.execCommand("fontSize", false, "4");
      var elts = graph.cellEditor.textarea.getElementsByTagName("font");

      for (var i = 0; i < elts.length; i++) {
        if (elts[i].getAttribute("size") == "4") {
          elts[i].removeAttribute("size");
          elts[i].style.fontSize = pendingFontSize + "px";

          // Overrides fontSize in input with the one just assigned as a workaround
          // for potential fontSize values of parent elements that don't match
          window.setTimeout(function () {
            input.value = pendingFontSize + " pt";
            pendingFontSize = null;
          }, 0);

          break;
        }
      }
    },
    true
  );

  var stepper = this.createStepper(
    input,
    inputUpdate,
    1,
    10,
    true,
    Menus.prototype.defaultFontSize
  );
  stepper.style.display = input.style.display;
  stepper.style.marginTop = "4px";

  if (!mxClient.IS_QUIRKS) {
    stepper.style.right = "20px";
  }

  stylePanel2.appendChild(stepper);

  var arrow = fontMenu.getElementsByTagName("div")[0];
  arrow.style.cssFloat = "right";

  var bgColorApply = null;
  var currentBgColor = "#ffffff";

  var fontColorApply = null;
  var currentFontColor = "#000000";

  var bgPanel = graph.cellEditor.isContentEditing()
    ? this.createColorOption(
        mxResources.get("backgroundColor"),
        function () {
          return currentBgColor;
        },
        function (color) {
          document.execCommand(
            "backcolor",
            false,
            color != mxConstants.NONE ? color : "transparent"
          );
        },
        "#ffffff",
        {
          install: function (apply) {
            bgColorApply = apply;
          },
          destroy: function () {
            bgColorApply = null;
          },
        },
        null,
        true
      )
    : this.createCellColorOption(
        mxResources.get("backgroundColor"),
        mxConstants.STYLE_LABEL_BACKGROUNDCOLOR,
        "#ffffff"
      );
  bgPanel.style.fontWeight = "bold";

  var borderPanel = this.createCellColorOption(
    mxResources.get("borderColor"),
    mxConstants.STYLE_LABEL_BORDERCOLOR,
    "#000000"
  );
  borderPanel.style.fontWeight = "bold";

  var panel = graph.cellEditor.isContentEditing()
    ? this.createColorOption(
        mxResources.get("fontColor"),
        function () {
          return currentFontColor;
        },
        function (color) {
          document.execCommand(
            "forecolor",
            false,
            color != mxConstants.NONE ? color : "transparent"
          );
        },
        "#000000",
        {
          install: function (apply) {
            fontColorApply = apply;
          },
          destroy: function () {
            fontColorApply = null;
          },
        },
        null,
        true
      )
    : this.createCellColorOption(
        mxResources.get("fontColor"),
        mxConstants.STYLE_FONTCOLOR,
        "#000000",
        function (color) {
          if (color == null || color == mxConstants.NONE) {
            bgPanel.style.display = "none";
          } else {
            bgPanel.style.display = "none";
          }

          borderPanel.style.display = bgPanel.style.display;
        },
        function (color) {
          if (color == null || color == mxConstants.NONE) {
            graph.setCellStyles(
              mxConstants.STYLE_NOLABEL,
              "1",
              graph.getSelectionCells()
            );
          } else {
            graph.setCellStyles(
              mxConstants.STYLE_NOLABEL,
              null,
              graph.getSelectionCells()
            );
          }
        }
      );
  panel.style.fontWeight = "bold";

  colorPanel.appendChild(panel);
  colorPanel.appendChild(bgPanel);

  if (!graph.cellEditor.isContentEditing()) {
    colorPanel.appendChild(borderPanel);
  }

  container.appendChild(colorPanel);

  var extraPanel = this.createPanel();
  extraPanel.style.paddingTop = "2px";
  extraPanel.style.paddingBottom = "4px";

  // LATER: Fix toggle using '' instead of 'null'
  var wwOpt = this.createCellOption(
    mxResources.get("wordWrap"),
    mxConstants.STYLE_WHITE_SPACE,
    null,
    "wrap",
    "null",
    null,
    null,
    true
  );
  wwOpt.style.fontWeight = "bold";

  // Word wrap in edge labels only supported via labelWidth style
  if (!ss.containsLabel && !ss.autoSize && ss.edges.length == 0) {
    extraPanel.appendChild(wwOpt);
  }

  // Delegates switch of style to formattedText action as it also convertes newlines
  var htmlOpt = this.createCellOption(
    mxResources.get("formattedText"),
    "html",
    "0",
    null,
    null,
    null,
    ui.actions.get("formattedText")
  );
  htmlOpt.style.fontWeight = "bold";
  extraPanel.appendChild(htmlOpt);

  var spacingPanel = this.createPanel();
  spacingPanel.style.paddingTop = "10px";
  spacingPanel.style.paddingBottom = "28px";
  spacingPanel.style.fontWeight = "normal";

  var span = document.createElement("div");
  span.style.position = "absolute";
  span.style.width = "70px";
  span.style.marginTop = "0px";
  span.style.fontWeight = "bold";
  mxUtils.write(span, mxResources.get("spacing"));
  spacingPanel.appendChild(span);

  var topUpdate, globalUpdate, leftUpdate, bottomUpdate, rightUpdate;
  var topSpacing = this.addUnitInput(spacingPanel, "pt", 91, 44, function () {
    topUpdate.apply(this, arguments);
  });
  var globalSpacing = this.addUnitInput(
    spacingPanel,
    "pt",
    20,
    44,
    function () {
      globalUpdate.apply(this, arguments);
    }
  );

  mxUtils.br(spacingPanel);
  this.addLabel(spacingPanel, mxResources.get("top"), 91);
  this.addLabel(spacingPanel, mxResources.get("global"), 20);
  mxUtils.br(spacingPanel);
  mxUtils.br(spacingPanel);

  var leftSpacing = this.addUnitInput(spacingPanel, "pt", 162, 44, function () {
    leftUpdate.apply(this, arguments);
  });
  var bottomSpacing = this.addUnitInput(
    spacingPanel,
    "pt",
    91,
    44,
    function () {
      bottomUpdate.apply(this, arguments);
    }
  );
  var rightSpacing = this.addUnitInput(spacingPanel, "pt", 20, 44, function () {
    rightUpdate.apply(this, arguments);
  });

  mxUtils.br(spacingPanel);
  this.addLabel(spacingPanel, mxResources.get("left"), 162);
  this.addLabel(spacingPanel, mxResources.get("bottom"), 91);
  this.addLabel(spacingPanel, mxResources.get("right"), 20);

  if (!graph.cellEditor.isContentEditing()) {
    container.appendChild(extraPanel);
    container.appendChild(
      this.createRelativeOption(
        mxResources.get("opacity"),
        mxConstants.STYLE_TEXT_OPACITY
      )
    );
    container.appendChild(spacingPanel);
  } else {
    var selState = null;
    var lineHeightInput = null;

    container.appendChild(
      this.createRelativeOption(
        mxResources.get("lineheight"),
        null,
        null,
        function (input) {
          var value = input.value == "" ? 120 : parseInt(input.value);
          value = Math.max(120, isNaN(value) ? 120 : value);

          if (selState != null) {
            graph.cellEditor.restoreSelection(selState);
            selState = null;
          }

          var selectedElement = graph.getSelectedElement();
          var node = selectedElement;

          while (
            node != null &&
            node.nodeType != mxConstants.NODETYPE_ELEMENT
          ) {
            node = node.parentNode;
          }

          if (
            node != null &&
            node == graph.cellEditor.textarea &&
            graph.cellEditor.textarea.firstChild != null
          ) {
            if (graph.cellEditor.textarea.firstChild.nodeName != "FONT") {
              graph.cellEditor.textarea.innerHTML =
                "<font>" + graph.cellEditor.textarea.innerHTML + "</font>";
            }

            node = graph.cellEditor.textarea.firstChild;
          }

          if (node != null && node != graph.cellEditor.textarea) {
            node.style.lineHeight = value + "%";
          }

          input.value = value + " %";
        },
        function (input) {
          // Used in CSS handler to update current value
          lineHeightInput = input;

          // KNOWN: Arrow up/down clear selection text in quirks/IE 8
          // Text size via arrow button limits to 16 in IE11. Why?
          mxEvent.addListener(input, "mousedown", function () {
            selState = graph.cellEditor.saveSelection();
          });

          mxEvent.addListener(input, "touchstart", function () {
            selState = graph.cellEditor.saveSelection();
          });

          input.value = "120 %";
        }
      )
    );

    var insertPanel = stylePanel.cloneNode(false);
    insertPanel.style.paddingLeft = "0px";
    var insertBtns = this.editorUi.toolbar.addItems(
      ["link", "image"],
      insertPanel,
      true
    );

    var btns = [
      this.editorUi.toolbar.addButton(
        "geSprite-horizontalrule",
        mxResources.get("insertHorizontalRule"),
        function () {
          document.execCommand("inserthorizontalrule", false, null);
        },
        insertPanel
      ),
      this.editorUi.toolbar.addMenuFunctionInContainer(
        insertPanel,
        "geSprite-table",
        mxResources.get("table"),
        false,
        mxUtils.bind(this, function (menu) {
          this.editorUi.menus.addInsertTableItem(menu);
        })
      ),
    ];
    this.styleButtons(insertBtns);
    this.styleButtons(btns);

    var wrapper2 = this.createPanel();
    wrapper2.style.paddingTop = "10px";
    wrapper2.style.paddingBottom = "10px";
    wrapper2.appendChild(this.createTitle(mxResources.get("insert")));
    wrapper2.appendChild(insertPanel);
    container.appendChild(wrapper2);

    if (mxClient.IS_QUIRKS) {
      wrapper2.style.height = "70";
    }

    var tablePanel = stylePanel.cloneNode(false);
    tablePanel.style.paddingLeft = "0px";

    var btns = [
      this.editorUi.toolbar.addButton(
        "geSprite-insertcolumnbefore",
        mxResources.get("insertColumnBefore"),
        function () {
          try {
            if (currentTable != null) {
              graph.selectNode(
                graph.insertColumn(
                  currentTable,
                  tableCell != null ? tableCell.cellIndex : 0
                )
              );
            }
          } catch (e) {
            alert(e);
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-insertcolumnafter",
        mxResources.get("insertColumnAfter"),
        function () {
          try {
            if (currentTable != null) {
              graph.selectNode(
                graph.insertColumn(
                  currentTable,
                  tableCell != null ? tableCell.cellIndex + 1 : -1
                )
              );
            }
          } catch (e) {
            alert(e);
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-deletecolumn",
        mxResources.get("deleteColumn"),
        function () {
          try {
            if (currentTable != null && tableCell != null) {
              graph.deleteColumn(currentTable, tableCell.cellIndex);
            }
          } catch (e) {
            alert(e);
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-insertrowbefore",
        mxResources.get("insertRowBefore"),
        function () {
          try {
            if (currentTable != null && tableRow != null) {
              graph.selectNode(
                graph.insertRow(currentTable, tableRow.sectionRowIndex)
              );
            }
          } catch (e) {
            alert(e);
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-insertrowafter",
        mxResources.get("insertRowAfter"),
        function () {
          try {
            if (currentTable != null && tableRow != null) {
              graph.selectNode(
                graph.insertRow(currentTable, tableRow.sectionRowIndex + 1)
              );
            }
          } catch (e) {
            alert(e);
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-deleterow",
        mxResources.get("deleteRow"),
        function () {
          try {
            if (currentTable != null && tableRow != null) {
              graph.deleteRow(currentTable, tableRow.sectionRowIndex);
            }
          } catch (e) {
            alert(e);
          }
        },
        tablePanel
      ),
    ];
    this.styleButtons(btns);
    btns[2].style.marginRight = "9px";

    var wrapper3 = this.createPanel();
    wrapper3.style.paddingTop = "10px";
    wrapper3.style.paddingBottom = "10px";
    wrapper3.appendChild(this.createTitle(mxResources.get("table")));
    wrapper3.appendChild(tablePanel);

    if (mxClient.IS_QUIRKS) {
      mxUtils.br(container);
      wrapper3.style.height = "70";
    }

    var tablePanel2 = stylePanel.cloneNode(false);
    tablePanel2.style.paddingLeft = "0px";

    var btns = [
      this.editorUi.toolbar.addButton(
        "geSprite-strokecolor",
        mxResources.get("borderColor"),
        mxUtils.bind(this, function () {
          if (currentTable != null) {
            // Converts rgb(r,g,b) values
            var color = currentTable.style.borderColor.replace(
              /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
              function ($0, $1, $2, $3) {
                return (
                  "#" +
                  ("0" + Number($1).toString(16)).substr(-2) +
                  ("0" + Number($2).toString(16)).substr(-2) +
                  ("0" + Number($3).toString(16)).substr(-2)
                );
              }
            );
            this.editorUi.pickColor(color, function (newColor) {
              if (newColor == null || newColor == mxConstants.NONE) {
                currentTable.removeAttribute("border");
                currentTable.style.border = "";
                currentTable.style.borderCollapse = "";
              } else {
                currentTable.setAttribute("border", "1");
                currentTable.style.border = "1px solid " + newColor;
                currentTable.style.borderCollapse = "collapse";
              }
            });
          }
        }),
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-fillcolor",
        mxResources.get("backgroundColor"),
        mxUtils.bind(this, function () {
          // Converts rgb(r,g,b) values
          if (currentTable != null) {
            var color = currentTable.style.backgroundColor.replace(
              /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
              function ($0, $1, $2, $3) {
                return (
                  "#" +
                  ("0" + Number($1).toString(16)).substr(-2) +
                  ("0" + Number($2).toString(16)).substr(-2) +
                  ("0" + Number($3).toString(16)).substr(-2)
                );
              }
            );
            this.editorUi.pickColor(color, function (newColor) {
              if (newColor == null || newColor == mxConstants.NONE) {
                currentTable.style.backgroundColor = "";
              } else {
                currentTable.style.backgroundColor = newColor;
              }
            });
          }
        }),
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-fit",
        mxResources.get("spacing"),
        function () {
          if (currentTable != null) {
            var value = currentTable.getAttribute("cellPadding") || 0;

            var dlg = new FilenameDialog(
              ui,
              value,
              mxResources.get("apply"),
              mxUtils.bind(this, function (newValue) {
                if (newValue != null && newValue.length > 0) {
                  currentTable.setAttribute("cellPadding", newValue);
                } else {
                  currentTable.removeAttribute("cellPadding");
                }
              }),
              mxResources.get("spacing")
            );
            ui.showDialog(dlg.container, 300, 80, true, true);
            dlg.init();
          }
        },
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-left",
        mxResources.get("left"),
        function () {
          if (currentTable != null) {
            currentTable.setAttribute("align", "left");
          }
        },
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-center",
        mxResources.get("center"),
        function () {
          if (currentTable != null) {
            currentTable.setAttribute("align", "center");
          }
        },
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-right",
        mxResources.get("right"),
        function () {
          if (currentTable != null) {
            currentTable.setAttribute("align", "right");
          }
        },
        tablePanel2
      ),
    ];
    this.styleButtons(btns);
    btns[2].style.marginRight = "9px";

    if (mxClient.IS_QUIRKS) {
      mxUtils.br(wrapper3);
      mxUtils.br(wrapper3);
    }

    wrapper3.appendChild(tablePanel2);
    container.appendChild(wrapper3);

    tableWrapper = wrapper3;
  }

  function setSelected(elt, selected) {
    if (mxClient.IS_IE && (mxClient.IS_QUIRKS || document.documentMode < 10)) {
      elt.style.filter = selected
        ? "progid:DXImageTransform.Microsoft.Gradient(" +
          "StartColorStr='#c5ecff', EndColorStr='#87d4fb', GradientType=0)"
        : "";
    } else {
      elt.style.backgroundImage = selected
        ? "linear-gradient(#c5ecff 0px,#87d4fb 100%)"
        : "";
    }
  }

  var listener = mxUtils.bind(this, function (sender, evt, force) {
    ss = this.format.getSelectionState();
    var fontStyle = mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSTYLE, 0);
    setSelected(
      fontStyleItems[0],
      (fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD
    );
    setSelected(
      fontStyleItems[1],
      (fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC
    );
    setSelected(
      fontStyleItems[2],
      (fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE
    );
    fontMenu.firstChild.nodeValue = mxUtils.htmlEntities(
      mxUtils.getValue(
        ss.style,
        mxConstants.STYLE_FONTFAMILY,
        Menus.prototype.defaultFont
      )
    );

    setSelected(
      verticalItem,
      mxUtils.getValue(ss.style, mxConstants.STYLE_HORIZONTAL, "1") == "0"
    );

    if (force || document.activeElement != input) {
      var tmp = parseFloat(
        mxUtils.getValue(
          ss.style,
          mxConstants.STYLE_FONTSIZE,
          Menus.prototype.defaultFontSize
        )
      );
      input.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    var align = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_ALIGN,
      mxConstants.ALIGN_CENTER
    );
    setSelected(left, align == mxConstants.ALIGN_LEFT);
    setSelected(center, align == mxConstants.ALIGN_CENTER);
    setSelected(right, align == mxConstants.ALIGN_RIGHT);

    var valign = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_VERTICAL_ALIGN,
      mxConstants.ALIGN_MIDDLE
    );
    setSelected(top, valign == mxConstants.ALIGN_TOP);
    setSelected(middle, valign == mxConstants.ALIGN_MIDDLE);
    setSelected(bottom, valign == mxConstants.ALIGN_BOTTOM);

    var pos = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_LABEL_POSITION,
      mxConstants.ALIGN_CENTER
    );
    var vpos = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_VERTICAL_LABEL_POSITION,
      mxConstants.ALIGN_MIDDLE
    );

    if (pos == mxConstants.ALIGN_LEFT && vpos == mxConstants.ALIGN_TOP) {
      positionSelect.value = "topLeft";
    } else if (
      pos == mxConstants.ALIGN_CENTER &&
      vpos == mxConstants.ALIGN_TOP
    ) {
      positionSelect.value = "top";
    } else if (
      pos == mxConstants.ALIGN_RIGHT &&
      vpos == mxConstants.ALIGN_TOP
    ) {
      positionSelect.value = "topRight";
    } else if (
      pos == mxConstants.ALIGN_LEFT &&
      vpos == mxConstants.ALIGN_BOTTOM
    ) {
      positionSelect.value = "bottomLeft";
    } else if (
      pos == mxConstants.ALIGN_CENTER &&
      vpos == mxConstants.ALIGN_BOTTOM
    ) {
      positionSelect.value = "bottom";
    } else if (
      pos == mxConstants.ALIGN_RIGHT &&
      vpos == mxConstants.ALIGN_BOTTOM
    ) {
      positionSelect.value = "bottomRight";
    } else if (pos == mxConstants.ALIGN_LEFT) {
      positionSelect.value = "left";
    } else if (pos == mxConstants.ALIGN_RIGHT) {
      positionSelect.value = "right";
    } else {
      positionSelect.value = "center";
    }

    var dir = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_TEXT_DIRECTION,
      mxConstants.DEFAULT_TEXT_DIRECTION
    );

    if (dir == mxConstants.TEXT_DIRECTION_RTL) {
      dirSelect.value = "rightToLeft";
    } else if (dir == mxConstants.TEXT_DIRECTION_LTR) {
      dirSelect.value = "leftToRight";
    } else if (dir == mxConstants.TEXT_DIRECTION_AUTO) {
      dirSelect.value = "automatic";
    }

    if (force || document.activeElement != globalSpacing) {
      var tmp = parseFloat(
        mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING, 2)
      );
      globalSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != topSpacing) {
      var tmp = parseFloat(
        mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_TOP, 0)
      );
      topSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != rightSpacing) {
      var tmp = parseFloat(
        mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_RIGHT, 0)
      );
      rightSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != bottomSpacing) {
      var tmp = parseFloat(
        mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_BOTTOM, 0)
      );
      bottomSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != leftSpacing) {
      var tmp = parseFloat(
        mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_LEFT, 0)
      );
      leftSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }
  });

  globalUpdate = this.installInputHandler(
    globalSpacing,
    mxConstants.STYLE_SPACING,
    2,
    -999,
    999,
    " pt"
  );
  topUpdate = this.installInputHandler(
    topSpacing,
    mxConstants.STYLE_SPACING_TOP,
    0,
    -999,
    999,
    " pt"
  );
  rightUpdate = this.installInputHandler(
    rightSpacing,
    mxConstants.STYLE_SPACING_RIGHT,
    0,
    -999,
    999,
    " pt"
  );
  bottomUpdate = this.installInputHandler(
    bottomSpacing,
    mxConstants.STYLE_SPACING_BOTTOM,
    0,
    -999,
    999,
    " pt"
  );
  leftUpdate = this.installInputHandler(
    leftSpacing,
    mxConstants.STYLE_SPACING_LEFT,
    0,
    -999,
    999,
    " pt"
  );

  this.addKeyHandler(input, listener);
  this.addKeyHandler(globalSpacing, listener);
  this.addKeyHandler(topSpacing, listener);
  this.addKeyHandler(rightSpacing, listener);
  this.addKeyHandler(bottomSpacing, listener);
  this.addKeyHandler(leftSpacing, listener);

  graph.getModel().addListener(mxEvent.CHANGE, listener);
  this.listeners.push({
    destroy: function () {
      graph.getModel().removeListener(listener);
      // console.log("asa");
    },
  });
  listener();

  if (graph.cellEditor.isContentEditing()) {
    var updating = false;

    var updateCssHandler = function () {
      if (!updating) {
        updating = true;

        window.setTimeout(function () {
          var selectedElement = graph.getSelectedElement();
          var node = selectedElement;

          while (
            node != null &&
            node.nodeType != mxConstants.NODETYPE_ELEMENT
          ) {
            node = node.parentNode;
          }

          if (node != null) {
            var css = mxUtils.getCurrentStyle(node);

            if (css != null) {
              setSelected(
                fontStyleItems[0],
                css.fontWeight == "bold" ||
                  graph.getParentByName(node, "B", graph.cellEditor.textarea) !=
                    null
              );
              setSelected(
                fontStyleItems[1],
                css.fontStyle == "italic" ||
                  graph.getParentByName(node, "I", graph.cellEditor.textarea) !=
                    null
              );
              setSelected(
                fontStyleItems[2],
                graph.getParentByName(node, "U", graph.cellEditor.textarea) !=
                  null
              );
              setSelected(left, css.textAlign == "left");
              setSelected(center, css.textAlign == "center");
              setSelected(right, css.textAlign == "right");
              setSelected(full, css.textAlign == "justify");
              setSelected(
                sup,
                graph.getParentByName(node, "SUP", graph.cellEditor.textarea) !=
                  null
              );
              setSelected(
                sub,
                graph.getParentByName(node, "SUB", graph.cellEditor.textarea) !=
                  null
              );

              currentTable = graph.getParentByName(
                node,
                "TABLE",
                graph.cellEditor.textarea
              );
              tableRow =
                currentTable == null
                  ? null
                  : graph.getParentByName(node, "TR", currentTable);
              tableCell =
                currentTable == null
                  ? null
                  : graph.getParentByName(node, "TD", currentTable);
              tableWrapper.style.display = currentTable != null ? "" : "none";

              if (document.activeElement != input) {
                if (
                  node.nodeName == "FONT" &&
                  node.getAttribute("size") == "4" &&
                  pendingFontSize != null
                ) {
                  node.removeAttribute("size");
                  node.style.fontSize = pendingFontSize + "px";
                  pendingFontSize = null;
                } else {
                  input.value = parseFloat(css.fontSize) + " pt";
                }

                var tmp = node.style.lineHeight || css.lineHeight;
                var lh = parseFloat(tmp);

                if (tmp.substring(tmp.length - 2) == "px") {
                  lh = lh / parseFloat(css.fontSize);
                }

                if (tmp.substring(tmp.length - 1) != "%") {
                  lh *= 100;
                }

                lineHeightInput.value = lh + " %";
              }

              // Converts rgb(r,g,b) values
              var color = css.color.replace(
                /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                function ($0, $1, $2, $3) {
                  return (
                    "#" +
                    ("0" + Number($1).toString(16)).substr(-2) +
                    ("0" + Number($2).toString(16)).substr(-2) +
                    ("0" + Number($3).toString(16)).substr(-2)
                  );
                }
              );
              var color2 = css.backgroundColor.replace(
                /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                function ($0, $1, $2, $3) {
                  return (
                    "#" +
                    ("0" + Number($1).toString(16)).substr(-2) +
                    ("0" + Number($2).toString(16)).substr(-2) +
                    ("0" + Number($3).toString(16)).substr(-2)
                  );
                }
              );

              // Updates the color picker for the current font
              if (fontColorApply != null) {
                if (color.charAt(0) == "#") {
                  currentFontColor = color;
                } else {
                  currentFontColor = "#000000";
                }

                fontColorApply(currentFontColor, true);
              }

              if (bgColorApply != null) {
                if (color2.charAt(0) == "#") {
                  currentBgColor = color2;
                } else {
                  currentBgColor = null;
                }

                bgColorApply(currentBgColor, true);
              }

              // Workaround for firstChild is null or not an object
              // in the log which seems to be IE8- only / 29.01.15
              if (fontMenu.firstChild != null) {
                // Strips leading and trailing quotes
                var ff = css.fontFamily;

                if (ff.charAt(0) == "'") {
                  ff = ff.substring(1);
                }

                if (ff.charAt(ff.length - 1) == "'") {
                  ff = ff.substring(0, ff.length - 1);
                }

                fontMenu.firstChild.nodeValue = ff;
              }
            }
          }

          updating = false;
        }, 0);
      }
    };

    mxEvent.addListener(graph.cellEditor.textarea, "input", updateCssHandler);
    mxEvent.addListener(
      graph.cellEditor.textarea,
      "touchend",
      updateCssHandler
    );
    mxEvent.addListener(graph.cellEditor.textarea, "mouseup", updateCssHandler);
    mxEvent.addListener(graph.cellEditor.textarea, "keyup", updateCssHandler);
    this.listeners.push({
      destroy: function () {
        // No need to remove listener since textarea is destroyed after edit
      },
    });
    updateCssHandler();
  }

  return container;
};

TextFormatPanel.prototype.addExhibitors = function (container) {
  //	var ui = this.editorUi;
  //	var editor = ui.editor;
  //	var graph = editor.graph;
  //	var ss = this.format.getSelectionState();
  //
  //
  //
  //	var stylePanel = this.createPanel();
  //	stylePanel.style.paddingTop = '2px';
  //	stylePanel.style.paddingBottom = '2px';
  //	stylePanel.style.position = 'relative';
  //	stylePanel.style.marginLeft = '-2px';
  //	stylePanel.style.borderWidth = '0px';
  //	stylePanel.className = 'geToolbarContainer';
  //
  //	if (mxClient.IS_QUIRKS)
  //	{
  //		stylePanel.style.display = 'block';
  //	}
  //
  //
  //	var title = this.createTitle('Exhibitors: ');
  //	title.style.paddingTop = '6px';
  //	title.style.paddingBottom = '6px';
  //	stylePanel.appendChild(title);
  //
  //	// Adds gradient direction option
  //	var gradientSelect = document.createElement('select');
  //
  //	//gradientSelect.style.position = 'absolute';
  //	//gradientSelect.style.marginTop = '-2px';
  //	//gradientSelect.style.right = (mxClient.IS_QUIRKS) ? '52px' : '72px';
  //
  //	gradientSelect.style.width = '92%';
  //	// Stops events from bubbling to color option event handler
  //	mxEvent.addListener(gradientSelect, 'click', function(evt)
  //	{
  //
  //		mxEvent.consume(evt);
  //	});
  //
  ///*
  //	var gradientPanel = this.createCellColorOption(mxResources.get('gradient'), mxConstants.STYLE_GRADIENTCOLOR, '#ffffff', function(color)
  //	{
  //		if (color == null || color == mxConstants.NONE)
  //		{
  //			gradientSelect.style.display = 'none';
  //		}
  //		else
  //		{
  //			gradientSelect.style.display = '';
  //		}
  //	});
  //	*/
  ///*
  //	var fillKey = (ss.style.shape == 'image') ? mxConstants.STYLE_IMAGE_BACKGROUND : mxConstants.STYLE_FILLCOLOR;
  //
  //	var fillPanel = this.createCellColorOption(mxResources.get('fill'), fillKey, '#ffffff');
  //	fillPanel.style.fontWeight = 'bold';
  //
  //	var tmpColor = mxUtils.getValue(ss.style, fillKey, null);
  //	gradientPanel.style.display = (tmpColor != null && tmpColor != mxConstants.NONE &&
  //		ss.fill && ss.style.shape != 'image') ? '' : 'none';
  //*/
  //	var directions = ["None", "Exhibitor I","Exhibitor II"];
  //        jQuery.each( mxgetjosnusersData, function( key, value ) {
  //
  //
  //                var gradientOption = document.createElement('option');
  //
  //
  //		gradientOption.setAttribute('value', mxgetjosnusersData[key].exhibitorsid);
  //
  //		mxUtils.write(gradientOption, mxgetjosnusersData[key].companyname);
  //		gradientSelect.appendChild(gradientOption);
  //
  //        });
  //
  //
  //	//gradientPanel.appendChild(gradientSelect);
  //
  //	var listener = mxUtils.bind(this, function()
  //	{
  //		ss = this.format.getSelectionState();
  //		var value = mxUtils.getValue(ss.style, "boothOwner", "None");
  //
  //		// Handles empty string which is not allowed as a value
  //		if (value == '')
  //		{
  //			value = directions[0];
  //		}
  //
  //		gradientSelect.value = value;
  //		container.style.display = (ss.fill) ? '' : 'none';
  //		/*
  //		var fillColor = mxUtils.getValue(ss.style, mxConstants.STYLE_FILLCOLOR, null);
  //
  //		if (!ss.fill || ss.containsImage || fillColor == null || fillColor == mxConstants.NONE)
  //		{
  //			gradientPanel.style.display = 'none';
  //		}
  //		else
  //		{
  //			gradientPanel.style.display = '';
  //		}
  //		*/
  //	});
  //
  //	graph.getModel().addListener(mxEvent.CHANGE, listener);
  //	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
  //	listener();
  //
  //	mxEvent.addListener(gradientSelect, 'change', function(evt)
  //	{
  //		graph.setCellStyles("boothOwner", gradientSelect.value, graph.getSelectionCells());
  //
  //		if(gradientSelect.value != '')
  //			graph.setCellStyles("fillColor", "#dcdcdc", graph.getSelectionCells());
  //		else
  //			graph.setCellStyles("fillColor", "#FAFFCF", graph.getSelectionCells());
  //
  //
  //
  //
  //		mxEvent.consume(evt);
  //	});
  //
  //	//stylePanel.appendChild(boothNumber);
  //	//stylePanel.appendChild(gradientSelect);
  //
  //	//container.appendChild(cssPanel);
  //	container.appendChild(stylePanel);
  //
  //	if (ss.style.shape == 'swimlane')
  //	{
  //		container.appendChild(this.createCellColorOption(mxResources.get('laneColor'), 'swimlaneFillColor', '#ffffff'));
  //	}
  //
  //	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel = function (format, editorUi, container) {
  BaseFormatPanel.call(this, format, editorUi, container);
  this.init();
};

mxUtils.extend(StyleFormatPanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.init = function () {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;
  var ss = this.format.getSelectionState();

  if (!ss.containsImage) {
    // && (ss.style.shape == 'rectangle' || ss.style.shape == 'ellipse'))
    this.container.appendChild(this.addExhibitors(this.createPanel()));
    this.container.appendChild(this.addFill(this.createPanel()));

    //console.log('Shape: ' + ss.style.shape);
  }

  if (!ss.containsImage || ss.style.shape == "image") {
  }

  var opacityPanel = this.createRelativeOption(
    mxResources.get("opacity"),
    mxConstants.STYLE_OPACITY,
    41
  );
  opacityPanel.style.paddingTop = "8px";
  opacityPanel.style.paddingBottom = "8px";
  opacityPanel.style.borderBottom = "0px";

  this.container.appendChild(this.addShapes(this.createPanel()));
  this.addGeometry(this.container);

  this.container.appendChild(this.addLegendLabel(this.createPanel()));
  this.container.appendChild(this.addBoothTags(this.createPanel()));
  this.container.appendChild(this.addPricetegs(this.createPanel()));

  var label = document.createElement("div");
  label.style.border = "1px solid #c0c0c0";
  label.style.borderWidth = "0px 0px 1px 0px";
  label.style.textAlign = "center";
  label.style.fontWeight = "bold";
  label.style.overflow = "hidden";
  label.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
  label.style.paddingTop = "8px";
  label.style.height = mxClient.IS_QUIRKS ? "34px" : "25px";
  label.style.width = "100%";
  label.className = " customebgcolor";
  this.container.appendChild(label);

  //mxUtils.write(label, 'Advanced Settings');
  label.innerHTML =
    'Advanced Settings <i class="far fa-question-circle" title="Advanced configurations on the booth type physical attributes. "></i>';
  this.container.appendChild(opacityPanel);

  this.container.appendChild(this.addStroke(this.createPanel()));
  this.container.appendChild(this.addEffects(this.createPanel()));
  //var opsPanel = this.addEditOps(this.createPanel());
  var opsPanel = this.addEditPresets(this.createPanel());

  if (opsPanel.firstChild != null) {
    mxUtils.br(opsPanel);
  }

  this.container.appendChild(this.addStyleOps(opsPanel));
  jQuery("#boothtagstypedropdown").select2();
};

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function encodeCharx(original) {
  var found = true;
  var thecharchar = original.charAt(0);
  var thechar = original.charCodeAt(0);
  switch (thecharchar) {
    case "\n":
      return "\\n";
      break; //newline
    case "\r":
      return "\\r";
      break; //Carriage return
    case "'":
      return "\\'";
      break;
    case '"':
      return '\\"';
      break;
    case "&":
      return "\\&";
      break;
    case "\\":
      return "\\\\";
      break;
    case "\t":
      return "\\t";
      break;
    case "\b":
      return "\\b";
      break;
    case "\f":
      return "\\f";
      break;
    case "/":
      return "\\x2F";
      break;
    case "<":
      return "\\x3C";
      break;
    case ">":
      return "\\x3E";
      break;
    default:
      found = false;
      break;
  }
  if (!found) {
    if (thechar > 127) {
      var c = thechar;
      var a4 = c % 16;
      c = Math.floor(c / 16);
      var a3 = c % 16;
      c = Math.floor(c / 16);
      var a2 = c % 16;
      c = Math.floor(c / 16);
      var a1 = c % 16;
      //	alert(a1);
      return "\\u" + hex[a1] + hex[a2] + hex[a3] + hex[a4] + "";
    } else {
      return original;
    }
  }
}
/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addEditOps = function (div) {
  var ss = this.format.getSelectionState();
  var btn = null;

  if (this.editorUi.editor.graph.getSelectionCount() == 1) {
    btn = mxUtils.button(
      mxResources.get("editStyle"),
      mxUtils.bind(this, function (evt) {
        this.editorUi.actions.get("editStyle").funct();
      })
    );

    btn.setAttribute(
      "title",
      mxResources.get("editStyle") +
        " (" +
        this.editorUi.actions.get("editStyle").shortcut +
        ")"
    );
    btn.style.width = "202px";
    btn.style.marginBottom = "2px";

    div.appendChild(btn);
  }

  if (ss.image) {
    var btn2 = mxUtils.button(
      mxResources.get("editImage"),
      mxUtils.bind(this, function (evt) {
        this.editorUi.actions.get("image").funct();
      })
    );

    btn2.setAttribute("title", mxResources.get("editImage"));
    btn2.style.marginBottom = "2px";

    if (btn == null) {
      btn2.style.width = "202px";
    } else {
      btn.style.width = "100px";
      btn2.style.width = "100px";
      btn2.style.marginLeft = "2px";
    }

    div.appendChild(btn2);
  }

  return div;
};

StyleFormatPanel.prototype.addEditPresets = function (div) {
  var ss = this.format.getSelectionState();
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;
  var btn = null;
  var boothtypestatus = true;
  //if (this.editorUi.editor.graph.getSelectionCount() == 1)
  //{
  btn = mxUtils.button(
    "Update Booth Type",
    mxUtils.bind(this, function (evt) {
      var currentStyle = this.editorUi.actions.get("editStyle").funct();
      var currentCell = currentStyle != null ? currentStyle.split(";") : [];

      jQuery.each(currentCell, function (index, value) {
        var getboothname = value != null ? value.split("=") : [];
        if (getboothname[0] == "uno") {
          var getfillcolor = getboothname[1];
          jQuery.each(currentCell, function (indexchild, valuechild) {
            var getfillcolorname =
              valuechild != null ? valuechild.split("=") : [];
            if (getfillcolorname[0] == "fillColor") {
              currentStyle = currentStyle.replace(
                currentCell[indexchild],
                "fillColor=" + getfillcolor
              );
            }
          });
        }
      });

      jQuery.each(ArrayOfObjects, function (index, value) {
        var tokens =
          ArrayOfObjects[index].style != null
            ? ArrayOfObjects[index].style.split(";")
            : [];

        if (tokens[0] == currentCell[0]) {
          if (
            tokens[0] != "DefaultStyle1" &&
            tokens[0] != "DefaultStyle2" &&
            tokens[0] != "DefaultStyle3"
          ) {
            ArrayOfObjects[index].style = currentStyle;
            ArrayOfObjects[index].height = ss.height;
            ArrayOfObjects[index].width = ss.width;

            var fns = [];

            for (var key in ArrayOfObjects) {
              var obj = ArrayOfObjects[key];
              var getboothNameData = obj.style;
              var getboothName = getboothNameData.split(";");
              var bothtypeheight = ArrayOfObjects[key].height / mxPixelPerFeet;
              var bothtypewidth = ArrayOfObjects[key].width / mxPixelPerFeet;

              var bothheight = ArrayOfObjects[key].height;
              var bothwidth = ArrayOfObjects[key].width;
              fns.push(
                ui.sidebar.createVertexTemplateEntry(
                  obj.style,
                  bothwidth,
                  bothheight,
                  "",
                  getboothName[0] +
                    "</br>" +
                    bothtypeheight +
                    "x" +
                    bothtypewidth +
                    " ft",
                  true,
                  true,
                  "rect rectangle box"
                )
              );
            }

            ui.sidebar.addPaletteFunctions(
              "general",
              "Default Booth Types",
              true,
              fns,
              true
            );
            //ui.sidebar.addPaletteFunctionsCustom('general1', "Custom Booth Types", true, fns,true);
          } else {
            boothtypestatus = false;
            return;
          }
        }
      });
      if (boothtypestatus == false) {
        swal({
          title: "Save as New?",
          text: "You cannot change a default booth type. Would you like to save it as a new booth type?",
          type: "info",
          showCancelButton: true,
          confirmButtonText: "Save New Booth Type",
          cancelButtonText: "No",
          confirmButtonClass: "btn-info",
          closeOnConfirm: false,
        }).then(function (isConfirm) {
          var jsonObj = {};
          var status_preset = "clear";
          var presetname = "";
          swal({
            title: "Booth Type Name",
            input: "text",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Booth Type Name",
          }).then(function (inputValue) {
            inputValue = inputValue.replace(/['"]+/g, "");
            status_preset = "clear";
            if (inputValue === false) return false;

            if (inputValue === "") {
              swal.showInputError("You need to write something!");
              jQuery("body").css("cursor", "default");
              return false;
            }

            jQuery.each(ArrayOfObjects, function (index, value) {
              var tokens =
                ArrayOfObjects[index].style != null
                  ? ArrayOfObjects[index].style.split(";")
                  : [];

              if (tokens[0] == inputValue) {
                status_preset = "alreadyexist";
              }
            });
            if (status_preset == "clear") {
              presetname = inputValue.replace(/([,.!;"'])+/g, "");
              // console.log(presetname);

              jQuery.each(currentCell, function (index, value) {
                var getboothname = value != null ? value.split("=") : [];
                if (getboothname[0] == "uno") {
                  var getfillcolor = getboothname[1];
                  jQuery.each(currentCell, function (indexchild, valuechild) {
                    var getfillcolorname =
                      valuechild != null ? valuechild.split("=") : [];
                    if (getfillcolorname[0] == "fillColor") {
                      currentStyle = currentStyle.replace(
                        currentCell[indexchild],
                        "fillColor=" + getfillcolor
                      );
                    }
                  });
                }
              });

              // currentStyle = currentStyle.replace(currentCell[8], "");
              // currentStyle = currentStyle.replace(currentCell[9], "");

              currentStyle = currentStyle.replace(currentCell[0], presetname);

              jsonObj = {};
              jsonObj.width = ss.width;
              (jsonObj.height = ss.height), (jsonObj.style = currentStyle);
              ArrayOfObjects.push(jsonObj);

              var fns = [];

              for (var key in ArrayOfObjects) {
                var obj = ArrayOfObjects[key];
                var bothtypeheight =
                  ArrayOfObjects[key].height / mxPixelPerFeet;
                var bothtypewidth = ArrayOfObjects[key].width / mxPixelPerFeet;
                var getboothNameData = obj.style;
                var getboothName = getboothNameData.split(";");
                var bothheight = ArrayOfObjects[key].height;
                var bothwidth = ArrayOfObjects[key].width;
                fns.push(
                  ui.sidebar.createVertexTemplateEntry(
                    obj.style,
                    bothwidth,
                    bothheight,
                    "",
                    getboothName[0] +
                      "</br>" +
                      bothtypeheight +
                      "x" +
                      bothtypewidth +
                      " ft",
                    true,
                    true,
                    "rect rectangle box"
                  )
                );
              }

              ui.sidebar.addPaletteFunctions(
                "general",
                "Default Booth Type",
                true,
                fns,
                true
              );
              // ui.sidebar.addPaletteFunctionsCustom('general', "Custom Booth Type", true, fns, true);

              swal({
                title: "Success!",
                text: "New booth type created successfully.",
                type: "success",
                confirmButtonClass: "btn-success",
              });
            } else {
              swal.showInputError(
                "A booth type with that name already exists Please try another name."
              );
            }
          });

          if (status_preset == "clear") {
          }
        });
      } else {
        swal({
          title: "Success!",
          text: "Booth Type settings updated successfully.",
          type: "success",
          confirmButtonClass: "btn-success",
        });
      }
    })
  );

  btn.setAttribute("title", "");
  btn.style.width = "110px";
  btn.style.marginTop = "10px";
  btn.style.marginLeft = "-12px";
  btn.style.marginBottom = "2px";
  btn.style.padding = "5px";
  btn.className = "myCustomeButton";
  btn.id = "updatetypebooth";

  btn.style.fontSize = "11px";

  div.appendChild(btn);

  jQuery("#updatetypebooth").attr("title", "Update Booth Type");
  btnNew = mxUtils.button(
    "Save Booth Type As..",
    mxUtils.bind(this, function (evt) {
      var currentStyle = this.editorUi.actions.get("editStyle").funct();
      var currentCell = currentStyle != null ? currentStyle.split(";") : [];
      var jsonObj = {};
      var status_preset = "clear";
      var presetname = "";
      swal({
        title: "Booth Type Name",

        input: "text",
        inputValue: "",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Booth Type Name",
      }).then(function (inputValue) {
        status_preset = "clear";
        if (inputValue === false) return false;

        if (inputValue === "") {
          swal.showInputError("You need to write something!");
          jQuery("body").css("cursor", "default");
          return false;
        }

        jQuery.each(ArrayOfObjects, function (index, value) {
          var tokens =
            ArrayOfObjects[index].style != null
              ? ArrayOfObjects[index].style.split(";")
              : [];

          if (tokens[0] == inputValue) {
            status_preset = "alreadyexist";
          }
        });
        if (status_preset == "clear") {
          presetname = inputValue.replace(/['"]+/g, "");

          jQuery.each(currentCell, function (index, value) {
            var getboothname = value != null ? value.split("=") : [];
            if (getboothname[0] == "uno") {
              var getfillcolor = getboothname[1];
              jQuery.each(currentCell, function (indexchild, valuechild) {
                var getfillcolorname =
                  valuechild != null ? valuechild.split("=") : [];
                if (getfillcolorname[0] == "fillColor") {
                  currentStyle = currentStyle.replace(
                    currentCell[indexchild],
                    "fillColor=" + getfillcolor
                  );
                }
              });
            }
          });

          // currentStyle = currentStyle.replace(currentCell[8], "");
          // currentStyle = currentStyle.replace(currentCell[9], "");

          currentStyle = currentStyle.replace(currentCell[0], presetname);

          jsonObj = {};
          jsonObj.width = ss.width;
          (jsonObj.height = ss.height), (jsonObj.style = currentStyle);
          ArrayOfObjects.push(jsonObj);

          var fns = [];

          for (var key in ArrayOfObjects) {
            var obj = ArrayOfObjects[key];
            var bothtypeheight = ArrayOfObjects[key].height / mxPixelPerFeet;
            var bothtypewidth = ArrayOfObjects[key].width / mxPixelPerFeet;
            var getboothNameData = obj.style;
            var getboothName = getboothNameData.split(";");
            var bothheight = ArrayOfObjects[key].height;
            var bothwidth = ArrayOfObjects[key].width;
            fns.push(
              ui.sidebar.createVertexTemplateEntry(
                obj.style,
                bothwidth,
                bothheight,
                "",
                getboothName[0] +
                  "</br>" +
                  bothtypeheight +
                  "x" +
                  bothtypewidth +
                  " ft",
                true,
                true,
                "rect rectangle box"
              )
            );
          }

          ui.sidebar.addPaletteFunctions(
            "general",
            "Default Booth Type",
            true,
            fns,
            true
          );
          // ui.sidebar.addPaletteFunctionsCustom('general', "Custom Booth Type", true, fns, true);

          swal({
            title: "Success!",
            text: "New booth type created successfully.",
            type: "success",
            confirmButtonClass: "btn-success",
          });
        } else {
          swal.showInputError(
            "A booth type with that name already exists Please try another name."
          );
        }
      });

      if (status_preset == "clear") {
      }
    })
  );

  btn.setAttribute(
    "title",
    mxResources.get("editStyle") +
      " (" +
      this.editorUi.actions.get("editStyle").shortcut +
      ")"
  );
  btnNew.style.width = "117px";
  btnNew.style.marginTop = "10px";
  btnNew.style.marginBottom = "2px";
  btnNew.style.padding = "5px";
  btnNew.className = "myCustomeButton";
  btnNew.style.fontSize = "11px";
  btnNew.style.marginLeft = "10px";
  btnNew.id = "saveboothtypeas";

  div.appendChild(btnNew);
  jQuery("#saveboothtypeas").attr("title", "Save Booth Type As..");
  //}

  if (ss.image) {
    var btn2 = mxUtils.button(
      "Save as new booth",
      mxUtils.bind(this, function (evt) {
        this.editorUi.actions.get("image").funct();
      })
    );

    btn2.setAttribute("title", "Save as new booth");
    btn2.style.display = "none"; //('display', 'none');
    btn2.style.marginBottom = "2px";

    if (btn == null) {
      btn2.style.width = "202px";
    } else {
      btn.style.width = "100px";
      btn2.style.width = "110px";
      btn2.style.marginLeft = "2px";
    }

    div.appendChild(btn2);
  }

  return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addFill = function (container) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var ss = this.format.getSelectionState();

  container.style.paddingTop = "6px";
  container.style.paddingBottom = "6px";
  container.style.borderBottom = "0px";

  var label = document.createElement("div");
  label.style.border = "1px solid #c0c0c0";
  label.style.borderWidth = "0px 0px 1px 0px";
  label.style.textAlign = "center";
  label.style.fontWeight = "bold";
  label.style.overflow = "hidden";
  label.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
  label.style.paddingTop = "8px";
  label.style.height = mxClient.IS_QUIRKS ? "34px" : "25px";
  label.style.width = "100%";
  label.className = " customebgcolor";
  this.container.appendChild(label);

  //mxUtils.write(label, 'Booth Type Settings');
  label.innerHTML =
    "Booth Type Settings <i class=\"far fa-question-circle\" title=\"Set the visual aspects and dimensions of the booth here. The color you select for 'Unoccupied' will be the set color for the booth(s) selected that don't have an exhibitor assigned. 'Occupied' color will be the color once an Exhibitor is assigned. Note these colors may be overridden in the Legend Labels below based on your settings in that section. \"></i>";
  // Adds gradient direction option
  var gradientSelect = document.createElement("select");
  gradientSelect.style.position = "absolute";
  gradientSelect.style.marginTop = "-5px";
  gradientSelect.style.height = "26px";
  gradientSelect.style.right = mxClient.IS_QUIRKS ? "52px" : "72px";
  gradientSelect.style.width = "70px";

  // Stops events from bubbling to color option event handler
  mxEvent.addListener(gradientSelect, "click", function (evt) {
    mxEvent.consume(evt);
  });

  var gradientPanel = this.createCellColorOption(
    mxResources.get("gradient"),
    mxConstants.STYLE_GRADIENTCOLOR,
    "#ffffff",
    function (color) {
      if (color == null || color == mxConstants.NONE) {
        gradientSelect.style.display = "none";
      } else {
        gradientSelect.style.display = "none";
      }
    }
  );

  var fillKey =
    ss.style.shape == "image"
      ? mxConstants.STYLE_IMAGE_BACKGROUND
      : mxConstants.STYLE_FILLCOLOR;

  var fillPanel = this.createCellColorOption("Unoccupied", "uno", "#ffffff");
  fillPanel.style.fontWeight = "bold";

  var unOccp = this.createCellColorOption("Occupied", "occ", "#ffffff");
  unOccp.style.fontWeight = "bold";

  var tmpColor = mxUtils.getValue(ss.style, fillKey, null);
  gradientPanel.style.display =
    tmpColor != null &&
    tmpColor != mxConstants.NONE &&
    ss.fill &&
    ss.style.shape != "image"
      ? ""
      : "none";

  var directions = [
    mxConstants.DIRECTION_NORTH,
    mxConstants.DIRECTION_EAST,
    mxConstants.DIRECTION_SOUTH,
    mxConstants.DIRECTION_WEST,
  ];

  for (var i = 0; i < directions.length; i++) {
    var gradientOption = document.createElement("option");
    gradientOption.setAttribute("value", directions[i]);
    mxUtils.write(gradientOption, mxResources.get(directions[i]));
    gradientSelect.appendChild(gradientOption);
  }

  gradientPanel.appendChild(gradientSelect);

  var listener = mxUtils.bind(this, function () {
    ss = this.format.getSelectionState();
    var value = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_GRADIENT_DIRECTION,
      mxConstants.DIRECTION_SOUTH
    );

    // Handles empty string which is not allowed as a value
    if (value == "") {
      value = mxConstants.DIRECTION_SOUTH;
    }

    gradientSelect.value = value;
    container.style.display = ss.fill ? "" : "none";

    var fillColor = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_FILLCOLOR,
      null
    );

    if (
      !ss.fill ||
      ss.containsImage ||
      fillColor == null ||
      fillColor == mxConstants.NONE
    ) {
      gradientPanel.style.display = "none";
    } else {
      gradientPanel.style.display = "none";
    }
  });

  graph.getModel().addListener(mxEvent.CHANGE, listener);
  this.listeners.push({
    destroy: function () {
      graph.getModel().removeListener(listener);
      //console.log("asda");;
    },
  });
  listener();

  mxEvent.addListener(gradientSelect, "change", function (evt) {
    graph.setCellStyles(
      mxConstants.STYLE_GRADIENT_DIRECTION,
      gradientSelect.value,
      graph.getSelectionCells()
    );
    mxEvent.consume(evt);
  });

  function update(evt) {
    // Maximum stroke width is 999
    var value = parseInt(input.value);
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));

    var cell = graph.getSelectionCells();
    graph.setCellStyles("fontSize", value, graph.getSelectionCells());

    input.value = value;
    //console.log(fontvalue);
    mxEvent.consume(evt);
  }

  var cell = graph.getSelectionCells();
  var fontvalue = 12;
  if (cell[0].style) {
    var cellData = cell[0].style;
    var getfontValue = cellData.split(";");
    jQuery.each(getfontValue, function (index, value) {
      var getfontKey = value.split("=");
      if (getfontKey[0] == "fontSize") {
        fontvalue = getfontKey[1];
      }
    });
  }

  var input = document.createElement("input");
  input.style.textAlign = "right";
  input.style.marginTop = "10px";
  input.style.width = "41px";
  input.style.float = "right";
  input.style.marginRight = "13%";
  input.style.width = "41px";

  input.value = fontvalue;
  input.setAttribute("title", "FontSize");

  var stepper = this.createStepper(input, update, 1, 9, false, fontvalue);
  stepper.style.display = input.style.display;
  stepper.style.marginTop = "10px";
  stepper.style.float = "right";
  stepper.style.marginLeft = "81%";
  stepper.style.marginTop = "10px";

  var mainrow = document.createElement("div");
  mainrow.style.height = "40px";

  var btypename = this.createTitle("Font Size ");
  btypename.style.paddingBottom = "6px";
  btypename.style.width = "70px";
  btypename.style.marginTop = "10px";

  btypename.style.float = "left";
  mainrow.appendChild(btypename);

  mainrow.appendChild(input);
  mainrow.appendChild(stepper);

  container.appendChild(fillPanel);
  container.appendChild(unOccp);
  container.appendChild(mainrow);

  mxEvent.addListener(input, "keypress", function (evt) {
    if (evt.which == 13) {
      var value = parseInt(input.value);
      value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));
      var cell = graph.getSelectionCells();
      graph.setCellStyles("fontSize", value, graph.getSelectionCells());

      input.value = value;

      mxEvent.consume(evt);
    }
  });

  mxEvent.addListener(input, "change", function (evt) {
    var value = parseInt(input.value);
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));
    var cell = graph.getSelectionCells();
    graph.setCellStyles("fontSize", value, graph.getSelectionCells());

    input.value = value;

    mxEvent.consume(evt);
  });

  if (ss.style.shape == "swimlane") {
    container.appendChild(
      this.createCellColorOption(
        mxResources.get("laneColor"),
        "swimlaneFillColor",
        "#ffffff"
      )
    );
  }

  return container;
};
StyleFormatPanel.prototype.addBoothTags = function (container) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var ss = this.format.getSelectionState();

  container.style.paddingTop = "6px";
  container.style.paddingBottom = "6px";
  container.style.borderBottom = "0px";

  var tags = document.createElement("div");
  tags.style.border = "1px solid #c0c0c0";
  tags.style.borderWidth = "0px 0px 1px 0px";
  tags.style.textAlign = "center";
  tags.style.fontWeight = "bold";
  tags.style.overflow = "hidden";
  tags.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
  tags.style.paddingTop = "8px";
  tags.style.height = mxClient.IS_QUIRKS ? "34px" : "25px";
  tags.style.width = "100%";
  tags.className = " customebgcolor";
  this.container.appendChild(tags);

  //mxUtils.write(label, 'Legend Labels');
  // tags.innerHTML = 'Booth Tags <i class="far fa-question-circle" title="Use this setting to \'group\' or \'categorize\' booths together on the interactive floor plan. Users will be able to view and identify booths tagged with these labels. Note you also have the option to override the booth color settings above with a legend label color. \n Be sure to click \'Apply Legend Label\' to apply any changes in this section, and click \'Save\' to publish these changes to the live floor plan. "></i>';

  tags.innerHTML =
    "Booth Tags <i class=\"far fa-question-circle\" title=\"Use this setting to 'Group' or 'Categorize' booths together on the interactive floor plan. Users will be able to view and identify booths tagged with these labels.\"></i>";

  var TagsstylePanel = this.createPanel();
  TagsstylePanel.style.paddingTop = "2px";
  TagsstylePanel.style.paddingBottom = "2px";
  TagsstylePanel.style.paddingLeft = "0px";
  TagsstylePanel.style.position = "relative";
  TagsstylePanel.style.marginLeft = "-2px";
  TagsstylePanel.style.borderWidth = "0px";
  TagsstylePanel.className = "geToolbarContainer";

  if (mxClient.IS_QUIRKS) {
    TagsstylePanel.style.display = "block";
  }

  var cell = graph.getSelectionCells();
  boothTagsList = "";

  if (mxUtils.isNode(cell[0].value)) {
    boothTagsList = cell[0].getAttribute("boothtags", "");
  }

  var createDivTags = document.createElement("div");

  var submitbuttonlebalTags = this.createTitle("");
  submitbuttonlebalTags.style.paddingBottom = "6px";
  TagsstylePanel.appendChild(submitbuttonlebalTags);

  var selectboothtags = document.createElement("select");
  selectboothtags.style.width = "70%";
  selectboothtags.style.marginRight = "10px";
  selectboothtags.id = "boothtagstypedropdown";
  selectboothtags.className = "select2";
  selectboothtags.dataPlaceholder = "Select Booth Tags";
  selectboothtags.title = "Select Booth Tags";
  selectboothtags.multiple = "multiple";

  var optiontags = document.createElement("option");
  //optiontags.value = '';
  //optiontags.text = 'None';

  if (boothTagsList == "") {
    //  optiontags.setAttribute('selected', 'selected');
  }

  // selectboothtags.appendChild(optiontags);

  jQuery.each(BoothTagsObjects, function (index1, value) {
    var option = document.createElement("option");
    option.value = value.ID;
    option.text = value.name;

    if (boothTagsList != "" && boothTagsList != undefined) {
      var foreachvalues = boothTagsList.split(",");
    } else {
      var foreachvalues = [];
    }
    if (jQuery.inArray(value.ID, foreachvalues) != -1) {
      option.setAttribute("selected", "selected");
    }

    selectboothtags.appendChild(option);
  });

  createDivTags.appendChild(selectboothtags);

  var manageboothtypesTags = document.createElement("a");
  manageboothtypesTags.className = "myCustomeButton";
  manageboothtypesTags.style.padding = "5px 4px 5px 4px";
  manageboothtypesTags.style.marginLeft = "10px";
  // manageboothtypes.setAttribute('onclick', 'getallboothtypes()');
  manageboothtypesTags.innerHTML = "Manage";

  createDivTags.appendChild(manageboothtypesTags);

  TagsstylePanel.appendChild(createDivTags);

  var boothtagsbuttonsubmit = document.createElement("button");
  boothtagsbuttonsubmit.id = "applybuttonboothtags";
  boothtagsbuttonsubmit.title = "";

  boothtagsbuttonsubmit.style.width = "56%";
  boothtagsbuttonsubmit.style.float = "right";
  boothtagsbuttonsubmit.style.marginTop = "10px";
  boothtagsbuttonsubmit.style.marginRight = "50px";
  boothtagsbuttonsubmit.className = "myCustomeButton";

  boothtagsbuttonsubmit.innerHTML = "Apply Booth Tags";

  mxEvent.addListener(manageboothtypesTags, "click", function () {
    var data = new FormData();
    var addtext = "'add'";
    var classstatusshow = "";
    data.append("post_id", mxPostID);

    var html = "<p class='successmessage'></p>";
    html +=
      '<div style="max-height: 350px;overflow: auto;"><table class="table mycustometable" id="listofalllegends">';

    if (BoothTagsObjects.length > 0) {
      classstatusshow = "";
    } else {
      classstatusshow = "display:none;";
    }
    html +=
      '<tr id="showheaderlegend" style="' +
      classstatusshow +
      '"><th style="text-align:center;">Position</th><th style="text-align:center;">Tag Title</th><th style="text-align:center;">Delete</th></tr>';

    //console.log(BoothTagsObjects);
    jQuery.each(BoothTagsObjects, function (index1, value) {
      var IDCODE = "'" + value.ID + "'";
      var statusremove = "removeable";
      var localxml = mxUtils.getXml(ui.editor.getGraphXml());

      var localxml = mxUtils.getXml(ui.editor.getGraphXml());
      var xmlDoc = jQuery.parseXML(localxml);
      $xml = jQuery(xmlDoc);
      // console.log($xml);
      // console.log(statusremove);
      jQuery($xml)
        .find("MyNode")
        .each(function () {
          var boothtagsArray = jQuery(this).attr("boothtags");
          // console.log(boothtagsArray);
          if (boothtagsArray != "" && boothtagsArray != undefined) {
            var boothTagsListarray = boothtagsArray.split(",");
          } else {
            var boothTagsListarray = [];
          }
          if (jQuery.inArray(value.ID, boothTagsListarray) != -1) {
            statusremove = "notremoveable";
          }
        });

      html +=
        '<tr class="lengendsrows" id="' +
        value.ID +
        '" ><td style="width:5%;text-align:center;"><i title="Move" style="margin-top: 8px;cursor: move;" class="hi-icon fusion-li-icon fas fa-arrows-alt-v fa-lg"></i></td><td    style="width: 25%;"><input type="text" title="Label" value="' +
        value.name +
        '" id="boothtypename_' +
        value.ID +
        '" /></td>';

      if (statusremove == "notremoveable") {
        html +=
          '<td style="width: 10%;text-align: center;"><i style="color: gray;" title="The selected tag cannot be deleted as it is assigned to one or more booths. Please try deleting again after removing the label from all booths." class="hi-icon fusion-li-icon fa fa-times-circle fa-lg"></i></td></tr>';
      } else {
        html +=
          '<td style="width: 10%;text-align: center;"><a style="cursor: pointer;"  title="Remove" onclick="removethisrow(' +
          IDCODE +
          ')" ><i class="hi-icon fusion-li-icon fa fa-times-circle fa-lg"></i></a></td></tr>';
      }
    });

    html += "</table></div>";
    html +=
      '<p id="legendsbuttons" style="' +
      classstatusshow +
      ' text-align:center;margin: 10px 0px 0px 0px;"><button class="btn btn-large btn-info" onclick="updateallboothstags()">Save</button><button style="margin-left: 11px;background-color: #b0b0b0; border-color: #b0b0b0;" class="btn btn-large btn-info" onclick="closelegendsdilog()">Cancel</button></p>';

    html += "<hr>";

    html += '<table class="table mycustometable">';
    html += "<tr ><th></th><th>Label</th></tr>";
    html +=
      '<tr><td style="width:5%;"><b>Add New</b></td><td style="width: 25%;"><input title="Label" type="text" id="addnewlegendname" ></td>';
    html +=
      '<td style="width: 10%;text-align: center;"><button class="btn btn-large btn-info" onclick="insertnewrowintoboothtagstypes()">Add</button></td></tr>';

    html += "</table>";

    //  }

    legendsdilog = jQuery.confirm({
      title: '<b style="text-align:center;">Booth Tags</b>',
      content: html,
      html: true,

      closeIcon: true,
      columnClass: "jconfirm-box-container-special-boothtypes",
      cancelButton: false, // hides the cancel button.
      confirmButton: false, // hides the confirm button
    });
    jQuery(".mycustometable tbody").sortable();
  });

  mxEvent.addListener(boothtagsbuttonsubmit, "click", function () {
    var cell = graph.getSelectionCells();
    document.getElementById("applybuttonlegend").focus();
    var legendlabelsdropdown = jQuery("#boothtagstypedropdown").val();
    jQuery.each(cell, function (cellindex, cellvalue) {
      var startfloorplanedtitng = {};
      startfloorplanedtitng.action = "Apply Booth Tags";
      var valuexmlstring = "";
      jQuery.each(cellvalue.value, function (valueindex, valuevalue) {
        if (valueindex == "outerHTML") {
          valuexmlstring = valuevalue;
        }
      });
      startfloorplanedtitng.boothid = cellvalue.id;
      startfloorplanedtitng.preboothdetail = valuexmlstring;
      startfloorplanedtitng.preboothstyle = cellvalue.style;

      startfloorplanedtitng.datetime = new Date(jQuery.now());

      //document.getElementById("boothtagstypedropdown");
      //var seletedlegendlabelsvalue = legendlabelsdropdown.options[legendlabelsdropdown.selectedIndex].value;
      //               console.log(legendlabelsdropdown)

      //                 console.log(foreachvalues)

      var labelvalue = "";
      var boothdetailvalue = "";
      var assigenduserID = "none";
      var companydescripiton = "";
      var boothproductid = "none";
      var seletedpricetegkeyvalue = "none";
      var seletedlegendlabelsvalue = "";
      var selectedlegendcolorcodeun = "";
      var selectedlegendcolorcodeocc = "";

      if (mxUtils.isNode(cellvalue.value)) {
        assigenduserID = cellvalue.getAttribute("boothOwner", "");
        labelvalue = cellvalue.getAttribute("mylabel", "");
        boothdetailvalue = cellvalue.getAttribute("boothDetail", "");
        companydescripiton = cellvalue.getAttribute("companydescripiton", "");
        boothproductid = cellvalue.getAttribute("boothproductid", "");
        seletedpricetegkeyvalue = cellvalue.getAttribute("pricetegid", "");

        seletedlegendlabelsvalue = cellvalue.getAttribute("legendlabels", "");
        selectedlegendcolorcodeun = cellvalue.getAttribute(
          "legendlabelscolorUn",
          ""
        );
        selectedlegendcolorcodeocc = cellvalue.getAttribute(
          "legendlabelscolorOcc",
          ""
        );
      }

      var doc = mxUtils.createXmlDocument();
      var node = doc.createElement("MyNode");

      node.setAttribute("boothOwner", assigenduserID);
      node.setAttribute("mylabel", labelvalue);
      node.setAttribute("boothDetail", boothdetailvalue);

      node.setAttribute("legendlabels", seletedlegendlabelsvalue);
      node.setAttribute("legendlabelscolorUn", selectedlegendcolorcodeun);
      node.setAttribute("legendlabelscolorOcc", selectedlegendcolorcodeocc);
      node.setAttribute("companydescripiton", companydescripiton);
      node.setAttribute("boothproductid", boothproductid);
      node.setAttribute("pricetegid", seletedpricetegkeyvalue);

      node.setAttribute("boothtags", legendlabelsdropdown);

      cellvalue.value = node;
      graph.cellLabelChanged(cellvalue, "");

      var valuexmlstring = "";
      jQuery.each(cellvalue.value, function (valueindex, valuevalue) {
        if (valueindex == "outerHTML") {
          valuexmlstring = valuevalue;
        }
      });
      startfloorplanedtitng.postboothdetail = valuexmlstring;
      startfloorplanedtitng.postboothstyle = cellvalue.style;
      expogenielogging.push(startfloorplanedtitng);
    });

    jQuery("#legendlabeltypedropdown").select2();
    jQuery("#boothtagstypedropdown").val(legendlabelsdropdown);
    jQuery("#boothtagstypedropdown").select2().trigger("change");
  });

  TagsstylePanel.appendChild(boothtagsbuttonsubmit);

  container.appendChild(TagsstylePanel);

  container.style.paddingTop = "0px";

  return container;
};
StyleFormatPanel.prototype.addLegendLabel = function (container) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var ss = this.format.getSelectionState();

  container.style.paddingTop = "6px";
  container.style.paddingBottom = "6px";
  container.style.borderBottom = "0px";

  var label = document.createElement("div");
  label.style.border = "1px solid #c0c0c0";
  label.style.borderWidth = "0px 0px 1px 0px";
  label.style.textAlign = "center";
  label.style.fontWeight = "bold";
  label.style.overflow = "hidden";
  label.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
  label.style.paddingTop = "8px";
  label.style.height = mxClient.IS_QUIRKS ? "34px" : "25px";
  label.style.width = "100%";
  label.className = " customebgcolor";
  this.container.appendChild(label);

  //mxUtils.write(label, 'Legend Labels');
  label.innerHTML =
    "Legend Labels <i class=\"far fa-question-circle\" title=\"Use this setting to 'group' or 'categorize' booths together on the interactive floor plan. Users will be able to view and identify booths tagged with these labels. Note you also have the option to override the booth color settings above with a legend label color. \n Be sure to click 'Apply Legend Label' to apply any changes in this section, and click 'Save' to publish these changes to the live floor plan. \"></i>";

  var stylePanel = this.createPanel();
  stylePanel.style.paddingTop = "2px";
  stylePanel.style.paddingBottom = "2px";
  stylePanel.style.paddingLeft = "0px";
  stylePanel.style.position = "relative";
  stylePanel.style.marginLeft = "-2px";
  stylePanel.style.borderWidth = "0px";
  stylePanel.className = "geToolbarContainer";

  if (mxClient.IS_QUIRKS) {
    stylePanel.style.display = "block";
  }

  var cell = graph.getSelectionCells();

  if (mxUtils.isNode(cell[0].value)) {
    legendlabelID = cell[0].getAttribute("legendlabels", "");
  }

  var createDiv = document.createElement("div");

  var submitbuttonlebal = this.createTitle("");
  submitbuttonlebal.style.paddingBottom = "6px";
  stylePanel.appendChild(submitbuttonlebal);

  var selectboothtypes = document.createElement("select");
  selectboothtypes.style.width = "70%";
  selectboothtypes.style.marginRight = "10px";
  selectboothtypes.id = "legendlabeltypedropdown";
  selectboothtypes.className = "select2";
  var option = document.createElement("option");
  option.value = "";

  option.text = "None";

  if (legendlabelID == "") {
    option.setAttribute("selected", "selected");
  }
  selectboothtypes.appendChild(option);

  jQuery.each(LegendsOfObjects, function (index1, value) {
    var option = document.createElement("option");
    option.value = value.ID;
    option.text = value.name;
    option.style.backgroundColor = value.colorcode;
    if (legendlabelID == value.ID) {
      option.setAttribute("selected", "selected");
    }

    selectboothtypes.appendChild(option);
  });

  createDiv.appendChild(selectboothtypes);

  var manageboothtypes = document.createElement("a");
  manageboothtypes.className = "myCustomeButton";
  manageboothtypes.style.padding = "5px 4px 5px 4px";
  manageboothtypes.style.marginLeft = "10px";
  // manageboothtypes.setAttribute('onclick', 'getallboothtypes()');
  manageboothtypes.innerHTML = "Manage";

  createDiv.appendChild(manageboothtypes);

  stylePanel.appendChild(createDiv);

  var legendbuttonsubmit = document.createElement("button");
  legendbuttonsubmit.id = "applybuttonlegend";
  legendbuttonsubmit.title = "";

  legendbuttonsubmit.style.width = "56%";
  legendbuttonsubmit.style.float = "right";
  legendbuttonsubmit.style.marginTop = "10px";
  legendbuttonsubmit.style.marginRight = "50px";
  legendbuttonsubmit.className = "myCustomeButton";

  legendbuttonsubmit.innerHTML = "Apply Legend Label";

  mxEvent.addListener(manageboothtypes, "click", function () {
    var data = new FormData();
    var addtext = "'add'";
    var classstatusshow = "";
    data.append("post_id", mxPostID);

    var html = "<p class='successmessage'></p>";

    // if(data == 'empty'){

    //  }else{

    //  var boothtypeslist = JSON.parse(data);

    // console.log(boothtypeslist);
    html +=
      '<div style="max-height: 350px;overflow: auto;"><table class="table mycustometable" id="listofalllegends">';

    if (LegendsOfObjects.length > 0) {
      classstatusshow = "";
    } else {
      classstatusshow = "display:none;";
    }
    html +=
      '<tr id="showheaderlegend" style="' +
      classstatusshow +
      '"><th style="text-align:center;">Position</th><th style="text-align:center;">Label</th><th style="text-align:center;" >Color Override <i class="far fa-question-circle" title="Enabling this will override both the Occupied AND the Unoccupied color of selected booths. Leave this disabled if you only want the Legend Label to be a text label only."></i></th><th style="text-align:center;">Unoccupied</th><th style="text-align:center;">Occupied</th><th style="text-align:center;">Delete</th></tr>';

    jQuery.each(LegendsOfObjects, function (index1, value) {
      var IDCODE = "'" + value.ID + "'";
      var statusremove = "removeable";
      var localxml = mxUtils.getXml(ui.editor.getGraphXml());

      var localxml = mxUtils.getXml(ui.editor.getGraphXml());
      var xmlDoc = jQuery.parseXML(localxml);
      $xml = jQuery(xmlDoc);
      jQuery($xml)
        .find("MyNode")
        .each(function () {
          var legendlabels = jQuery(this).attr("legendlabels");
          if (legendlabels == value.ID) {
            statusremove = "notremoveable";
          }
        });

      html +=
        '<tr class="lengendsrows" id="' +
        value.ID +
        '" ><td style="width:5%;text-align:center;"><i title="Move" style="margin-top: 8px;cursor: move;" class="hi-icon fusion-li-icon fas fa-arrows-alt-v fa-lg"></i></td><td    style="width: 25%;"><input type="text" title="Label" value="' +
        value.name +
        '" id="boothtypename_' +
        value.ID +
        '" /></td>';
      if (value.colorstatus == true) {
        html +=
          '<td style="width: 10%;text-align: center;"><label style="" title="Enabling this will override both the Occupied AND the Unoccupied color of selected booths. Leave this disabled if you only want the Legend Label to be a text label only." class="switch"><input type="checkbox" onclick="hidecolorselection(' +
          IDCODE +
          ')"  id="lengendcolorstatus_' +
          value.ID +
          '" checked><span class="slider round"></span></label></td><td style="width: 10%;text-align: center;"><input title="Select Unoccupied Color" type="color" value="' +
          value.colorcode +
          '" id="boothtypecolor_' +
          value.ID +
          '" /></td><td style="width: 10%;text-align: center;"><input title="Select Occupied Color" type="color" value="' +
          value.colorcodeOcc +
          '" id="boothtypecolorOcc_' +
          value.ID +
          '" /></td>';
      } else {
        html +=
          '<td style="width: 10%;text-align: center;"><label  title="Enabling this will override both the Occupied AND the Unoccupied color of selected booths. Leave this disabled if you only want the Legend Label to be a text label only." class="switch"><input type="checkbox" onclick="hidecolorselection(' +
          IDCODE +
          ')"  id="lengendcolorstatus_' +
          value.ID +
          '" ><span class="slider round"></span></label></td><td style="width: 10%;text-align: center;"><input style="display:none;" title="Select Unoccupied Color" type="color" value="' +
          value.colorcode +
          '" id="boothtypecolor_' +
          value.ID +
          '" /></td><td style="width: 10%;text-align: center;"><input title="Select Occupied Color" style="display:none;" type="color" value="' +
          value.colorcodeOcc +
          '" id="boothtypecolorOcc_' +
          value.ID +
          '" /></td>';
      }
      if (statusremove == "notremoveable") {
        html +=
          '<td style="width: 10%;text-align: center;"><i style="color: gray;" title="The selected label cannot be deleted as it is assigned to one or more booths. Please try deleting again after removing the label from all booths." class="hi-icon fusion-li-icon fa fa-times-circle fa-lg"></i></td></tr>';
      } else {
        html +=
          '<td style="width: 10%;text-align: center;"><a style="cursor: pointer;"  title="Remove" onclick="removethisrow(' +
          IDCODE +
          ')" ><i class="hi-icon fusion-li-icon fa fa-times-circle fa-lg"></i></a></td></tr>';
      }
    });

    html += "</table></div>";
    html +=
      '<p id="legendsbuttons" style="' +
      classstatusshow +
      ' text-align:center;margin: 10px 0px 0px 0px;"><button class="btn btn-large btn-info" onclick="updatealllengends()">Save</button><button style="margin-left: 11px;background-color: #b0b0b0; border-color: #b0b0b0;" class="btn btn-large btn-info" onclick="closelegendsdilog()">Cancel</button></p>';
    html += "<hr>";

    html += '<table class="table mycustometable">';
    html +=
      '<tr ><th></th><th>Label</th><th title="Enabling this will override both the Occupied AND the Unoccupied color of selected booths. Leave this disabled if you only want the Legend Label to be a text label only." style="text-align:center;">Color Override <i class="far fa-question-circle" title="Enabling this will override both the Occupied AND the Unoccupied color of selected booths. Leave this disabled if you only want the Legend Label to be a text label only."></i></th><th>Unoccupied</th><th>Occupied</th></tr>';
    html +=
      '<tr><td style="width:5%;"><b>Add New</b></td><td style="width: 25%;"><input title="Label" type="text" id="addnewlegendname" ></td>';
    html +=
      '<td style="width: 10%;text-align: center;"><label  title="Enabling this will override both the Occupied AND the Unoccupied color of selected booths. Leave this disabled if you only want the Legend Label to be a text label only." class="switch"><input type="checkbox" onclick="hidecolorselection(' +
      addtext +
      ')"  id="addnewlegendstatus" checked><span class="slider round"></span></label></td><td style="width: 10%;text-align: center;"><input title="Select Unoccupied Color" type="color"  id="addnewlegendcolorcode" ></td><td style="width: 10%;text-align: center;"><input title="Select Occupied Color" type="color"  id="addnewlegendcolorcodeOcc" ></td><td style="width: 10%;text-align: center;"><button class="btn btn-large btn-info" onclick="insertnewrowintolegendtypes()">Add</button></td></tr>';
    html += "</table>";

    //  }

    legendsdilog = jQuery.confirm({
      title: '<b style="text-align:center;">Legend Labels</b>',
      content: html,
      html: true,

      closeIcon: true,
      columnClass: "jconfirm-box-container-special-boothtypes",
      cancelButton: false, // hides the cancel button.
      confirmButton: false, // hides the confirm button.
    });
    jQuery(".mycustometable tbody").sortable();
  });

  mxEvent.addListener(legendbuttonsubmit, "click", function () {
    var cell = graph.getSelectionCells();
    document.getElementById("applybuttonlegend").focus();
    jQuery.each(cell, function (cellindex, cellvalue) {
      var startfloorplanedtitng = {};
      startfloorplanedtitng.action = "Apply Legend Label";
      var valuexmlstring = "";
      jQuery.each(cellvalue.value, function (valueindex, valuevalue) {
        if (valueindex == "outerHTML") {
          valuexmlstring = valuevalue;
        }
      });
      startfloorplanedtitng.boothid = cellvalue.id;
      startfloorplanedtitng.preboothdetail = valuexmlstring;
      startfloorplanedtitng.preboothstyle = cellvalue.style;
      startfloorplanedtitng.datetime = new Date(jQuery.now());

      // console.log(cellvalue);
      var legendlabelsdropdown = document.getElementById(
        "legendlabeltypedropdown"
      );
      var seletedlegendlabelsvalue =
        legendlabelsdropdown.options[legendlabelsdropdown.selectedIndex].value;
      var selectedlegendcolorcodeun = "none";
      var selectedlegendcolorcodeocc = "none";
      jQuery.each(LegendsOfObjects, function (index1, value) {
        if (value.ID == seletedlegendlabelsvalue) {
          selectedlegendcolorcodeun = value.colorcode;
          selectedlegendcolorcodeocc = value.colorcodeOcc;
        }
      });

      var labelvalue = "";
      var boothdetailvalue = "";
      var assigenduserID = "none";
      var companydescripiton = "";
      var boothproductid = "none";
      var seletedpricetegkeyvalue = "none";
      var boothtags = "";
      if (mxUtils.isNode(cellvalue.value)) {
        assigenduserID = cellvalue.getAttribute("boothOwner", "");
        labelvalue = cellvalue.getAttribute("mylabel", "");
        boothdetailvalue = cellvalue.getAttribute("boothDetail", "");
        companydescripiton = cellvalue.getAttribute("companydescripiton", "");
        boothproductid = cellvalue.getAttribute("boothproductid", "");
        seletedpricetegkeyvalue = cellvalue.getAttribute("pricetegid", "");
        boothtags = cellvalue.getAttribute("boothtags", "");
      }

      var doc = mxUtils.createXmlDocument();
      var node = doc.createElement("MyNode");

      node.setAttribute("boothOwner", assigenduserID);
      node.setAttribute("mylabel", labelvalue);
      node.setAttribute("boothDetail", boothdetailvalue);

      node.setAttribute("legendlabels", seletedlegendlabelsvalue);
      node.setAttribute("legendlabelscolorUn", selectedlegendcolorcodeun);
      node.setAttribute("legendlabelscolorOcc", selectedlegendcolorcodeocc);
      node.setAttribute("companydescripiton", companydescripiton);
      node.setAttribute("boothproductid", boothproductid);
      node.setAttribute("pricetegid", seletedpricetegkeyvalue);
      node.setAttribute("boothtags", boothtags);

      var cellStyle = cellvalue.style;
      var tokens = cellStyle != null ? cellStyle.split(";") : [];
      var occcolor = "";
      var unoccou = "";
      jQuery.each(tokens, function (index, value) {
        var getboothname = value != null ? value.split("=") : [];
        if (getboothname[0] == "occ") {
          occcolor = getboothname[1];
        } else if (getboothname[0] == "uno") {
          unoccou = getboothname[1];
        }
      });

      // console.log(assigenduserID);
      if (assigenduserID != "none" && assigenduserID != "") {
        // console.log(selectedlegendcolorcodeocc);
        if (
          seletedlegendlabelsvalue != "none" &&
          seletedlegendlabelsvalue != ""
        ) {
          if (selectedlegendcolorcodeocc == "none") {
            graph.setCellStyles("fillColor", occcolor, cellvalue);
          } else {
            graph.setCellStyles(
              "fillColor",
              selectedlegendcolorcodeocc,
              cellvalue
            );
          }
        } else {
          // console.log(occcolor + "OCCcolor");
          graph.setCellStyles("fillColor", occcolor, cellvalue);
        }
      } else {
        // console.log(selectedlegendcolorcodeocc);
        if (
          seletedlegendlabelsvalue != "none" &&
          seletedlegendlabelsvalue != ""
        ) {
          //graph.setCellStyles("fillColor", selectedlegendcolorcodeun, cellvalue);
          if (selectedlegendcolorcodeun == "none") {
            graph.setCellStyles("fillColor", unoccou, cellvalue);
          } else {
            graph.setCellStyles(
              "fillColor",
              selectedlegendcolorcodeun,
              cellvalue
            );
          }
        } else {
          // console.log(occcolor + "UOCCColor");
          graph.setCellStyles("fillColor", unoccou, cellvalue);
        }
      }

      cellvalue.value = node;
      graph.cellLabelChanged(cellvalue, "");
      var valuexmlstring = "";
      jQuery.each(cellvalue.value, function (valueindex, valuevalue) {
        if (valueindex == "outerHTML") {
          valuexmlstring = valuevalue;
        }
      });
      startfloorplanedtitng.postboothdetail = valuexmlstring;
      startfloorplanedtitng.postboothstyle = cellvalue.style;
      expogenielogging.push(startfloorplanedtitng);
    });

    jQuery("#legendlabeltypedropdown").select2();
    jQuery("#boothtagstypedropdown").select2();
  });

  stylePanel.appendChild(legendbuttonsubmit);

  container.appendChild(stylePanel);

  container.style.paddingTop = "0px";

  return container;
};
StyleFormatPanel.prototype.removelegendlable = function (container) {
  // console.log(container);
};
StyleFormatPanel.prototype.addPricetegs = function (container) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var ss = this.format.getSelectionState();
  var pricetegsID = "";
  container.style.paddingTop = "6px";
  container.style.paddingBottom = "6px";
  container.style.borderBottom = "0px";

  var label = document.createElement("div");
  label.style.border = "1px solid #c0c0c0";
  label.style.borderWidth = "0px 0px 1px 0px";
  label.style.textAlign = "center";
  label.style.fontWeight = "bold";
  label.style.overflow = "hidden";
  label.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
  label.style.paddingTop = "8px";
  label.style.height = mxClient.IS_QUIRKS ? "34px" : "25px";
  label.style.width = "100%";
  label.className = " customebgcolor";
  this.container.appendChild(label);

  //mxUtils.write(label, 'Price Tags');
  label.innerHTML =
    'Self-Booth Purchase <i class="far fa-question-circle" title="Use this feature if you want to allow your users to self-select, assign, and/or pay for booths directly from the interactive floor plan. Note that any booths configured with this option will make the booth purchasable by users and assign them automatically without your approval. If you need to maintain control of assigning your users to booths, do NOT use this feature."></i>';

  var stylePanel = this.createPanel();
  stylePanel.style.paddingTop = "2px";
  stylePanel.style.paddingBottom = "2px";
  stylePanel.style.paddingLeft = "0px";
  stylePanel.style.position = "relative";
  stylePanel.style.marginLeft = "-2px";
  stylePanel.style.borderWidth = "0px";
  stylePanel.className = "geToolbarContainer";

  if (mxClient.IS_QUIRKS) {
    stylePanel.style.display = "block";
  }

  var cell = graph.getSelectionCells();
  var selectedBoothID = cell[0].getAttribute("id", "");

  var createDiv = document.createElement("div");
  createDiv.style.textAlign = "center";

  var manageboothtypes = document.createElement("a");
  manageboothtypes.className = "myCustomeButton";
  manageboothtypes.style.padding = "5px 4px 5px 4px";

  manageboothtypes.style.width = "56%";
  manageboothtypes.style.textAlign = "center";
  // manageboothtypes.setAttribute('onclick', 'getallpricetegs()');
  manageboothtypes.innerHTML = "Sell Booth";
  manageboothtypes.id = "manageboothtypes";

  var dontsellbutton = document.createElement("a");
  dontsellbutton.className = "myCustomeButton";
  dontsellbutton.style.padding = "5px 4px 5px 4px";
  dontsellbutton.id = "dontsellbutton";
  dontsellbutton.style.width = "40%";
  dontsellbutton.innerHTML = "Don't Sell Booth";

  var updateboothdetail = document.createElement("a");
  updateboothdetail.className = "myCustomeButton";
  updateboothdetail.style.padding = "5px 4px 5px 4px";

  updateboothdetail.style.width = "26%";
  updateboothdetail.style.marginRight = "15%";
  updateboothdetail.id = "updateboothdetail";
  updateboothdetail.innerHTML = "Edit";
  var productstatus = "";
  var currentBoothID = cell[0].id;

  //console.log(cell.length);

  if (cell.length > 1) {
    jQuery.each(cell, function (cellindex, cellvalue) {
      var currentBoothIDDD = cellvalue.id;
      var checkstatusproductstatus = checkBoothPurchaseable(currentBoothIDDD);
      if (checkstatusproductstatus == "selled") {
        currentBoothID = cellvalue.id;
        productstatus = "selled";
      }

      // console.log(productstatus);
    });
  } else {
    productstatus = checkBoothPurchaseable(currentBoothID);
  }

  var checkboothstatusfun = checkboothstatus(currentBoothID);

  if (productstatus != "selled") {
    updateboothdetail.style.display = "none";
    dontsellbutton.style.display = "none";
  } else {
    if (checkboothstatusfun == "deleterequest") {
      updateboothdetail.style.display = "none";
      dontsellbutton.style.display = "none";
    } else {
      manageboothtypes.style.display = "none";
    }
  }

  createDiv.appendChild(updateboothdetail);
  createDiv.appendChild(dontsellbutton);
  createDiv.appendChild(manageboothtypes);
  stylePanel.appendChild(createDiv);
  var multiboothsselectionErrorMsg =
    "<p style='color:red;text-align: center;'>Warning: These changes will be applied to all booths in your current selection, overriding all previous pricing details (Price, Description, Level). Be sure about the booths in your current selection before clicking 'Update'. </p>";
  mxEvent.addListener(dontsellbutton, "click", function () {
    jQuery.each(cell, function (cellindex, cellvalue) {
      var CurentBoothID = cellvalue.id;
      jQuery.each(allBoothsProductData, function (boothIndex, boothObject) {
        if (boothObject.cellID == CurentBoothID) {
          allBoothsProductData[boothIndex].boothstatus = "deleterequest";
        }
      });
    });

    jQuery("#manageboothtypes").show();
    jQuery("#updateboothdetail").hide();
    jQuery("#dontsellbutton").hide();
  });
  var selectedBoothtitles = "";
  jQuery.each(cell, function (cellindex, cellvalue) {
    var CurentBoothID = cellvalue.id;
    var title = cellvalue.getAttribute("mylabel", "");
    selectedBoothtitles += title + " ,";
  });
  mxEvent.addListener(updateboothdetail, "click", function () {
    var cell = graph.getSelectionCells();
    var popupstatus = "multiboothselection";
    var productstatus = "";
    var firstBoothiD = cell[0].id;

    if (cell.length > 1) {
      jQuery.each(cell, function (cellindex, cellvalue) {
        var currentBoothIDDD = cellvalue.id;
        var checkstatusproductstatus = checkBoothPurchaseable(currentBoothIDDD);
        if (checkstatusproductstatus == "selled") {
          firstBoothiD = cellvalue.id;
        }
      });
    }

    var firstBoothownerID = cell[0].getAttribute("boothOwner", "");
    var exhibitorstatus = "deactive";

    var boothOwner = "none";
    var boothprice = 0;
    var boothlevel = "";
    var userBoothsLevel = "";
    var userBooths = "";
    var prebothlevel = "";
    var boothdescripition = "";
    var titlestatus = "";
    var depositestatus = "unchecked";
    var depositetype = "";
    var depositeamount = "";
    var overRideCheck = "";
    var despositeenablestatus = "no";
    var discountType= "";
    var priceBasedLevels = "";

    // console.log(allBoothsProductData);
    jQuery.each(allBoothsProductData, function (boothIndex, boothObject) {
      if (boothObject.cellID == firstBoothiD) {
        // console.log(boothObject);
        boothprice = boothObject.boothprice;
        boothlevel = boothObject.boothlevel;
        reservedStatue = boothObject.reservedStatus;
        overRideCheckers = boothObject.overRideCheck;
        userBooths = boothObject.userBooths;
        userBoothsLevel = boothObject.userBoothsLevel;
        prebothlevel = boothObject.boothlevel;
        boothdescripition = boothObject.boothdescripition;
        depositestatus = boothObject.depositestatus;
        depositetype = boothObject.depositstype;
        despositeenablestatus = boothObject.despositeenablestatus;
        depositeamount = boothObject.depositsamount;

    
        priceBasedLevels = boothObject.levelbaseddiscountdata;



      }
    });
   
  
    jQuery.each(cell, function (cellindex, cellvalue) {
      var CurentBoothID = cellvalue.id;
      var mylabel = cellvalue.getAttribute("mylabel", "");
      // console.log(mylabel);
      var boothOwner = cellvalue.getAttribute("boothOwner", "");

      if (boothOwner != "none" && boothOwner != "") {
        exhibitorstatus = "avtive";
      }

      if (checkBoothPurchaseable(CurentBoothID) == "selled") {
        popupstatus = "success";
      } else {
        popupstatus = "multiboothselection";
      }
      if (typeof mylabel === "undefined" || mylabel == "") {
        titlestatus = "empty";
      }
    });

    var addtext = "'add'";

    var html = "<p class='successmessage'></p>";
    var roleshtml = "";
    var newroleshtml = "";
    var classstatusshow = "";
    var boothlevelname = "";
    var boothlevelnames = "";
    var alltaskesHtml = "";
    var levelBasedDiscountHtml = '';
    var levelHtml = '';
    var typeHtml = '';
    var levelsz = '';
    var currencySymbol = '';
    var flag = true;

    if (priceBasedLevels == null || priceBasedLevels == undefined || priceBasedLevels == 'undefined') { 
      // Generate HTML when priceBasedLevels is null
      levelBasedDiscountHtml =  priceBasedLevelHtml(arrayoflevelsObjects);
  } else if (priceBasedLevels.length > 0) {
      var bflag = '';
      jQuery.each(priceBasedLevels, function (key, value) {

        if(key == 0){
          bflag = 'true';
      }else{
          bflag = 'false';
      }
        levelBasedDiscountHtml += '<div id="'+value.discountid+'" class="html-content row">';
        levelBasedDiscountHtml +='<div class = "col-md-3">';

        levelBasedDiscountHtml += '<h6><strong>Levels</strong></h6>';
        levelBasedDiscountHtml += '<select class="form-control js-example-basic-multiple" id="levels-'+value.discountid+'" multiple="multiple" data-allow-clear="true" >';
        jQuery.each(arrayoflevelsObjects, function (rolekey, rolevalue) {
          if (rolevalue.key != 'administrator' && rolevalue.key != 'contentmanager') {

            if (jQuery.inArray(rolevalue.key, value.levels) !== -1) {

              levelBasedDiscountHtml += '<option selected="true" value="'+rolevalue.key+'">' +rolevalue.name+"</option>";
            }else{

              levelBasedDiscountHtml +='<option value="'+rolevalue.key+'" >' +rolevalue.name +"</option>";
            }
        }
        });
        levelBasedDiscountHtml += '</select>';
        levelBasedDiscountHtml += '</div>';
        


        levelBasedDiscountHtml += '<div class = "col-md-3">';

        levelBasedDiscountHtml += '<h6><strong>Discount Type</strong></h6>';
        levelBasedDiscountHtml += '<select style= "height: 28px;" id="discount_type-'+value.discountid+'"opid="'+value.discountid+'" class="form-control" onchange="symbol(this)" >';

          if(value.discounttype == 'percent'){
            levelBasedDiscountHtml += '<option value="fixed">Fixed</option>';
            levelBasedDiscountHtml +='<option value="percent" selected="true">Percent</option>';
            currencySymbol = '%';

            }else if(value.discounttype == 'fixed'){

            levelBasedDiscountHtml += '<option value="fixed" selected="true" >Fixed</option>';
            levelBasedDiscountHtml += '<option value="percent">Percent</option>';
            currencySymbol = '$';
            }else{

            levelBasedDiscountHtml += '<option value="fixed">Fixed</option>';
            levelBasedDiscountHtml += '<option value="percent">Percent</option>';
            }
        levelBasedDiscountHtml += '</select>';
        levelBasedDiscountHtml += '</div>';

        levelBasedDiscountHtml +='<div class = "col-md-3">';
        levelBasedDiscountHtml +='<h6><strong>Discount</strong></h6>';
        levelBasedDiscountHtml +='<div class="input-group">';
        levelBasedDiscountHtml +='<div id="input-group-'+value.discountid+'" class="input-group-addon">'+currencySymbol+'</div>';
        levelBasedDiscountHtml +='<input style= "height: 28px;" type="number" min="1" class="form-control"id="amount-price-'+value.discountid+'" name="amount-price" value="'+value.discountamount+'"placeholder="Price" >';
        levelBasedDiscountHtml +='</div>';
        levelBasedDiscountHtml +='<p class="depositeerror"></p>';
        levelBasedDiscountHtml +='</div>';
          if(bflag == 'true'){

            levelBasedDiscountHtml +=  '<div class="col-md-1" id="add-new-discount">';
            levelBasedDiscountHtml += '<i style="color:#004598 !important; margin-top: 70px; margin-left: 35px;" class="addnewdiscount adddscountbuttonsty font-icon fa fa-plus-circle fa-2x" onclick="addNewDiscount();" egid="addnewdiscount"></i>';
            levelBasedDiscountHtml +='</div>';
          }

          if(bflag == 'false'){

            levelBasedDiscountHtml +='<div class = "col-md-1" style="padding-left: 36px;">';
            levelBasedDiscountHtml +='<h6 style="margin-top: 70px;"><strong></strong></h6>';
            levelBasedDiscountHtml +='<span><i style="color:crimson; margin-left: 15px;" onclick="removeDiscount(this)"; id="'+value.discountid+'" class="fa fa-times-circle fa-2x delfee" aria-hidden="true"></i></span>';
            levelBasedDiscountHtml +='</div>';
    
            levelBasedDiscountHtml +='</div><hr id = "hr-'+value.discountid+'">';
          }


        levelBasedDiscountHtml += '</div>'; //ending div
    
      });
    }

    var levels = "";
    levels += '<option value="all" >All</option>';
    boothlevelname += '<option value="" >None</option>';

    jQuery.each(arrayoflevelsObjects, function (rolekey, rolevalue) {
      if (jQuery.inArray(rolevalue.key, userBoothsLevel) !== -1) {
        flag = false;
        // console.log(userBoothsLevel);
        boothlevelnames +=
          '<option value="' +
          rolevalue.key +
          '" selected>' +
          rolevalue.name +
          "</option>";
      } else {
        boothlevelnames +=
          '<option value="' +
          rolevalue.key +
          '" >' +
          rolevalue.name +
          "</option>";
      }
    });

    //arham
    if (flag == true && userBoothsLevel != null) {
      boothlevelnames += '<option value="" selected>All</option>';
    } else {
      boothlevelnames += '<option value="" >All</option>';
      
    }

    jQuery.each(arrayoflevelsObjects, function (rolekey, rolevalue) {
      // console.log(rolevalue);
      if (rolevalue.key == prebothlevel) {
        boothlevelname +=
          '<option value="' +
          rolevalue.key +
          '" selected>' +
          rolevalue.name +
          "</option>";
      } else {
        boothlevelname +=
          '<option value="' +
          rolevalue.key +
          '" >' +
          rolevalue.name +
          "</option>";
      }
    });
    var updateproductlist = document.createElement("a");
    updateproductlist.className = "myCustomeButton";
    updateproductlist.style.padding = "5px 4px 5px 4px";

    updateproductlist.style.width = "75%";
    updateproductlist.style.marginRight = "7%";
    updateproductlist.style.textAlign = "center";
    // manageboothtypes.setAttribute('onclick', 'getallpricetegs()');
    updateproductlist.innerHTML = "Update";

    selectedBoothtitles = selectedBoothtitles.slice(0, -1);

    html += multiboothsselectionErrorMsg;

    // console.log(titlestatus);
    // console.log(reservedStatue);

    if (reservedStatue != "0") {
      reservedStatue = null;
    } else {
      reservedStatue = "checked";
    }
    if (overRideCheckers != "0") {
      overRideCheck = null;
    } else {
      overRideCheck = "checked";
    }
    var statushtml = "";
    var reservedToggle = "";
    var levelAssigment = "";
    var UserAssigment = "";
    var depositedetail = "";
    var companynames = "";
    jQuery.each(newcompanynamesArray, function (rolekey, rolevalue) {
      if (jQuery.inArray(rolevalue.userID, userBooths) !== -1) {
        companynames +=
          '<option value="' +
          rolevalue.userID +
          '" selected>' +
          rolevalue.companyname +
          "</option>";
      } else {
        companynames +=
          '<option value="' +
          rolevalue.userID +
          '" >' +
          rolevalue.companyname +
          "</option>";
      }
    });
    var selectedoptions =
      '<option value="percent" >Percentage</option><option value="fixed">Fixed Amount</option>';

      var discountTypeHtml = '';

      if(discountType == 'fixed'){
        discountTypeHtml +='<select style="" id="discount_type" name="discount_type" class="form-control"><option value="fixed" selected="selected">Fixed</option><option value="percent">Percentage</option></select>'
      }else{

        discountTypeHtml +='<select style="" id="discount_type" name="discount_type" class="form-control"><option value="fixed" >Fixed</option><option selected="selected" value="percent">Percentage</option></select>'

      }
    if (
      despositeenablestatus == "forced" ||
      despositeenablestatus == "optional" ||
      depositestatus == "checked"
    ) {
      if (despositeenablestatus == "optional") {
        statushtml =
          '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Enable Deposits <i class="far fa-question-circle" title=""></i></label></div><div class="col-sm-3"><select class="form-control" id="depositsstatus"><option value="optional" selected="true">Deposit OR Pay in Full</option><option value="forced">Deposit Only - No Option to Pay in Full</option><option value="no" >No</option></select></div></div>';
        reservedToggle =
          '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Option to Reserve? <i class="far fa-question-circle" title=""></i></label></div><div class="col-sm-3"><input type="checkbox" ' +
          reservedStatue +
          ' style="margin-right:4px;"  id="reservedCheck"  value="0"></div></div>';
        levelAssigment =
          '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" id="levelAssigment" style="text-align:right;"><label>Level Purchasability<i class="far fa-question-circle" title="The level of a user that can purchase this booth." ></i></label></div><div class="col-sm-3"><select id="boothlevel"  multiple="multiple"  placeholder="Select Level Of Booth" class="form-control js-example-basic-multiple">' +
          boothlevelnames +
          "</select></div></div>";
        UserAssigment =
          '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" id="UserAssigment"  style="text-align:right;"><label>User Purchasability<i class="far fa-question-circle" ></i></label></div><div class="col-sm-3"><select id="UserBooth"  multiple="multiple"  placeholder="Select User For  Booth" class="form-control js-example-basic-multiple">' +
          companynames +
          "</select></div></div>";
      } else {
        statushtml =
          '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Enable Deposits <i class="far fa-question-circle" title=""></i></label></div><div class="col-sm-3"><select class="form-control" id="depositsstatus"><option value="optional" >Deposit OR Pay in Full</option><option value="forced" selected="true">Deposit Only - No Option to Pay in Full</option><option value="no" >No</option></select></div></div>';
        reservedToggle =
          '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Option to Reserve? <i class="far fa-question-circle" title=""></i></label></div><div class="col-sm-3"><input type="checkbox" ' +
          reservedStatue +
          ' style="margin-right:4px;"  id="reservedCheck"  value="0"></div></div>';
        levelAssigment =
          '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" id="levelAssigment" style="text-align:right;"><label>Level Purchasability<i class="far fa-question-circle" title="The level of a user that can purchase this booth." ></i></label></div><div class="col-sm-3"><select  multiple="multiple"  id="boothlevel"  placeholder="Select Level Of Booth" class="form-control js-example-basic-multiple">' +
          boothlevelnames +
          "</select></div></div>";
        UserAssigment =
          '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" id="UserAssigment" style="text-align:right;"><label>User Purchasability<i class="far fa-question-circle" ></i></label></div><div class="col-sm-3"><select  multiple="multiple"  id="UserBooth" placeholder="Select User For  Booth" class="form-control js-example-basic-multiple">' +
          companynames +
          "</select></div></div>";
      }

      if (depositetype == "percent") {
        selectedoptions =
          '<option value="percent" selected="true">Percentage</option><option value="fixed">Fixed Amount</option>';
      } else {
        selectedoptions =
          '<option value="percent" >Percentage</option><option value="fixed" selected="true">Fixed Amount</option>';
      }

      depositedetail =
        '<div class="row depositsdetail" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Deposits Type <i class="far fa-question-circle" title=""></i></label></div><div class="col-sm-3"><select id="depositstype" class="form-control">' +
        selectedoptions +
        '</select></div></div><div class="row depositsdetail" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Deposit Amount <i class="far fa-question-circle" title=\'Enter dollar amount for "Fixed Amount" types, and percentage amount for "Percentage" types\'></i></label></div><div class="col-sm-3"><input style="color: #333;" id="depositamount" min="1"  class="form-control" min="1" value="' +
        depositeamount +
        '" type="number" ><p class="depositeerror"></p></div></div>';
    } else {
      statushtml =
        '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Enable Deposits <i class="far fa-question-circle" title="Select if you want to enable split payments for this booth."></i></label></div><div class="col-sm-3"><select class="form-control" id="depositsstatus"><option value="optional">Deposit OR Pay in Full</option><option value="forced">Deposit Only - No Option to Pay in Full</option><option value="no" selected="true">No</option></select></div></div>';
      reservedToggle =
        '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Option to Reserve? <i class="far fa-question-circle" title=""></i></label></div><div class="col-sm-3"><input type="checkbox"  ' +
        reservedStatue +
        ' style="margin-right:4px;"  id="reservedCheck"  value="0"></div></div>';
      levelAssigment =
        '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" id="levelAssigment" style="text-align:right;"><label>Level Purchasability<i class="far fa-question-circle" title="The level of a user that can purchase this booth." ></i></label></div><div class="col-sm-3"><select id="boothlevel"  multiple="multiple"  placeholder="Select Level Of Booth" class="form-control js-example-basic-multiple">' +
        boothlevelnames +
        "</select></div></div>";
      UserAssigment =
        '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" id="UserAssigment" style="text-align:right;"><label>User Purchasability<i class="far fa-question-circle" ></i></label></div><div class="col-sm-3"><select id="UserBooth"  multiple="multiple"  placeholder="Select User For  Booth" placeholder="Select User For  Booth" class="form-control js-example-basic-multiple">' +
        companynames +
        "</select></div></div>";
      depositedetail =
        '<div class="row depositsdetail" style="margin-bottom: 3%;display:none;"><div class="col-sm-2" style="text-align:right;"><label>Deposits Type <i class="far fa-question-circle" title="For the initial payment, enter either a fixed dollar amount or a percentage of the entire cost."></i></label></div><div class="col-sm-3"><select id="depositstype" class="form-control" >' +
        selectedoptions +
        '</select></div></div><div class="row depositsdetail" style="margin-bottom: 3%;display:none;"><div class="col-sm-2" style="text-align:right;"><label>Deposit Amount <i class="far fa-question-circle" title=\'Enter dollar amount for "Fixed Amount" types, and percentage amount for "Percentage" types\'></i></label></div><div class="col-sm-3"><input style="color: #333;" id="depositamount" min="1" class="form-control" value="' +
        depositeamount +
        '" type="number" ><p class="depositeerror"></p></div></div>';
    }

    var htmlfordeposite =
      statushtml +
      reservedToggle +
      levelAssigment +
      UserAssigment +
      depositedetail;
    var overrideString = "Override User's Existing Level";
    var inputValidity = 'validity.valid||(value="")';

    html +=
      '<p id="messageerror"></p><script>jQuery("#depositsstatus").change(function(){if(jQuery("#depositsstatus option:selected").val() !="no"){jQuery(".depositsdetail").show(); }else{ jQuery(".depositsdetail").hide();} });</script> <div class="row" style="margin-bottom: 2%;margin-top: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Selected Booths</label></div><div class="col-sm-8">' +
      selectedBoothtitles +
      '</div></div><div class="row" style="margin-bottom: 1%;"><div class="col-sm-2" style="text-align:right;"><label>Price</label></div><div class="col-sm-3"><div class="input-group"><span style="height:20px;"class="input-group-addon"><strong style="color:#333">' +
      currencysymbole +
      '</strong></span><input type="number" style="color:#333;height:32px;width: 99%;" id="boothprice" min="0" value="' +
      boothprice +
      '" class="form-control currency"></div></div></div>' +
      htmlfordeposite +
      '<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label >Product Description <i class="far fa-question-circle"  title="This content will appear in the pop-up when users click this booth. Note this will no longer show after a booth is purchased."></i></label></div><div class="col-sm-8"><textarea id="boothdescripition" class="form-control" rows="8">' +
      unescape(boothdescripition) +
      '</textarea></div></div>'+
      '<hr>'+

      '<div id="level-based-discount">'+

      '<div><h3>Level Based Discount</h3>'+
        levelBasedDiscountHtml+
      '</div>'+
     
 

      '</div>'+

      '<hr>'+
      '<div class="row" style="margin-bottom: 1%; margin-left: 133px; color: gray"><h5 class="eg-sub-title"><strong>IF this booth is purchased, THEN</strong></h5></div><div style="margin-left: 6px;" ><div style="margin-left: 169px;margin-bottom: 11px;font-weight: bold;padding: 2px"><input type="checkbox" style="margin-right:4px;" ' +
      overRideCheck +
      ' id="overRideCheckBox" onclick="cliker()" value="0"><span style="font-size:bold">' +
      overrideString +
      '</span></div></div><div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" id="userLevelDiscriptionLabel" style="text-align:right;"><label>Assign User Level <i class="far fa-question-circle" title="Select the Level the user will be automatically assigned to upon purchasing this booth. "></i></label></div><div class="col-sm-3"><select id="boothlevelvalue" class="form-control">' +
      boothlevelname +
      '</select></div></div><div class="row" style="margin-bottom: 3%;"><div class="col-sm-1" ></div><div class="col-sm-1" id="updateproductbutton"></div><div class="col-sm-2"></div></div>';

    if (popupstatus == "success" || popupstatus == "multiboothselection") {
      if (exhibitorstatus == "deactive") {
        if (titlestatus == "") {
          boothdetailpopup = jQuery.confirm({
            onOpen: function () {
              jQuery(".js-example-basic-multiple").select2();
              if (overRideCheckers != "0") {
                // console.log("Afreen");
                jQuery("#boothlevelvalue").hide();
                jQuery("#userLevelDiscriptionLabel").hide();
              } else {
                jQuery("#boothlevelvalue").show();
                jQuery("#userLevelDiscriptionLabel").show();
              }
              // console.log("IN open");
            },
            title: '<b style="text-align:center;">Self-booth Purchase</b>',
            content: html,
            html: true,
            closeIcon: true,
            columnClass: "jconfirm-box-container-special-boothtypes",
            cancelButton: false, // hides the cancel button.
            confirmButton: false, // hides the confirm button.
            backgroundDismiss: false,
          });

          jQuery(".mycustometable tbody").sortable();
          jQuery("#updateproductbutton").append(updateproductlist);
        } else {
          swal({
            title: "Invalid Booth Selection",
            text: "At least one booth in your current selection is missing booth number. Please assign booth numbers to all selected booths and try again.",
            type: "warning",
            confirmButtonClass: "btn-warning",
            confirmButtonText: "Ok",
          });
        }
      } else {
        swal({
          title: "Invalid Booth Selection",
          text: "At least one booth in your current selection has an exhibitor(s) already assigned. Either remove the exhibitor(s) assigned to your current selected booths, or reselect booths without any exhibitors assigned.",
          type: "warning",
          confirmButtonClass: "btn-warning",
          confirmButtonText: "Ok",
        });
      }
    }

    mxEvent.addListener(updateproductlist, "click", function () {
      var allDataArray = [];
      var cell = graph.getSelectionCells();
      var boothprice = jQuery("#boothprice").val();
      var boothlevel = jQuery("#boothlevelvalue option:selected").val();
      //var userBooths = jQuery("#UserBooth  option:selected").val();
      var userBooths = jQuery("#UserBooth").select2("val");
      //var userBoothsLevel = jQuery("#boothlevel option:selected").val();
      var userBoothsLevel = jQuery("#boothlevel").select2("val");
      var reservedStatus = jQuery("#reservedCheck:checked").val();
      var overRideCheck = jQuery("#overRideCheckBox:checked").val();
      var boothtasks = jQuery("#boothtasksvalues ").val();
      var boothdescripition = escape(jQuery("#boothdescripition").val());
      var discflag = true;


      jQuery( ".html-content" ).each(function(index) {
        var dataArray={};

        var discountID = jQuery( this ).attr('id');
       
   
        dataArray['discountid'] = discountID;
        dataArray['levels'] = jQuery('#levels-'+discountID).val();
        dataArray['discounttype'] = jQuery('#discount_type-'+discountID).val();
        dataArray['discountamount'] = jQuery('#amount-price-'+discountID).val();

                
        if(jQuery('#discount_type-'+discountID).val() == 'percent' && jQuery('#amount-price-'+discountID).val() > 100){
        
          discflag = false;
          jQuery(".depositeerror").empty();
          jQuery(".depositeerror").append(
              "<label style='margin-top: 10px;color:red'>The percentage amount cannot be greater than the price.</label>"
          );
      
          jQuery("body").css("cursor", "default");
          setTimeout(function () {
              // reset CSS
              jQuery(".depositeerror").empty();
          }, 5000);

          // return false;
      }

        allDataArray[index] = dataArray;
    });
    
    // console.log('1---------'+allDataArray);
   

      // console.log("!");
      // console.log(reservedStatus);
      // console.log(boothdescripition);
      var depositstype = "";
      var depositsamount = "";
      var depositestatus = "unchecked";
      var despositeenablestatus = jQuery(
        "#depositsstatus option:selected"
      ).val();
      var level = "";

      // console.log("In Sell New");
      // console.log(boothlevel);
      // console.log(prebothlevel);

      if (
        (userBoothsLevel != null || userBooths != null) &&
        (overRideCheck == undefined || (overRideCheck == 0 && boothlevel != ""))
      ) {
        if (
          despositeenablestatus == "forced" ||
          despositeenablestatus == "optional" ||
          depositestatus == "checked"
        ) {
          depositstype = jQuery("#depositstype option:selected").val();
          depositsamount = jQuery("#depositamount").val();
          depositestatus = "checked";
        }

        jQuery.each(cell, function (cellindex, cellvalue) {
          var startfloorplanedtitng = {};
          var valuexmlstring = "";
          jQuery.each(cellvalue.value, function (valueindex, valuevalue) {
            if (valueindex == "outerHTML") {
              valuexmlstring = valuevalue;
            }
          });
          startfloorplanedtitng.boothid = cellvalue.id;
          startfloorplanedtitng.preboothdetail = valuexmlstring;
          startfloorplanedtitng.preboothstyle = cellvalue.style;

          startfloorplanedtitng.datetime = new Date(jQuery.now());
          startfloorplanedtitng.event = "Updateproduct";
          // console.log(startfloorplanedtitng);
          var boothproductdata = {};
          var CurentBoothID = cellvalue.id;
          var boothtitle = cellvalue.getAttribute("mylabel", "");
          var boothstatus = cellvalue.getAttribute("boothproductid", "");
          var boothID = cellvalue.getAttribute("boothproductid", "");
          if (
            boothstatus == "" ||
            boothstatus == "none" ||
            boothstatus == "deleterequest"
          ) {
            boothstatus = "newBooth";
          } else {
            boothstatus = "updated";
          }

          // console.log(allDataArray);
          // console.log(boothdescripition);
          boothdescripition = boothdescripition.replace(/(["'])+/g, "");
          // console.log(boothdescripition);

          boothproductdata.boothprice = boothprice;
          boothproductdata.reservedStatus = reservedStatus;
          boothproductdata.boothlevel = boothlevel;
          boothproductdata.userBooths = userBooths;
          boothproductdata.userBoothsLevel = userBoothsLevel;
          boothproductdata.boothdescripition = boothdescripition;
          boothproductdata.boothstatus = boothstatus;
          boothproductdata.boothID = boothID;
          boothproductdata.overRideCheck = overRideCheck;
          boothproductdata.boothtitle = boothtitle;
          boothproductdata.depositstype = depositstype;
          boothproductdata.depositsamount = depositsamount;
          boothproductdata.depositestatus = depositestatus;
          boothproductdata.despositeenablestatus = despositeenablestatus;

          boothproductdata.levelbaseddiscountdata = allDataArray;

          boothproductdata.cellID = CurentBoothID;
          //console.log(boothproductdata);

          if (checkBoothPurchaseable(CurentBoothID) == "selled") {
            jQuery.each(
              allBoothsProductData,
              function (boothIndex, boothobject) {
                if (boothobject.cellID == CurentBoothID) {
                  allBoothsProductData[boothIndex].boothprice = boothprice;
                  allBoothsProductData[boothIndex].reservedStatus =
                    reservedStatus;
                  allBoothsProductData[boothIndex].userBooths = userBooths;
                  allBoothsProductData[boothIndex].userBoothsLevel =
                    userBoothsLevel;

                  allBoothsProductData[boothIndex].overRideCheck =
                    overRideCheck;
                  allBoothsProductData[boothIndex].boothlevel = boothlevel;
                  allBoothsProductData[boothIndex].boothdescripition =
                    boothdescripition;
                  allBoothsProductData[boothIndex].boothID = boothID;
                  allBoothsProductData[boothIndex].boothstatus = boothstatus;
                  allBoothsProductData[boothIndex].boothtitle = boothtitle;
                  allBoothsProductData[boothIndex].depositstype = depositstype;
                  allBoothsProductData[boothIndex].depositsamount =
                    depositsamount;
                  allBoothsProductData[boothIndex].depositestatus =
                    depositestatus;
                  allBoothsProductData[boothIndex].despositeenablestatus =
                    despositeenablestatus;


                  allBoothsProductData[boothIndex].levelbaseddiscountdata = allDataArray;


                    allBoothsProductData[boothIndex].userBoothsLevel =
                    userBoothsLevel;
                  startfloorplanedtitng.postboothdetail = JSON.stringify(
                    allBoothsProductData[boothIndex]
                  );
                  expogenielogging.push(startfloorplanedtitng);
                }
              }
            );
          } else {
            allBoothsProductData.push(boothproductdata);
            startfloorplanedtitng.postboothdetail =
              JSON.stringify(boothproductdata);
            expogenielogging.push(startfloorplanedtitng);
          }
        });
       // console.log(allBoothsProductData);

        if (
          depositstype == "fixed" &&
          parseInt(depositsamount) >= parseInt(boothprice)
        ) {
          jQuery(".depositeerror").append(
            "<label style='margin-top: 10px;color:red'>Deposit Amount must be less than price.</label>"
          );
          setTimeout(function () {
            // reset CSS
            jQuery(".depositeerror").empty();
          }, 5000);
        } else if (
          depositstype == "percent" &&
          parseInt(depositsamount) >= 100
        ) {
          jQuery(".depositeerror").append(
            "<label style='margin-top: 10px;color:red'>Deposit Amount must be less than price.</label>"
          );
          setTimeout(function () {
            // reset CSS
            jQuery(".depositeerror").empty();
          }, 5000);
        } else {
          if (
            depositestatus == "checked" &&
            (depositsamount == "" || parseInt(depositsamount) <= 0)
          ) {
            jQuery(".depositeerror").append(
              "<label style='margin-top: 10px;color:red'>Deposit Amount is required field.</label>"
            );
            setTimeout(function () {
              // reset CSS
              jQuery(".depositeerror").empty();
            }, 5000);
          } else {

            if(discflag == true){

              boothdetailpopup.close();
              swal({
                title: "Success",
                text: "Booth Detail has been updated successfully.",
                type: "success",
                confirmButtonClass: "btn-success",
                confirmButtonText: "Ok",
              });
            }
          }
        }
      } else if (overRideCheck == 0 && boothlevel == "") {
        jQuery(".successmessage").append(
          '<label style="color:red">Please select a Level to assign the user when this booth is purchased. If you don’t want a Level to be assigned upon purchase, uncheck “Override User’s Existing Level.</label>'
        );
      }else if (discflag == false){
        return discflag;
      } else {
        jQuery(".successmessage").append(
          '<label style="color:red">Please select a User Assignment Or Level Assignment.</label>'
        );
      }
    });
  });

  mxEvent.addListener(manageboothtypes, "click", function () {
    var data = new FormData();
    var cell = graph.getSelectionCells();
    var popupstatus = "error";
    var titlestatus = "";
    var productstatus = "";
    var getFirstOneStatus = cell[0].id;
    var exhibitorstatus = "deactive";
    if (checkBoothPurchaseable(getFirstOneStatus) == "selled") {
      productstatus = "alreadyExist";
    } else {
      productstatus = "newBooth";
    }
    jQuery.each(cell, function (cellindex, cellvalue) {
      var CurentBoothID = cellvalue.id;
      var mylabel = cellvalue.getAttribute("mylabel", "");
      var boothOwner = cellvalue.getAttribute("boothOwner", "");
      //console.log(mylabel);

      if (boothOwner != "none" && boothOwner != "") {
        exhibitorstatus = "avtive";
      }

      if (productstatus == "alreadyExist") {
        if (checkBoothPurchaseable(CurentBoothID) == "selled") {
          popupstatus = "success";
        } else {
          popupstatus = "error";
        }
      } else {
        if (checkBoothPurchaseable(CurentBoothID) == "selled") {
          popupstatus = "error";
        } else {
          popupstatus = "success";
        }
      }
      if (typeof mylabel === "undefined" || mylabel == "") {
        titlestatus = "empty";
      }
    });
    //console.log(popupstatus);

    var addtext = "'add'";
    data.append("post_id", mxPostID);
    var html = "<p class='successmessage' style='text-align: center;'></p>";
    var roleshtml = "";
    var boothlevelname = "";
    var boothlevelnames = "";
    var companynames = "";
    var alltaskesHtml = "";
    var classstatusshow = "";
    var discountAmount = "";
    boothlevelname += '<option value="unassigned" >Unassigned</option>';
    // boothlevelnames += '<option value="unassigned" >Unassigned</option>';

    jQuery.each(arrayoflevelsObjects, function (rolekey, rolevalue) {
      //console.log(rolevalue);
      boothlevelname +=
        '<option value="' +
        rolevalue.key +
        '" >' +
        rolevalue.name +
        "</option>";
    });
    jQuery.each(arrayoflevelsObjects, function (rolekey, rolevalue) {
      //console.log(rolevalue);
      boothlevelnames +=
        '<option value="' +
        rolevalue.key +
        '" >' +
        rolevalue.name +
        "</option>";
    });

   
    boothlevelnames += '<option value=""selected >All</option>';
    boothlevelname += '<option value=""selected >None</option>';
    jQuery.each(arrayoftasksObjects, function (taskskey, taskname) {
      alltaskesHtml +=
        '<option value="' + taskname.key + '" >' + taskname.name + "</option>";
    });

    jQuery.each(newcompanynamesArray, function (rolekey, rolevalue) {
      companynames +=
        '<option value="' +
        rolevalue.userID +
        '" >' +
        rolevalue.companyname +
        "</option>";
    });

    var updateproductlist = document.createElement("a");
    updateproductlist.className = "myCustomeButton";
    updateproductlist.style.padding = "5px 4px 5px 4px";

    updateproductlist.style.width = "75%";
    updateproductlist.style.marginRight = "7%";
    updateproductlist.style.textAlign = "center";
    // manageboothtypes.setAttribute('onclick', 'getallpricetegs()');

    updateproductlist.innerHTML = "Update";

    mxEvent.addListener(updateproductlist, "click", function () {
      var allDataArray = [];
      var cell = graph.getSelectionCells();
      var boothprice = jQuery("#boothprice").val();
      var boothlevel = jQuery("#boothlevelvalue option:selected").val();
      var reservedStatus = jQuery("#reservedCheck:checked").val();
      //var userBooths = jQuery("#UserBooth  option:selected").val();
      var userBooths = jQuery("#UserBooth").select2("val");
      //var userBoothsLevel = jQuery("#boothlevel option:selected").val();
      var userBoothsLevel = jQuery("#boothlevel").select2("val");
      var overRideCheck = jQuery("#overRideCheckBox:checked").val();
      var boothdescripition = jQuery("#boothdescripition").val();
      var discflag = true;

            jQuery( ".html-content" ).each(function(index) {
        var dataArray={};

        var discountID = jQuery( this ).attr('id');
       
   
        dataArray['discountid'] = discountID;
        dataArray['levels'] = jQuery('#levels-'+discountID).val();
        dataArray['discounttype'] = jQuery('#discount_type-'+discountID).val();
        dataArray['discountamount'] = jQuery('#amount-price-'+discountID).val();

                
        if(jQuery('#discount_type-'+discountID).val() == 'percent' && jQuery('#amount-price-'+discountID).val() > 100){
        
          discflag = false;
          jQuery(".depositeerror").empty();
          jQuery(".depositeerror").append(
              "<label style='margin-top: 10px;color:red'>The percentage amount cannot be greater than the price.</label>"
          );
      
          jQuery("body").css("cursor", "default");
          setTimeout(function () {
              // reset CSS
              jQuery(".depositeerror").empty();
          }, 5000);

          // return false;
      }
        allDataArray[index] = dataArray;
    });
    // console.log('2---------'+allDataArray);
      var selectedBoothtitles = "";
      var depositstype = "";
      var depositsamount = "";
      var depositestatus = "unchecked";



      var despositeenablestatus = jQuery(
        "#depositsstatus option:selected"
      ).val();
      // console.log("In Sell Edit");
      // console.log(boothlevel);
      // console.log(reservedStatus);

      if (
        (userBoothsLevel != null || userBooths != null) &&
        (overRideCheck == undefined || (overRideCheck == 0 && boothlevel != ""))
      ) {
        // console.log(boothlevel);

        if (
          despositeenablestatus == "forced" ||
          despositeenablestatus == "optional" ||
          depositestatus == "checked"
        ) {
          depositstype = jQuery("#depositstype option:selected").val();

          depositsamount = jQuery("#depositamount").val();
          depositestatus = "checked";
        }

        jQuery.each(cell, function (cellindex, cellvalue) {
          var startfloorplanedtitng = {};
          startfloorplanedtitng.action = "Add Product";
          var valuexmlstring = "";
          jQuery.each(cellvalue.value, function (valueindex, valuevalue) {
            if (valueindex == "outerHTML") {
              valuexmlstring = valuevalue;
            }
          });
          startfloorplanedtitng.boothid = cellvalue.id;
          startfloorplanedtitng.preboothdetail = valuexmlstring;
          startfloorplanedtitng.preboothstyle = cellvalue.style;

          startfloorplanedtitng.datetime = new Date(jQuery.now());

          var boothproductdata = {};
          var CurentBoothID = cellvalue.id;
          var boothtitle = cellvalue.getAttribute("mylabel", "");

          var boothstatus = cellvalue.getAttribute("boothproductid", "");
          var boothID = cellvalue.getAttribute("boothproductid", "");
          var title = cellvalue.getAttribute("mylabel", "");
          var laststatusID = boothstatus;
          selectedBoothtitles += title + " , ";

          if (
            boothstatus == "" ||
            boothstatus == "none" ||
            boothstatus == "deleterequest"
          ) {
            boothstatus = "newBooth";
          } else {
            boothstatus = "updated";
          }

          boothdescripition = boothdescripition.replace(/(["'])+/g, "");
          boothproductdata.boothprice = boothprice;
          boothproductdata.boothlevel = boothlevel;
          boothproductdata.userBooths = userBooths;
          boothproductdata.userBoothsLevel = userBoothsLevel;
          boothproductdata.reservedStatus = reservedStatus;
          boothproductdata.overRideCheck = overRideCheck;
          boothproductdata.boothdescripition = boothdescripition;
          boothproductdata.boothstatus = boothstatus;

          boothproductdata.levelbaseddiscountdata = allDataArray;


          if (
            laststatusID == "" ||
            laststatusID == "none" ||
            laststatusID == "deleterequest"
          ) {
            boothproductdata.boothID = "";
          } else {
            boothproductdata.boothID = boothID;
          }

          boothproductdata.boothtitle = boothtitle;
          boothproductdata.cellID = CurentBoothID;
          boothproductdata.cellID = CurentBoothID;

          boothproductdata.depositstype = depositstype;
          boothproductdata.despositeenablestatus = despositeenablestatus;

          boothproductdata.depositsamount = depositsamount;
          boothproductdata.depositestatus = depositestatus;
          // console.log(boothproductdata);

          if (checkBoothPurchaseable(CurentBoothID) == "selled") {
            jQuery.each(
              allBoothsProductData,
              function (boothIndex, boothobject) {
                if (boothobject.cellID == CurentBoothID) {
                  allBoothsProductData[boothIndex].boothprice = boothprice;
                  allBoothsProductData[boothIndex].boothlevel = boothlevel;
                  allBoothsProductData[boothIndex].reservedStatus =
                    reservedStatus;
                  allBoothsProductData[boothIndex].userBooths = userBooths;
                  allBoothsProductData[boothIndex].userBoothsLevel =
                    userBoothsLevel;
                  allBoothsProductData[boothIndex].overRideCheck =
                    overRideCheck;
                  allBoothsProductData[boothIndex].boothdescripition =
                    boothdescripition;
                  allBoothsProductData[boothIndex].boothstatus = boothstatus;
                  allBoothsProductData[boothIndex].boothtitle = boothtitle;
                  if (
                    laststatusID == "" ||
                    laststatusID == "none" ||
                    laststatusID == "deleterequest"
                  ) {
                    allBoothsProductData[boothIndex].boothID = "";
                  }
                  allBoothsProductData[boothIndex].depositstype = depositstype;
                  allBoothsProductData[boothIndex].despositeenablestatus =
                    despositeenablestatus;

                  allBoothsProductData[boothIndex].depositsamount =
                    depositsamount;
                  allBoothsProductData[boothIndex].depositestatus =
                    depositestatus;

                  allBoothsProductData[boothIndex].levelbaseddiscountdata = allDataArray;

                  startfloorplanedtitng.postboothdetail = JSON.stringify(
                    allBoothsProductData[boothIndex]
                  );
                  expogenielogging.push(startfloorplanedtitng);
                }
              }
            );
          } else {
            allBoothsProductData.push(boothproductdata);
            startfloorplanedtitng.postboothdetail =
              JSON.stringify(boothproductdata);
            expogenielogging.push(startfloorplanedtitng);
          }
        });
        if (
          depositstype == "fixed" &&
          parseInt(depositsamount) >= parseInt(boothprice)
        ) {
          jQuery(".depositeerror").append(
            "<label style='margin-top: 10px;color:red'>Deposit Amount must be less than price.</label>"
          );
          setTimeout(function () {
            // reset CSS
            jQuery(".depositeerror").empty();
          }, 5000);
        } else if (
          depositstype == "percent" &&
          parseInt(depositsamount) >= 100
        ) {
          jQuery(".depositeerror").append(
            "<label style='margin-top: 10px;color:red'>Deposit Amount must be less than price.</label>"
          );
          setTimeout(function () {
            // reset CSS
            jQuery(".depositeerror").empty();
          }, 5000);
        } else {
          if (
            depositestatus == "checked" &&
            (depositsamount == "" || parseInt(depositsamount) <= 0)
          ) {
            jQuery(".depositeerror").append(
              "<label style='margin-top: 10px;color:red'>Deposit Amount is required field.</label>"
            );
            setTimeout(function () {
              // reset CSS
              jQuery(".depositeerror").empty();
            }, 5000);
          } else {

            if(discflag == true){
              
              boothdetailpopup.close();
              swal({
                title: "Success",
                text: "Booth detail has been successfully updated.",
                type: "success",
                confirmButtonClass: "btn-success",
                confirmButtonText: "Ok",
              });
              jQuery("#manageboothtypes").hide();
              jQuery("#updateboothdetail").show();
              jQuery("#dontsellbutton").show();
            }else{

              return discflag;
            }

          }
        }
      } else if (overRideCheck == 0 && boothlevel == "") {
        jQuery(".successmessage").append(
          '<label style="color:red">Please select a Level to assign the user when this booth is purchased. If you don’t want a Level to be assigned upon purchase, uncheck “Override User’s Existing Level.</label>'
        );
      } else {
        jQuery(".successmessage").append(
          '<label style="color:red">Please select a User Assignment Or Level Assignment.</label>'
        );
      }
    });

    // var checkOverride = document.createElement("input");
    // checkOverride.type = "checkbox";
    // checkOverride.value = "on";
    // checkOverride.setAttribute("checked", "true");

    // mxEvent.addListener(checkOverride, "change", function () {
    //   var overRideCheck = jQuery("#overRideCheckBox:checked").val();
    //   var overRideChecks = jQuery("#overRideCheckBox").val();
    //   if(jQuery("#overRideCheckBox").is(':checked'))
    //   {
    //     console.log("Checked");
    //   }else{
    //     console.log("Unchecked");
    //   }

    // });
    selectedBoothtitles = selectedBoothtitles.slice(0, -1);

    if (popupstatus == "multiboothselection") {
      html += multiboothsselectionErrorMsg;
    }
    var levelBasedDiscountHtml1 = ''
    var num1 = Math.random().toFixed(2)*100;
    discid = 'discount-'+Math.trunc(num1);
    levelBasedDiscountHtml1 += '<div id="'+discid+'" class="html-content row">';
    levelBasedDiscountHtml1 +='<div class = "col-md-3">';

    levelBasedDiscountHtml1 += '<h6><strong>Levels</strong></h6>';
    levelBasedDiscountHtml1 += '<select class="form-control js-example-basic-multiple" id="levels-'+discid+'" multiple="multiple" data-allow-clear="true" >';
    jQuery.each(arrayoflevelsObjects, function (rolekey, rolevalue) {
      if (rolevalue.key != 'administrator' && rolevalue.key != 'contentmanager') {


          levelBasedDiscountHtml1 +='<option value="'+rolevalue.key+'" >' +rolevalue.name +"</option>";
        
    }
    });
    levelBasedDiscountHtml1 += '</select>';
    levelBasedDiscountHtml1 += '</div>';
    


    levelBasedDiscountHtml1 += '<div class = "col-md-3">';

    levelBasedDiscountHtml1 += '<h6><strong>Discount Type</strong></h6>';
    levelBasedDiscountHtml1 += '<select style= "height: 28px;" id="discount_type-'+discid+'"opid="'+discid+'" class="form-control" onchange="symbol(this)" >';



        levelBasedDiscountHtml1 += '<option value="fixed">Fixed</option>';
        levelBasedDiscountHtml1 += '<option value="percent">Percent</option>';
       
    levelBasedDiscountHtml1 += '</select>';
    levelBasedDiscountHtml1 += '</div>';

    levelBasedDiscountHtml1 +='<div class = "col-md-3">';
    levelBasedDiscountHtml1 +='<h6><strong>Discount</strong></h6>';
    levelBasedDiscountHtml1 +='<div class="input-group">';
    levelBasedDiscountHtml1 +='<div id="input-group-'+discid+'" class="input-group-addon">$</div>';
    levelBasedDiscountHtml1 +='<input style= "height: 28px;" type="number" min="1" class="form-control"id="amount-price-'+discid+'" name="amount-price" value=""placeholder="Price" >';
    levelBasedDiscountHtml1 +='</div>';
    levelBasedDiscountHtml1 +='<p class="depositeerror"></p>';
    levelBasedDiscountHtml1 +='</div>';
 
    levelBasedDiscountHtml1 +='<div class = "col-md-1" id="add-new-discount">';
    levelBasedDiscountHtml1 +='<i style="color:#004598 !important; margin-top: 70px; margin-left: 35px;" class="addnewdiscount adddscountbuttonsty font-icon fa fa-plus-circle fa-2x" onclick="addNewDiscount();" egid="addnewdiscount"></i>';
    levelBasedDiscountHtml1 +='</div>';

    levelBasedDiscountHtml1 +='</div>';
   

    levelBasedDiscountHtml1 += '</div>'; //ending div

    
    //var overRideCheckBox = document.createElement("select");
    var overrideString = "Override User's Existing Level";
    var inputValidity = 'validity.valid||(value="")';
    html +=
      '<script>jQuery("#depositsstatus").change(function(){if(jQuery("#depositsstatus option:selected").val()!="no"){jQuery(".depositsdetail").show(); }else{ jQuery(".depositsdetail").hide();} });</script> <div class="row" style="margin-bottom: 2%;margin-top: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Selected Booths</label></div><div class="col-sm-8">' +
      selectedBoothtitles +
      '</div></div><div class="row" style="margin-bottom: 1%;"><div class="col-sm-2" style="text-align:right;"><label>Price</label></div><div class="col-sm-3"><div class="input-group"><span style="height:20px;"class="input-group-addon"><strong style="color:#333">' +
      currencysymbole +
      '</strong></span><input type="number" style="color:#333;height:32px;width: 99%;" id="boothprice" value="0" min="0" class="form-control currency"></div></div></div><div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Enable Deposits <i class="far fa-question-circle" title="Select if you want to enable split payments for this booth"></i></label></div><div class="col-sm-3"><select class="form-control" id="depositsstatus"><option value="optional">Deposit OR Pay in Full</option><option value="forced">Deposit Only - No Option to Pay in Full</option><option value="no" selected="true">No</option></select></div></div><div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label>Option to Reserve? <i class="far fa-question-circle" title=""></i></label></div><div class="col-sm-3"><input type="checkbox" style="margin-right:4px;"  id="reservedCheck"  value="0"></div></div><div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" id="levelAssigment" style="text-align:right;"><label>Level Purchasability<i class="far fa-question-circle" title="The level of a user that can purchase this booth." ></i></label></div><div class="col-sm-3"><select id="boothlevel" multiple="multiple"  placeholder="Select Booth Level"class="form-control js-example-basic-multiple">' +
      boothlevelnames +
      '</select></div></div><div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" id="UserAssigment" style="text-align:right;"><label>User Purchasability<i class="far fa-question-circle" ></i></label></div><div class="col-sm-3"><select id="UserBooth"  multiple="multiple" placeholder="Select User For  Booth" class="form-control js-example-basic-multiple">' +
      companynames +
      '</select></div></div><div class="row depositsdetail" style="margin-bottom: 3%;display:none;"><div class="col-sm-2" style="text-align:right;"><label>Deposits Type <i class="far fa-question-circle" title="For the initial payment, enter either a fixed dollar amount or a percentage of the entire cost."></i></label></div><div class="col-sm-3"><select id="depositstype" class="form-control" ><option value="percent">Percentage</option><option value="fixed">Fixed Amount</option></select></div></div><div class="row depositsdetail" style="margin-bottom: 3%;display:none;"><div class="col-sm-2" style="text-align:right;"><label>Deposit Amount <i class="far fa-question-circle" title=\'Enter dollar amount for "Fixed Amount" types, and percentage amount for "Percentage" types\'></i></label></div><div class="col-sm-3"><input style="color: #333;" id="depositamount" class="form-control" value="" min="1" type="number" ><p class="depositeerror"></p></div></div>'
      +'<div class="row" style="margin-bottom: 3%;"><div class="col-sm-2" style="text-align:right;"><label >Product Description <i class="far fa-question-circle"  title="This content will appear in the pop-up when users click this booth. Note this will no longer show after a booth is purchased."></i></label></div><div class="col-sm-8"><textarea rows="8" class="form-control" id="boothdescripition" ></textarea></div></div>'+
      '<hr>'+

      '<div><h3>Level Based Discount</h3></div>'+

      '<div id="level-based-discount">'+
      levelBasedDiscountHtml1 +
      '</div>'+
      // '<div id="add-new-discount">'+
      // '<a class="addnewdiscount btn btn-md myCustomeButton" style="margin-left: 89%;" onclick="addNewDiscount();" egid="addnewdiscount">Add</a>'+
      // '</div>'+

      '<hr>'+
      '<div class="row" style="margin-bottom: 1%; margin-left: 133px; color: gray"><h5 class="eg-sub-title"><strong>IF this booth is purchased, THEN</strong></h5></div><div class="row" style="margin-bottom: 3%;"><div style="margin-left: 6px;" ><div style="margin-left: 169px;margin-bottom: 11px;font-weight: bold;padding: 2px"><input type="checkbox" style="margin-right:4px;" id="overRideCheckBox" onclick="cliker()" value="0"><span style="font-size:bold">' +
      overrideString +
      '</span></div></div> <div class="col-sm-2" id="userLevelDiscriptionLabel" style="text-align:right;"><label>Assign User Level<i class="far fa-question-circle" title="Select the Level the user will be automatically assigned to upon purchasing this booth. "></i></label></div><div class="col-sm-3"><select id="boothlevelvalue" class="form-control">' +
      boothlevelname +
      '</select></div></div><div class="row" style="margin-bottom: 3%;"><div class="col-sm-1" ></div><div class="col-sm-1" id="updateproductbutton"></div><div class="col-sm-2"></div></div>';

    // <input  type="checkbox"
    //  id="overRideCheckBox" checked style="margin: 0px 6px 0px 0px;"><span style="font-size:bold">
    //    Overrides User Existing Level</span></div>
    //   var overRideCheck = jQuery("#overRideCheckBox:checked").val();

    //   if (overRideCheck == undefined) {
    //     jQuery("#boothlevelvalue").remove();
    //     jQuery("#boothlevelvalue").empty();
    //   } else if (overRideCheck == "on") {
    //     var Select =
    //       '<div class="col-sm-2" style="text-align:right;"><label>Assign/Re-Assign User Level <i class="far fa-question-circle" title="Select the Level the user will be automatically assigned to upon purchasing this booth. "></i></label></div><div class="col-sm-3"><select id="boothlevelvalue" class="form-control">' +
    //       boothlevelname +
    //       "</select></div>";
    //     jQuery("#boothlevelvalue").append(Select);
    //   }

    if (popupstatus == "success" || popupstatus == "multiboothselection") {
      if (exhibitorstatus == "deactive") {
        if (titlestatus == "") {
          boothdetailpopup = jQuery.confirm({
            onOpen: function () {
              jQuery(".js-example-basic-multiple").select2();
              jQuery("#boothlevelvalue").hide();
              jQuery("#userLevelDiscriptionLabel").hide();
              // console.log("IN open");
            },
            title: '<b style="text-align:center;">Self-booth Purchase</b>',
            content: html,
            html: true,
            closeIcon: true,
            columnClass: "jconfirm-box-container-special-boothtypes",
            cancelButton: false, // hides the cancel button.
            confirmButton: false, // hides the confirm button.
            backgroundDismiss: false,
          });

          jQuery(".mycustometable tbody").sortable();
          jQuery("#updateproductbutton").append(updateproductlist);
          //jQuery("#overRideCheckBox").append(checkOverride);
        } else {
          swal({
            title: "Invalid Booth Selection",
            text: "At least one booth in your current selection is missing booth number. Please assign booth numbers to all selected booths and try again.",
            type: "warning",
            confirmButtonClass: "btn-warning",
            confirmButtonText: "Ok",
          });
        }
      } else {
        swal({
          title: "Invalid Booth Selection",
          text: "At least one booth in your current selection has an exhibitor(s) already assigned. Either remove the exhibitor(s) assigned to your current selected booths, or reselect booths without any exhibitors assigned.",
          type: "warning",
          confirmButtonClass: "btn-warning",
          confirmButtonText: "Ok",
        });
      }
    }
  });

  /* mxEvent.addListener('', 'click', function()
	{
                          
                          var cell = graph.getSelectionCells();  
                          document.getElementById("applypricetegs").focus();
                          jQuery.each(cell,function(cellindex,cellvalue){
                             
                            
                               var selectedpricetegkey = document.getElementById("pricetegdropdown");
                               var seletedpricetegkeyvalue = selectedpricetegkey.options[selectedpricetegkey.selectedIndex].value;
                           
                              
                            
                            var labelvalue = "";
                            var boothdetailvalue = "";
                            var assigenduserID = "none";
                            var companydescripiton = "";
                            var boothproductid = "none";
                            var seletedlegendlabelsvalue="none";
                            var selectedlegendcolorcode="";
                            if (mxUtils.isNode(cellvalue.value))
                                {  
                                    
                                     assigenduserID = cellvalue.getAttribute('boothOwner', '');
                                     labelvalue = cellvalue.getAttribute('mylabel', '');
                                     boothdetailvalue = cellvalue.getAttribute('boothDetail', '');
                                     companydescripiton = cellvalue.getAttribute('companydescripiton', '');
                                     boothproductid = cellvalue.getAttribute('boothproductid', '');
                                     seletedlegendlabelsvalue = cellvalue.getAttribute('legendlabels', '');
                                     selectedlegendcolorcode = cellvalue.getAttribute('legendlabelscolor', '');
                                    
                                }
                                
                            var doc = mxUtils.createXmlDocument();
                            var node = doc.createElement('MyNode')
                          
                            node.setAttribute('boothOwner', assigenduserID);
                            node.setAttribute('mylabel', labelvalue);
                            node.setAttribute('boothDetail', boothdetailvalue);
                            
                            node.setAttribute('legendlabels', seletedlegendlabelsvalue);
                            node.setAttribute('legendlabelscolor', selectedlegendcolorcode);
                            node.setAttribute('companydescripiton', companydescripiton);
                            node.setAttribute('boothproductid', boothproductid);
                            node.setAttribute('pricetegid', seletedpricetegkeyvalue);
                               
                                  
                               
                                
                                cellvalue.value = node;
                                graph.cellLabelChanged(cellvalue, '');
                                    
                            });
                            
                            
                                   
                   
                });*/

  container.appendChild(stylePanel);

  container.style.paddingTop = "0px";

  return container;
};

function checkboothstatus(ID) {
  var CurrentBoothStatus = "";
  jQuery.each(allBoothsProductData, function (boothIndex, boothObject) {
    if (boothObject.cellID == ID) {
      CurrentBoothStatus = boothObject.boothstatus;
    }
  });

  return CurrentBoothStatus;
}
function checkBoothPurchaseable(ID) {
  var CurrentBoothStatus = "unselled";
  jQuery.each(allBoothsProductData, function (boothIndex, boothObject) {
    if (boothObject.cellID == ID) {
      CurrentBoothStatus = "selled";
    }
  });

  return CurrentBoothStatus;
}
StyleFormatPanel.prototype.addfloorplancompanydescription =
  function floorplancompany_descripiton() {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var ss = this.format.getSelectionState();
  };

function getWords(str) {
  return str.split(/\s+/).slice(0, 10).join(" ");
}

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addExhibitors = function (container) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;
  var ss = this.format.getSelectionState();

  var stylePanel = this.createPanel();
  stylePanel.style.paddingTop = "2px";
  stylePanel.style.paddingBottom = "2px";
  stylePanel.style.paddingLeft = "0px";
  stylePanel.style.position = "relative";
  stylePanel.style.marginLeft = "-2px";
  stylePanel.style.borderWidth = "0px";
  stylePanel.className = "geToolbarContainer";

  if (mxClient.IS_QUIRKS) {
    stylePanel.style.display = "block";
  }

  var btypename = document.createElement("div");
  btypename.innerHTML =
    'Booth Label  <i class="far fa-question-circle" title="Set Booth Number or other display label here."></i>';

  btypename.style.paddingTop = "10px";
  stylePanel.appendChild(btypename);

  var cell = graph.getSelectionCells();
  var labelvalue = "";
  var boothdetailvalue = "";
  var boothownervalue = "";
  var companydescripiton = "";
  if (mxUtils.isNode(cell[0].value)) {
    labelvalue = cell[0].getAttribute("mylabel", "");
    boothdetailvalue = cell[0].getAttribute("boothDetail", "");
    companydescripiton = cell[0].getAttribute("companydescripiton", "");
  }

  var getshowdescripiton = getWords(companydescripiton);
  var companydescripitonInput = document.createElement("input");

  companydescripitonInput.type = "hidden";
  companydescripitonInput.id = "currentcompanydescripiton";
  companydescripitonInput.value = unescape(companydescripiton);

  stylePanel.appendChild(companydescripitonInput);
  var boothtypename = document.createElement("input");
  boothtypename.type = "text";
  //boothNumber.value = '';
  boothtypename.style.padding = "4px";
  boothtypename.style.width = "92%";
  boothtypename.id = "boothnumber";

  boothtypename.value = labelvalue.replace(/\\/g, ""); //(cell != null)? cell[0].value : '';

  stylePanel.appendChild(boothtypename);

  var bothdetiallebal = document.createElement("div");

  bothdetiallebal.innerHTML =
    'Booth Detail  <i class="far fa-question-circle" title="Add any details of the booth itself here. This content will appear as a tooltip when users hover their mouse over the booth, and when a user clicks the booth IF there is no exhibitor assigned to that booth. Example: 10x10 Gold Booth.\n Note that if an Exhibitor is assigned to the booth, then the Exhibitor\'s \'Company Description\' details will override this content."></i>';

  bothdetiallebal.style.paddingTop = "10px";
  bothdetiallebal.style.display = "none";
  stylePanel.appendChild(bothdetiallebal);

  //console.log(cell);
  var boothdetail = document.createElement("input");
  boothdetail.id = "boothdetail";
  boothdetail.type = "hidden";
  boothdetail.value = "";

  boothdetail.style.padding = "4px";
  boothdetail.style.width = "92%";
  // boothdetail.setAttribute('value', "");
  boothdetail.value = boothdetailvalue.replace(/\\/g, "");
  //boothdetail.value = (cell != null)? cell[0].value : '';

  stylePanel.appendChild(boothdetail);

  var heading = document.createElement("div");

  var icontegat = document.createElement("p");

  icontegat.innerHTML =
    '<i class="font-icon fa fa-edit"  style="cursor: pointer;color: #0082ff;" title="Edit booth detail"></i>';
  icontegat.style.float = "right";
  icontegat.style.marginRight = "9%";
  icontegat.style.marginTop = "-6%";

  heading.innerHTML =
    'Booth Detail  <i class="far fa-question-circle" title="Add any details of the booth itself here. This content will appear as a tooltip when users hover their mouse over the booth, and when a user clicks the booth IF there is no exhibitor assigned to that booth. Example: 10x10 Gold Booth.\n Note that if an Exhibitor is assigned to the booth, then the Exhibitor\'s \'Company Description\' details will override this content."></i>';

  heading.style.paddingTop = "10px";
  heading.style.whiteSpace = "nowrap";
  heading.style.overflow = "hidden";
  heading.style.width = "200px";
  heading.style.fontWeight = "bold";

  stylePanel.appendChild(heading);
  stylePanel.appendChild(icontegat);

  var descripitiondetailhtml = document.createElement("p");
  descripitiondetailhtml.id = "descripitonhtmltext";
  if (getshowdescripiton != "") {
    var htmldescription = unescape(getshowdescripiton);

    descripitiondetailhtml.innerHTML = htmldescription.substr(0, 75) + "....";
  }

  descripitiondetailhtml.style.whiteSpace = "normal";
  descripitiondetailhtml.style.overflow = "hidden";
  descripitiondetailhtml.style.width = "236px";

  stylePanel.appendChild(descripitiondetailhtml);

  var seletetboothprduct = document.createElement("input");
  var boothporudcttitlename = document.createElement("p");
  //gradientSelect.style.position = 'absolute';
  //gradientSelect.style.marginTop = '-2px';
  //gradientSelect.style.right = (mxClient.IS_QUIRKS) ? '52px' : '72px';

  seletetboothprduct.type = "hidden";

  boothporudcttitlename.id = "selectedboothtitlename";

  seletetboothprduct.id = "boothproduct";
  seletetboothprduct.disabled = "true";
  var seletedproductID = "";

  if (mxUtils.isNode(cell[0].value)) {
    seletedproductID = cell[0].getAttribute("boothproductid", "");
  }

  //        var productdivtitle = document.createElement('div');
  //
  //        productdivtitle.style.width = '100%';
  //        var boothproduct = this.createTitle('Booth Product: ');
  //	boothproduct.style.paddingTop = '6px';
  //	boothproduct.style.paddingBottom = '6px';
  //        boothproduct.style.width = '35%';
  //
  //        var buttonsdiv = document.createElement('div');
  //        buttonsdiv.style.width = '22%';
  //        buttonsdiv.style.float = 'right';
  //
  //        buttonsdiv.id = 'customebuttonsdiv';
  //        var removeproduct = document.createElement('a');
  //
  //	removeproduct.id = 'removethisporduct';
  //
  //
  //
  //
  //
  //        removeproduct.innerHTML = '<i class="fa fa-trash" style="cursor: pointer;color: #0082ff;" ></i>';
  //        removeproduct.title = 'Remove';
  //
  //
  //        var editproduct = document.createElement('a');
  //
  //	editproduct.id = 'editthisporduct';
  //        editproduct.href = baseCurrentSiteURl+'/add-new-product/?productid='+seletedproductID;
  //        editproduct.target ="_blank";
  //        editproduct.style.marginRight = '10px';
  //        editproduct.innerHTML = '<i class="font-icon fa fa-edit" style="cursor: pointer;color: #0082ff;" ></i>';
  //        editproduct.title = 'Edit Product';
  //
  //       buttonsdiv.appendChild(editproduct);
  //       buttonsdiv.appendChild(removeproduct);
  //
  //       if(seletedproductID == 'none' || seletedproductID == ""){
  //            buttonsdiv.style.display = 'none';
  //       }
  //
  //       productdivtitle.appendChild(boothproduct);
  //       productdivtitle.appendChild(buttonsdiv);
  //
  //
  //        if(seletedproductID == ""){
  //
  //            seletetboothprduct.value = "none";
  //
  //        }
  //
  //
  //        jQuery.each(boothsproducts, function(index1, value) {
  //
  //
  //
  //                         if(seletedproductID == value.id){
  //
  //
  //                            seletetboothprduct.value = value.id;
  //                            boothporudcttitlename.innerHTML=currencysymbole+value.price+' '+value.title;
  //
  //                        }
  //
  //
  //
  //        });
  //
  //
  //
  //        if(cell.length == 1){
  //	 stylePanel.appendChild(productdivtitle);
  //         stylePanel.appendChild(boothporudcttitlename);
  //         stylePanel.appendChild(seletetboothprduct);
  //        }
  //

  var detailsubmit = document.createElement("button");
  detailsubmit.id = "applybutton";
  detailsubmit.title = "";

  detailsubmit.style.width = "56%";
  detailsubmit.style.float = "right";
  detailsubmit.style.marginTop = "10px";
  detailsubmit.style.marginRight = "50px";
  detailsubmit.className = "myCustomeButton";

  detailsubmit.innerHTML = "Apply Booth Settings";

  var title = document.createElement("div");

  title.innerHTML =
    'Exhibitors  <i class="far fa-question-circle" title="Select from your list of available users to assign the booth(s)."></i>';

  title.style.paddingTop = "6px";
  title.style.paddingBottom = "6px";

  if (cell.length == 1) {
    stylePanel.appendChild(title);
  }

  // Adds gradient direction option
  var gradientSelect = document.createElement("select");

  //gradientSelect.style.position = 'absolute';
  //gradientSelect.style.marginTop = '-2px';
  //gradientSelect.style.right = (mxClient.IS_QUIRKS) ? '52px' : '72px';
  gradientSelect.style.width = "92%";
  gradientSelect.id = "exhibitorID";

  // Stops events from bubbling to color option event handler
  mxEvent.addListener(gradientSelect, "click", function (evt) {
    mxEvent.consume(evt);
  });

  // Stops events from bubbling to color option event handler
  mxEvent.addListener(boothtypename, "click", function (evt) {
    mxEvent.consume(evt);
  });

  /*      
	var gradientPanel = this.createCellColorOption(mxResources.get('gradient'), mxConstants.STYLE_GRADIENTCOLOR, '#ffffff', function(color)
	{
		if (color == null || color == mxConstants.NONE)
		{
			gradientSelect.style.display = 'none';
		}
		else
		{
			gradientSelect.style.display = '';
		}
	});
	*/
  /*
	var fillKey = (ss.style.shape == 'image') ? mxConstants.STYLE_IMAGE_BACKGROUND : mxConstants.STYLE_FILLCOLOR;
	
	var fillPanel = this.createCellColorOption(mxResources.get('fill'), fillKey, '#ffffff');
	fillPanel.style.fontWeight = 'bold';

	var tmpColor = mxUtils.getValue(ss.style, fillKey, null);
	gradientPanel.style.display = (tmpColor != null && tmpColor != mxConstants.NONE &&
		ss.fill && ss.style.shape != 'image') ? '' : 'none';
*/
  var directions = ["none"];

  var gradientOption = document.createElement("option");
  gradientOption.setAttribute("selected", "true");
  gradientOption.setAttribute("value", "none");
  mxUtils.write(gradientOption, "None");
  gradientSelect.appendChild(gradientOption);
  var mxFloorPlanXml = mxUtils.getXml(ui.editor.getGraphXml());
  var xmlDoc = jQuery.parseXML(mxFloorPlanXml);
  $xml = jQuery(xmlDoc);

  //console.log(mxFloorPlanXml);

  jQuery.each(newcompanynamesArray, function (key, value) {
    var gradientOption = document.createElement("option");
    gradientOption.setAttribute("value", value.userID);
    mxUtils.write(gradientOption, value.companyname);
    jQuery($xml)
      .find("MyNode")
      .each(function () {
        var usercurrentid = jQuery(this).attr("boothOwner");
        if (value.userID == usercurrentid) {
          gradientOption.setAttribute("class", "assignedcolor");
        }
      });

    gradientSelect.appendChild(gradientOption);
  });

  jQuery.each(cell, function (cellindex, cellvalue) {
    var startfloorplanedtitng = {};

    var mylabel = cellvalue.getAttribute("mylabel", "");
    var boothproductid = cellvalue.getAttribute("boothproductid", "");
    var boothowner = cellvalue.getAttribute("boothOwner", "");
    var valuexmlstring = "";
    jQuery.each(cellvalue.value, function (valueindex, valuevalue) {
      if (valueindex == "outerHTML") {
        valuexmlstring = valuevalue;
      }
    });
    startfloorplanedtitng.action = "Select and Apply";
    startfloorplanedtitng.boothlable = mylabel;
    startfloorplanedtitng.boothid = cellvalue.id;
    startfloorplanedtitng.boothownerid = boothowner;
    startfloorplanedtitng.postboothdetail = valuexmlstring;
    startfloorplanedtitng.postboothstyle = cellvalue.style;

    startfloorplanedtitng.datetime = new Date(jQuery.now());

    expogenielogging.push(startfloorplanedtitng);
  });
  // console.log(expogenielogging);

  var listener = mxUtils.bind(this, function () {
    ss = this.format.getSelectionState();
    var cell = graph.getSelectionCells();
    var value = cell[0].getAttribute("boothOwner", "");

    // jQuery("#exhibitorID").valu('none');

    // Handles empty string which is not allowed as a value
    if (value == "") {
      value = directions[0];
    }

    //boothtypename.value = boothnametext;

    gradientSelect.value = value;

    container.style.display = ss.fill ? "" : "none";

    /*
		var fillColor = mxUtils.getValue(ss.style, mxConstants.STYLE_FILLCOLOR, null);

		if (!ss.fill || ss.containsImage || fillColor == null || fillColor == mxConstants.NONE)
		{
			gradientPanel.style.display = 'none';
		}
		else
		{
			gradientPanel.style.display = '';
		}
		*/
  });

  graph.getModel().addListener(mxEvent.CHANGE, listener);
  this.listeners.push({
    destroy: function () {
      graph.getModel().removeListener(listener);
      //console.log("asda");;
    },
  });
  listener();

  //        mxEvent.addListener(removeproduct, 'click', function()
  //	{
  //
  //
  //            jQuery("#boothproduct").val("none");
  //            jQuery("#customebuttonsdiv").hide();
  //            jQuery("#selectedboothtitlename").empty();
  //
  //
  //           // var cell = graph.getSelectionCells();
  //
  //          //   jQuery.each(cell,function(cellindex,cellvalue){
  //
  //            //     cellvalue.setAttribute('boothproductid', 'none');
  //
  //           //  });
  //
  //
  //
  //
  //        });
  function change_ch() {
    // console.log("Change");
  }

  mxEvent.addListener(icontegat, "click", function () {
    var getdescripitionvalue = jQuery("#currentcompanydescripiton").val();
    jQuery.confirm({
      title: "Booth Detail",
      content:
        '<textarea style="width:100%;height:200px;"class="companydescription"  >' +
        unescape(getdescripitionvalue) +
        "</textarea>",
      html: true,
      columnClass:
        "jconfirm-box-container-special-company-descripiton addboothdetialbox",

      closeIcon: true,
      confirmButton: "Apply",
      cancelButton: "Close",
      confirmButtonClass:
        "btn mycustomwidth btn-lg btn-primary mysubmitemailbutton",
      cancelButtonClass: "btn mycustomwidth btn-lg btn-danger",
      confirm: function () {
        var updatedescripionvalue = jQuery(".companydescription").val();
        jQuery("#currentcompanydescripiton").val(
          unescape(updatedescripionvalue)
        );

        jQuery("#descripitonhtmltext").empty();

        jQuery("#descripitonhtmltext").append(
          unescape(getWords(updatedescripionvalue)) + "...."
        );

        var cell = graph.getSelectionCells();
        document.getElementById("applybutton").focus();
        jQuery.each(cell, function (cellindex, cellvalue) {
          var startfloorplanedtitng = {};
          var valuexmlstring = "";
          jQuery.each(cellvalue.value, function (valueindex, valuevalue) {
            if (valueindex == "outerHTML") {
              valuexmlstring = valuevalue;
            }
          });

          startfloorplanedtitng.preboothdetail = valuexmlstring;
          startfloorplanedtitng.preboothstyle = cellvalue.style;
          var getdetailvalue = document.getElementById("boothdetail").value;
          var getboothnumber = document.getElementById("boothnumber").value;

          getdetailvalue = getdetailvalue.replace(/([,.!;"'])+/g, "");

          getboothnumber = getboothnumber.replace(/([,.!;"'])+/g, "");

          var currentcompanydescripiton = escape(
            jQuery("#currentcompanydescripiton").val()
          );

          var getexhibortervalue = "";
          var boothproductvalue = "";
          if (getboothnumber) {
          } else {
            getboothnumber = "";
          }
          if (getdetailvalue) {
          } else {
            getdetailvalue = "";
          }

          var doc = mxUtils.createXmlDocument();
          var node = doc.createElement("MyNode");
          var legendlabels = "";
          var legendlabelscolorUn = "";
          var legendlabelscolorOcc = "";
          var seletedpricetegkeyvalue = "none";
          node.setAttribute("mylabel", getboothnumber);
          node.setAttribute("boothDetail", getdetailvalue);
          node.setAttribute("companydescripiton", currentcompanydescripiton);

          if (cell.length == 1) {
            legendlabels = cell[0].getAttribute("legendlabels", "");
            legendlabelscolorUn = cell[0].getAttribute(
              "legendlabelscolorUn",
              ""
            );
            legendlabelscolorOcc = cell[0].getAttribute(
              "legendlabelscolorOcc",
              ""
            );
            seletedpricetegkeyvalue = cell[0].getAttribute("pricetegid", "");

            node.setAttribute("legendlabels", legendlabels);
            node.setAttribute("legendlabelscolorUn", legendlabelscolorUn);
            node.setAttribute("legendlabelscolorOcc", legendlabelscolorOcc);
            node.setAttribute("pricetegid", seletedpricetegkeyvalue);
            var e = document.getElementById("exhibitorID");
            if (e.options[e.selectedIndex].value != "") {
              getexhibortervalue = e.options[e.selectedIndex].value;
            } else {
              getexhibortervalue = "";
            }
            node.setAttribute("boothOwner", getexhibortervalue);
            var boothproductvaluecheck = cell[0].getAttribute(
              "boothproductid",
              ""
            );
            if (boothproductvaluecheck != "") {
              boothproductvalue = boothproductvaluecheck;
            } else {
              boothproductvalue = "";
            }
            node.setAttribute("boothproductid", boothproductvalue);

            if (getexhibortervalue != "none") {
              if (legendlabels != "none" && legendlabels != "") {
                if (legendlabelscolorOcc == "none") {
                  graph.setCellStyles("fillColor", ss.style.occ, cellvalue);
                } else {
                  graph.setCellStyles(
                    "fillColor",
                    legendlabelscolorOcc,
                    cellvalue
                  );
                }
              } else {
                graph.setCellStyles("fillColor", ss.style.occ, cellvalue);
              }
            } else {
              if (legendlabels != "none" && legendlabels != "") {
                //  graph.setCellStyles("fillColor", legendlabelscolorUn, cellvalue);
                if (legendlabelscolorUn == "none") {
                  graph.setCellStyles("fillColor", ss.style.uno, cellvalue);
                } else {
                  graph.setCellStyles(
                    "fillColor",
                    legendlabelscolorUn,
                    cellvalue
                  );
                }
              } else {
                graph.setCellStyles("fillColor", ss.style.uno, cellvalue);
              }
            }
          } else {
            var boothownerlastvalue = "";
            var boothproductlastvalue = "";
            var seletedpricetegkeyvalue = "none";
            if (mxUtils.isNode(cellvalue.value)) {
              // console.log(boothownerlastvalue);
              boothownerlastvalue = cellvalue.getAttribute("boothOwner", "");
              legendlabels = cellvalue.getAttribute("legendlabels", "");
              legendlabelscolorUn = cellvalue.getAttribute(
                "legendlabelscolorUn",
                ""
              );
              legendlabelscolorOcc = cellvalue.getAttribute(
                "legendlabelscolorOcc",
                ""
              );
              boothproductlastvalue = cellvalue.getAttribute(
                "boothproductid",
                ""
              );
              seletedpricetegkeyvalue = cellvalue.getAttribute(
                "pricetegid",
                ""
              );
            }

            if (boothownerlastvalue != "none") {
              if (legendlabels != "none" && legendlabels != "") {
                //  graph.setCellStyles("fillColor", legendlabelscolorOcc, cellvalue);

                if (legendlabelscolorOcc == "none") {
                  graph.setCellStyles("fillColor", ss.style.occ, cellvalue);
                } else {
                  graph.setCellStyles(
                    "fillColor",
                    legendlabelscolorOcc,
                    cellvalue
                  );
                }
              } else {
                graph.setCellStyles("fillColor", ss.style.occ, cellvalue);
              }
            } else {
              if (legendlabels != "none" && legendlabels != "") {
                // graph.setCellStyles("fillColor", legendlabelscolorUn, cellvalue);
                if (legendlabelscolorUn == "none") {
                  graph.setCellStyles("fillColor", ss.style.uno, cellvalue);
                } else {
                  graph.setCellStyles(
                    "fillColor",
                    legendlabelscolorUn,
                    cellvalue
                  );
                }
              } else {
                graph.setCellStyles("fillColor", ss.style.uno, cellvalue);
              }
            }
            node.setAttribute("boothOwner", boothownerlastvalue);
            node.setAttribute("legendlabels", legendlabels);
            node.setAttribute("legendlabelscolorUn", legendlabelscolorUn);
            node.setAttribute("legendlabelscolorOcc", legendlabelscolorOcc);
            node.setAttribute("boothproductid", boothproductlastvalue);
            node.setAttribute("pricetegid", seletedpricetegkeyvalue);
          }

          cellvalue.value = node;
          graph.cellLabelChanged(cellvalue, "");

          var startfloorplanedtitng = {};
          startfloorplanedtitng.action = "Update Company Description";
          var mylabel = cellvalue.getAttribute("mylabel", "");
          var boothproductid = cellvalue.getAttribute("boothproductid", "");
          var boothowner = cellvalue.getAttribute("boothOwner", "");
          var legendlabels = cellvalue.getAttribute("legendlabels", "");
          var legendlabelscolorUn = cellvalue.getAttribute(
            "legendlabelscolorUn",
            ""
          );
          var pricetegid = cellvalue.getAttribute("pricetegid", "");
          var legendlabelscolorOcc = cellvalue.getAttribute(
            "legendlabelscolorOcc",
            ""
          );
          var companydescripiton = cellvalue.getAttribute(
            "companydescripiton",
            ""
          );

          var valuexmlstring = "";
          jQuery.each(cellvalue.value, function (valueindex, valuevalue) {
            if (valueindex == "outerHTML") {
              valuexmlstring = valuevalue;
            }
          });

          startfloorplanedtitng.boothlable = mylabel;
          startfloorplanedtitng.boothid = cellvalue.id;
          startfloorplanedtitng.boothownerid = boothowner;
          startfloorplanedtitng.boothproductid = boothproductid;
          startfloorplanedtitng.legendlabels = legendlabels;
          startfloorplanedtitng.legendlabelscolorUn = legendlabelscolorUn;
          startfloorplanedtitng.legendlabelscolorOcc = legendlabelscolorOcc;
          startfloorplanedtitng.pricetegid = pricetegid;
          startfloorplanedtitng.postboothdetail = valuexmlstring;
          startfloorplanedtitng.postboothstyle = cellvalue.style;
          startfloorplanedtitng.datetime = new Date(jQuery.now());

          startfloorplanedtitng.companydescripiton = companydescripiton;
          expogenielogging.push(startfloorplanedtitng);
        });
      },
    });
  });
  mxEvent.addListener(detailsubmit, "click", function () {
    var cell = graph.getSelectionCells();
    document.getElementById("applybutton").focus();
    jQuery.each(cell, function (cellindex, cellvalue) { 
      var startfloorplanedtitng = {};
      var valuexmlstring = "";
      startfloorplanedtitng.action = "Update Booth";
      jQuery.each(cellvalue.value, function (valueindex, valuevalue) {
        if (valueindex == "outerHTML") {
          valuexmlstring = valuevalue;
        }
      });
      startfloorplanedtitng.preboothdetail = valuexmlstring;
      startfloorplanedtitng.preboothstyle = cellvalue.style;
      var getdetailvalue = document.getElementById("boothdetail").value;

      getdetailvalue = getdetailvalue.replace(/([,.!;"'])+/g, "");
      var getboothnumber = boothtypename.value;
      getboothnumber = getboothnumber.replace(/([,.!;"'])+/g, "");

      var currentcompanydescripiton = escape(
        jQuery("#currentcompanydescripiton").val()
      );

      var getexhibortervalue = "";
      var boothproductvalue = "";

      if (getboothnumber) {
      } else {
        getboothnumber = "";
      }
      if (getdetailvalue) {
      } else {
        getdetailvalue = "";
      }

      var doc = mxUtils.createXmlDocument();
      var node = doc.createElement("MyNode");
      var legendlabels = "";
      var legendlabelscolorUn = "";
      var legendlabelscolorOcc = "";
      var boothtagsvalue = "";

      node.setAttribute("mylabel", getboothnumber);
      node.setAttribute("boothDetail", getdetailvalue);
      node.setAttribute("companydescripiton", currentcompanydescripiton);

      if (cell.length == 1) {
      
        legendlabels = cell[0].getAttribute("legendlabels", "");
        legendlabelscolorUn = cell[0].getAttribute("legendlabelscolorUn", "");
        legendlabelscolorOcc = cell[0].getAttribute("legendlabelscolorOcc", "");
        boothtagsvalue = cell[0].getAttribute("boothtags", "");
        var seletedpricetegkeyvalue = cell[0].getAttribute("pricetegid", "");
        var boothproductvaluecheck = cell[0].getAttribute("boothproductid", "");

        var e = document.getElementById("exhibitorID");
        var oldboothowner = cell[0].getAttribute("boothOwner", "");
        if (e.options[e.selectedIndex].value != "none") {
          getexhibortervalue = e.options[e.selectedIndex].value;
        } else {
          getexhibortervalue = "none";
        }
        if(jQuery('#exhibitorID :selected').val() != 'none'){
      
          if((boothproductvaluecheck != "" || boothproductvaluecheck != null)){
  
            node.setAttribute("boothproductid", boothproductvalue);
          }else{
            node.setAttribute("boothproductid", "");
          }
          if(legendlabels != "none"){

            node.setAttribute("legendlabels", legendlabels);
          }else{
            node.setAttribute("legendlabels", "");
          }

          if(legendlabelscolorUn != "none"){

            node.setAttribute("legendlabelscolorUn", legendlabelscolorUn);
          
          }else{
            node.setAttribute("legendlabelscolorUn", "");
          }

          if(legendlabelscolorOcc != "none"){

            node.setAttribute("legendlabelscolorOcc", legendlabelscolorOcc);
          
          }else{
            node.setAttribute("legendlabelscolorOcc", "");
          }

          if(boothtagsvalue != "none"){

            node.setAttribute("boothtags", boothtagsvalue);
          
          }else{
            node.setAttribute("boothtags", "");
          }

          if (getexhibortervalue != "none") {
            if (legendlabels != "none" && legendlabels != "") {
          
              if (legendlabelscolorOcc == "none" || legendlabelscolorOcc == "") {
                graph.setCellStyles("fillColor", ss.style.occ, cellvalue);
              } else {
                graph.setCellStyles("fillColor", legendlabelscolorOcc, cellvalue);
              }
            } else {
               graph.setCellStyles("fillColor", ss.style.occ, cellvalue);
            }
          } else {

            if (legendlabels != "none" && legendlabels != "") {
              if (legendlabelscolorUn == "none" || legendlabelscolorUn == "") {
                //console.log('x-1');
                graph.setCellStyles("fillColor", ss.style.uno, cellvalue);
              } else {
                graph.setCellStyles("fillColor", legendlabelscolorUn, cellvalue);
              }
            } else {
              graph.setCellStyles("fillColor", ss.style.uno, cellvalue);
            }
          }

          
        }
        node.setAttribute("boothOwner", getexhibortervalue);

        if(jQuery('#exhibitorID :selected').val() == 'none'){
      
          node.setAttribute("legendlabels", legendlabels);
          node.setAttribute("legendlabelscolorUn", legendlabelscolorUn);
          node.setAttribute("legendlabelscolorOcc", legendlabelscolorOcc);
  
          node.setAttribute("pricetegid", seletedpricetegkeyvalue);
          node.setAttribute("boothtags", boothtagsvalue);
  
  
          
          var cellID = cell[0].id;
          if (boothproductvaluecheck != "") {
            boothproductvalue = boothproductvaluecheck;
  
            // console.log(boothproductvalue);
          } else {
            boothproductvalue = "";
          }
          if (oldboothowner != "" && oldboothowner != "none") { 
            jQuery.each(allBoothsProductData, function (boothIndex, boothObject) {
              if (boothObject.cellID == cellID) {
                allBoothsProductData[boothIndex].boothstatus = "deleterequest";
                boothproductvalue = "";
              }
            });
          }
  
          
          //document.getElementById("boothproduct");
  
          node.setAttribute("boothproductid", boothproductvalue);
  
          if (getexhibortervalue != "none") {
          
            if (legendlabels != "none" && legendlabels != "") {

              if (legendlabelscolorOcc == "none") {

                graph.setCellStyles("fillColor", ss.style.occ, cellvalue);
              } else {
            
                graph.setCellStyles("fillColor", legendlabelscolorOcc, cellvalue);
              }
            } else {

              if(legendlabelscolorUn != "none" || legendlabelscolorUn != ""){

                graph.setCellStyles("fillColor", ss.style.uno, cellvalue);
              }
               graph.setCellStyles("fillColor", ss.style.occ, cellvalue);
            }
          } else {
       
            if (legendlabels != "none" && legendlabels != "") {

            
              if (legendlabelscolorUn == "none" || legendlabelscolorUn == "") {
    
                graph.setCellStyles("fillColor", ss.style.uno, cellvalue);
              } else {
                
                graph.setCellStyles("fillColor", '', cellvalue);
                graph.setCellStyles("fillColor", legendlabelscolorUn, cellvalue);
              }
            } else {
     
               graph.setCellStyles("fillColor", ss.style.uno, cellvalue);
            }
          }
        }
      } else {

 
        var boothownerlastvalue = "";
        var boothproductlastvalue = "";
        var seletedpricetegkeyvalue = "none";
        var boothvaluetag = "";
        if (mxUtils.isNode(cellvalue.value)) {
         // console.log(boothownerlastvalue);
          boothownerlastvalue = cellvalue.getAttribute("boothOwner", "");

          legendlabels = cellvalue.getAttribute("legendlabels", "");
          legendlabelscolorUn = cell[0].getAttribute("legendlabelscolorUn", "");
          legendlabelscolorOcc = cell[0].getAttribute(
            "legendlabelscolorOcc",
            ""
          );
          boothproductlastvalue = cellvalue.getAttribute("boothproductid", "");
          seletedpricetegkeyvalue = cellvalue.getAttribute("pricetegid", "");
          boothvaluetag = cellvalue.getAttribute("boothtags", "");
        }


        if (boothownerlastvalue != "none" && boothownerlastvalue != "") {
          if (legendlabels != "none" && legendlabels != "") {
            if (legendlabelscolorOcc == "none" || legendlabelscolorOcc == "") {
              graph.setCellStyles("fillColor", ss.style.occ, cellvalue);
            } else {
              graph.setCellStyles("fillColor", legendlabelscolorOcc, cellvalue);
            }
          } else {
            graph.setCellStyles("fillColor", ss.style.occ, cellvalue);
          }
        } else {
          if (legendlabels != "none" && legendlabels != "") {
            // graph.setCellStyles("fillColor", legendlabelscolorUn, cellvalue);
            if (legendlabelscolorUn == "none" || legendlabelscolorUn == "") {
              graph.setCellStyles("fillColor", ss.style.uno, cellvalue);
            } else {
              graph.setCellStyles("fillColor", legendlabelscolorUn, cellvalue);
            }
          } else {
     
            graph.setCellStyles("fillColor", ss.style.uno, cellvalue);
          }
        }

        node.setAttribute("boothOwner", boothownerlastvalue);
        node.setAttribute("legendlabels", legendlabels);
       
        node.setAttribute("legendlabelscolorUn", legendlabelscolorUn);
        node.setAttribute("legendlabelscolorOcc", legendlabelscolorOcc);
        node.setAttribute("boothproductid", boothproductlastvalue);
        node.setAttribute("pricetegid", seletedpricetegkeyvalue);
        node.setAttribute("pricetegid", boothvaluetag);
      }

   
      cellvalue.value = node;
      graph.cellLabelChanged(cellvalue, "");

      var mylabel = cellvalue.getAttribute("mylabel", "");
      var boothproductid = cellvalue.getAttribute("boothproductid", "");
      var boothowner = cellvalue.getAttribute("boothOwner", "");

      var legendlabels = cellvalue.getAttribute("legendlabels", "");
      var legendlabelscolorUn = cellvalue.getAttribute(
        "legendlabelscolorUn",
        ""
      );
      var pricetegid = cellvalue.getAttribute("pricetegid", "");
      var legendlabelscolorOcc = cellvalue.getAttribute(
        "legendlabelscolorOcc",
        ""
      );

      var valuexmlstring = "";
      jQuery.each(cellvalue.value, function (valueindex, valuevalue) {
        if (valueindex == "outerHTML") {
          valuexmlstring = valuevalue;
        }
      });

      startfloorplanedtitng.boothlable = mylabel;
      startfloorplanedtitng.boothid = cellvalue.id;
      startfloorplanedtitng.boothownerid = boothowner;
      startfloorplanedtitng.boothproductid = boothproductid;
      startfloorplanedtitng.legendlabels = legendlabels;
      startfloorplanedtitng.datetime = new Date(jQuery.now());
      startfloorplanedtitng.legendlabelscolorUn = legendlabelscolorUn;
      startfloorplanedtitng.legendlabelscolorOcc = legendlabelscolorOcc;
      startfloorplanedtitng.pricetegid = pricetegid;

      startfloorplanedtitng.postboothdetail = valuexmlstring;
      startfloorplanedtitng.postboothstyle = cellvalue.style;
      expogenielogging.push(startfloorplanedtitng);
    });

    jQuery(".select2").select2();
  });

  //	mxEvent.addListener(gradientSelect, 'change', function(evt)
  //	{
  //		graph.setCellStyles("boothOwner", gradientSelect.value, graph.getSelectionCells());
  //
  //
  //
  //		if(gradientSelect.value != '<None>')
  //			graph.setCellStyles("fillColor", ss.style.occ, graph.getSelectionCells());
  //		else
  //			graph.setCellStyles("fillColor", ss.style.uno, graph.getSelectionCells());
  //
  //		mxEvent.consume(evt);
  //	});

  //	graph.convertValueToString = function(cell)
  //	{
  //		//mxUtils.alert(cell.value);
  //		console.log(cell.value+' - '+boothtypename.value);
  //		//return cell.value = (cell.value == '') ?  boothNumber.value : cell.value;
  //		return cell.value = boothtypename.value;
  //	};
  graph.convertValueToString = function (cell) {
    if (mxUtils.isNode(cell.value)) {
      return cell.getAttribute("mylabel", "");
    } else {
      return "";
    }
  };
  var cellLabelChanged = graph.cellLabelChanged;
  graph.cellLabelChanged = function (cell, newValue, autoSize) {
    if (mxUtils.isNode(cell.value)) {
      // Clones the value for correct undo/redo

      var elt = cell.value.cloneNode(true);
      elt.setAttribute("mylabel", newValue);
      newValue = elt;
    }

    cellLabelChanged.apply(this, arguments);
  };
  //	var cellLabelChanged = graph.cellLabelChanged;
  //	graph.cellLabelChanged = function(cell, newValue, autoSize)
  //	{
  //		//mxUtils.alert(newValue);
  //                 console.log('celllabelchanged-> '+newValue);
  //	  if (mxUtils.isNode(cell.value))
  //	  {
  //		// Clones the value for correct undo/redo
  //		var elt = cell.value.cloneNode(true);
  //		elt.setAttribute('value', newValue);
  //		newValue = elt;
  //	  }
  //
  //	  cellLabelChanged.apply(this, arguments);
  //	};

  //	var applyHandler = function()
  //				{
  //					var newValue = boothtypename.value || '';
  //					var oldValue = '';
  //                                        console.log(newValue+ "--------------"+oldValue);
  //					if (newValue != oldValue)
  //					{
  //						graph.getModel().beginUpdate();
  //
  //                        try
  //                        {
  //							var cell = graph.getSelectionCells();
  //							graph.setCellStyles("boothname", boothtypename.value, cell);
  //                        	//var edit = new mxCellAttributeChange(
  // 		                           //graph.getSelectionCells(), 'boothNumber',
  // 		                           //newValue);
  //                           	//graph.getModel().execute(edit);
  //                           	//graph.updateCellSize(cell);
  //                        }
  //                        finally
  //                        {
  //                            graph.getModel().endUpdate();
  //                        }
  //					}
  //				};
  //
  //				mxEvent.addListener(boothtypename, 'keypress', function (evt)
  //				{
  //					// Needs to take shift into account for textareas
  //					if (evt.keyCode == /*enter*/13 &&
  //						!mxEvent.isShiftDown(evt))
  //					{
  //						boothtypename.blur();
  //					}
  //				});
  //
  //				if (mxClient.IS_IE)
  //				{
  //					mxEvent.addListener(boothtypename, 'focusout', applyHandler);
  //				}
  //				else
  //				{
  //					// Note: Known problem is the blurring of fields in
  //					// Firefox by changing the selection, in which case
  //					// no event is fired in FF and the change is lost.
  //					// As a workaround you should use a local variable
  //					// that stores the focused field and invoke blur
  //					// explicitely where we do the graph.focus above.
  //					mxEvent.addListener(boothtypename, 'blur', applyHandler);
  //				}
  //
  //

  //stylePanel.appendChild(boothNumber);
  if (cell.length == 1) {
    stylePanel.appendChild(gradientSelect);
  }
  stylePanel.appendChild(detailsubmit);

  //container.appendChild(cssPanel);
  //   if(cell.length == 1){
  container.appendChild(stylePanel);
  //  }

  if (ss.style.shape == "swimlane") {
    container.appendChild(
      this.createCellColorOption(
        mxResources.get("laneColor"),
        "swimlaneFillColor",
        "#ffffff"
      )
    );
  }
  container.style.paddingTop = "0px";

  return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addStroke = function (container) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var ss = this.format.getSelectionState();

  container.style.paddingTop = "4px";
  container.style.paddingBottom = "4px";
  container.style.whiteSpace = "normal";
  container.style.borderBottom = "0px";
  var colorPanel = document.createElement("div");
  colorPanel.style.fontWeight = "bold";

  // Adds gradient direction option
  var styleSelect = document.createElement("select");
  styleSelect.style.position = "absolute";
  styleSelect.style.marginTop = "-2px";
  styleSelect.style.right = "72px";
  styleSelect.style.width = "80px";

  // Adds shape option
  var shapeSelect = document.createElement("select");
  shapeSelect.style.position = "absolute";
  shapeSelect.style.marginTop = "-2px";
  shapeSelect.style.right = "72px";
  shapeSelect.style.width = "80px";

  var styles = ["sharp", "rounded", "curved"];

  for (var i = 0; i < styles.length; i++) {
    var styleOption = document.createElement("option");
    styleOption.setAttribute("value", styles[i]);
    mxUtils.write(styleOption, mxResources.get(styles[i]));
    styleSelect.appendChild(styleOption);
  }

  var shapes = ["rectangle", "ellipse"];

  for (var i = 0; i < shapes.length; i++) {
    var shapeOption = document.createElement("option");
    shapeOption.setAttribute("value", shapes[i]);

    if (ss.style.shape == shapes[i]) shapeOption.setAttribute("selected", true);

    if (shapes[i] == "rectangle") {
      mxUtils.write(shapeOption, "Rectangle");
    } else {
      mxUtils.write(shapeOption, "Circle");
    }
    shapeSelect.appendChild(shapeOption);
  }

  mxEvent.addListener(styleSelect, "change", function (evt) {

    graph.getModel().beginUpdate();
    try {
      var keys = [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED];
      // Default for rounded is 1
      var values = ["0", null];

      if (styleSelect.value == "rounded") {
        values = ["1", null];
      } else if (styleSelect.value == "curved") {
        values = [null, "1"];
      }

      for (var i = 0; i < keys.length; i++) {
        graph.setCellStyles(keys[i], values[i], graph.getSelectionCells());
      }

      ui.fireEvent(
        new mxEventObject(
          "styleChanged",
          "keys",
          keys,
          "values",
          values,
          "cells",
          graph.getSelectionCells()
        )
      );
    } finally {
      graph.getModel().endUpdate();
    }

    mxEvent.consume(evt);
  });

  // Stops events from bubbling to color option event handler
  mxEvent.addListener(styleSelect, "click", function (evt) {
    mxEvent.consume(evt);
  });

  mxEvent.addListener(shapeSelect, "change", function (evt) {
    graph.getModel().beginUpdate();
    try {
      var keys = ["shape"];

      if (shapeSelect.value == "rectangle") {
        values = [shapeSelect.value];
      } else if (shapeSelect.value == "ellipse") {
        values = [shapeSelect.value];
      }

      for (var i = 0; i < keys.length; i++) {
        graph.setCellStyles(keys[i], values[i], graph.getSelectionCells());
      }

      ui.fireEvent(
        new mxEventObject(
          "shapeChanged",
          "keys",
          keys,
          "values",
          values,
          "cells",
          graph.getSelectionCells()
        )
      );
    } finally {
      graph.getModel().endUpdate();
    }

    mxEvent.consume(evt);
  });

  // Stops events from bubbling to color option event handler
  mxEvent.addListener(shapeSelect, "click", function (evt) {
    mxEvent.consume(evt);
  });

  var strokeKey =
    ss.style.shape == "image"
      ? mxConstants.STYLE_IMAGE_BORDER
      : mxConstants.STYLE_STROKECOLOR;

  var lineColor = this.createCellColorOption(
    mxResources.get("line"),
    strokeKey,
    "#000000"
  );
  lineColor.appendChild(styleSelect);
  colorPanel.appendChild(lineColor);

  // Used if only edges selected
  var stylePanel = colorPanel.cloneNode(false);
  stylePanel.style.fontWeight = "normal";
  stylePanel.style.whiteSpace = "nowrap";
  stylePanel.style.position = "relative";

  stylePanel.style.marginBottom = "2px";
  stylePanel.style.marginTop = "2px";
  stylePanel.className = "geToolbarContainer";

  var addItem = mxUtils.bind(
    this,
    function (menu, width, cssName, keys, values) {
      var item = this.editorUi.menus.styleChange(
        menu,
        "",
        keys,
        values,
        "geIcon",
        null
      );

      var pat = document.createElement("div");
      pat.style.width = width + "px";
      pat.style.height = "1px";
      pat.style.borderBottom = "1px " + cssName + " black";
      pat.style.paddingTop = "6px";

      item.firstChild.firstChild.style.padding = "0px 4px 0px 4px";
      item.firstChild.firstChild.style.width = width + "px";
      item.firstChild.firstChild.appendChild(pat);

      return item;
    }
  );

  var pattern = this.editorUi.toolbar.addMenuFunctionInContainer(
    stylePanel,
    "geSprite-orthogonal",
    mxResources.get("pattern"),
    false,
    mxUtils.bind(this, function (menu) {
      addItem(
        menu,
        75,
        "solid",
        [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
        [null, null]
      ).setAttribute("title", mxResources.get("solid"));
      addItem(
        menu,
        75,
        "dashed",
        [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
        ["1", null]
      ).setAttribute("title", mxResources.get("dashed"));
      addItem(
        menu,
        75,
        "dotted",
        [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
        ["1", "1 1"]
      ).setAttribute("title", mxResources.get("dotted") + " (1)");
      addItem(
        menu,
        75,
        "dotted",
        [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
        ["1", "1 2"]
      ).setAttribute("title", mxResources.get("dotted") + " (2)");
      addItem(
        menu,
        75,
        "dotted",
        [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
        ["1", "1 4"]
      ).setAttribute("title", mxResources.get("dotted") + " (3)");
    })
  );

  // Used for mixed selection (vertices and edges)
  var altStylePanel = stylePanel.cloneNode(false);

  var edgeShape = this.editorUi.toolbar.addMenuFunctionInContainer(
    altStylePanel,
    "geSprite-connection",
    mxResources.get("connection"),
    false,
    mxUtils.bind(this, function (menu) {
      this.editorUi.menus
        .styleChange(
          menu,
          "",
          [
            mxConstants.STYLE_SHAPE,
            mxConstants.STYLE_STARTSIZE,
            mxConstants.STYLE_ENDSIZE,
            "width",
          ],
          [null, null, null, null],
          "geIcon geSprite geSprite-connection",
          null,
          true
        )
        .setAttribute("title", mxResources.get("line"));
      this.editorUi.menus
        .styleChange(
          menu,
          "",
          [
            mxConstants.STYLE_SHAPE,
            mxConstants.STYLE_STARTSIZE,
            mxConstants.STYLE_ENDSIZE,
            "width",
          ],
          ["link", null, null, null],
          "geIcon geSprite geSprite-linkedge",
          null,
          true
        )
        .setAttribute("title", mxResources.get("link"));
      this.editorUi.menus
        .styleChange(
          menu,
          "",
          [
            mxConstants.STYLE_SHAPE,
            mxConstants.STYLE_STARTSIZE,
            mxConstants.STYLE_ENDSIZE,
            "width",
          ],
          ["flexArrow", null, null, null],
          "geIcon geSprite geSprite-arrow",
          null,
          true
        )
        .setAttribute("title", mxResources.get("arrow"));
      this.editorUi.menus
        .styleChange(
          menu,
          "",
          [
            mxConstants.STYLE_SHAPE,
            mxConstants.STYLE_STARTSIZE,
            mxConstants.STYLE_ENDSIZE,
            "width",
          ],
          ["arrow", null, null, null],
          "geIcon geSprite geSprite-simplearrow",
          null,
          true
        )
        .setAttribute("title", mxResources.get("simpleArrow"));
    })
  );

  var altPattern = this.editorUi.toolbar.addMenuFunctionInContainer(
    altStylePanel,
    "geSprite-orthogonal",
    mxResources.get("pattern"),
    false,
    mxUtils.bind(this, function (menu) {
      addItem(
        menu,
        33,
        "solid",
        [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
        [null, null]
      ).setAttribute("title", mxResources.get("solid"));
      addItem(
        menu,
        33,
        "dashed",
        [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
        ["1", null]
      ).setAttribute("title", mxResources.get("dashed"));
      addItem(
        menu,
        33,
        "dotted",
        [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
        ["1", "1 1"]
      ).setAttribute("title", mxResources.get("dotted") + " (1)");
      addItem(
        menu,
        33,
        "dotted",
        [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
        ["1", "1 2"]
      ).setAttribute("title", mxResources.get("dotted") + " (2)");
      addItem(
        menu,
        33,
        "dotted",
        [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
        ["1", "1 4"]
      ).setAttribute("title", mxResources.get("dotted") + " (3)");
    })
  );

  var stylePanel2 = stylePanel.cloneNode(false);

  // Stroke width
  var input = document.createElement("input");
  input.style.textAlign = "right";
  input.style.marginTop = "2px";
  input.style.width = "41px";
  input.setAttribute("title", mxResources.get("linewidth"));

  stylePanel.appendChild(input);

  var altInput = input.cloneNode(true);
  altStylePanel.appendChild(altInput);

  function update(evt) {
    // Maximum stroke width is 999
    var value = parseInt(input.value);
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));

    if (value != mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1)) {
      graph.setCellStyles(
        mxConstants.STYLE_STROKEWIDTH,
        value,
        graph.getSelectionCells()
      );
      ui.fireEvent(
        new mxEventObject(
          "styleChanged",
          "keys",
          [mxConstants.STYLE_STROKEWIDTH],
          "values",
          [value],
          "cells",
          graph.getSelectionCells()
        )
      );
    }

    input.value = value + " pt";
    mxEvent.consume(evt);
  }

  function altUpdate(evt) {
    // Maximum stroke width is 999
    var value = parseInt(altInput.value);
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));

    if (value != mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1)) {
      graph.setCellStyles(
        mxConstants.STYLE_STROKEWIDTH,
        value,
        graph.getSelectionCells()
      );
      ui.fireEvent(
        new mxEventObject(
          "styleChanged",
          "keys",
          [mxConstants.STYLE_STROKEWIDTH],
          "values",
          [value],
          "cells",
          graph.getSelectionCells()
        )
      );
    }

    altInput.value = value + " pt";
    mxEvent.consume(evt);
  }

  var stepper = this.createStepper(input, update, 1, 9);
  stepper.style.display = input.style.display;
  stepper.style.marginTop = "2px";
  stylePanel.appendChild(stepper);

  var altStepper = this.createStepper(altInput, altUpdate, 1, 9);
  altStepper.style.display = altInput.style.display;
  altStepper.style.marginTop = "2px";
  altStylePanel.appendChild(altStepper);

  if (!mxClient.IS_QUIRKS) {
    input.style.position = "absolute";
    input.style.right = "32px";
    input.style.height = "15px";
    stepper.style.right = "20px";

    altInput.style.position = "absolute";
    altInput.style.right = "32px";
    altInput.style.height = "15px";
    altStepper.style.right = "20px";
  } else {
    input.style.height = "17px";
    altInput.style.height = "17px";
  }

  mxEvent.addListener(input, "blur", update);
  mxEvent.addListener(input, "change", update);

  mxEvent.addListener(altInput, "blur", altUpdate);
  mxEvent.addListener(altInput, "change", altUpdate);

  if (mxClient.IS_QUIRKS) {
    mxUtils.br(stylePanel2);
    mxUtils.br(stylePanel2);
  }

  var edgeStyle = this.editorUi.toolbar.addMenuFunctionInContainer(
    stylePanel2,
    "geSprite-orthogonal",
    mxResources.get("waypoints"),
    false,
    mxUtils.bind(this, function (menu) {
      if (ss.style.shape != "arrow") {
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            "",
            [
              mxConstants.STYLE_EDGE,
              mxConstants.STYLE_CURVED,
              mxConstants.STYLE_NOEDGESTYLE,
            ],
            [null, null, null],
            "geIcon geSprite geSprite-straight",
            null,
            true
          )
          .setAttribute("title", mxResources.get("straight"));
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            "",
            [
              mxConstants.STYLE_EDGE,
              mxConstants.STYLE_CURVED,
              mxConstants.STYLE_NOEDGESTYLE,
            ],
            ["orthogonalEdgeStyle", null, null],
            "geIcon geSprite geSprite-orthogonal",
            null,
            true
          )
          .setAttribute("title", mxResources.get("orthogonal"));
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            "",
            [
              mxConstants.STYLE_EDGE,
              mxConstants.STYLE_ELBOW,
              mxConstants.STYLE_CURVED,
              mxConstants.STYLE_NOEDGESTYLE,
            ],
            ["elbowEdgeStyle", null, null, null],
            "geIcon geSprite geSprite-horizontalelbow",
            null,
            true
          )
          .setAttribute("title", mxResources.get("simple"));
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            "",
            [
              mxConstants.STYLE_EDGE,
              mxConstants.STYLE_ELBOW,
              mxConstants.STYLE_CURVED,
              mxConstants.STYLE_NOEDGESTYLE,
            ],
            ["elbowEdgeStyle", "vertical", null, null],
            "geIcon geSprite geSprite-verticalelbow",
            null,
            true
          )
          .setAttribute("title", mxResources.get("simple"));
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            "",
            [
              mxConstants.STYLE_EDGE,
              mxConstants.STYLE_ELBOW,
              mxConstants.STYLE_CURVED,
              mxConstants.STYLE_NOEDGESTYLE,
            ],
            ["isometricEdgeStyle", null, null, null],
            "geIcon geSprite geSprite-horizontalisometric",
            null,
            true
          )
          .setAttribute("title", mxResources.get("isometric"));
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            "",
            [
              mxConstants.STYLE_EDGE,
              mxConstants.STYLE_ELBOW,
              mxConstants.STYLE_CURVED,
              mxConstants.STYLE_NOEDGESTYLE,
            ],
            ["isometricEdgeStyle", "vertical", null, null],
            "geIcon geSprite geSprite-verticalisometric",
            null,
            true
          )
          .setAttribute("title", mxResources.get("isometric"));

        if (ss.style.shape == "connector") {
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [
                mxConstants.STYLE_EDGE,
                mxConstants.STYLE_CURVED,
                mxConstants.STYLE_NOEDGESTYLE,
              ],
              ["orthogonalEdgeStyle", "1", null],
              "geIcon geSprite geSprite-curved",
              null,
              true
            )
            .setAttribute("title", mxResources.get("curved"));
        }

        this.editorUi.menus
          .edgeStyleChange(
            menu,
            "",
            [
              mxConstants.STYLE_EDGE,
              mxConstants.STYLE_CURVED,
              mxConstants.STYLE_NOEDGESTYLE,
            ],
            ["entityRelationEdgeStyle", null, null],
            "geIcon geSprite geSprite-entity",
            null,
            true
          )
          .setAttribute("title", mxResources.get("entityRelation"));
      }
    })
  );

  var lineStart = this.editorUi.toolbar.addMenuFunctionInContainer(
    stylePanel2,
    "geSprite-startclassic",
    mxResources.get("linestart"),
    false,
    mxUtils.bind(this, function (menu) {
      if (ss.style.shape == "connector" || ss.style.shape == "flexArrow") {
        var item = this.editorUi.menus.edgeStyleChange(
          menu,
          "",
          [mxConstants.STYLE_STARTARROW, "startFill"],
          [mxConstants.NONE, 0],
          "geIcon",
          null,
          false
        );
        item.setAttribute("title", mxResources.get("none"));
        item.firstChild.firstChild.innerHTML =
          '<font style="font-size:10px;">' +
          mxUtils.htmlEntities(mxResources.get("none")) +
          "</font>";

        if (ss.style.shape == "connector") {
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_CLASSIC, 1],
              "geIcon geSprite geSprite-startclassic",
              null,
              false
            )
            .setAttribute("title", mxResources.get("classic"));
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            [mxConstants.ARROW_CLASSIC_THIN, 1],
            "geIcon geSprite geSprite-startclassicthin",
            null,
            false
          );
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_OPEN, 0],
              "geIcon geSprite geSprite-startopen",
              null,
              false
            )
            .setAttribute("title", mxResources.get("openArrow"));
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            [mxConstants.ARROW_OPEN_THIN, 0],
            "geIcon geSprite geSprite-startopenthin",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["openAsync", 0],
            "geIcon geSprite geSprite-startopenasync",
            null,
            false
          );
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_BLOCK, 1],
              "geIcon geSprite geSprite-startblock",
              null,
              false
            )
            .setAttribute("title", mxResources.get("block"));
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            [mxConstants.ARROW_BLOCK_THIN, 1],
            "geIcon geSprite geSprite-startblockthin",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["async", 1],
            "geIcon geSprite geSprite-startasync",
            null,
            false
          );
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_OVAL, 1],
              "geIcon geSprite geSprite-startoval",
              null,
              false
            )
            .setAttribute("title", mxResources.get("oval"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_DIAMOND, 1],
              "geIcon geSprite geSprite-startdiamond",
              null,
              false
            )
            .setAttribute("title", mxResources.get("diamond"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_DIAMOND_THIN, 1],
              "geIcon geSprite geSprite-startthindiamond",
              null,
              false
            )
            .setAttribute("title", mxResources.get("diamondThin"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_CLASSIC, 0],
              "geIcon geSprite geSprite-startclassictrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("classic"));
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            [mxConstants.ARROW_CLASSIC_THIN, 0],
            "geIcon geSprite geSprite-startclassicthintrans",
            null,
            false
          );
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_BLOCK, 0],
              "geIcon geSprite geSprite-startblocktrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("block"));
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            [mxConstants.ARROW_BLOCK_THIN, 0],
            "geIcon geSprite geSprite-startblockthintrans",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["async", 0],
            "geIcon geSprite geSprite-startasynctrans",
            null,
            false
          );
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_OVAL, 0],
              "geIcon geSprite geSprite-startovaltrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("oval"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_DIAMOND, 0],
              "geIcon geSprite geSprite-startdiamondtrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("diamond"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_DIAMOND_THIN, 0],
              "geIcon geSprite geSprite-startthindiamondtrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("diamondThin"));

          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["dash", 0],
            "geIcon geSprite geSprite-startdash",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["cross", 0],
            "geIcon geSprite geSprite-startcross",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["circlePlus", 0],
            "geIcon geSprite geSprite-startcircleplus",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["circle", 1],
            "geIcon geSprite geSprite-startcircle",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["ERone", 0],
            "geIcon geSprite geSprite-starterone",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["ERmandOne", 0],
            "geIcon geSprite geSprite-starteronetoone",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["ERmany", 0],
            "geIcon geSprite geSprite-startermany",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["ERoneToMany", 0],
            "geIcon geSprite geSprite-starteronetomany",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["ERzeroToOne", 1],
            "geIcon geSprite geSprite-starteroneopt",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            ["ERzeroToMany", 1],
            "geIcon geSprite geSprite-startermanyopt",
            null,
            false
          );
        } else {
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW],
              [mxConstants.ARROW_BLOCK],
              "geIcon geSprite geSprite-startblocktrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("block"));
        }
      }
    })
  );

  var lineEnd = this.editorUi.toolbar.addMenuFunctionInContainer(
    stylePanel2,
    "geSprite-endclassic",
    mxResources.get("lineend"),
    false,
    mxUtils.bind(this, function (menu) {
      if (ss.style.shape == "connector" || ss.style.shape == "flexArrow") {
        var item = this.editorUi.menus.edgeStyleChange(
          menu,
          "",
          [mxConstants.STYLE_ENDARROW, "endFill"],
          [mxConstants.NONE, 0],
          "geIcon",
          null,
          false
        );
        item.setAttribute("title", mxResources.get("none"));
        item.firstChild.firstChild.innerHTML =
          '<font style="font-size:10px;">' +
          mxUtils.htmlEntities(mxResources.get("none")) +
          "</font>";

        if (ss.style.shape == "connector") {
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_CLASSIC, 1],
              "geIcon geSprite geSprite-endclassic",
              null,
              false
            )
            .setAttribute("title", mxResources.get("classic"));
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            [mxConstants.ARROW_CLASSIC_THIN, 1],
            "geIcon geSprite geSprite-endclassicthin",
            null,
            false
          );
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_OPEN, 0],
              "geIcon geSprite geSprite-endopen",
              null,
              false
            )
            .setAttribute("title", mxResources.get("openArrow"));
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            [mxConstants.ARROW_OPEN_THIN, 0],
            "geIcon geSprite geSprite-endopenthin",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["openAsync", 0],
            "geIcon geSprite geSprite-endopenasync",
            null,
            false
          );
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_BLOCK, 1],
              "geIcon geSprite geSprite-endblock",
              null,
              false
            )
            .setAttribute("title", mxResources.get("block"));
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            [mxConstants.ARROW_BLOCK_THIN, 1],
            "geIcon geSprite geSprite-endblockthin",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["async", 1],
            "geIcon geSprite geSprite-endasync",
            null,
            false
          );
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_OVAL, 1],
              "geIcon geSprite geSprite-endoval",
              null,
              false
            )
            .setAttribute("title", mxResources.get("oval"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_DIAMOND, 1],
              "geIcon geSprite geSprite-enddiamond",
              null,
              false
            )
            .setAttribute("title", mxResources.get("diamond"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_DIAMOND_THIN, 1],
              "geIcon geSprite geSprite-endthindiamond",
              null,
              false
            )
            .setAttribute("title", mxResources.get("diamondThin"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_CLASSIC, 0],
              "geIcon geSprite geSprite-endclassictrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("classic"));
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            [mxConstants.ARROW_CLASSIC_THIN, 0],
            "geIcon geSprite geSprite-endclassicthintrans",
            null,
            false
          );
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_BLOCK, 0],
              "geIcon geSprite geSprite-endblocktrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("block"));
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            [mxConstants.ARROW_BLOCK_THIN, 0],
            "geIcon geSprite geSprite-endblockthintrans",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["async", 0],
            "geIcon geSprite geSprite-endasynctrans",
            null,
            false
          );
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_OVAL, 0],
              "geIcon geSprite geSprite-endovaltrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("oval"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_DIAMOND, 0],
              "geIcon geSprite geSprite-enddiamondtrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("diamond"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_DIAMOND_THIN, 0],
              "geIcon geSprite geSprite-endthindiamondtrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("diamondThin"));

          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["dash", 0],
            "geIcon geSprite geSprite-enddash",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["cross", 0],
            "geIcon geSprite geSprite-endcross",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["circlePlus", 0],
            "geIcon geSprite geSprite-endcircleplus",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["circle", 1],
            "geIcon geSprite geSprite-endcircle",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["ERone", 0],
            "geIcon geSprite geSprite-enderone",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["ERmandOne", 0],
            "geIcon geSprite geSprite-enderonetoone",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["ERmany", 0],
            "geIcon geSprite geSprite-endermany",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["ERoneToMany", 0],
            "geIcon geSprite geSprite-enderonetomany",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["ERzeroToOne", 1],
            "geIcon geSprite geSprite-enderoneopt",
            null,
            false
          );
          this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_ENDARROW, "endFill"],
            ["ERzeroToMany", 1],
            "geIcon geSprite geSprite-endermanyopt",
            null,
            false
          );
        } else {
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW],
              [mxConstants.ARROW_BLOCK],
              "geIcon geSprite geSprite-endblocktrans",
              null,
              false
            )
            .setAttribute("title", mxResources.get("block"));
        }
      }
    })
  );

  this.addArrow(edgeShape, 8);
  this.addArrow(edgeStyle);
  this.addArrow(lineStart);
  this.addArrow(lineEnd);

  var symbol = this.addArrow(pattern, 9);
  symbol.className = "geIcon";
  symbol.style.width = "84px";

  var altSymbol = this.addArrow(altPattern, 9);
  altSymbol.className = "geIcon";
  altSymbol.style.width = "22px";

  var solid = document.createElement("div");
  solid.style.width = "85px";
  solid.style.height = "1px";
  solid.style.borderBottom = "1px solid black";
  solid.style.marginBottom = "9px";
  symbol.appendChild(solid);

  var altSolid = document.createElement("div");
  altSolid.style.width = "23px";
  altSolid.style.height = "1px";
  altSolid.style.borderBottom = "1px solid black";
  altSolid.style.marginBottom = "9px";
  altSymbol.appendChild(altSolid);

  pattern.style.height = "15px";
  altPattern.style.height = "15px";
  edgeShape.style.height = "15px";
  edgeStyle.style.height = "17px";
  lineStart.style.marginLeft = "3px";
  lineStart.style.height = "17px";
  lineEnd.style.marginLeft = "3px";
  lineEnd.style.height = "17px";

  container.appendChild(colorPanel);
  container.appendChild(altStylePanel);
  container.appendChild(stylePanel);

  var arrowPanel = stylePanel.cloneNode(false);
  arrowPanel.style.paddingBottom = "6px";
  arrowPanel.style.paddingTop = "4px";
  arrowPanel.style.fontWeight = "normal";

  var span = document.createElement("div");
  span.style.position = "absolute";
  span.style.marginLeft = "3px";
  span.style.marginBottom = "12px";
  span.style.marginTop = "2px";
  span.style.fontWeight = "normal";
  span.style.width = "76px";

  mxUtils.write(span, mxResources.get("lineend"));
  arrowPanel.appendChild(span);

  var endSpacingUpdate, endSizeUpdate;
  var endSpacing = this.addUnitInput(arrowPanel, "pt", 74, 33, function () {
    endSpacingUpdate.apply(this, arguments);
  });
  var endSize = this.addUnitInput(arrowPanel, "pt", 20, 33, function () {
    endSizeUpdate.apply(this, arguments);
  });

  mxUtils.br(arrowPanel);

  var spacer = document.createElement("div");
  spacer.style.height = "8px";
  arrowPanel.appendChild(spacer);

  span = span.cloneNode(false);
  mxUtils.write(span, mxResources.get("linestart"));
  arrowPanel.appendChild(span);

  var startSpacingUpdate, startSizeUpdate;
  var startSpacing = this.addUnitInput(arrowPanel, "pt", 74, 33, function () {
    startSpacingUpdate.apply(this, arguments);
  });
  var startSize = this.addUnitInput(arrowPanel, "pt", 20, 33, function () {
    startSizeUpdate.apply(this, arguments);
  });

  mxUtils.br(arrowPanel);
  this.addLabel(arrowPanel, mxResources.get("spacing"), 74, 50);
  this.addLabel(arrowPanel, mxResources.get("size"), 20, 50);
  mxUtils.br(arrowPanel);

  var perimeterPanel = colorPanel.cloneNode(false);
  perimeterPanel.style.fontWeight = "normal";
  perimeterPanel.style.position = "relative";
  perimeterPanel.style.paddingLeft = "16px";
  perimeterPanel.style.marginBottom = "2px";
  perimeterPanel.style.marginTop = "6px";
  perimeterPanel.style.borderWidth = "0px";
  perimeterPanel.style.paddingBottom = "18px";

  var span = document.createElement("div");
  span.style.position = "absolute";
  span.style.marginLeft = "3px";
  span.style.marginBottom = "12px";
  span.style.marginTop = "1px";
  span.style.fontWeight = "normal";
  span.style.width = "120px";
  mxUtils.write(span, mxResources.get("perimeter"));
  perimeterPanel.appendChild(span);

  var perimeterUpdate;
  var perimeterSpacing = this.addUnitInput(
    perimeterPanel,
    "pt",
    20,
    41,
    function () {
      perimeterUpdate.apply(this, arguments);
    }
  );

  if (ss.edges.length == graph.getSelectionCount()) {
    container.appendChild(stylePanel2);

    if (mxClient.IS_QUIRKS) {
      mxUtils.br(container);
      mxUtils.br(container);
    }

    container.appendChild(arrowPanel);
  } else if (ss.vertices.length == graph.getSelectionCount()) {
    if (mxClient.IS_QUIRKS) {
      mxUtils.br(container);
    }

    //container.appendChild(perimeterPanel);
  }

  var listener = mxUtils.bind(this, function (sender, evt, force) {
    ss = this.format.getSelectionState();
    var color = mxUtils.getValue(ss.style, strokeKey, null);

    if (force || document.activeElement != input) {
      var tmp = parseInt(
        mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1)
      );
      input.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != altInput) {
      var tmp = parseInt(
        mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1)
      );
      altInput.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    styleSelect.style.visibility =
      ss.style.shape == "connector" ? "" : "hidden";

    if (mxUtils.getValue(ss.style, mxConstants.STYLE_CURVED, null) == "1") {
      styleSelect.value = "curved";
    } else if (
      mxUtils.getValue(ss.style, mxConstants.STYLE_ROUNDED, null) == "1"
    ) {
      styleSelect.value = "rounded";
    }

    if (mxUtils.getValue(ss.style, mxConstants.STYLE_DASHED, null) == "1") {
      if (
        mxUtils.getValue(ss.style, mxConstants.STYLE_DASH_PATTERN, null) == null
      ) {
        solid.style.borderBottom = "1px dashed black";
      } else {
        solid.style.borderBottom = "1px dotted black";
      }
    } else {
      solid.style.borderBottom = "1px solid black";
    }

    altSolid.style.borderBottom = solid.style.borderBottom;

    // Updates toolbar icon for edge style
    var edgeStyleDiv = edgeStyle.getElementsByTagName("div")[0];
    var es = mxUtils.getValue(ss.style, mxConstants.STYLE_EDGE, null);

    if (
      mxUtils.getValue(ss.style, mxConstants.STYLE_NOEDGESTYLE, null) == "1"
    ) {
      es = null;
    }

    if (
      es == "orthogonalEdgeStyle" &&
      mxUtils.getValue(ss.style, mxConstants.STYLE_CURVED, null) == "1"
    ) {
      edgeStyleDiv.className = "geSprite geSprite-curved";
    } else if (es == "straight" || es == "none" || es == null) {
      edgeStyleDiv.className = "geSprite geSprite-straight";
    } else if (es == "entityRelationEdgeStyle") {
      edgeStyleDiv.className = "geSprite geSprite-entity";
    } else if (es == "elbowEdgeStyle") {
      edgeStyleDiv.className =
        "geSprite " +
        (mxUtils.getValue(ss.style, mxConstants.STYLE_ELBOW, null) == "vertical"
          ? "geSprite-verticalelbow"
          : "geSprite-horizontalelbow");
    } else if (es == "isometricEdgeStyle") {
      edgeStyleDiv.className =
        "geSprite " +
        (mxUtils.getValue(ss.style, mxConstants.STYLE_ELBOW, null) == "vertical"
          ? "geSprite-verticalisometric"
          : "geSprite-horizontalisometric");
    } else {
      edgeStyleDiv.className = "geSprite geSprite-orthogonal";
    }

    // Updates icon for edge shape
    var edgeShapeDiv = edgeShape.getElementsByTagName("div")[0];

    if (ss.style.shape == "link") {
      edgeShapeDiv.className = "geSprite geSprite-linkedge";
    } else if (ss.style.shape == "flexArrow") {
      edgeShapeDiv.className = "geSprite geSprite-arrow";
    } else if (ss.style.shape == "arrow") {
      edgeShapeDiv.className = "geSprite geSprite-simplearrow";
    } else {
      edgeShapeDiv.className = "geSprite geSprite-connection";
    }

    if (ss.edges.length == graph.getSelectionCount()) {
      altStylePanel.style.display = "";
      stylePanel.style.display = "none";
    } else {
      altStylePanel.style.display = "none";
      stylePanel.style.display = "";
    }

    function updateArrow(marker, fill, elt, prefix) {
      var markerDiv = elt.getElementsByTagName("div")[0];

      markerDiv.className = ui.getCssClassForMarker(
        prefix,
        ss.style.shape,
        marker,
        fill
      );

      if (markerDiv.className == "geSprite geSprite-noarrow") {
        markerDiv.innerHTML = mxUtils.htmlEntities(mxResources.get("none"));
        markerDiv.style.backgroundImage = "none";
        markerDiv.style.verticalAlign = "top";
        markerDiv.style.marginTop = "5px";
        markerDiv.style.fontSize = "10px";
        markerDiv.nextSibling.style.marginTop = "0px";
      }

      return markerDiv;
    }

    var sourceDiv = updateArrow(
      mxUtils.getValue(ss.style, mxConstants.STYLE_STARTARROW, null),
      mxUtils.getValue(ss.style, "startFill", "1"),
      lineStart,
      "start"
    );
    var targetDiv = updateArrow(
      mxUtils.getValue(ss.style, mxConstants.STYLE_ENDARROW, null),
      mxUtils.getValue(ss.style, "endFill", "1"),
      lineEnd,
      "end"
    );

    // Special cases for markers
    if (ss.style.shape == "arrow") {
      sourceDiv.className = "geSprite geSprite-noarrow";
      targetDiv.className = "geSprite geSprite-endblocktrans";
    } else if (ss.style.shape == "link") {
      sourceDiv.className = "geSprite geSprite-noarrow";
      targetDiv.className = "geSprite geSprite-noarrow";
    }

    mxUtils.setOpacity(edgeStyle, ss.style.shape == "arrow" ? 30 : 100);

    if (ss.style.shape != "connector" && ss.style.shape != "flexArrow") {
      mxUtils.setOpacity(lineStart, 30);
      mxUtils.setOpacity(lineEnd, 30);
    } else {
      mxUtils.setOpacity(lineStart, 100);
      mxUtils.setOpacity(lineEnd, 100);
    }

    if (force || document.activeElement != startSize) {
      var tmp = parseInt(
        mxUtils.getValue(
          ss.style,
          mxConstants.STYLE_STARTSIZE,
          mxConstants.DEFAULT_MARKERSIZE
        )
      );
      startSize.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != startSpacing) {
      var tmp = parseInt(
        mxUtils.getValue(
          ss.style,
          mxConstants.STYLE_SOURCE_PERIMETER_SPACING,
          0
        )
      );
      startSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != endSize) {
      var tmp = parseInt(
        mxUtils.getValue(
          ss.style,
          mxConstants.STYLE_ENDSIZE,
          mxConstants.DEFAULT_MARKERSIZE
        )
      );
      endSize.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != startSpacing) {
      var tmp = parseInt(
        mxUtils.getValue(
          ss.style,
          mxConstants.STYLE_TARGET_PERIMETER_SPACING,
          0
        )
      );
      endSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != perimeterSpacing) {
      var tmp = parseInt(
        mxUtils.getValue(ss.style, mxConstants.STYLE_PERIMETER_SPACING, 0)
      );
      perimeterSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }
  });

  startSizeUpdate = this.installInputHandler(
    startSize,
    mxConstants.STYLE_STARTSIZE,
    mxConstants.DEFAULT_MARKERSIZE,
    0,
    999,
    " pt"
  );
  startSpacingUpdate = this.installInputHandler(
    startSpacing,
    mxConstants.STYLE_SOURCE_PERIMETER_SPACING,
    0,
    -999,
    999,
    " pt"
  );
  endSizeUpdate = this.installInputHandler(
    endSize,
    mxConstants.STYLE_ENDSIZE,
    mxConstants.DEFAULT_MARKERSIZE,
    0,
    999,
    " pt"
  );
  endSpacingUpdate = this.installInputHandler(
    endSpacing,
    mxConstants.STYLE_TARGET_PERIMETER_SPACING,
    0,
    -999,
    999,
    " pt"
  );
  perimeterUpdate = this.installInputHandler(
    perimeterSpacing,
    mxConstants.STYLE_PERIMETER_SPACING,
    0,
    0,
    999,
    " pt"
  );

  this.addKeyHandler(input, listener);
  this.addKeyHandler(startSize, listener);
  this.addKeyHandler(startSpacing, listener);
  this.addKeyHandler(endSize, listener);
  this.addKeyHandler(endSpacing, listener);
  this.addKeyHandler(perimeterSpacing, listener);

  graph.getModel().addListener(mxEvent.CHANGE, listener);
  this.listeners.push({
    destroy: function () {
      graph.getModel().removeListener(listener);
      //console.log("asda");;
    },
  });
  listener();

  return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addShapes = function (div) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;
  var ss = this.format.getSelectionState();

  div.style.paddingTop = "0px";
  div.style.paddingBottom = "2px";
  div.style.borderBottom = "0px";
  // Adds shape option
  var shapeSelect = document.createElement("select");
  shapeSelect.style.position = "relative";

  shapeSelect.style.marginBottom = "8px";
  shapeSelect.style.width = "80px";
  shapeSelect.style.float = "right";
  shapeSelect.style.marginRight = "18px";

  var shapes = ["rectangle", "ellipse"];

  for (var i = 0; i < shapes.length; i++) {
    var shapeOption = document.createElement("option");
    shapeOption.setAttribute("value", shapes[i]);

    if (ss.style.shape == shapes[i]) shapeOption.setAttribute("selected", true);
    if (shapes[i] == "rectangle") {
      mxUtils.write(shapeOption, "Rectangle");
    } else {
      mxUtils.write(shapeOption, "Circle");
    }

    shapeSelect.appendChild(shapeOption);
  }

  mxEvent.addListener(shapeSelect, "change", function (evt) {
    graph.getModel().beginUpdate();
    try {
      var keys = ["shape"];

      if (shapeSelect.value == "rectangle") {
        values = [shapeSelect.value];
      } else if (shapeSelect.value == "ellipse") {
        values = [shapeSelect.value];
      }

      for (var i = 0; i < keys.length; i++) {
        graph.setCellStyles(keys[i], values[i], graph.getSelectionCells());
      }

      ui.fireEvent(
        new mxEventObject(
          "shapeChanged",
          "keys",
          keys,
          "values",
          values,
          "cells",
          graph.getSelectionCells()
        )
      );
    } finally {
      graph.getModel().endUpdate();
    }

    mxEvent.consume(evt);
  });

  // Stops events from bubbling to color option event handler
  mxEvent.addListener(shapeSelect, "click", function (evt) {
    mxEvent.consume(evt);
  });

  var span = document.createElement("span");
  span.style.fontWeight = "bold";
  span.style.marginRight = "5px";
  mxUtils.write(span, "Shape");
  div.appendChild(span);

  div.appendChild(shapeSelect);

  return div;
};

StyleFormatPanel.prototype.addGeometry = function (container) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var rect = this.format.getSelectionState();

  var div = this.createPanel();
  div.style.paddingBottom = "8px";
  div.style.height = "36px";
  div.style.marginTop = "42px";
  var span = document.createElement("div");
  span.style.position = "absolute";
  span.style.width = "50px";
  span.style.marginTop = "0px";
  span.style.fontWeight = "bold";
  mxUtils.write(span, mxResources.get("size") + " (feet)"); //danyal
  div.appendChild(span);

  var widthUpdate, heightUpdate, leftUpdate, topUpdate;
  var width = this.addUnitInput(div, "pt", 84, 44, function () {
    widthUpdate.apply(this, arguments);
  });
  var height = this.addUnitInput(div, "pt", 20, 44, function () {
    heightUpdate.apply(this, arguments);
  });

  var autosizeBtn = document.createElement("div");
  autosizeBtn.className = "geSprite geSprite-fit";
  autosizeBtn.setAttribute(
    "title",
    mxResources.get("autosize") +
      " (" +
      this.editorUi.actions.get("autosize").shortcut +
      ")"
  );
  autosizeBtn.style.position = "relative";
  autosizeBtn.style.display = "none";
  autosizeBtn.style.cursor = "pointer";
  autosizeBtn.style.marginTop = "-3px";
  autosizeBtn.style.border = "0px";
  autosizeBtn.style.left = "52px";
  mxUtils.setOpacity(autosizeBtn, 50);

  mxEvent.addListener(autosizeBtn, "mouseenter", function () {
    mxUtils.setOpacity(autosizeBtn, 100);
  });

  mxEvent.addListener(autosizeBtn, "mouseleave", function () {
    mxUtils.setOpacity(autosizeBtn, 50);
  });

  mxEvent.addListener(autosizeBtn, "click", function () {
    ui.actions.get("autosize").funct();
  });

  div.appendChild(autosizeBtn);

  //this.addLabel(div, mxResources.get('width'), 84);
  //this.addLabel(div, mxResources.get('height'), 20);
  var autosizeBtnWidth = document.createElement("div");

  autosizeBtnWidth.style.position = "absolute";
  autosizeBtnWidth.style.right = "100px";
  autosizeBtnWidth.style.marginTop = "23px";
  autosizeBtnWidth.style.textAlign = "center";
  autosizeBtnWidth.innerHTML = "Width";

  var autosizeBtnHeight = document.createElement("div");

  autosizeBtnHeight.style.position = "absolute";
  autosizeBtnHeight.style.right = "35px";
  autosizeBtnHeight.style.marginTop = "23px";
  autosizeBtnHeight.style.textAlign = "center";
  autosizeBtnHeight.innerHTML = "Height";

  div.appendChild(autosizeBtnWidth);
  div.appendChild(autosizeBtnHeight);

  mxUtils.br(div);

  var wrapper = document.createElement("div");
  wrapper.style.paddingTop = "8px";
  wrapper.style.paddingRight = "20px";
  wrapper.style.whiteSpace = "nowrap";
  wrapper.style.textAlign = "right";
  var opt = this.createCellOption(
    mxResources.get("constrainProportions"),
    mxConstants.STYLE_ASPECT,
    null,
    "fixed",
    "null"
  );
  opt.style.width = "100%";
  wrapper.appendChild(opt);
  //div.appendChild(wrapper);

  this.addKeyHandler(width, listener);
  this.addKeyHandler(height, listener);

  widthUpdate = this.addGeometryHandler(width, function (geo, value) {
    if (geo.width > 0) {
      geo.width = Math.max(1, value) * mxPixelPerFeet;
    }
  });
  heightUpdate = this.addGeometryHandler(height, function (geo, value) {
    if (geo.height > 0) {
      geo.height = Math.max(1, value) * mxPixelPerFeet;
    }
  });

  container.appendChild(div);

  var div2 = this.createPanel();
  div2.style.paddingBottom = "30px";

  var span = document.createElement("div");
  span.style.position = "absolute";
  span.style.width = "70px";
  span.style.marginTop = "0px";
  span.style.fontWeight = "bold";
  mxUtils.write(span, mxResources.get("position"));
  div2.appendChild(span);

  var left = this.addUnitInput(div2, "pt", 84, 44, function () {
    leftUpdate.apply(this, arguments);
  });
  var top = this.addUnitInput(div2, "pt", 20, 44, function () {
    topUpdate.apply(this, arguments);
  });

  mxUtils.br(div2);
  this.addLabel(div2, mxResources.get("left"), 84);
  this.addLabel(div2, mxResources.get("top"), 20);

  var listener = mxUtils.bind(this, function (sender, evt, force) {
    rect = this.format.getSelectionState();

    if (
      !rect.containsLabel &&
      rect.vertices.length == graph.getSelectionCount() &&
      rect.width != null &&
      rect.height != null
    ) {
      div.style.display = "";

      if (force || document.activeElement != width) {
        width.value =
          rect.width / mxPixelPerFeet + (rect.width == "" ? "" : " "); //danyal ft
      }

      if (force || document.activeElement != height) {
        height.value =
          rect.height / mxPixelPerFeet + (rect.height == "" ? "" : " "); //danyal ft
      }
    } else {
      div.style.display = "none";
    }

    if (
      rect.vertices.length == graph.getSelectionCount() &&
      rect.x != null &&
      rect.y != null
    ) {
      div2.style.display = "";

      if (force || document.activeElement != left) {
        left.value = rect.x / mxPixelPerFeet + (rect.x == "" ? "" : " ft");
      }

      if (force || document.activeElement != top) {
        top.value = rect.y / mxPixelPerFeet + (rect.y == "" ? "" : " ft");
      }
    } else {
      div2.style.display = "none";
    }
  });

  this.addKeyHandler(left, listener);
  this.addKeyHandler(top, listener);

  graph.getModel().addListener(mxEvent.CHANGE, listener);
  this.listeners.push({
    destroy: function () {
      graph.getModel().removeListener(listener);
      //console.log("asda");;
    },
  });
  listener();

  leftUpdate = this.addGeometryHandler(left, function (geo, value) {
    if (geo.relative) {
      geo.offset.x = value * mxPixelPerFeet;
    } else {
      geo.x = value * mxPixelPerFeet;
    }
  });
  topUpdate = this.addGeometryHandler(top, function (geo, value) {
    if (geo.relative) {
      geo.offset.y = value * mxPixelPerFeet;
    } else {
      geo.y = value * mxPixelPerFeet;
    }
  });

  //container.appendChild(div2);
};

/**
 *
 */
StyleFormatPanel.prototype.addGeometryHandler = function (input, fn) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var initialValue = null;

  function update(evt) {
    if (input.value != "") {
      var value = parseFloat(input.value);

      if (value != initialValue) {
        graph.getModel().beginUpdate();
        try {
          var cells = graph.getSelectionCells();

          for (var i = 0; i < cells.length; i++) {
            if (graph.getModel().isVertex(cells[i])) {
              var geo = graph.getCellGeometry(cells[i]);

              if (geo != null) {
                geo = geo.clone();
                fn(geo, value);

                graph.getModel().setGeometry(cells[i], geo);
              }
            }
          }
        } finally {
          graph.getModel().endUpdate();
        }

        initialValue = value;
        input.value = value + " pt";
      } else if (isNaN(value)) {
        input.value = initialValue + " pt";
      }
    }

    mxEvent.consume(evt);
  }

  mxEvent.addListener(input, "blur", update);
  mxEvent.addListener(input, "change", update);
  mxEvent.addListener(input, "focus", function () {
    initialValue = input.value;
  });

  return update;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addEffects = function (div) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;
  var ss = this.format.getSelectionState();

  div.style.paddingTop = "0px";
  div.style.paddingBottom = "2px";

  var table = document.createElement("table");

  if (mxClient.IS_QUIRKS) {
    table.style.fontSize = "1em";
  }

  table.style.width = "100%";
  //table.style.fontWeight = 'bold';
  table.style.paddingRight = "20px";
  table.style.fontSize = "12px";
  var tbody = document.createElement("tbody");
  var row = document.createElement("tr");
  row.style.padding = "0px";
  var left = document.createElement("td");
  left.style.padding = "0px";
  left.style.width = "50%";
  left.setAttribute("valign", "top");

  var right = left.cloneNode(true);
  right.style.paddingLeft = "8px";
  row.appendChild(left);
  row.appendChild(right);
  tbody.appendChild(row);
  table.appendChild(tbody);
  div.appendChild(table);

  var current = left;
  var count = 0;

  var addOption = mxUtils.bind(this, function (label, key, defaultValue) {
    var opt = this.createCellOption(label, key, defaultValue);
    opt.style.width = "100%";
    current.appendChild(opt);
    current = current == left ? right : left;
    count++;
  });

  var listener = mxUtils.bind(this, function (sender, evt, force) {
    ss = this.format.getSelectionState();

    left.innerHTML = "";
    right.innerHTML = "";
    current = left;

    if (ss.rounded) {
      addOption(mxResources.get("rounded"), mxConstants.STYLE_ROUNDED, 0);
    }

    if (ss.style.shape == "swimlane") {
      addOption(mxResources.get("divider"), "swimlaneLine", 1);
    }

    if (!ss.containsImage) {
      addOption(mxResources.get("shadow"), mxConstants.STYLE_SHADOW, 0);
    }

    if (ss.glass) {
      //addOption(mxResources.get('glass'), mxConstants.STYLE_GLASS, 0);
    }

    if (ss.comic) {
      //addOption(mxResources.get('comic'), 'comic', 0);
    }

    if (count == 0) {
      div.style.display = "none";
    }
  });

  graph.getModel().addListener(mxEvent.CHANGE, listener);
  this.listeners.push({
    destroy: function () {
      graph.getModel().removeListener(listener);
      //console.log("asda");;
    },
  });
  listener();

  return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addStyleOps = function (div) {
  /*
	div.style.paddingTop = '10px';
	div.style.paddingBottom = '10px';
	
	var btn = mxUtils.button(mxResources.get('setAsDefaultStyle'), mxUtils.bind(this, function(evt)
	{
		this.editorUi.actions.get('setAsDefaultStyle').funct();
	}));
	
	btn.setAttribute('title', mxResources.get('setAsDefaultStyle') + ' (' + this.editorUi.actions.get('setAsDefaultStyle').shortcut + ')');
	btn.style.width = '202px';
	div.appendChild(btn);
*/
  return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel = function (format, editorUi, container) {
  BaseFormatPanel.call(this, format, editorUi, container);
  this.init();
};

mxUtils.extend(DiagramFormatPanel, BaseFormatPanel);

/**
 * Specifies if the background image option should be shown. Default is true.
 */
DiagramFormatPanel.prototype.showBackgroundImageOption = true;

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.init = function () {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;

  //this.container.appendChild(this.multisitesub(this.createPanel()));
  this.container.appendChild(this.addView(this.createPanel()));

  if (graph.isEnabled()) {
    //this.container.appendChild(this.addOptions(this.createPanel()));
    //this.container.appendChild(this.addPaperSize(this.createPanel()));//edit
    //this.container.appendChild(this.addStyleOps(this.createPanel()));

    btn = mxUtils.button(
      "Save",
      mxUtils.bind(this, function (evt) {
        mxFloorPlanXml = mxUtils.getXml(ui.editor.getGraphXml());
        //console.log(mxFloorPlanXml);

        jQuery.ajax({
          url: baseCurrentSiteURl + "/wp-admin/admin-ajax.php",
          type: "post",
          data: {
            action: "getBoothList",
            post_id: mxPostID,
            boothTypes: ArrayOfObjects,
            floorBG: mxFloorBackground,
            floorXml: mxFloorPlanXml,
          },
          success: function (response) {
            swal({
              title: "Success",
              text: "Floor plan saved successfully.",
              type: "success",
              confirmButtonClass: "btn-success",
              confirmButtonText: "Ok",
            });
          },
          error: function (xhr, ajaxOptions, thrownError) {
            swal({
              title: "Error",
              text: "There was an error during the requested operation. Please try again.",
              type: "error",
              confirmButtonClass: "btn-danger",
              confirmButtonText: "Ok",
            });
          },
        });
      })
    );

    btn.setAttribute("title", "Save Floor Plan");

    btn.style.marginTop = "5px";
    btn.style.marginBottom = "2px";
    btn.className = "myCustomeButton";

    //this.container.appendChild(btn);
  }
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addView = function (div) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;

  div.style.padding = "0px";
  var label = document.createElement("div");

  label.style.borderBottom = "1px solid #c0c0c0";
  label.style.borderWidth = "1px";
  label.style.textAlign = "center";
  label.style.fontWeight = "bold";
  label.style.overflow = "hidden";
  label.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
  label.style.paddingTop = "8px";
  label.style.height = mxClient.IS_QUIRKS ? "34px" : "25px";
  label.style.width = "100%";
  label.className = "customebgcolor";
  label.innerHTML =
    'Static Layer Settings <i class="far fa-question-circle" title="helpText"></i>'; //edit

  div.appendChild(label);

  if (graph.isEnabled()) {
    // Background
    //var bg = this.createColorOption(mxResources.get('background'), function()
    var bg = this.createColorOption(
      "",
      function () //edit
      {
        return graph.background;
      },
      function (color) {
        var change = new ChangePageSetup(ui, color);
        change.ignoreImage = true;

        graph.model.execute(change);
      },
      "#ffffff",
      {
        install: function (apply) {
          this.listener = function () {
            apply(graph.background);
          };

          ui.addListener("backgroundColorChanged", this.listener);
        },
        destroy: function () {
          ui.removeListener(this.listener);
          //console.log("asda");;
        },
      }
    );

    if (this.showBackgroundImageOption) {
      var btn = mxUtils.button(mxResources.get("image"), function (evt) {
        //ui.showBackgroundImageDialog();
        //mxEvent.consume(evt);

        swal({
          title: "Are you sure?",
          text: "Performing this action will replace the current static layer on the floor plan and cannot be undone. It is highly recommended you first download the static layer and save the current version. If you need to make a change on the static layer of the floor plan and are unsure, please contact support@expo-genie.com for assistance.",
          type: "info",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          confirmButtonClass: "btn-info",
          closeOnConfirm: false,
        }).then(function (isConfirm) {
          if (isConfirm) {
            window.openFile = new OpenFile(
              mxUtils.bind(this, function () {
                ui.hideDialog();
              })
            );

            window.openFile.setConsumer(
              mxUtils.bind(this, function (xml, filename) {
                ui.newBackgroundImage = filename;
                ui.showBackgroundImageDialog();
              })
            );

            // Removes openFile if dialog is closed
            ui.showDialog(
              new OpenDialog(this).container,
              320,
              120,
              true,
              true,
              function () {
                window.openFile = null;
              }
            );
          }
        });
      });

      btn.style.marginLeft = "9%"; //edit
      btn.style.width = "68%"; //edit
      btn.style.marginTop = "10px"; //edit
      btn.className = "myCustomeButton";
      bg.style.width = "194px";
      bg.style.height = "30px";

      btn.innerHTML = "Upload Static Layer"; //edit new add
      btn.setAttribute("id", "myCustomeButtonid"); //edit new add
      btn.setAttribute("title", "png format only"); //edit new add

      //bg.appendChild(btn);
    }

    var downloadbutton2 = document.createElement("div");
    downloadbutton2.style.marginTop = "10px"; //edit 20px
    downloadbutton2.style.marginLeft = "10%";
    downloadbutton2.style.marginBottom = "10px";
    downloadbutton2.id = "mainDivdownloadButton";

    downloadbutton2.appendChild(btn);
    div.appendChild(downloadbutton2);
  }

  var currentbgImage = mxFloorBackground;

  var downloadbutton = document.createElement("div");
  downloadbutton.style.marginTop = "10px"; //edit 20px
  downloadbutton.style.marginLeft = "18%";
  downloadbutton.style.marginBottom = "10px";
  downloadbutton.id = "mainDivdownloadButton";

  var downloadLink = document.createElement("a");

  // downloadLink.style.padding = '10px';

  downloadLink.className = "myCustomeButton";
  downloadLink.style.padding = "5px 33px 5px 33px";
  downloadLink.innerHTML = "Download Static Layer"; //edit
  downloadbutton.style.display = "none";

  if (currentbgImage != "") {
    downloadLink.setAttribute("href", currentbgImage);
    downloadbutton.style.display = "block";
  }
  downloadLink.setAttribute("download", "");
  downloadLink.id = "currentImage";
  downloadbutton.appendChild(downloadLink);

  div.appendChild(downloadbutton);

  return div;
};

DiagramFormatPanel.prototype.multisitesub = function (div) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;

  var addfloorplantitle = document.createElement("p");
  addfloorplantitle.style.marginTop = "5%";

  addfloorplantitle.innerHTML = "<strong>Floor Plan Title</strong>";

  var Maindiv = document.createElement("p");

  var inputtypefloorplantitle = document.createElement("input");
  inputtypefloorplantitle.type = "text";
  inputtypefloorplantitle.id = "loadedfloorplanid";
  inputtypefloorplantitle.style.width = "80%";

  Maindiv.appendChild(inputtypefloorplantitle);

  var errormsg = document.createElement("p");
  errormsg.innerHTML =
    "<strong style='color:red;text-align:center;'>Floor Plan Title is requried.</strong>";
  errormsg.id = "floorplantitlerequreidmsg";
  errormsg.style.display = "none";

  var selectfloorplandiv = document.createElement("p");

  var selectfloorplantitle = document.createElement("p");
  selectfloorplantitle.innerHTML = "<strong>Select Floor Plan</strong>";

  var selectfloorplanfield = document.createElement("select");
  selectfloorplanfield.id = "floorplanselectionID";
  var listfloorplanoption = document.createElement("option");
  listfloorplanoption.value = "new";
  listfloorplanoption.text = "Add New Floor Plan";
  selectfloorplanfield.appendChild(listfloorplanoption);

  jQuery.each(arrayfloorplanlist, function (index1, value) {
    var listfloorplanoption = document.createElement("option");
    listfloorplanoption.value = value.ID;
    listfloorplanoption.text = value.title;
    if (mxPostID == value.ID) {
      inputtypefloorplantitle.value = value.title;
      currentslectedboothtitle = value.title;
      inputtypefloorplantitle;
      listfloorplanoption.setAttribute("selected", "selected");
    }

    selectfloorplanfield.appendChild(listfloorplanoption);
  });

  mxEvent.addListener(selectfloorplanfield, "change", function () {
    var currentfloorplanID = jQuery(
      "#floorplanselectionID option:selected"
    ).val();
    var loadedfloorplantitle = jQuery("#loadedfloorplanid").val();
    // if(loadedfloorplantitle !=""){
    // jQuery("#floorplantitlerequreidmsg").hide();
    if (currentfloorplanID == "new") {
      var data = new FormData();
      data.append("loadedfloorplantitle", loadedfloorplantitle);
      jQuery.ajax({
        url:
          baseCurrentSiteURl +
          "/wp-content/plugins/floorplan/floorplan.php?floorplanRequest=createnewfloorplan",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: "POST",
        success: function (data) {
          window.location.replace(
            baseCurrentSiteURl + "/floor-plan-editor/?floorplanID=" + data
          );
        },
      });
    } else {
      window.location.replace(
        baseCurrentSiteURl +
          "/floor-plan-editor/?floorplanID=" +
          currentfloorplanID
      );
    }

    // }else{

    //  jQuery("#floorplantitlerequreidmsg").show();

    // }
  });

  selectfloorplanfield.style.width = "80%";
  selectfloorplandiv.appendChild(selectfloorplanfield);

  div.appendChild(addfloorplantitle);
  div.appendChild(Maindiv);
  div.appendChild(errormsg);

  div.appendChild(selectfloorplantitle);
  div.appendChild(selectfloorplandiv);

  return div;
};

function updateallboothstags() {
  jQuery("body").css({ cursor: "wait" });
  var data = new FormData();
  BoothTagsObjects = [];
  data.append("post_id", mxPostID);
  jQuery(".lengendsrows").each(function (index) {
    var currentrowID = jQuery(this).attr("id");
    var currentrowName = jQuery("#boothtypename_" + currentrowID).val();
    var currentrowprice = jQuery("#boothtypeprice_" + currentrowID).val();
    currentrowName = currentrowName.replace(/([,.!;"'])+/g, "");
    var currentrowLengendStatus = jQuery().attr("id");

    var saveddataarray = {};
    saveddataarray.ID = currentrowID;
    saveddataarray.name = currentrowName;

    //saveddataarray.price =currentrowprice;
    BoothTagsObjects.push(saveddataarray);
    //console.log(BoothTagsObjects);
  });

  jQuery("#boothtagstypedropdown").empty();

  var option = document.createElement("option");
  option.value = "";
  option.text = "None";
  if (boothTagsList == "") {
    option.setAttribute("selected", "selected");
  }

  jQuery("#boothtagstypedropdown").append(option);
  if (boothTagsList != "" && boothTagsList != undefined) {
    var boothTagsListarray = boothTagsList.split(",");
  } else {
    var boothTagsListarray = [];
  }

  jQuery.each(BoothTagsObjects, function (index1, value) {
    var option = document.createElement("option");

    if (jQuery.inArray(value.ID, boothTagsListarray) != -1) {
      option.setAttribute("selected", "selected");
    }

    option.value = value.ID;
    option.text = value.name;
    jQuery("#boothtagstypedropdown").append(option);
  });

  jQuery("#boothtagstypedropdown").select2();
  data.append("boothtagsArray", JSON.stringify(BoothTagsObjects));
  jQuery.ajax({
    url:
      baseCurrentSiteURl +
      "/wp-content/plugins/floorplan/floorplan.php?floorplanRequest=savedallboothtags",
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    type: "POST",
    success: function (data) {
      jQuery("body").css({ cursor: "default" });

      if (data.trim() == "update") {
        jQuery(".successmessage").append(
          "<h6 style='background: #95e87a;color: #fff;text-align: center;'>Booth tags have been updated successfully.</h6>"
        );
      }

      setTimeout(function () {
        jQuery(".successmessage").empty();
      }, 3000); // <-- time in milliseconds
    },
    error: function (xhr, ajaxOptions, thrownError) {
      swal({
        title: "Error",
        text: "There was an error during the requested operation. Please try again.",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
      });
    },
  });
}
function cliker() {
  var boothlevelname = "";
  boothlevelname += '<option value="none" selected>None</option>';
  // console.log("In Function");
  var overRideChecks = jQuery("#overRideCheckBox:checked").val();
  // console.log(overRideChecks);
  if (overRideChecks == undefined) {
    jQuery("#boothlevelvalue").hide();
    jQuery("#userLevelDiscriptionLabel").hide();
  } else if (overRideChecks == 0) {
    // console.log("Checked");
    // var Select =
    //   "<div class='col-sm-2' style='text-align:right;'><label>Assign/Re-Assign User Level <i class='far fa-question-circle' ></i></label></div><div class='col-sm-3'><select id='boothlevelvalue' class='form-control'><option value='none' selected>None</option><option value='exbitore' >Exibitors</option></select></div>";
    // jQuery("#userLevelDiscriptionLabel").append(Select);
    // console.log(Select);
    jQuery("#boothlevelvalue").show();
    jQuery("#userLevelDiscriptionLabel").show();
  }
}

function updatealllengends() {
  jQuery("body").css({ cursor: "wait" });
  var data = new FormData();
  LegendsOfObjects = [];
  data.append("post_id", mxPostID);
  jQuery(".lengendsrows").each(function (index) {
    var currentrowID = jQuery(this).attr("id");
    var currentrowName = jQuery("#boothtypename_" + currentrowID).val();
    var currentrowprice = jQuery("#boothtypeprice_" + currentrowID).val();
    currentrowName = currentrowName.replace(/([,.!;"'])+/g, "");
    var currentrowLengendStatus = jQuery().attr("id");

    if (jQuery("#lengendcolorstatus_" + currentrowID).prop("checked")) {
      var currentrowLengendStatus = true;
      var currentrowColorCode = jQuery("#boothtypecolor_" + currentrowID).val();
      var currentrowColorCodeOcc = jQuery(
        "#boothtypecolorOcc_" + currentrowID
      ).val();
    } else {
      var currentrowLengendStatus = false;
      var currentrowColorCode = "none";
      var currentrowColorCodeOcc = "none";
    }

    var saveddataarray = {};
    saveddataarray.ID = currentrowID;
    saveddataarray.colorstatus = currentrowLengendStatus;
    saveddataarray.name = currentrowName;
    saveddataarray.colorcode = currentrowColorCode;
    saveddataarray.colorcodeOcc = currentrowColorCodeOcc;

    //saveddataarray.price =currentrowprice;
    LegendsOfObjects.push(saveddataarray);
    // console.log(LegendsOfObjects);
  });

  jQuery("#legendlabeltypedropdown").empty();

  var option = document.createElement("option");
  option.value = "";
  option.text = "None";
  if (legendlabelID == "") {
    option.setAttribute("selected", "selected");
  }

  jQuery("#legendlabeltypedropdown").append(option);
  jQuery.each(LegendsOfObjects, function (index1, value) {
    var option = document.createElement("option");

    if (legendlabelID == value.ID) {
      option.setAttribute("selected", "selected");
    }
    option.style.backgroundColor = value.colorcode;
    option.value = value.ID;
    option.text = value.name;
    jQuery("#legendlabeltypedropdown").append(option);
  });

  // console.log(LegendsOfObjects);
  data.append("legendstypesArray", JSON.stringify(LegendsOfObjects));
  jQuery.ajax({
    url:
      baseCurrentSiteURl +
      "/wp-content/plugins/floorplan/floorplan.php?floorplanRequest=savedalllegendstypes",
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    type: "POST",
    success: function (data) {
      jQuery("body").css({ cursor: "default" });

      if (data.trim() == "update") {
        jQuery(".successmessage").append(
          "<h6 style='background: #95e87a;color: #fff;text-align: center;'>Legend labels have been updated successfully.</h6>"
        );
      }

      setTimeout(function () {
        jQuery(".successmessage").empty();
      }, 3000); // <-- time in milliseconds
    },
    error: function (xhr, ajaxOptions, thrownError) {
      swal({
        title: "Error",
        text: "There was an error during the requested operation. Please try again.",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
      });
    },
  });
}

function updateallpricetegs() {
  jQuery("body").css({ cursor: "wait" });
  var data = new FormData();
  PricetegsObjects = [];
  data.append("post_id", mxPostID);
  var rowscount = document.getElementById("listofallpricetegs").rows.length;
  var rowcounter = 0;
  jQuery(".listofallpricetegs").each(function (index) {
    var currentrowID = jQuery(this).attr("id");
    var currentrowName = jQuery("#pricetegname_" + currentrowID).val();
    var currentrowprice = jQuery("#pricetegprice_" + currentrowID).val();
    var priceteglevel = jQuery(
      "#priceteglevel_" + currentrowID + " option:selected"
    ).val();
    // console.log(priceteglevel);
    currentrowName = currentrowName.replace(/([,.!;"'])+/g, "");

    var saveddataarray = {};
    saveddataarray.ID = currentrowID;
    saveddataarray.name = currentrowName;
    saveddataarray.price = currentrowprice;
    saveddataarray.level = priceteglevel;

    PricetegsObjects.push(saveddataarray);
  });

  jQuery("#pricetegdropdown").empty();

  var option = document.createElement("option");
  option.value = "";
  option.text = "None";
  if (pricetegID == "") {
    option.setAttribute("selected", "selected");
  }

  jQuery("#pricetegdropdown").append(option);
  jQuery.each(PricetegsObjects, function (index1, value) {
    var option = document.createElement("option");

    if (pricetegID == value.ID) {
      option.setAttribute("selected", "selected");
    }
    option.style.backgroundColor = value.colorcode;
    option.value = value.ID;
    option.text = value.name;
    jQuery("#pricetegdropdown").append(option);
  });

  // console.log(PricetegsObjects);
  data.append("pricetegsArray", JSON.stringify(PricetegsObjects));
  jQuery.ajax({
    url:
      baseCurrentSiteURl +
      "/wp-content/plugins/floorplan/floorplan.php?floorplanRequest=savedallpricetegs",
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    type: "POST",
    success: function (data) {
      jQuery("body").css({ cursor: "default" });

      if (data.trim() == "update") {
        jQuery(".successmessage").append(
          "<h6 style='background: #95e87a;color: #fff;text-align: center;'>Price tags have been updated successfully.</h6>"
        );
      }

      setTimeout(function () {
        jQuery(".successmessage").empty();
      }, 3000); // <-- time in milliseconds
    },
    error: function (xhr, ajaxOptions, thrownError) {
      swal({
        title: "Error",
        text: "There was an error during the requested operation. Please try again.",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
      });
    },
  });
}

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function insertnewrowintoboothtagstypes() {
  if (jQuery("#addnewlegendname").val() != "") {
    jQuery("body").css({ cursor: "wait" });
    var saveddataarray = {};
    var insertRowhtml = "";
    saveddataarray.ID = makeid();

    var IDCODE = "'" + saveddataarray.ID + "'";
    var legendlabel = jQuery("#addnewlegendname").val();

    saveddataarray.name = legendlabel.replace(/([,.!;"'])+/g, "");

    insertRowhtml +=
      '<tr class="lengendsrows" id="' +
      saveddataarray.ID +
      '" ><td style="width:5%;text-align: center;"><i title="Move" style="margin-top: 8px;cursor: move;" class="hi-icon fusion-li-icon fas fa-arrows-alt-v fa-lg"></i></td><td style="width: 25%;"><input type="text" title="Label" value="' +
      saveddataarray.name +
      '" id="boothtypename_' +
      saveddataarray.ID +
      '" /></td>';

    insertRowhtml +=
      '<td style="width: 10%;text-align: center;"><a style="cursor: pointer;"  title="Remove" onclick="removethisrow(' +
      IDCODE +
      ')" ><i class="hi-icon fusion-li-icon fa fa-times-circle fa-lg"></i></a></td></tr>';

    // LegendsOfObjects.push(saveddataarray);

    jQuery("#showheaderlegend").show();
    jQuery("#legendsbuttons").show();
    jQuery("#addnewlegendname").val("");

    jQuery("#listofalllegends").append(insertRowhtml);
    jQuery("body").css({ cursor: "default" });
  }
}
function insertnewrowintolegendtypes() {
  if (jQuery("#addnewlegendname").val() != "") {
    jQuery("body").css({ cursor: "wait" });
    var saveddataarray = {};
    var insertRowhtml = "";
    saveddataarray.ID = makeid();

    var IDCODE = "'" + saveddataarray.ID + "'";
    var legendlabel = jQuery("#addnewlegendname").val();

    saveddataarray.name = legendlabel.replace(/([,.!;"'])+/g, "");

    insertRowhtml +=
      '<tr class="lengendsrows" id="' +
      saveddataarray.ID +
      '" ><td style="width:5%;text-align: center;"><i title="Move" style="margin-top: 8px;cursor: move;" class="hi-icon fusion-li-icon fas fa-arrows-alt-v fa-lg"></i></td><td style="width: 25%;"><input type="text" title="Label" value="' +
      saveddataarray.name +
      '" id="boothtypename_' +
      saveddataarray.ID +
      '" /></td>';

    if (jQuery("#addnewlegendstatus").prop("checked")) {
      saveddataarray.colorstatus = true;
      saveddataarray.colorcode = jQuery("#addnewlegendcolorcode").val();
      saveddataarray.colorcodeOcc = jQuery("#addnewlegendcolorcodeOcc").val();
      insertRowhtml +=
        '<td style="width: 10%;text-align: center;"><label  title="Enabling this will override both the Occupied AND the Unoccupied color of selected booths. Leave this disabled if you only want the Legend Label to be a text label only." class="switch"><input type="checkbox" onclick="hidecolorselection(' +
        IDCODE +
        ')" id="lengendcolorstatus_' +
        saveddataarray.ID +
        '" checked><span class="slider round"></span></label></td><td style="width: 10%;text-align: center;"><input title="Select Unoccupied Color" type="color"  value="' +
        saveddataarray.colorcode +
        '" id="boothtypecolor_' +
        saveddataarray.ID +
        '" /></td><td style="width: 10%;text-align: center;"><input title="Select Occupied Color" type="color"  value="' +
        saveddataarray.colorcodeOcc +
        '" id="boothtypecolorOcc_' +
        saveddataarray.ID +
        '" /></td>';
    } else {
      saveddataarray.colorstatus = false;
      saveddataarray.colorcode = "none";
      saveddataarray.colorcodeOcc = "none";
      insertRowhtml +=
        '<td style="width: 10%;text-align: center;"><label  title="Enabling this will override both the Occupied AND the Unoccupied color of selected booths. Leave this disabled if you only want the Legend Label to be a text label only." class="switch"><input type="checkbox" onclick="hidecolorselection(' +
        IDCODE +
        ')"  id="lengendcolorstatus_' +
        saveddataarray.ID +
        '" ><span class="slider round"></span></label></td><td style="width: 10%;text-align: center;"><input title="Select Unoccupied Color" type="color" style="display:none;" value="' +
        saveddataarray.colorcode +
        '" id="boothtypecolor_' +
        saveddataarray.ID +
        '" /></td><td style="width: 10%;text-align: center;"><input title="Select Occupied Color" type="color" style="display:none;" value="' +
        saveddataarray.colorcodeOcc +
        '" id="boothtypecolorOcc_' +
        saveddataarray.ID +
        '" /></td>';
    }
    insertRowhtml +=
      '<td style="width: 10%;text-align: center;"><a style="cursor: pointer;"  title="Remove" onclick="removethisrow(' +
      IDCODE +
      ')" ><i class="hi-icon fusion-li-icon fa fa-times-circle fa-lg"></i></a></td></tr>';

    // LegendsOfObjects.push(saveddataarray);

    jQuery("#showheaderlegend").show();
    jQuery("#legendsbuttons").show();
    jQuery("#addnewlegendcolorcode").val("#000000");
    jQuery("#addnewlegendcolorcodeOcc").val("#000000");
    jQuery("#addnewlegendname").val("");

    jQuery("#addnewlegendstatus").removeAttr("checked");
    jQuery("#listofalllegends").append(insertRowhtml);
    jQuery("body").css({ cursor: "default" });
  }
}

function insertnewrowintopricetegs() {
  if (jQuery("#addnewpricetegname").val() != "") {
    jQuery("body").css({ cursor: "wait" });
    var saveddataarray = {};
    var insertRowhtml = "";
    saveddataarray.ID = makeid();

    var IDCODE = "'" + saveddataarray.ID + "'";
    var legendlabel = jQuery("#addnewpricetegname").val();
    var price = jQuery("#pricetegpriceNewTeg").val();
    var selectedlevel = jQuery(
      "#pricetegleveldropdownvalue option:selected"
    ).val();
    var roleshtml = "";
    jQuery.each(arrayoflevelsObjects, function (rolekey, rolevalue) {
      if (selectedlevel == rolevalue.key) {
        roleshtml +=
          '<option value="' +
          rolevalue.key +
          '" selected>' +
          rolevalue.name +
          "</option>";
      } else {
        roleshtml +=
          '<option value="' +
          rolevalue.key +
          '" >' +
          rolevalue.name +
          "</option>";
      }
    });

    saveddataarray.name = legendlabel.replace(/([,.!;"'])+/g, "");
    saveddataarray.price = price;
    insertRowhtml +=
      '<tr class="listofallpricetegs" id="' +
      saveddataarray.ID +
      '" ><td style="width:65px;"><i title="Move" style="margin-top: 8px;cursor: move;" class="hi-icon fusion-li-icon fas fa-arrows-alt-v fa-lg"></i></td><td style="width: 30%;"><input type="text" title="Title" value="' +
      saveddataarray.name +
      '" id="pricetegname_' +
      saveddataarray.ID +
      '" /></td>';

    insertRowhtml +=
      '<td style="width: 30%;text-align: center;"><div class="input-group"><span class="input-group-addon">' +
      currencysymbole +
      '</span><input style="width: 80%;" type="number" id="pricetegprice_' +
      saveddataarray.ID +
      '" value="' +
      saveddataarray.price +
      '"    class="form-control currency"  /></div></td>';
    insertRowhtml +=
      '<td style="width: 10%;text-align: center;"><select id="priceteglevel_' +
      saveddataarray.ID +
      '" >' +
      roleshtml +
      "</select></td>";

    insertRowhtml +=
      '<td style="width: 10%;text-align: center;"><a style="cursor: pointer;"  title="Remove" onclick="removethispriceteg(' +
      IDCODE +
      ')" ><i class="hi-icon fusion-li-icon fa fa-times-circle fa-lg"></i></a></td></tr>';

    // PricetegsObjects.push(saveddataarray);

    jQuery("#buttonsdiv").show();
    jQuery("#showheader").show();

    jQuery("#addnewpricetegname").val("");
    jQuery("#pricetegpriceNewTeg").val("");
    jQuery("#listofallpricetegs").append(insertRowhtml);
    jQuery("body").css({ cursor: "default" });
  }
}

function hidecolorselection(id) {
  if (id == "add") {
    if (jQuery("#addnewlegendstatus").prop("checked")) {
      jQuery("#addnewlegendcolorcode").show();
      jQuery("#addnewlegendcolorcodeOcc").show();
    } else {
      jQuery("#addnewlegendcolorcode").hide();
      jQuery("#addnewlegendcolorcodeOcc").hide();
    }
  } else {
    if (jQuery("#lengendcolorstatus_" + id).prop("checked")) {
      jQuery("#boothtypecolor_" + id).show();
      jQuery("#boothtypecolorOcc_" + id).show();
    } else {
      jQuery("#boothtypecolor_" + id).hide();
      jQuery("#boothtypecolorOcc_" + id).hide();
    }
  }
}
function removethisrow(id) {
  jQuery("#" + id).remove();
}
function removethispriceteg(id) {
  jQuery("#" + id).remove();
}

function getallpricetegs() {
  var data = new FormData();
  var addtext = "'add'";
  data.append("post_id", mxPostID);

  var html = "<p class='successmessage'></p>";
  var roleshtml = "";
  var newroleshtml = "";
  var classstatusshow = "";
  jQuery.each(arrayoflevelsObjects, function (rolekey, rolevalue) {
    if (rolevalue.key == "standard_role") {
      newroleshtml +=
        '<option value="' +
        rolevalue.key +
        '" selected>' +
        rolevalue.name +
        "</option>";
    } else {
      newroleshtml +=
        '<option value="' +
        rolevalue.key +
        '" >' +
        rolevalue.name +
        "</option>";
    }
  });

  html +=
    '<div style="max-height: 350px;overflow: auto;"><table class="table mycustometable" id="listofallpricetegs">';
  if (PricetegsObjects.length > 0) {
    classstatusshow = "";
  } else {
    classstatusshow = "display:none;";
  }
  html +=
    '<tr id="showheader" style="' +
    classstatusshow +
    '"><th>Position</th><th>Default Name</th><th>Default Price</th><th>Default Level</th><th>Delete</th></tr>';

  jQuery.each(PricetegsObjects, function (index1, value) {
    var IDCODE = "'" + value.ID + "'";

    jQuery.each(arrayoflevelsObjects, function (rolekey, rolevalue) {
      if (value.level == rolevalue.key) {
        roleshtml +=
          '<option value="' +
          rolevalue.key +
          '" selected>' +
          rolevalue.name +
          "</option>";
      } else {
        roleshtml +=
          '<option value="' +
          rolevalue.key +
          '" >' +
          rolevalue.name +
          "</option>";
      }
    });

    html +=
      '<tr class="listofallpricetegs" id="' +
      value.ID +
      '" ><td style="width:10%;"><i title="Move" style="margin-top: 8px;cursor: move;" class="hi-icon fusion-li-icon fas fa-arrows-alt-v fa-lg"></i></td><td    style="width: 30%;"><input title="Title" type="text" title="Label" value="' +
      value.name +
      '" id="pricetegname_' +
      value.ID +
      '" /></td>';

    html +=
      '<td style="width: 30%;text-align: center;"><div class="input-group"><span class="input-group-addon">' +
      currencysymbole +
      '</span><input style="width: 80%;" type="number" id="pricetegprice_' +
      value.ID +
      '" value="' +
      value.price +
      '"    class="form-control currency"  /></div></td>';
    html +=
      '<td style="width: 10%;text-align: center;"><select id="priceteglevel_' +
      value.ID +
      '" >' +
      roleshtml +
      "</select></td>";
    html +=
      '<td style="width: 10%;text-align: center;"><a style="cursor: pointer;"  title="Remove" onclick="removethispriceteg(' +
      IDCODE +
      ')" ><i class="hi-icon fusion-li-icon fa fa-times-circle fa-lg"></i></a></td></tr>';
  });

  html += "</table></div>";
  html +=
    '<p id="buttonsdiv" style="' +
    classstatusshow +
    'text-align:center;margin: 10px 0px 0px 0px;"><button class="btn btn-large btn-info" onclick="updateallpricetegs()">Save</button><button style="margin-left: 11px;background-color: #b0b0b0; border-color: #b0b0b0;" class="btn btn-large btn-info" onclick="closepricetegsdilog()">Cancel</button></p>';

  html += "<hr>";

  html += '<table class="table mycustometable">';
  html +=
    "<tr><th></th><th>Default Name</th><th>Default Price</th><th>Default Level</th><th></th></tr>";
  html +=
    '<tr><td style="width:10%;"><b>Add New</b></td><td style="width: 30%;"><input title="Default Title" type="text" id="addnewpricetegname" ></td>';
  html +=
    '<td style="width: 30%;text-align: center;"><div class="input-group"><span class="input-group-addon">' +
    currencysymbole +
    '</span><input type="number" style="width: 80%;" id="pricetegpriceNewTeg" value="0"    class="form-control currency"  /></div></td><td style="width: 10%;text-align: center;"><select id="pricetegleveldropdownvalue" >' +
    newroleshtml +
    '</select></td><td style="width: 10%;text-align: center;"><button class="btn btn-large btn-info" onclick="insertnewrowintopricetegs()">Add</button></td></tr>';

  html += "</table>";

  //  }

  pricetegsdilog = jQuery.confirm({
    title: '<b style="text-align:center;">Price Tags</b>',
    content: html,
    html: true,

    closeIcon: true,
    columnClass: "jconfirm-box-container-special-tagsbooth",
    cancelButton: false, // hides the cancel button.
    confirmButton: false, // hides the confirm button.
  });
  jQuery(".mycustometable tbody").sortable();
}

function closelegendsdilog() {
  legendsdilog.close();
}
function closepricetegsdilog() {
  pricetegsdilog.close();
}

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addOptions = function (div) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;

  div.appendChild(this.createTitle(mxResources.get("options")));

  if (graph.isEnabled()) {
    // Connection arrows
    div.appendChild(
      this.createOption(
        mxResources.get("connectionArrows"),
        function () {
          return graph.connectionArrowsEnabled;
        },
        function (checked) {
          ui.actions.get("connectionArrows").funct();
        },
        {
          install: function (apply) {
            this.listener = function () {
              apply(graph.connectionArrowsEnabled);
            };

            ui.addListener("connectionArrowsChanged", this.listener);
          },
          destroy: function () {
            ui.removeListener(this.listener);
            //console.log("asda");;
          },
        }
      )
    );

    // Connection points
    div.appendChild(
      this.createOption(
        mxResources.get("connectionPoints"),
        function () {
          return graph.connectionHandler.isEnabled();
        },
        function (checked) {
          ui.actions.get("connectionPoints").funct();
        },
        {
          install: function (apply) {
            this.listener = function () {
              apply(graph.connectionHandler.isEnabled());
            };

            ui.addListener("connectionPointsChanged", this.listener);
          },
          destroy: function () {
            ui.removeListener(this.listener);
            //console.log("asda");;
          },
        }
      )
    );
  }

  return div;
};

/**
 *
 */
DiagramFormatPanel.prototype.addGridOption = function (container) {
  var ui = this.editorUi;
  var graph = ui.editor.graph;

  var input = document.createElement("input");
  input.style.position = "absolute";
  input.style.textAlign = "right";
  input.style.width = "38px";
  input.value = graph.getGridSize() + " pt";

  var stepper = this.createStepper(input, update);
  input.style.display = graph.isGridEnabled() ? "" : "none";
  stepper.style.display = input.style.display;

  mxEvent.addListener(input, "keydown", function (e) {
    if (e.keyCode == 13) {
      graph.container.focus();
      mxEvent.consume(e);
    } else if (e.keyCode == 27) {
      input.value = graph.getGridSize();
      graph.container.focus();
      mxEvent.consume(e);
    }
  });

  function update(evt) {
    var value = parseInt(input.value);
    value = Math.max(1, isNaN(value) ? 10 : value);

    if (value != graph.getGridSize()) {
      graph.setGridSize(value);
    }

    input.value = value + " pt";
    mxEvent.consume(evt);
  }

  mxEvent.addListener(input, "blur", update);
  mxEvent.addListener(input, "change", update);

  if (mxClient.IS_SVG) {
    input.style.marginTop = "-2px";
    input.style.right = "84px";
    stepper.style.marginTop = "-16px";
    stepper.style.right = "72px";

    var panel = this.createColorOption(
      mxResources.get("grid"),
      function () {
        var color = graph.view.gridColor;

        return graph.isGridEnabled() ? color : null;
      },
      function (color) {
        if (color == mxConstants.NONE) {
          graph.setGridEnabled(false);
          ui.fireEvent(new mxEventObject("gridEnabledChanged"));
        } else {
          graph.setGridEnabled(true);
          ui.setGridColor(color);
        }

        input.style.display = graph.isGridEnabled() ? "" : "none";
        stepper.style.display = input.style.display;
      },
      "#e0e0e0",
      {
        install: function (apply) {
          this.listener = function () {
            apply(graph.isGridEnabled() ? graph.view.gridColor : null);
          };

          ui.addListener("gridColorChanged", this.listener);
          ui.addListener("gridEnabledChanged", this.listener);
        },
        destroy: function () {
          ui.removeListener(this.listener);
          //console.log("asda");;
        },
      }
    );

    panel.appendChild(input);
    panel.appendChild(stepper);
    container.appendChild(panel);
  } else {
    input.style.marginTop = "2px";
    input.style.right = "32px";
    stepper.style.marginTop = "2px";
    stepper.style.right = "20px";

    container.appendChild(input);
    container.appendChild(stepper);

    container.appendChild(
      this.createOption(
        mxResources.get("grid"),
        function () {
          return graph.isGridEnabled();
        },
        function (checked) {
          graph.setGridEnabled(checked);

          if (graph.isGridEnabled()) {
            graph.view.gridColor = "#e0e0e0";
          }

          ui.fireEvent(new mxEventObject("gridEnabledChanged"));
        },
        {
          install: function (apply) {
            this.listener = function () {
              input.style.display = graph.isGridEnabled() ? "" : "none";
              stepper.style.display = input.style.display;

              apply(graph.isGridEnabled());
            };

            ui.addListener("gridEnabledChanged", this.listener);
          },
          destroy: function () {
            ui.removeListener(this.listener);
            //console.log("asda");;
          },
        }
      )
    );
  }
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addDocumentProperties = function (div) {
  // Hook for subclassers
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;

  div.appendChild(this.createTitle(mxResources.get("options")));

  return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addPaperSize = function (div) {
  var ui = this.editorUi;
  var editor = ui.editor;
  var graph = editor.graph;

  //div.appendChild(this.createTitle("Floor Size"));  //edit

  var accessor = PageSetupDialog.addPageFormatPanel(
    div,
    "formatpanel",
    graph.pageFormat,
    function (pageFormat) {
      if (
        graph.pageFormat == null ||
        graph.pageFormat.width != pageFormat.width ||
        graph.pageFormat.height != pageFormat.height
      ) {
        //console.log(pageFormat);
        ui.setPageFormat(pageFormat);
      }
    }
  );

  this.addKeyHandler(accessor.widthInput, function () {
    //console.log('here', graph.pageFormat);
    accessor.set(graph.pageFormat);
  });
  -this.addKeyHandler(accessor.heightInput, function () {
    accessor.set(graph.pageFormat);
  });

  var listener = function () {
    accessor.set(graph.pageFormat);
  };

  ui.addListener("pageFormatChanged", listener);
  this.listeners.push({
    destroy: function () {
      ui.removeListener(listener);
      //console.log("asda");;
    },
  });

  graph.getModel().addListener(mxEvent.CHANGE, listener);
  this.listeners.push({
    destroy: function () {
      graph.getModel().removeListener(listener);
      //console.log("asda");;
    },
  });

  return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addStyleOps = function (div) {
  var btn = mxUtils.button(
    mxResources.get("editData"),
    mxUtils.bind(this, function (evt) {
      this.editorUi.actions.get("editData").funct();
    })
  );

  btn.setAttribute(
    "title",
    mxResources.get("editData") +
      " (" +
      this.editorUi.actions.get("editData").shortcut +
      ")"
  );
  btn.style.width = "202px";
  btn.style.marginBottom = "2px";
  div.appendChild(btn);

  mxUtils.br(div);

  btn = mxUtils.button(
    mxResources.get("clearDefaultStyle"),
    mxUtils.bind(this, function (evt) {
      this.editorUi.actions.get("clearDefaultStyle").funct();
    })
  );

  btn.setAttribute(
    "title",
    mxResources.get("clearDefaultStyle") +
      " (" +
      this.editorUi.actions.get("clearDefaultStyle").shortcut +
      ")"
  );
  btn.style.width = "202px";
  div.appendChild(btn);

  return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.destroy = function () {
  BaseFormatPanel.prototype.destroy.apply(this, arguments);

  if (this.gridEnabledListener) {
    this.editorUi.removeListener(this.gridEnabledListener);
    //console.log("asda");;
    this.gridEnabledListener = null;
  }
};

StyleFormatPanel.prototype.addGeneralPalette = function (expand) {
  var fns = [];

  for (var key in ArrayOfObjects) {
    var obj = ArrayOfObjects[key];
    //console.log(obj.background);
    var bothtypeheight = ArrayOfObjects[key].height / mxPixelPerFeet;
    var bothtypewidth = ArrayOfObjects[key].width / mxPixelPerFeet;

    var bothheight = ArrayOfObjects[key].height;
    var bothwidth = ArrayOfObjects[key].width;
    fns.push(
      this.createVertexTemplateEntry(
        obj.style,
        bothwidth,
        bothheight,
        "",
        bothtypeheight + "x" + bothtypewidth + " ft",
        true,
        true,
        "rect rectangle box"
      )
    );
  }

  this.addPaletteFunctions(
    "general",
    "Presets",
    expand != null ? expand : true,
    fns
  );
};

StyleFormatPanel.prototype.createVertexTemplateEntry = function (
  style,
  width,
  height,
  value,
  title,
  showLabel,
  showTitle,
  tags
) {
  //console.log(style+"<width>"+width+"<height>"+height+"<value>"+value+"<title>"+title+"<showLabel>"+showLabel+"<showTitle>"+showTitle+"<tags>"+tags);
  //rounded=1;whiteSpace=wrap;html=1;<width>120<height>60<value><title>Rounded Rectangle<showLabel>null<showTitle>null<tags>rounded rect rectangle box
  tags = tags != null && tags.length > 0 ? tags : title.toLowerCase();

  return this.addEntry(
    tags,
    mxUtils.bind(this, function () {
      return this.createVertexTemplate(
        style,
        width,
        height,
        value,
        title,
        showLabel,
        showTitle
      );
    })
  );
};

StyleFormatPanel.prototype.addEntry = function (tags, fn) {
  if (this.taglist != null && tags != null && tags.length > 0) {
    // Replaces special characters
    var tmp = tags
      .toLowerCase()
      .replace(/[\/\,\(\)]/g, " ")
      .split(" ");

    var doAddEntry = mxUtils.bind(this, function (tag) {
      if (tag.length > 1) {
        var entry = this.taglist[tag];

        if (typeof entry !== "object") {
          entry = { entries: [], dict: new mxDictionary() };
          this.taglist[tag] = entry;
        }

        // Ignores duplicates
        if (entry.dict.get(fn) == null) {
          entry.dict.put(fn, fn);
          entry.entries.push(fn);
        }
      }
    });

    for (var i = 0; i < tmp.length; i++) {
      doAddEntry(tmp[i]);

      // Adds additional entry with removed trailing numbers
      var normalized = tmp[i].replace(/\.*\d*$/, "");

      if (normalized != tmp[i]) {
        doAddEntry(normalized);
      }
    }
  }

  return fn;
};

StyleFormatPanel.prototype.createVertexTemplate = function (
  style,
  width,
  height,
  value,
  title,
  showLabel,
  showTitle,
  allowCellsInserted
) {
  var cells = [
    new mxCell(
      value != null ? value : "",
      new mxGeometry(0, 0, width, height),
      style
    ),
  ];
  cells[0].vertex = true;

  return this.createVertexTemplateFromCells(
    cells,
    width,
    height,
    title,
    showLabel,
    showTitle,
    allowCellsInserted
  );
};

StyleFormatPanel.prototype.createVertexTemplateFromCells = function (
  cells,
  width,
  height,
  title,
  showLabel,
  showTitle,
  allowCellsInserted
) {
  return this.createItem(
    cells,
    title,
    showLabel,
    showTitle,
    width,
    height,
    allowCellsInserted
  );
};

StyleFormatPanel.prototype.createItem = function (
  cells,
  title,
  showLabel,
  showTitle,
  width,
  height,
  allowCellsInserted
) {
  var elt = document.createElement("a");
  elt.setAttribute("href", "javascript:void(0);");
  elt.className = "geItem";
  elt.style.overflow = "hidden";
  var border = mxClient.IS_QUIRKS
    ? 8 + 2 * this.thumbPadding
    : 2 * this.thumbBorder;
  elt.style.width = this.thumbWidth + border + "px";
  elt.style.height = this.thumbHeight + border + "px";
  elt.style.padding = this.thumbPadding + "px";

  if (mxClient.IS_IE6) {
    elt.style.border = "none";
  }

  // Blocks default click action
  mxEvent.addListener(elt, "click", function (evt) {
    mxEvent.consume(evt);
  });

  this.createThumb(
    cells,
    this.thumbWidth,
    this.thumbHeight,
    elt,
    title,
    showLabel,
    showTitle,
    width,
    height
  );
  var bounds = new mxRectangle(0, 0, width, height);

  if (cells.length > 1 || cells[0].vertex) {
    var ds = this.createDragSource(
      elt,
      this.createDropHandler(cells, true, allowCellsInserted, bounds),
      this.createDragPreview(width, height),
      cells,
      bounds
    );
    this.addClickHandler(elt, ds, cells);

    // Uses guides for vertices only if enabled in graph
    ds.isGuidesEnabled = mxUtils.bind(this, function () {
      return this.editorUi.editor.graph.graphHandler.guidesEnabled;
    });
  } else if (cells[0] != null && cells[0].edge) {
    var ds = this.createDragSource(
      elt,
      this.createDropHandler(cells, false, allowCellsInserted, bounds),
      this.createDragPreview(width, height),
      cells,
      bounds
    );
    this.addClickHandler(elt, ds, cells);
  }

  // Shows a tooltip with the rendered cell
  if (!mxClient.IS_IOS) {
    mxEvent.addGestureListeners(
      elt,
      null,
      mxUtils.bind(this, function (evt) {
        if (mxEvent.isMouseEvent(evt)) {
          this.showTooltip(
            elt,
            cells,
            bounds.width,
            bounds.height,
            title,
            showLabel
          );
        }
      })
    );
  }

  return elt;
};

StyleFormatPanel.prototype.createThumb = function (
  cells,
  width,
  height,
  parent,
  title,
  showLabel,
  showTitle,
  realWidth,
  realHeight
) {
  this.graph.labelsVisible = showLabel == null || showLabel;
  var fo = mxClient.NO_FO;
  mxClient.NO_FO = Editor.prototype.originalNoForeignObject;
  this.graph.view.scaleAndTranslate(1, 0, 0);
  this.graph.addCells(cells);
  var bounds = this.graph.getGraphBounds();
  var s =
    Math.floor(
      Math.min(
        (width - 2 * this.thumbBorder) / bounds.width,
        (height - 2 * this.thumbBorder) / bounds.height
      ) * 100
    ) / 100;
  this.graph.view.scaleAndTranslate(
    s,
    Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
    Math.floor((height - bounds.height * s) / 2 / s - bounds.y)
  );

  var node = null;

  // For supporting HTML labels in IE9 standards mode the container is cloned instead
  if (this.graph.dialect == mxConstants.DIALECT_SVG && !mxClient.NO_FO) {
    node = this.graph.view.getCanvas().ownerSVGElement.cloneNode(true);
  }
  // LATER: Check if deep clone can be used for quirks if container in DOM
  else {
    node = this.graph.container.cloneNode(false);
    node.innerHTML = this.graph.container.innerHTML;
  }

  this.graph.getModel().clear();
  mxClient.NO_FO = fo;

  // Catch-all event handling
  if (mxClient.IS_IE6) {
    parent.style.backgroundImage =
      "url(" + this.editorUi.editor.transparentImage + ")";
  }

  node.style.position = "relative";
  node.style.overflow = "hidden";
  node.style.cursor = "move";
  node.style.left = this.thumbBorder + "px";
  node.style.top = this.thumbBorder + "px";
  node.style.width = width + "px";
  node.style.height = height + "px";
  node.style.visibility = "";
  node.style.minWidth = "";
  node.style.minHeight = "";

  parent.appendChild(node);

  // Adds title for sidebar entries
  if (this.sidebarTitles && title != null && showTitle != false) {
    var border = mxClient.IS_QUIRKS ? 2 * this.thumbPadding + 2 : 0;
    parent.style.height =
      this.thumbHeight + border + this.sidebarTitleSize + 8 + "px";

    var div = document.createElement("div");
    div.style.fontSize = this.sidebarTitleSize + "px";
    div.style.color = "#303030";
    div.style.textAlign = "center";
    div.style.whiteSpace = "nowrap";

    if (mxClient.IS_IE) {
      div.style.height = this.sidebarTitleSize + 12 + "px";
    }

    div.style.paddingTop = "4px";
    mxUtils.write(div, title);
    parent.appendChild(div);
  }

  return bounds;
};

StyleFormatPanel.prototype.createDragSource = function (
  elt,
  dropHandler,
  preview,
  cells,
  bounds
) {
  // Checks if the cells contain any vertices
  var ui = this.editorUi;
  var graph = ui.editor.graph;
  var freeSourceEdge = null;
  var firstVertex = null;
  var sidebar = this;

  for (var i = 0; i < cells.length; i++) {
    if (
      firstVertex == null &&
      this.editorUi.editor.graph.model.isVertex(cells[i])
    ) {
      firstVertex = i;
    } else if (
      freeSourceEdge == null &&
      this.editorUi.editor.graph.model.isEdge(cells[i]) &&
      this.editorUi.editor.graph.model.getTerminal(cells[i], true) == null
    ) {
      freeSourceEdge = i;
    }

    if (firstVertex != null && freeSourceEdge != null) {
      break;
    }
  }

  var dragSource = mxUtils.makeDraggable(
    elt,
    this.editorUi.editor.graph,
    mxUtils.bind(this, function (graph, evt, target, x, y) {
      if (this.updateThread != null) {
        window.clearTimeout(this.updateThread);
      }

      if (
        cells != null &&
        currentStyleTarget != null &&
        activeArrow == styleTarget
      ) {
        var tmp = graph.isCellSelected(currentStyleTarget.cell)
          ? graph.getSelectionCells()
          : [currentStyleTarget.cell];
        var updatedCells = this.updateShapes(
          graph.model.isEdge(currentStyleTarget.cell)
            ? cells[0]
            : cells[firstVertex],
          tmp
        );
        graph.setSelectionCells(updatedCells);
      } else if (
        cells != null &&
        activeArrow != null &&
        currentTargetState != null &&
        activeArrow != styleTarget
      ) {
        var index =
          graph.model.isEdge(currentTargetState.cell) || freeSourceEdge == null
            ? firstVertex
            : freeSourceEdge;
        this.dropAndConnect(currentTargetState.cell, cells, direction, index);
      } else {
        dropHandler.apply(this, arguments);
      }

      if (this.editorUi.hoverIcons != null) {
        this.editorUi.hoverIcons.update(
          graph.view.getState(graph.getSelectionCell())
        );
      }
    }),
    preview,
    0,
    0,
    this.editorUi.editor.graph.autoscroll,
    true,
    true
  );

  // Stops dragging if cancel is pressed
  this.editorUi.editor.graph.addListener(
    mxEvent.ESCAPE,
    function (sender, evt) {
      if (dragSource.isActive()) {
        dragSource.reset();
      }
    }
  );

  // Overrides mouseDown to ignore popup triggers
  var mouseDown = dragSource.mouseDown;

  dragSource.mouseDown = function (evt) {
    if (!mxEvent.isPopupTrigger(evt) && !mxEvent.isMultiTouchEvent(evt)) {
      graph.stopEditing();
      mouseDown.apply(this, arguments);
    }
  };

  // Workaround for event redirection via image tag in quirks and IE8
  function createArrow(img, tooltip) {
    var arrow = null;

    if (mxClient.IS_IE && !mxClient.IS_SVG) {
      // Workaround for PNG images in IE6
      if (mxClient.IS_IE6 && document.compatMode != "CSS1Compat") {
        arrow = document.createElement(mxClient.VML_PREFIX + ":image");
        arrow.setAttribute("src", img.src);
        arrow.style.borderStyle = "none";
      } else {
        arrow = document.createElement("div");
        arrow.style.backgroundImage = "url(" + img.src + ")";
        arrow.style.backgroundPosition = "center";
        arrow.style.backgroundRepeat = "no-repeat";
      }

      arrow.style.width = img.width + 4 + "px";
      arrow.style.height = img.height + 4 + "px";
      arrow.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
    } else {
      arrow = mxUtils.createImage(img.src);
      arrow.style.width = img.width + "px";
      arrow.style.height = img.height + "px";
    }

    if (tooltip != null) {
      arrow.setAttribute("title", tooltip);
    }

    mxUtils.setOpacity(arrow, img == this.refreshTarget ? 30 : 20);
    arrow.style.position = "absolute";
    arrow.style.cursor = "crosshair";

    return arrow;
  }

  var currentTargetState = null;
  var currentStateHandle = null;
  var currentStyleTarget = null;
  var activeTarget = false;

  var arrowUp = createArrow(this.triangleUp, mxResources.get("connect"));
  var arrowRight = createArrow(this.triangleRight, mxResources.get("connect"));
  var arrowDown = createArrow(this.triangleDown, mxResources.get("connect"));
  var arrowLeft = createArrow(this.triangleLeft, mxResources.get("connect"));
  var styleTarget = createArrow(this.refreshTarget, mxResources.get("replace"));
  // Workaround for actual parentNode not being updated in old IE
  var styleTargetParent = null;
  var roundSource = createArrow(this.roundDrop);
  var roundTarget = createArrow(this.roundDrop);
  var direction = mxConstants.DIRECTION_NORTH;
  var activeArrow = null;

  function checkArrow(x, y, bounds, arrow) {
    if (arrow.parentNode != null) {
      if (mxUtils.contains(bounds, x, y)) {
        mxUtils.setOpacity(arrow, 100);
        activeArrow = arrow;
      } else {
        mxUtils.setOpacity(arrow, arrow == styleTarget ? 30 : 20);
      }
    }

    return bounds;
  }

  // Hides guides and preview if target is active
  var dsCreatePreviewElement = dragSource.createPreviewElement;

  // Stores initial size of preview element
  dragSource.createPreviewElement = function (graph) {
    var elt = dsCreatePreviewElement.apply(this, arguments);

    // Pass-through events required to tooltip on replace shape
    if (mxClient.IS_SVG) {
      elt.style.pointerEvents = "none";
    }

    this.previewElementWidth = elt.style.width;
    this.previewElementHeight = elt.style.height;

    return elt;
  };

  // Shows/hides hover icons
  var dragEnter = dragSource.dragEnter;
  dragSource.dragEnter = function (graph, evt) {
    // console.log("dragEnter");
    if (ui.hoverIcons != null) {
      ui.hoverIcons.setDisplay("none");
    }

    dragEnter.apply(this, arguments);
  };

  var dragExit = dragSource.dragExit;
  dragSource.dragExit = function (graph, evt) {
    // console.log("dragExit");
    if (ui.hoverIcons != null) {
      ui.hoverIcons.setDisplay("");
    }

    dragExit.apply(this, arguments);
  };

  dragSource.dragOver = function (graph, evt) {
    // console.log("dragOver");
    mxDragSource.prototype.dragOver.apply(this, arguments);

    if (this.currentGuide != null && activeArrow != null) {
      this.currentGuide.hide();
    }

    if (this.previewElement != null) {
      var view = graph.view;

      if (currentStyleTarget != null && activeArrow == styleTarget) {
        this.previewElement.style.display = graph.model.isEdge(
          currentStyleTarget.cell
        )
          ? "none"
          : "";

        this.previewElement.style.left = currentStyleTarget.x + "px";
        this.previewElement.style.top = currentStyleTarget.y + "px";
        this.previewElement.style.width = currentStyleTarget.width + "px";
        this.previewElement.style.height = currentStyleTarget.height + "px";
      } else if (currentTargetState != null && activeArrow != null) {
        var index =
          graph.model.isEdge(currentTargetState.cell) || freeSourceEdge == null
            ? firstVertex
            : freeSourceEdge;
        var geo = sidebar.getDropAndConnectGeometry(
          currentTargetState.cell,
          cells[index],
          direction,
          cells
        );
        var geo2 = !graph.model.isEdge(currentTargetState.cell)
          ? graph.getCellGeometry(currentTargetState.cell)
          : null;
        var geo3 = graph.getCellGeometry(cells[index]);
        var parent = graph.model.getParent(currentTargetState.cell);
        var dx = view.translate.x * view.scale;
        var dy = view.translate.y * view.scale;

        if (geo2 != null && !geo2.relative && graph.model.isVertex(parent)) {
          var pState = view.getState(parent);
          dx = pState.x;
          dy = pState.y;
        }

        var dx2 = geo3.x;
        var dy2 = geo3.y;

        // Ignores geometry of edges
        if (graph.model.isEdge(cells[index])) {
          dx2 = 0;
          dy2 = 0;
        }

        // Shows preview at drop location
        this.previewElement.style.left = (geo.x - dx2) * view.scale + dx + "px";
        this.previewElement.style.top = (geo.y - dy2) * view.scale + dy + "px";

        if (cells.length == 1) {
          this.previewElement.style.width = geo.width * view.scale + "px";
          this.previewElement.style.height = geo.height * view.scale + "px";
        }

        this.previewElement.style.display = "";
      } else if (
        dragSource.currentHighlight.state != null &&
        graph.model.isEdge(dragSource.currentHighlight.state.cell)
      ) {
        // Centers drop cells when splitting edges
        this.previewElement.style.left =
          Math.round(
            parseInt(this.previewElement.style.left) -
              (bounds.width * view.scale) / 2
          ) + "px";
        this.previewElement.style.top =
          Math.round(
            parseInt(this.previewElement.style.top) -
              (bounds.height * view.scale) / 2
          ) + "px";
      } else {
        this.previewElement.style.width = this.previewElementWidth;
        this.previewElement.style.height = this.previewElementHeight;
        this.previewElement.style.display = "";
      }
    }
  };

  var startTime = new Date().getTime();
  var timeOnTarget = 0;
  var prev = null;

  // Gets source cell style to compare shape below
  var sourceCellStyle = this.editorUi.editor.graph.getCellStyle(cells[0]);

  // Allows drop into cell only if target is a valid root
  dragSource.getDropTarget = mxUtils.bind(this, function (graph, x, y, evt) {
    // Alt means no targets at all
    // LATER: Show preview where result will go
    var cell =
      !mxEvent.isAltDown(evt) && cells != null ? graph.getCellAt(x, y) : null;

    // Uses connectable parent vertex if one exists
    if (cell != null && !this.graph.isCellConnectable(cell)) {
      var parent = this.graph.getModel().getParent(cell);

      if (
        this.graph.getModel().isVertex(parent) &&
        this.graph.isCellConnectable(parent)
      ) {
        cell = parent;
      }
    }

    // Ignores locked cells
    if (graph.isCellLocked(cell)) {
      cell = null;
    }

    var state = graph.view.getState(cell);
    activeArrow = null;
    var bbox = null;

    // Time on target
    if (prev != state) {
      prev = state;
      startTime = new Date().getTime();
      timeOnTarget = 0;

      if (this.updateThread != null) {
        window.clearTimeout(this.updateThread);
      }

      if (state != null) {
        this.updateThread = window.setTimeout(function () {
          if (activeArrow == null) {
            prev = state;
            dragSource.getDropTarget(graph, x, y, evt);
          }
        }, this.dropTargetDelay + 10);
      }
    } else {
      timeOnTarget = new Date().getTime() - startTime;
    }

    // Shift means disabled, delayed on cells with children, shows after this.dropTargetDelay, hides after 2500ms
    if (
      timeOnTarget < 2500 &&
      state != null &&
      !mxEvent.isShiftDown(evt) &&
      // If shape is equal or target has no stroke then add long delay except for images
      ((mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE) !=
        mxUtils.getValue(sourceCellStyle, mxConstants.STYLE_SHAPE) &&
        mxUtils.getValue(
          state.style,
          mxConstants.STYLE_STROKECOLOR,
          mxConstants.NONE
        ) != mxConstants.NONE) ||
        mxUtils.getValue(sourceCellStyle, mxConstants.STYLE_SHAPE) == "image" ||
        timeOnTarget > 1500 ||
        graph.model.isEdge(state.cell)) &&
      timeOnTarget > this.dropTargetDelay &&
      ((graph.model.isVertex(state.cell) && firstVertex != null) ||
        (graph.model.isEdge(state.cell) && graph.model.isEdge(cells[0])))
    ) {
      currentStyleTarget = state;
      var tmp = graph.model.isEdge(state.cell)
        ? graph.view.getPoint(state)
        : new mxPoint(state.getCenterX(), state.getCenterY());
      tmp = new mxRectangle(
        tmp.x - this.refreshTarget.width / 2,
        tmp.y - this.refreshTarget.height / 2,
        this.refreshTarget.width,
        this.refreshTarget.height
      );

      styleTarget.style.left = Math.floor(tmp.x) + "px";
      styleTarget.style.top = Math.floor(tmp.y) + "px";

      if (styleTargetParent == null) {
        graph.container.appendChild(styleTarget);
        styleTargetParent = styleTarget.parentNode;
      }

      checkArrow(x, y, tmp, styleTarget);
    }
    // Does not reset on ignored edges
    else if (
      currentStyleTarget == null ||
      !mxUtils.contains(currentStyleTarget, x, y) ||
      (timeOnTarget > 1500 && !mxEvent.isShiftDown(evt))
    ) {
      currentStyleTarget = null;

      if (styleTargetParent != null) {
        styleTarget.parentNode.removeChild(styleTarget);
        styleTargetParent = null;
      }
    } else if (currentStyleTarget != null && styleTargetParent != null) {
      // Sets active Arrow as side effect
      var tmp = graph.model.isEdge(currentStyleTarget.cell)
        ? graph.view.getPoint(currentStyleTarget)
        : new mxPoint(
            currentStyleTarget.getCenterX(),
            currentStyleTarget.getCenterY()
          );
      tmp = new mxRectangle(
        tmp.x - this.refreshTarget.width / 2,
        tmp.y - this.refreshTarget.height / 2,
        this.refreshTarget.width,
        this.refreshTarget.height
      );
      checkArrow(x, y, tmp, styleTarget);
    }

    // Checks if inside bounds
    if (
      activeTarget &&
      currentTargetState != null &&
      !mxEvent.isAltDown(evt) &&
      activeArrow == null
    ) {
      // LATER: Use hit-detection for edges
      bbox = mxRectangle.fromRectangle(currentTargetState);

      if (graph.model.isEdge(currentTargetState.cell)) {
        var pts = currentTargetState.absolutePoints;

        if (roundSource.parentNode != null) {
          var p0 = pts[0];
          bbox.add(
            checkArrow(
              x,
              y,
              new mxRectangle(
                p0.x - this.roundDrop.width / 2,
                p0.y - this.roundDrop.height / 2,
                this.roundDrop.width,
                this.roundDrop.height
              ),
              roundSource
            )
          );
        }

        if (roundTarget.parentNode != null) {
          var pe = pts[pts.length - 1];
          bbox.add(
            checkArrow(
              x,
              y,
              new mxRectangle(
                pe.x - this.roundDrop.width / 2,
                pe.y - this.roundDrop.height / 2,
                this.roundDrop.width,
                this.roundDrop.height
              ),
              roundTarget
            )
          );
        }
      } else {
        var bds = mxRectangle.fromRectangle(currentTargetState);

        // Uses outer bounding box to take rotation into account
        if (
          currentTargetState.shape != null &&
          currentTargetState.shape.boundingBox != null
        ) {
          bds = mxRectangle.fromRectangle(currentTargetState.shape.boundingBox);
        }

        bds.grow(this.graph.tolerance);
        bds.grow(HoverIcons.prototype.arrowSpacing);

        var handler = this.graph.selectionCellsHandler.getHandler(
          currentTargetState.cell
        );

        if (handler != null) {
          bds.x -= handler.horizontalOffset / 2;
          bds.y -= handler.verticalOffset / 2;
          bds.width += handler.horizontalOffset;
          bds.height += handler.verticalOffset;

          // Adds bounding box of rotation handle to avoid overlap
          if (
            handler.rotationShape != null &&
            handler.rotationShape.node != null &&
            handler.rotationShape.node.style.visibility != "hidden" &&
            handler.rotationShape.node.style.display != "none" &&
            handler.rotationShape.boundingBox != null
          ) {
            bds.add(handler.rotationShape.boundingBox);
          }
        }

        bbox.add(
          checkArrow(
            x,
            y,
            new mxRectangle(
              currentTargetState.getCenterX() - this.triangleUp.width / 2,
              bds.y - this.triangleUp.height,
              this.triangleUp.width,
              this.triangleUp.height
            ),
            arrowUp
          )
        );
        bbox.add(
          checkArrow(
            x,
            y,
            new mxRectangle(
              bds.x + bds.width,
              currentTargetState.getCenterY() - this.triangleRight.height / 2,
              this.triangleRight.width,
              this.triangleRight.height
            ),
            arrowRight
          )
        );
        bbox.add(
          checkArrow(
            x,
            y,
            new mxRectangle(
              currentTargetState.getCenterX() - this.triangleDown.width / 2,
              bds.y + bds.height,
              this.triangleDown.width,
              this.triangleDown.height
            ),
            arrowDown
          )
        );
        bbox.add(
          checkArrow(
            x,
            y,
            new mxRectangle(
              bds.x - this.triangleLeft.width,
              currentTargetState.getCenterY() - this.triangleLeft.height / 2,
              this.triangleLeft.width,
              this.triangleLeft.height
            ),
            arrowLeft
          )
        );
      }

      // Adds tolerance
      if (bbox != null) {
        bbox.grow(10);
      }
    }

    direction = mxConstants.DIRECTION_NORTH;

    if (activeArrow == arrowRight) {
      direction = mxConstants.DIRECTION_EAST;
    } else if (activeArrow == arrowDown || activeArrow == roundTarget) {
      direction = mxConstants.DIRECTION_SOUTH;
    } else if (activeArrow == arrowLeft) {
      direction = mxConstants.DIRECTION_WEST;
    }

    if (currentStyleTarget != null && activeArrow == styleTarget) {
      state = currentStyleTarget;
    }

    var validTarget =
      (firstVertex == null || graph.isCellConnectable(cells[firstVertex])) &&
      ((graph.model.isEdge(cell) && firstVertex != null) ||
        (graph.model.isVertex(cell) && graph.isCellConnectable(cell)));

    // Drop arrows shown after this.dropTargetDelay, hidden after 5 secs, switches arrows after 500ms
    if (
      (currentTargetState != null && timeOnTarget >= 5000) ||
      (currentTargetState != state &&
        (bbox == null ||
          !mxUtils.contains(bbox, x, y) ||
          (timeOnTarget > 500 && activeArrow == null && validTarget)))
    ) {
      activeTarget = false;
      currentTargetState =
        (timeOnTarget < 5000 && timeOnTarget > this.dropTargetDelay) ||
        graph.model.isEdge(cell)
          ? state
          : null;

      if (currentTargetState != null && validTarget) {
        var elts = [
          roundSource,
          roundTarget,
          arrowUp,
          arrowRight,
          arrowDown,
          arrowLeft,
        ];

        for (var i = 0; i < elts.length; i++) {
          if (elts[i].parentNode != null) {
            elts[i].parentNode.removeChild(elts[i]);
          }
        }

        if (graph.model.isEdge(cell)) {
          var pts = state.absolutePoints;

          if (pts != null) {
            var p0 = pts[0];
            var pe = pts[pts.length - 1];
            var tol = graph.tolerance;
            var box = new mxRectangle(x - tol, y - tol, 2 * tol, 2 * tol);

            roundSource.style.left =
              Math.floor(p0.x - this.roundDrop.width / 2) + "px";
            roundSource.style.top =
              Math.floor(p0.y - this.roundDrop.height / 2) + "px";

            roundTarget.style.left =
              Math.floor(pe.x - this.roundDrop.width / 2) + "px";
            roundTarget.style.top =
              Math.floor(pe.y - this.roundDrop.height / 2) + "px";

            if (graph.model.getTerminal(cell, true) == null) {
              graph.container.appendChild(roundSource);
            }

            if (graph.model.getTerminal(cell, false) == null) {
              graph.container.appendChild(roundTarget);
            }
          }
        } else {
          var bds = mxRectangle.fromRectangle(state);

          // Uses outer bounding box to take rotation into account
          if (state.shape != null && state.shape.boundingBox != null) {
            bds = mxRectangle.fromRectangle(state.shape.boundingBox);
          }

          bds.grow(this.graph.tolerance);
          bds.grow(HoverIcons.prototype.arrowSpacing);

          var handler = this.graph.selectionCellsHandler.getHandler(state.cell);

          if (handler != null) {
            bds.x -= handler.horizontalOffset / 2;
            bds.y -= handler.verticalOffset / 2;
            bds.width += handler.horizontalOffset;
            bds.height += handler.verticalOffset;

            // Adds bounding box of rotation handle to avoid overlap
            if (
              handler.rotationShape != null &&
              handler.rotationShape.node != null &&
              handler.rotationShape.node.style.visibility != "hidden" &&
              handler.rotationShape.node.style.display != "none" &&
              handler.rotationShape.boundingBox != null
            ) {
              bds.add(handler.rotationShape.boundingBox);
            }
          }

          arrowUp.style.left =
            Math.floor(state.getCenterX() - this.triangleUp.width / 2) + "px";
          arrowUp.style.top = Math.floor(bds.y - this.triangleUp.height) + "px";

          arrowRight.style.left = Math.floor(bds.x + bds.width) + "px";
          arrowRight.style.top =
            Math.floor(state.getCenterY() - this.triangleRight.height / 2) +
            "px";

          arrowDown.style.left = arrowUp.style.left;
          arrowDown.style.top = Math.floor(bds.y + bds.height) + "px";

          arrowLeft.style.left =
            Math.floor(bds.x - this.triangleLeft.width) + "px";
          arrowLeft.style.top = arrowRight.style.top;

          if (state.style["portConstraint"] != "eastwest") {
            graph.container.appendChild(arrowUp);
            graph.container.appendChild(arrowDown);
          }

          graph.container.appendChild(arrowRight);
          graph.container.appendChild(arrowLeft);
        }

        // Hides handle for cell under mouse
        if (state != null) {
          currentStateHandle = graph.selectionCellsHandler.getHandler(
            state.cell
          );

          if (
            currentStateHandle != null &&
            currentStateHandle.setHandlesVisible != null
          ) {
            currentStateHandle.setHandlesVisible(false);
          }
        }

        activeTarget = true;
      } else {
        var elts = [
          roundSource,
          roundTarget,
          arrowUp,
          arrowRight,
          arrowDown,
          arrowLeft,
        ];

        for (var i = 0; i < elts.length; i++) {
          if (elts[i].parentNode != null) {
            elts[i].parentNode.removeChild(elts[i]);
          }
        }
      }
    }

    if (!activeTarget && currentStateHandle != null) {
      currentStateHandle.setHandlesVisible(true);
    }

    // Handles drop target
    var target =
      (!mxEvent.isAltDown(evt) || mxEvent.isShiftDown(evt)) &&
      !(currentStyleTarget != null && activeArrow == styleTarget)
        ? mxDragSource.prototype.getDropTarget.apply(this, arguments)
        : null;
    var model = graph.getModel();

    if (target != null) {
      if (activeArrow != null || !graph.isSplitTarget(target, cells, evt)) {
        // Selects parent group as drop target
        while (
          target != null &&
          !graph.isValidDropTarget(target, cells, evt) &&
          model.isVertex(model.getParent(target))
        ) {
          target = model.getParent(target);
        }

        if (
          graph.view.currentRoot == target ||
          (!graph.isValidRoot(target) &&
            graph.getModel().getChildCount(target) == 0) ||
          graph.isCellLocked(target) ||
          model.isEdge(target)
        ) {
          target = null;
        }
      }
    }

    return target;
  });

  dragSource.stopDrag = function () {
    mxDragSource.prototype.stopDrag.apply(this, arguments);

    var elts = [
      roundSource,
      roundTarget,
      styleTarget,
      arrowUp,
      arrowRight,
      arrowDown,
      arrowLeft,
    ];

    for (var i = 0; i < elts.length; i++) {
      if (elts[i].parentNode != null) {
        elts[i].parentNode.removeChild(elts[i]);
      }
    }

    if (currentTargetState != null && currentStateHandle != null) {
      currentStateHandle.reset();
    }

    currentStateHandle = null;
    currentTargetState = null;
    currentStyleTarget = null;
    styleTargetParent = null;
    activeArrow = null;
  };

  return dragSource;
};

StyleFormatPanel.prototype.createDragPreview = function (width, height) {
  var elt = document.createElement("div");
  elt.style.border = "1px dashed black";
  elt.style.width = width + "px";
  elt.style.height = height + "px";

  return elt;
};

// if(jQuery('#level-based-discount').text().trim() == ""){

//   jQuery('#level-based-discount').append('<p class="emptytext"><strong>No level based discounts are created , Click Add to start.</strong></p>');
// }

function priceBasedLevelHtml(allLevels) {


  const numx = Math.trunc(Math.random() * 100);
  const discountId = 'discount-' + numx;

  return `
          <div id="${discountId}" class="html-content row">
              <div class="col-md-3">
                  <h6><strong>Levels</strong></h6>
                  <select class="form-control js-example-basic-multiple" id="levels-${discountId}" multiple="multiple" data-allow-clear="true">
                      ${Object.entries(allLevels)
          .filter(([key]) => key !== 'administrator' && key !== 'contentmanager')
          .map(([key, rolevalue]) => `<option value="${key}">${rolevalue.name}</option>`)
          .join('')}
                  </select>
              </div>
              
              <div class="col-md-3">
                  <h6><strong>Discount Type</strong></h6>
                  <select style="height:28px;" id="discount_type-${discountId}" opid="${discountId}" class="form-control" onchange="symbol(this)">
                      <option value="fixed">Fixed</option>
                      <option value="percent">Percent</option>
                  </select>
              </div>
              
              <div class="col-md-3">
                  <h6><strong>Discount</strong></h6>
                  <div class="input-group">
                      <div id="input-group-${discountId}" class="input-group-addon">$</div>
                      <input style="height:28px;" type="number" min="1" class="form-control" id="amount-price-${discountId}" name="amount-price" value="" placeholder="Price">
                  </div>
              </div>
              
              <div class="col-md-1" id="add-new-discount">
                  <i style="color:#004598 !important; margin-top: 70px; margin-left: 35px;" class="addnewdiscount adddscountbuttonsty font-icon fa fa-plus-circle fa-2x" onclick="addNewDiscount();" egid="addnewdiscount"></i>
              </div>
          </div>`;


}

function addNewDiscount(){

  // jQuery(".emptytext").remove();
  var html = '';
  var num = Math.random().toFixed(2)*100;
  num = Math.trunc(num);
  var discountRowId = 'discount-'+num;

  var levels = '';
  var allLevels = arrayoflevelsObjects;

  jQuery.each(allLevels, function (key, rolevalue) {

      if (rolevalue.key != 'administrator' && rolevalue.key != 'contentmanager') {

          levels += '<option value="'+rolevalue.key +'" >' +rolevalue.name +'</option>';
      }
  });
  var levelHtml = '';
  levelHtml += '<h6><strong>Levels</strong></h6>';
  levelHtml += '<select class="form-control js-example-basic-multiple" id="levels-'+discountRowId+'" multiple="multiple" data-allow-clear="true" >';
  levelHtml += levels;
  levelHtml += '</select>';

  html = '<div id="'+discountRowId+'" class="html-content row">' +

  '<div class = "col-md-3">'+
      levelHtml+
  '</div>'+

  '<div class = "col-md-3">'+
  '<h6><strong>Discount Type</strong></h6>'+
  '<select style= "height: 28px;" id="discount_type-'+discountRowId+'"opid="'+discountRowId+'" class="form-control" onchange="symbol(this)" >'+
      '<option value="fixed">Fixed</option>'+
      '<option value="percent">Percent</option>'+
  '</select>'+
  '</div>'+

  '<div class = "col-md-3">'+
  '<h6><strong>Discount</strong></h6>'+
  '<div class="input-group">'+
  '<div id="input-group-'+discountRowId+'" class="input-group-addon">'+symbol()+'</div>'+
  '<input style= "height: 28px;" type="number" min="1" class="form-control"id="amount-price-'+discountRowId+'" name="amount-price" value=""placeholder="Price" >'+
  '</div>'+
  '<p class="depositeerror"></p>'+
  '</div>'+

  '<div class = "col-md-1" style="padding-left: 36px;">'+
  '<h6 style="margin-top: 70px;"><strong></strong></h6>'+
  '<span><i style="color:crimson; margin-left: 15px;" onclick="removeDiscount(this)"; id="'+discountRowId+'" class="fa fa-times-circle fa-2x" aria-hidden="true"></i></span>'+
  '</div>'+

  '</div>';

  jQuery('#level-based-discount').append(html);
  jQuery('.js-example-basic-multiple').select2();
  
}

function removeDiscount(e){


  var id = jQuery(e).attr('id');
  // var postid = jQuery(e).attr('postid');
  
  // delFeeArray.push(postid);
  jQuery('#'+ id).remove();
  jQuery('#hr-'+ id).remove();
  // console.log(delFeeArray);
  // return delFeeArray;

}

function symbol(e){

  var id = jQuery(e).attr('id');
  var opid = jQuery(e).attr('opid');
  var value = jQuery('#'+id).val();
  
  // console.log('input-group-'+opid);
  jQuery('#input-group-'+opid).html('');
  if(value == 'fixed'){

      jQuery('#input-group-'+opid).html('$');
   
  }else if(value == 'percent'){ 

      jQuery('#input-group-'+opid).html('%');
      
    
  }else{

      return '$';
  }

}


document.addEventListener("wheel", function (event) {
  if (document.activeElement.type === "number") {
    document.activeElement.blur();
  }
});
