/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph editor
 */
var checkinitalstatus;
var disableStyle;
var purchCount = 0;
EditorUi = function (editor, container, lightbox) {
    var floorPlanSettings = JSON.parse(floorPlanSetting);

    //console.log(floorPlanSettings["Open_users"]);
    // console.log(floorPlanSettings["tableSort"]);
    // var cartTotalCount=cartCount;
    // var cartTotalCounts=JSON.parse(cartCount);
    var logInUser = JSON.parse(loggedInUser);
    // console.log("---");
    // console.log(cartTotalCount);
    // console.log(cartTotalCounts);
    // console.log(logInUser["priorityNum"][0]);
    var activeNumber = TurnUsers;
    loggedInUserLevel =  logInUser["UserLevel"];

    // console.log(logInUser);
    // console.log(activeNumber);
    //  console.log(floorPlanSettings.Open_users);

    //  jQuery.each(floorPlanSettings,function (index,value) {
    //    console.log(index);
    //    console.log("---");
    //    console.log(value);
    //  })OverrideBoothLimit
    //console.log(floorPlanSettings.get('Open_users'));
    // console.log(floorPlanSettings);
    mxEventSource.call(this);
    this.destroyFunctions = [];

    this.editor = editor || new Editor();
    this.container = container || document.body;
    var graph = this.editor.graph;
    graph.lightbox = lightbox;

    // Pre-fetches submenu image or replaces with embedded image if supported
    if (mxClient.IS_SVG) {
        mxPopupMenu.prototype.submenuImage =
            "data:image/gif;base64,R0lGODlhCQAJAIAAAP///zMzMyH5BAEAAAAALAAAAAAJAAkAAAIPhI8WebHsHopSOVgb26AAADs=";
    } else {
        new Image().src = mxPopupMenu.prototype.submenuImage;
    }

    // Pre-fetches connect image
    if (!mxClient.IS_SVG && mxConnectionHandler.prototype.connectImage != null) {
        new Image().src = mxConnectionHandler.prototype.connectImage.src;
    }

    // Disables graph and forced panning in chromeless mode
    if (this.editor.chromeless) {
        this.footerHeight = 0;
        graph.isEnabled = function () {
            return false;
        };
        graph.panningHandler.isForcePanningEvent = function (me) {
            return !mxEvent.isPopupTrigger(me.getEvent());
        };
    }

    // Creates the user interface
    this.actions = new Actions(this);
    this.menus = this.createMenus();
    this.createDivs();
    this.createUi();
    this.refresh();

    // Disables HTML and text selection
    var textEditing = mxUtils.bind(this, function (evt) {
        if (evt == null) {
            evt = window.event;
        }

        return this.isSelectionAllowed(evt) || graph.isEditing();
    });

    // Disables text selection while not editing and no dialog visible
    if (this.container == document.body) {
        this.menubarContainer.onselectstart = textEditing;
        this.menubarContainer.onmousedown = textEditing;
        this.toolbarContainer.onselectstart = textEditing;
        this.toolbarContainer.onmousedown = textEditing;
        this.diagramContainer.onselectstart = textEditing;
        this.diagramContainer.onmousedown = textEditing;
        this.sidebarContainer.onselectstart = textEditing;
        this.sidebarContainer.onmousedown = textEditing;
        this.formatContainer.onselectstart = textEditing;
        this.formatContainer.onmousedown = textEditing;
        this.footerContainer.onselectstart = textEditing;
        this.footerContainer.onmousedown = textEditing;

        if (this.tabContainer != null) {
            // Mouse down is needed for drag and drop
            this.tabContainer.onselectstart = textEditing;
        }
    }

    // And uses built-in context menu while editing
    if (!this.editor.chromeless) {
        if (
            mxClient.IS_IE &&
            (typeof document.documentMode === "undefined" ||
                document.documentMode < 9)
        ) {
            mxEvent.addListener(this.diagramContainer, "contextmenu", textEditing);
        } else {
            // Allows browser context menu outside of diagram and sidebar
            this.diagramContainer.oncontextmenu = textEditing;
        }
    } else {
        graph.panningHandler.usePopupTrigger = false;
    }

    // Contains the main graph instance inside the given panel
    graph.init(this.diagramContainer);

    // Creates hover icons
    this.hoverIcons = this.createHoverIcons();

    // Adds tooltip when mouse is over scrollbars to show space-drag panning option
    mxEvent.addListener(
        this.diagramContainer,
        "mousemove",
        mxUtils.bind(this, function (evt) {
            var off = mxUtils.getOffset(this.diagramContainer);

            if (
                mxEvent.getClientX(evt) - off.x - this.diagramContainer.clientWidth >
                0 ||
                mxEvent.getClientY(evt) - off.y - this.diagramContainer.clientHeight > 0
            ) {
                this.diagramContainer.setAttribute(
                    "title",
                    mxResources.get("panTooltip")
                );
            } else {
                this.diagramContainer.removeAttribute("title");
            }
        })
    );

    // Escape key hides dialogs, adds space+drag panning
    var spaceKeyPressed = false;

    // Overrides hovericons to disable while space key is pressed
    var hoverIconsIsResetEvent = this.hoverIcons.isResetEvent;

    this.hoverIcons.isResetEvent = function (evt, allowShift) {
        return spaceKeyPressed || hoverIconsIsResetEvent.apply(this, arguments);
    };

    this.keydownHandler = mxUtils.bind(this, function (evt) {
        if (evt.which == 32 /* Space */) {
            spaceKeyPressed = true;
            this.hoverIcons.reset();
            graph.container.style.cursor = "move";

            // Disables scroll after space keystroke with scrollbars
            if (!graph.isEditing() && mxEvent.getSource(evt) == graph.container) {
                mxEvent.consume(evt);
            }
        } else if (!mxEvent.isConsumed(evt) && evt.keyCode == 27 /* Escape */) {
            this.hideDialog();
        }
    });

    mxEvent.addListener(document, "keydown", this.keydownHandler);

    this.keyupHandler = mxUtils.bind(this, function (evt) {
        graph.container.style.cursor = "";
        spaceKeyPressed = false;
    });

    mxEvent.addListener(document, "keyup", this.keyupHandler);

    // Forces panning for middle and right mouse buttons
    var panningHandlerIsForcePanningEvent =
        graph.panningHandler.isForcePanningEvent;
    graph.panningHandler.isForcePanningEvent = function (me) {
        // Ctrl+left button is reported as right button in FF on Mac
        return (
            panningHandlerIsForcePanningEvent.apply(this, arguments) ||
            spaceKeyPressed ||
            (mxEvent.isMouseEvent(me.getEvent()) &&
                (this.usePopupTrigger || !mxEvent.isPopupTrigger(me.getEvent())) &&
                ((!mxEvent.isControlDown(me.getEvent()) &&
                        mxEvent.isRightMouseButton(me.getEvent())) ||
                    mxEvent.isMiddleMouseButton(me.getEvent())))
        );
    };

    // Ctrl/Cmd+Enter applies editing value except in Safari where Ctrl+Enter creates
    // a new line (while Enter creates a new paragraph and Shift+Enter stops)
    var cellEditorIsStopEditingEvent = graph.cellEditor.isStopEditingEvent;
    graph.cellEditor.isStopEditingEvent = function (evt) {
        return (
            cellEditorIsStopEditingEvent.apply(this, arguments) ||
            (evt.keyCode == 13 &&
                ((!mxClient.IS_SF && mxEvent.isControlDown(evt)) ||
                    (mxClient.IS_MAC && mxEvent.isMetaDown(evt)) ||
                    (mxClient.IS_SF && mxEvent.isShiftDown(evt))))
        );
    };

    // Switches toolbar for text editing
    var textMode = false;
    var fontMenu = null;
    var sizeMenu = null;
    var nodes = null;

    var updateToolbar = mxUtils.bind(this, function () {
        if (textMode != graph.cellEditor.isContentEditing()) {
            var node = this.toolbar.container.firstChild;
            var newNodes = [];

            while (node != null) {
                var tmp = node.nextSibling;

                if (mxUtils.indexOf(this.toolbar.staticElements, node) < 0) {
                    node.parentNode.removeChild(node);
                    newNodes.push(node);
                }

                node = tmp;
            }

            // Saves references to special items
            var tmp1 = this.toolbar.fontMenu;
            var tmp2 = this.toolbar.sizeMenu;

            if (nodes == null) {
                this.toolbar.createTextToolbar();
            } else {
                for (var i = 0; i < nodes.length; i++) {
                    this.toolbar.container.appendChild(nodes[i]);
                }

                // Restores references to special items
                this.toolbar.fontMenu = fontMenu;
                this.toolbar.sizeMenu = sizeMenu;
            }

            textMode = graph.cellEditor.isContentEditing();
            fontMenu = tmp1;
            sizeMenu = tmp2;
            nodes = newNodes;
        }
    });

    var ui = this;

    // Overrides cell editor to update toolbar
    var cellEditorStartEditing = graph.cellEditor.startEditing;
    graph.cellEditor.startEditing = function () {
        // console.log("Testtooltip");
        cellEditorStartEditing.apply(this, arguments);
        updateToolbar();

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

                            if (css != null && ui.toolbar != null) {
                                // Strips leading and trailing quotes
                                var ff = css.fontFamily;

                                if (ff.charAt(0) == "'") {
                                    ff = ff.substring(1);
                                }

                                if (ff.charAt(ff.length - 1) == "'") {
                                    ff = ff.substring(0, ff.length - 1);
                                }

                                ui.toolbar.setFontName(ff);
                                ui.toolbar.setFontSize(parseInt(css.fontSize));
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
            mxEvent.addListener(
                graph.cellEditor.textarea,
                "mouseup",
                updateCssHandler
            );
            mxEvent.addListener(graph.cellEditor.textarea, "keyup", updateCssHandler);
            updateCssHandler();
        }
    };

    var cellEditorStopEditing = graph.cellEditor.stopEditing;
    graph.cellEditor.stopEditing = function (cell, trigger) {
        cellEditorStopEditing.apply(this, arguments);
        updateToolbar();
    };

    // Enables scrollbars and sets cursor style for the container
    graph.container.setAttribute("tabindex", "0");
    graph.container.style.cursor = "default";

    // Workaround for page scroll if embedded via iframe
    if (window.self === window.top && graph.container.parentNode != null) {
        graph.container.focus();
    }

    // Keeps graph container focused on mouse down
    var graphFireMouseEvent = graph.fireMouseEvent;
    graph.fireMouseEvent = function (evtName, me, sender) {
        if (evtName == mxEvent.MOUSE_DOWN) {
            this.container.focus();
        }

        graphFireMouseEvent.apply(this, arguments);
    };

    // Configures automatic expand on mouseover
    graph.popupMenuHandler.autoExpand = true;

    // Installs context menu
    if (this.menus != null) {
        graph.popupMenuHandler.factoryMethod = mxUtils.bind(
            this,
            function (menu, cell, evt) {
                this.menus.createPopupMenu(menu, cell, evt);
            }
        );
    }

    // Hides context menu
    mxEvent.addGestureListeners(
        document,
        mxUtils.bind(this, function (evt) {
            graph.popupMenuHandler.hideMenu();
        })
    );

    // Create handler for key events
    this.keyHandler = this.createKeyHandler(editor);

    // Getter for key handler
    this.getKeyHandler = function () {
        return keyHandler;
    };

    // Stores the current style and assigns it to new cells
    var styles = [
        "rounded",
        "shadow",
        "glass",
        "dashed",
        "dashPattern",
        "comic",
        "labelBackgroundColor",
    ];
    var connectStyles = [
        "shape",
        "edgeStyle",
        "curved",
        "rounded",
        "elbow",
        "comic",
    ];

    // Note: Everything that is not in styles is ignored (styles is augmented below)
    this.setDefaultStyle = function (cell) {
        var state = graph.view.getState(cell);

        if (state != null) {
            // Ignores default styles
            var clone = cell.clone();
            clone.style = "";
            var defaultStyle = graph.getCellStyle(clone);
            var values = [];
            var keys = [];

            for (var key in state.style) {
                if (defaultStyle[key] != state.style[key]) {
                    values.push(state.style[key]);
                    keys.push(key);
                }
            }

            // Handles special case for value "none"
            var cellStyle = graph.getModel().getStyle(state.cell);
            var tokens = cellStyle != null ? cellStyle.split(";") : [];

            for (var i = 0; i < tokens.length; i++) {
                var tmp = tokens[i];
                var pos = tmp.indexOf("=");

                if (pos >= 0) {
                    var key = tmp.substring(0, pos);
                    var value = tmp.substring(pos + 1);

                    if (defaultStyle[key] != null && value == "none") {
                        values.push(value);
                        keys.push(key);
                    }
                }
            }

            // Resets current style
            if (graph.getModel().isEdge(state.cell)) {
                graph.currentEdgeStyle = {};
            } else {
                graph.currentVertexStyle = {};
            }

            this.fireEvent(
                new mxEventObject(
                    "styleChanged",
                    "keys",
                    keys,
                    "values",
                    values,
                    "cells",
                    [state.cell]
                )
            );
        }
    };

    this.clearDefaultStyle = function () {
        graph.currentEdgeStyle = graph.defaultEdgeStyle;
        graph.currentVertexStyle = {};

        // Updates UI
        this.fireEvent(
            new mxEventObject("styleChanged", "keys", [], "values", [], "cells", [])
        );
    };

    // Keys that should be ignored if the cell has a value (known: new default for all cells is html=1 so
    // for the html key this effecticely only works for edges inserted via the connection handler)
    var valueStyles = ["fontFamily", "fontSize", "fontColor"];

    // Keys that always update the current edge style regardless of selection
    var alwaysEdgeStyles = [
        "edgeStyle",
        "startArrow",
        "startFill",
        "startSize",
        "endArrow",
        "endFill",
        "endSize",
        "jettySize",
        "orthogonalLoop",
    ];

    // Keys that are ignored together (if one appears all are ignored)
    var keyGroups = [
        [
            "startArrow",
            "startFill",
            "startSize",
            "endArrow",
            "endFill",
            "endSize",
            "jettySize",
            "orthogonalLoop",
        ],
        ["strokeColor", "strokeWidth"],
        ["fillColor", "gradientColor"],
        valueStyles,
        ["align"],
        ["html"],
    ];

    // Adds all keys used above to the styles array
    for (var i = 0; i < keyGroups.length; i++) {
        for (var j = 0; j < keyGroups[i].length; j++) {
            styles.push(keyGroups[i][j]);
        }
    }

    for (var i = 0; i < connectStyles.length; i++) {
        styles.push(connectStyles[i]);
    }

    // Implements a global current style for edges and vertices that is applied to new cells
    var insertHandler = function (cells, asText) {
        graph.getModel().beginUpdate();
        try {
            // Applies only basic text styles
            if (asText) {
                var edge = graph.getModel().isEdge(cell);
                var current = edge ? graph.currentEdgeStyle : graph.currentVertexStyle;
                var textStyles = ["fontSize", "fontFamily", "fontColor"];

                for (var j = 0; j < textStyles.length; j++) {
                    var value = current[textStyles[j]];

                    if (value != null) {
                        graph.setCellStyles(textStyles[j], value, cells);
                    }
                }
            } else {
                for (var i = 0; i < cells.length; i++) {
                    var cell = cells[i];

                    // Removes styles defined in the cell style from the styles to be applied
                    var cellStyle = graph.getModel().getStyle(cell);
                    var tokens = cellStyle != null ? cellStyle.split(";") : [];
                    var appliedStyles = styles.slice();

                    for (var j = 0; j < tokens.length; j++) {
                        var tmp = tokens[j];
                        var pos = tmp.indexOf("=");

                        if (pos >= 0) {
                            var key = tmp.substring(0, pos);
                            var index = mxUtils.indexOf(appliedStyles, key);

                            if (index >= 0) {
                                appliedStyles.splice(index, 1);
                            }

                            // Handles special cases where one defined style ignores other styles
                            for (var k = 0; k < keyGroups.length; k++) {
                                var group = keyGroups[k];

                                if (mxUtils.indexOf(group, key) >= 0) {
                                    for (var l = 0; l < group.length; l++) {
                                        var index2 = mxUtils.indexOf(appliedStyles, group[l]);

                                        if (index2 >= 0) {
                                            appliedStyles.splice(index2, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Applies the current style to the cell
                    var edge = graph.getModel().isEdge(cell);
                    var current = edge
                        ? graph.currentEdgeStyle
                        : graph.currentVertexStyle;

                    for (var j = 0; j < appliedStyles.length; j++) {
                        var key = appliedStyles[j];
                        var styleValue = current[key];

                        if (styleValue != null && (key != "shape" || edge)) {
                            // Special case: Connect styles are not applied here but in the connection handler
                            if (!edge || mxUtils.indexOf(connectStyles, key) < 0) {
                                graph.setCellStyles(key, styleValue, [cell]);
                            }
                        }
                    }
                }
            }
        } finally {
            graph.getModel().endUpdate();
        }
    };

    graph.addListener("cellsInserted", function (sender, evt) {
        insertHandler(evt.getProperty("cells"));
    });

    graph.addListener("textInserted", function (sender, evt) {
        insertHandler(evt.getProperty("cells"), true);
    });

    graph.connectionHandler.addListener(mxEvent.CONNECT, function (sender, evt) {
        var cells = [evt.getProperty("cell")];

        if (evt.getProperty("terminalInserted")) {
            cells.push(evt.getProperty("terminal"));
        }

        insertHandler(cells);
    });

    this.addListener(
        "styleChanged",
        mxUtils.bind(this, function (sender, evt) {
            // Checks if edges and/or vertices were modified
            var cells = evt.getProperty("cells");
            var vertex = false;
            var edge = false;

            if (cells.length > 0) {
                for (var i = 0; i < cells.length; i++) {
                    vertex = graph.getModel().isVertex(cells[i]) || vertex;
                    edge = graph.getModel().isEdge(cells[i]) || edge;

                    if (edge && vertex) {
                        break;
                    }
                }
            } else {
                vertex = true;
                edge = true;
            }

            var keys = evt.getProperty("keys");
            var values = evt.getProperty("values");

            for (var i = 0; i < keys.length; i++) {
                var common = mxUtils.indexOf(valueStyles, keys[i]) >= 0;

                // Ignores transparent stroke colors
                if (
                    keys[i] != "strokeColor" ||
                    (values[i] != null && values[i] != "none")
                ) {
                    // Special case: Edge style and shape
                    if (mxUtils.indexOf(connectStyles, keys[i]) >= 0) {
                        if (edge || mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
                            if (values[i] == null) {
                                delete graph.currentEdgeStyle[keys[i]];
                            } else {
                                graph.currentEdgeStyle[keys[i]] = values[i];
                            }
                        }
                        // Uses style for vertex if defined in styles
                        else if (vertex && mxUtils.indexOf(styles, keys[i]) >= 0) {
                            if (values[i] == null) {
                                delete graph.currentVertexStyle[keys[i]];
                            } else {
                                graph.currentVertexStyle[keys[i]] = values[i];
                            }
                        }
                    } else if (mxUtils.indexOf(styles, keys[i]) >= 0) {
                        if (vertex || common) {
                            if (values[i] == null) {
                                delete graph.currentVertexStyle[keys[i]];
                            } else {
                                graph.currentVertexStyle[keys[i]] = values[i];
                            }
                        }

                        if (
                            edge ||
                            common ||
                            mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0
                        ) {
                            if (values[i] == null) {
                                delete graph.currentEdgeStyle[keys[i]];
                            } else {
                                graph.currentEdgeStyle[keys[i]] = values[i];
                            }
                        }
                    }
                }
            }

            if (this.toolbar != null) {
                this.toolbar.setFontName(
                    graph.currentVertexStyle["fontFamily"] || Menus.prototype.defaultFont
                );
                this.toolbar.setFontSize(
                    graph.currentVertexStyle["fontSize"] ||
                    Menus.prototype.defaultFontSize
                );

                if (this.toolbar.edgeStyleMenu != null) {
                    // Updates toolbar icon for edge style
                    var edgeStyleDiv =
                        this.toolbar.edgeStyleMenu.getElementsByTagName("div")[0];

                    if (
                        graph.currentEdgeStyle["edgeStyle"] == "orthogonalEdgeStyle" &&
                        graph.currentEdgeStyle["curved"] == "1"
                    ) {
                        edgeStyleDiv.className = "geSprite geSprite-curved";
                    } else if (
                        graph.currentEdgeStyle["edgeStyle"] == "straight" ||
                        graph.currentEdgeStyle["edgeStyle"] == "none" ||
                        graph.currentEdgeStyle["edgeStyle"] == null
                    ) {
                        edgeStyleDiv.className = "geSprite geSprite-straight";
                    } else if (
                        graph.currentEdgeStyle["edgeStyle"] == "entityRelationEdgeStyle"
                    ) {
                        edgeStyleDiv.className = "geSprite geSprite-entity";
                    } else if (graph.currentEdgeStyle["edgeStyle"] == "elbowEdgeStyle") {
                        edgeStyleDiv.className =
                            "geSprite geSprite-" +
                            (graph.currentEdgeStyle["elbow"] == "vertical"
                                ? "verticalelbow"
                                : "horizontalelbow");
                    } else if (
                        graph.currentEdgeStyle["edgeStyle"] == "isometricEdgeStyle"
                    ) {
                        edgeStyleDiv.className =
                            "geSprite geSprite-" +
                            (graph.currentEdgeStyle["elbow"] == "vertical"
                                ? "verticalisometric"
                                : "horizontalisometric");
                    } else {
                        edgeStyleDiv.className = "geSprite geSprite-orthogonal";
                    }
                }

                if (this.toolbar.edgeShapeMenu != null) {
                    // Updates icon for edge shape
                    var edgeShapeDiv =
                        this.toolbar.edgeShapeMenu.getElementsByTagName("div")[0];

                    if (graph.currentEdgeStyle["shape"] == "link") {
                        edgeShapeDiv.className = "geSprite geSprite-linkedge";
                    } else if (graph.currentEdgeStyle["shape"] == "flexArrow") {
                        edgeShapeDiv.className = "geSprite geSprite-arrow";
                    } else if (graph.currentEdgeStyle["shape"] == "arrow") {
                        edgeShapeDiv.className = "geSprite geSprite-simplearrow";
                    } else {
                        edgeShapeDiv.className = "geSprite geSprite-connection";
                    }
                }

                // Updates icon for optinal line start shape
                if (this.toolbar.lineStartMenu != null) {
                    var lineStartDiv =
                        this.toolbar.lineStartMenu.getElementsByTagName("div")[0];

                    lineStartDiv.className = this.getCssClassForMarker(
                        "start",
                        graph.currentEdgeStyle["shape"],
                        graph.currentEdgeStyle[mxConstants.STYLE_STARTARROW],
                        mxUtils.getValue(graph.currentEdgeStyle, "startFill", "1")
                    );
                }

                // Updates icon for optinal line end shape
                if (this.toolbar.lineEndMenu != null) {
                    var lineEndDiv =
                        this.toolbar.lineEndMenu.getElementsByTagName("div")[0];

                    lineEndDiv.className = this.getCssClassForMarker(
                        "end",
                        graph.currentEdgeStyle["shape"],
                        graph.currentEdgeStyle[mxConstants.STYLE_ENDARROW],
                        mxUtils.getValue(graph.currentEdgeStyle, "endFill", "1")
                    );
                }
            }
        })
    );

    // Update font size and font family labels
    if (this.toolbar != null) {
        var update = mxUtils.bind(this, function () {
            var ff = graph.currentVertexStyle["fontFamily"] || "Helvetica";
            var fs = String(graph.currentVertexStyle["fontSize"] || "12");
            var state = graph.getView().getState(graph.getSelectionCell());

            if (state != null) {
                ff = state.style[mxConstants.STYLE_FONTFAMILY] || ff;
                fs = state.style[mxConstants.STYLE_FONTSIZE] || fs;

                if (ff.length > 10) {
                    ff = ff.substring(0, 8) + "...";
                }
            }

            this.toolbar.setFontName(ff);
            this.toolbar.setFontSize(fs);
        });

        graph.getSelectionModel().addListener(mxEvent.CHANGE, update);
        graph.getModel().addListener(mxEvent.CHANGE, update);
    }

    // Makes sure the current layer is visible when cells are added
    graph.addListener(mxEvent.CELLS_ADDED, function (sender, evt) {
        var cells = evt.getProperty("cells");
        var parent = evt.getProperty("parent");

        if (
            graph.getModel().isLayer(parent) &&
            !graph.isCellVisible(parent) &&
            cells != null &&
            cells.length > 0
        ) {
            graph.getModel().setVisible(parent, true);
        }
    });

    // Global handler to hide the current menu
    this.gestureHandler = mxUtils.bind(this, function (evt) {
        if (
            this.currentMenu != null &&
            mxEvent.getSource(evt) != this.currentMenu.div
        ) {
            this.hideCurrentMenu();
        }
    });

    mxEvent.addGestureListeners(document, this.gestureHandler);

    // Updates the editor UI after the window has been resized or the orientation changes
    // Timeout is workaround for old IE versions which have a delay for DOM client sizes.
    // Should not use delay > 0 to avoid handle multiple repaints during window resize
    this.resizeHandler = mxUtils.bind(this, function () {
        window.setTimeout(
            mxUtils.bind(this, function () {
                this.refresh();
            }),
            0
        );
    });

    mxEvent.addListener(window, "resize", this.resizeHandler);

    this.orientationChangeHandler = mxUtils.bind(this, function () {
        this.refresh();
    });

    mxEvent.addListener(
        window,
        "orientationchange",
        this.orientationChangeHandler
    );

    // Workaround for bug on iOS see
    // http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
    if (mxClient.IS_IOS && !window.navigator.standalone) {
        this.scrollHandler = mxUtils.bind(this, function () {
            window.scrollTo(0, 0);
        });

        mxEvent.addListener(window, "scroll", this.scrollHandler);
    }

    /**
     * Sets the initial scrollbar locations after a file was loaded.
     */
    this.editor.addListener(
        "resetGraphView",
        mxUtils.bind(this, function () {
            this.resetScrollbars();
        })
    );

    /**
     * Repaints the grid.
     */
    this.addListener(
        "gridEnabledChanged",
        mxUtils.bind(this, function () {
            graph.view.validateBackground();
        })
    );

    this.addListener(
        "backgroundColorChanged",
        mxUtils.bind(this, function () {
            graph.view.validateBackground();
        })
    );

    /**
     * Repaints the grid.
     */
    graph.addListener(
        "gridSizeChanged",
        mxUtils.bind(this, function () {
            if (graph.isGridEnabled()) {
                graph.view.validateBackground();
            }
        })
    );

    // Resets UI, updates action and menu states
    this.editor.resetGraph();
    this.init();
    this.open();

    // Load/Populate Graph from xml on load
    if (mxFloorPlanXml) {
        var data = this.editor.graph.zapGremlins(mxUtils.trim(mxFloorPlanXml));

        this.editor.setGraphXml(mxUtils.parseXml(data).documentElement);
        mxGraph.prototype.cellsEditable = false;
        if (mxCurrentfloorplanstatus == "viewer") {
            //  this.editor.graph.setEnabled(false);
            mxCellState.prototype.setCursor("pointer");
            mxSelectionCellsHandler.prototype.setEnabled(false);
            mxDragSource.prototype.setEnabled(false);
            mxGraph.prototype.cellsLocked = true;
            mxGraph.prototype.cellsMovable = false;
            mxEditor.prototype.disableContextMenu = true;
            mxPopupMenu.prototype.enabled = false;

            //var highlight = new mxCellTracker(graph, '#00FF00');
            this.editor.graph.addListener(mxEvent.CLICK, function (sender, evt) {
                var cell = evt.getProperty("cell");                 
                if (userloggedinstatus == '') {
                    if (packageboothpurchaselimit != '') {
                        userlimit = packageboothpurchaselimit;
                    } else{
                        userlimit = '';
                    }
                }
                else {
                    if (
                        logInUser["OverrideCheck"] == "checked" &&
                        logInUser["OverrideBoothLimit"]
                    ) {
                        userlimit = logInUser["OverrideBoothLimit"];
                    } else {
                        if (loggedInUserLevel == 'contentmanager') {
                            userlimit = '';
                        }
                        else {

                            if (floorPlanSettings["usersNum"] != '') {
                                userlimit = floorPlanSettings["usersNum"];
                            }
                            else {
                                userlimit = logInUser["BoothPurchaseLimit"];
                            }
                        }
                    }
                }

                if (logInUser["OverrideCheck"] == "checked" &&
                    logInUser["Overrideprepaid"] == "checked") {
                    prePaid = logInUser["Overrideprepaid"];
                } else {
                    prePaid = floorPlanSettings["PrePaidChk"];
                }

                if(prePaid == "checked"){

                    disableStyle = 'disabled';
                }

                // console.log(logInUser["UserLevel"]);
                // console.log(userlimit);
                var array = {};
                var flag = true;
                for (
                    let index = 0;
                    index < logInUser["ReservedBooth"].length;
                    index++
                ) {
                    // console.log(logInUser["ReservedBooth"][index]);
                    if (logInUser["ReservedBooth"][0].length > 1 && flag == true) {
                        for (let y = 0; y < logInUser["ReservedBooth"][index].length; y++) {
                            // console.log(logInUser["ReservedBooth"][index][y]);
                            array[index] = logInUser["ReservedBooth"][index][y];
                        }
                        flag = false;
                    } else {
                        array[index] = logInUser["ReservedBooth"][index];
                    }
                }
                // console.log(array);

                if (typeof cell != "undefined") {
                    var assignedboothname = "";
                    jQuery("body").css("cursor", "wait");
                    assignedboothname = cell.getAttribute("mylabel", "");
                    var valuessrting = cell.style;
                    var companydescription = "";
                    var htmlcompanydescription = "";
                    // console.log("cell-------Detail");
                    var userid = cell.getAttribute("boothOwner", "");
                    var boothdetail = cell.getAttribute("boothDetail", "");
                    var companydescription = cell.getAttribute("companydescripiton", "");
                    var boothproductid = cell.getAttribute("boothproductid", "");
                    var boothID = cell.id;
                    var tagslist = cell.getAttribute("boothtags", "");
                    var tagsnameslist = "";

                    if (tagslist != "") {
                        jQuery.each(BoothTagsObjects, function (index1, value) {
                            var foreachvalues = tagslist.split(",");

                            if (jQuery.inArray(value.ID, foreachvalues) != -1) {
                                tagsnameslist += value.name + ",";
                            }
                        });
                        tagsnameslist = tagsnameslist.replace(/,\s*$/, "");
                        // console.log(tagsnameslist);
                    }

                    var reportData = jQuery.parseJSON(mxgetAllusersData);

                    var openhtml = "";
                    var tablehtml = "";
                    var curr_dat = "";
                    var companynameas = "";
                    var companylogourlnew = "";
                    var profilelogourl = "";
                    var companywebsite = "";
                    var htmlforassignedbooth = "";
                    var boothtitle = "";
                    var htmlforaddress = "";
                    var imagesrc = "";
                    var websiteURLhtml = "";
                    var contactname = "";
                    var contactphonenumber = "";
                    var contactemail = "";
                    var contactnameHTML = "";
                    var contactphonenumberHTML = "";
                    var contactemailHTML = "";

                    if (userid != "" && userid != "none" && reportData) {
                        // console.log(reportData);
                        jQuery.each(reportData, function (key, index) {
                            if (index.exhibitorsid == userid) {
                                // console.log("User=" + JSON.stringify(index));
                                companynameas = index.companyname;
                                companylogourlnew = index.COL;
                                profilelogourl = index.companylogourl;
                                companywebsite = index.COW;
                                companydescription = index.COD;
                                companylogourlnew = index.COL;
                                // profilelogourl = index.companylogourl;
                                // companywebsite = index.compnaywebsite;
                                // companydescription = index.compnayDesp;

                                // contactname = index.contactName;
                                // contactphonenumber = index.contactNumber;
                                // contactemail = index.contactemail;
                                // contactemail = index.nickname;
                                contactname = index.CON;
                                contactphonenumber = index.COP;
                                contactemail = index.COE;
                                // contactemail = index.nickname;

                                // console.log(contactname);
                                // console.log(contactphonenumber);
                                // console.log(contactemail);

                                if (companywebsite == null || companywebsite == "") {
                                    websiteURLhtml = ""; //<div class="row" style="margin-bottom: 10px;"><div class="col-sm-11" >'+boothtitle+htmlcompanydescription+'</div></div>';
                                } else if (
                                    floorPlanSettings["Hide_exhibitor_Details"] != "Hide_Details" 
                                ) {

                                    
                                    websiteURLhtml =
                                        '<div class="row" style="margin-bottom: 10px;"><div class="col-sm-11" ><a href="' +
                                        companywebsite +
                                        '" target="_blank">' +
                                        companywebsite +
                                        "</a></div></div>";
                                }else if (
                                    floorPlanSettings["Hide_exhibitor_Details"] == "Hide_Details" && userloggedinstatus == "1"
                                ) {

                                    
                                    websiteURLhtml =
                                        '<div class="row" style="margin-bottom: 10px;"><div class="col-sm-11" ><a href="' +
                                        companywebsite +
                                        '" target="_blank">' +
                                        companywebsite +
                                        "</a></div></div>";
                                }

                                if (contactname == null || contactname == "") {
                                    contactnameHTML = ""; //<div class="row" style="margin-bottom: 10px;"><div class="col-sm-11" >'+boothtitle+htmlcompanydescription+'</div></div>';
                                } else {
                                    contactnameHTML =
                                        '<div class="row" style="margin-bottom: 10px;margin-top: 15px;"><div class="col-sm-3" ><strong>Contact Name:</strong></div><div class="col-sm-5">' +
                                        contactname +
                                        "</div></div>";
                                }

                                if (contactphonenumber == null || contactphonenumber == "") {
                                    contactphonenumberHTML = ""; //<div class="row" style="margin-bottom: 10px;"><div class="col-sm-11" >'+boothtitle+htmlcompanydescription+'</div></div>';
                                } else {
                                    contactphonenumberHTML =
                                        '<div class="row" style="margin-bottom: 10px;"><div class="col-sm-3" ><strong>Contact Phone:</strong></div><div class="col-sm-5">' +
                                        contactphonenumber +
                                        "</div></div>";
                                }
                                if (contactemail == null || contactemail == "") {
                                    contactemailHTML = ""; //<div class="row" style="margin-bottom: 10px;"><div class="col-sm-11" >'+boothtitle+htmlcompanydescription+'</div></div>';
                                } else if (
                                    floorPlanSettings["Hide_exhibitor_Details"] == "" ||
                                    floorPlanSettings["Hide_exhibitor_Details"] != "Hide_Details"
                                ) {
                                    
                                    contactemailHTML =
                                        '<div class="row" style="margin-bottom: 10px;"><div class="col-sm-3" ><strong>Contact Email:</strong></div><div class="col-sm-5">' +
                                        contactemail +
                                        "</div></div>";
                                }else if (
                                    floorPlanSettings["Hide_exhibitor_Details"] == "" ||
                                    floorPlanSettings["Hide_exhibitor_Details"] == "Hide_Details" &&
                                    userloggedinstatus == "1"
                                ) {
                                    
                                    contactemailHTML =
                                        '<div class="row" style="margin-bottom: 10px;"><div class="col-sm-3" ><strong>Contact Email:</strong></div><div class="col-sm-5">' +
                                        contactemail +
                                        "</div></div>";
                                }

                                if (companylogourlnew == null || companylogourlnew == "") {
                                    if (profilelogourl == null || profilelogourl == "") {
                                        companylogourlnew =
                                            baseCurrentSiteURl +
                                            "/wp-content/plugins/floorplan/styles/default-placeholder-300x300.png";
                                    } else {
                                        companylogourlnew = profilelogourl;
                                    }
                                }

                                imagesrc =
                                    "<p style='float: right;padding: 0px 20px 0px 20px;margin-top: 10px;'><img width='150' src='" +
                                    companylogourlnew +
                                    "' /></p>";

                                if (
                                    companydescription != "" &&
                                    typeof companydescription !== "undefined" &&
                                    companydescription != null &&
                                    floorPlanSettings["Hide_exhibitor_Details"] != "Hide_Details"


                                ) {
                                    
                                    htmlcompanydescription =
                                        "<div >" + unescape(companydescription) + "</div>";
                                } else {

                                    
                                    if(floorPlanSettings["Hide_exhibitor_Details"] == "Hide_Details" && userloggedinstatus != '1'){
                                        htmlcompanydescription = "";
                                    }else{
                                        
                                        htmlcompanydescription =
                                        "<div >" + unescape(companydescription) + "</div>";
                                    }
                                }

                                if (assignedboothname != "") {
                                    htmlforassignedbooth = ""; //'<h5 ><strong>Assigned Booth(s):</strong>   ' + assignedboothname.replace(/,\s*$/, "") + '</h5>';
                                } else {
                                    htmlforassignedbooth = "";
                                }

                                if (index.address_line_1 != "") {
                                    htmlforaddress =
                                        "<p>" +
                                        index.address_line_1 +
                                        ", " +
                                        index.usercity +
                                        ", " +
                                        index.usercountry +
                                        "</p>";
                                } else {
                                    htmlforaddress = "";
                                }
                                if (companynameas == null || companynameas == "") {
                                    companynameas = "";
                                }
                                if (floorPlanSettings["Hide_exhibitor_Details"] != null && userloggedinstatus != '1') {
                                  
                                    companynameas = "Booth is Purchased";
                                }
                            }
                        });

                        var boothtitle =
                            imagesrc +
                            "<h5 id='boothName' ><strong>Booth Number: </strong>" +
                            assignedboothname +
                            "</h5>";
                        //openhtml = '<div class="maindiv" style="width:100%;min-height: 350px;"><div class="profiledive" style="width:30%;margin-top:6%;float:left;text-align:center"><img width="200" src="' + companylogourlnew + '" /></div><div class="descrpitiondiv" style="float:right;width:68%;margin-bottom: 30px;"><h1 >' + companynameas + '</h1>' + htmlforaddress + '<hr>' + htmlforassignedbooth + '<hr>'+htmlcompanydescription+'</div></div>';
                        var openhtml =
                            '<div class="row" style="margin-bottom: 10px;"><div class="col-sm-11" >' +
                            boothtitle +
                            htmlcompanydescription +
                            "</div></div>";

                        var contactinformation =
                            contactnameHTML + contactphonenumberHTML + contactemailHTML;

                        // console.log(floorPlanSettings["Hide_exhibitor_Details"]);

                        if (
                            contactname == undefined &&
                            contactphonenumber == undefined &&
                            contactemail == undefined
                        ) {
                            var newopenhtml =
                                '<div class="tab"><button id="mainprofile" onclick="toggletabs(this)" class="tablinks" >Main Profile</button></div><div id="mainprofilediv" class="tabcontent" style="margin-bottom: 10px;">' +
                                openhtml +
                                websiteURLhtml +
                                "</div>";
                        } else if (
                            floorPlanSettings["Hide_exhibitor_Details"] == "Hide_Details" && userloggedinstatus != '1'
                        ) {

                   
                            var newopenhtml =
                                '<div class="tab"><button id="mainprofile" onclick="toggletabs(this)" class="tablinks" >Main Profile</button></div><div id="mainprofilediv" class="tabcontent" style="margin-bottom: 10px;">' +
                                openhtml +
                                websiteURLhtml +
                                "</div>";
                        } else {
                           
                            if(userloggedinstatus != "1" && floorPlanSettings["Hide_exhibitor_Details"] == "Hide_Details"){

                                var hiddenStyleClass = 'hideElem';
                                contactinformation = '';
                            }
                            var newopenhtml =
                                '<div class="tab"><button id="mainprofile" onclick="toggletabs(this)" class="tablinks" >Main Profile</button><button id="contacttab" onclick="toggletabs(this)" class="tablinks unactive '+hiddenStyleClass+'" >Contact Information</button></div><div id="mainprofilediv" class="tabcontent" style="margin-bottom: 10px;">' +
                                openhtml +
                                websiteURLhtml +
                                '</div><div  id="contactdiv" class="tabcontent" style="display:none;min-height: 130px;margin-bottom: 10px;">' +
                                contactinformation +
                                "</div>";
                        }

                        jQuery("body").css("cursor", "default");

                        if (popupstatus == "off") {
                            popupstatus = "on";
                            jQuery.confirm({
                                title: '<i class="far fa-id-card"></i> ' + companynameas,
                                content: newopenhtml,
                                confirmButton: false,
                                confirmButtonClass: "mycustomwidth",
                                cancelButton: false,
                                closeIcon: true,
                                columnClass: "jconfirm-box-container-viewerBOx",
                                cancel: function () {
                                    //close
                                    popupstatus = "off";
                                },
                            });

                            jQuery(".closeIcon").each(function () {
                                // console.log("google");
                                jQuery(this)
                                    .children()
                                    .removeClass("glyphicon glyphicon-remove");
                                jQuery(this)
                                    .children()
                                    .addClass("customecloseicon btn btn-small btn-danger");
                                jQuery(this).children().html("Close");
                            });
                        }
                    } else {
                        if (
                            boothproductid != "" &&
                            boothproductid != "undefined" &&
                            boothproductid != "none"
                        ) {
                            var data = new FormData();
                            data.append("pro_id", boothproductid);
                            data.append("floorplanID", mxPostID);
                            // console.log(boothproductid);

                            jQuery.ajax({
                                url:
                                    baseCurrentSiteURl +
                                    "/wp-content/plugins/floorplan/floorplan.php?floorplanRequest=getproductdetail",
                                data: data,
                                cache: false,
                                contentType: false,
                                processData: false,
                                type: "POST",
                                success: function (data) {
                                    // console.log(data);
                                    var finalresultProduct = jQuery.parseJSON(data);
                                    var floorplanstatus = finalresultProduct.floorplanstatus;
                                    var productstatus = finalresultProduct.status;
                                    var boothOwner = finalresultProduct.Booth_Purchaser;
                                    var LevelOfBooth = finalresultProduct.LevelOfBooth;
                                    var PurchaseCount = finalresultProduct.PurchaseCount;
                                    purchCount = PurchaseCount;
                                    var NumberOfReservedBooths =
                                        finalresultProduct.NumberOfReservedBooths;
                                    var buttonsdiv = "";
                                    var totalCount = 0;
                                    var priority = finalresultProduct.priority;
                                    var checkforPurchase = "false";
                                    var cartLimit = finalresultProduct.CartTotal;
                                    var reservedCheck = finalresultProduct.reservedStatus;
                                    var reservedStatus = finalresultProduct.Reserved;
                                    // console.log(finalresultProduct.deposit_enable_type);
                                    // console.log(logInUser["UserLevel"]);
                                    // console.log(NumberOfReservedBooths);
                                    // console.log(PurchaseCount);
                                    if (NumberOfReservedBooths != false) {
                                        totalCount =
                                            NumberOfReservedBooths.length + cartLimit + PurchaseCount;
                                    } else {
                                        totalCount = cartLimit + PurchaseCount;
                                    }
                                    // jQuery.each(logInUser.toLowerCase(),function (key,v) {
                                    //   console.log(key);
                                    //   console.log(v);
                                    // })
                                    if (reservedCheck == "0") {
                                        if (array != "") {
                                            if (jQuery.inArray(boothproductid, array) !== -1) {
                                                // console.log("Availabel");
                                                checkforPurchase = "true";
                                            }
                                        }
                                    }

                                    var htmlforproductdetail = "";
                                    var postid = "'" + boothproductid + "'";
                                    var checkouturl = baseCurrentSiteURl + "/checkout/";
                                  
                                    if (
                                        userloggedinstatus != "1" && 
                                        floorPlanSettings["Hide_Price"] == "Hide_Booth_price" || finalresultProduct.price == 0
                                    ) {

                                        var productprice = '';

                                    }else{     


                                           // console.log('discprice---------'+finalresultProduct.levelbaseddiscountedprice);
                                           if(finalresultProduct.levelbaseddiscountedprice !== -1){


                                                console.log(levelbaseddiscountstatus);

                                              if(levelbaseddiscountstatus == 'disable'){


                                                var productprice =
                                                "<p><h5 ><strong>Price: </strong>" +
                                                finalresultProduct.currencysymbole +
                                                (finalresultProduct.levelbaseddiscountedprice)  +
                                                "</h5></p>";



                                              }else{
   
                                                var productprice =
                                               "<p><h5 ><strong>Price: </strong>" +
                                               finalresultProduct.currencysymbole +
                                               finalresultProduct.levelbaseddiscountedprice +
                                               "</h5>";

                                              }

                                           }else{
   
                                               var productprice =
                                                   "<p><h5 ><strong>Price: </strong>" +
                                                   finalresultProduct.currencysymbole +
                                                   finalresultProduct.price +
                                                   "</h5>";
                                           }
                                      
                                    } 

                                    var boothtitle =
                                        "<h5 id='boothName'><strong>Booth Number: </strong>" +
                                        assignedboothname +
                                        "</h5>";

                                    if (finalresultProduct.description == null) {
                                        finalresultProduct.description = "";
                                    }

                                    var productDescription =
                                        "<h6 >" +
                                        unescape(finalresultProduct.description) +
                                        "</h6>";

                                    var productICon =
                                        "<p style='float:right;margin-top: 10px;'><img width='125' src='" +
                                        finalresultProduct.src +
                                        "'></p>";

                                    htmlforproductdetail +=
                                        "<div class='row'><div class='col-sm-6'><h2>" +
                                        finalresultProduct.title +
                                        "</h2><p><strong>Price : " +
                                        finalresultProduct.price +
                                        "</strong></p></div><div class='col-sm-3'><p style='text-align:center;margin-top: 25px;'><img width='100' src='" +
                                        finalresultProduct.src +
                                        "'></p></div></div>";

                                    //}else{
                                    // htmlforproductdetail += "<div class='row'><div class='col-sm-6'><h2>"+finalresultProduct.title+"</h2></div><div class='col-sm-3'><p style='text-align:center;margin-top: 25px;'><img width='100' src='"+finalresultProduct.src+"'></p></div></div>";

                                    // }
                                    htmlforproductdetail +=
                                        "<p>" +
                                        unescape(finalresultProduct.description) +
                                        "</p><hr>";
                                    if (
                                        companydescription != "" &&
                                        typeof companydescription !== "undefined"
                                    ) {
                                        htmlcompanydescription =
                                            "<h6 ><div >" +
                                            unescape(companydescription) +
                                            "</div></h6>";
                                    }
                                    if (finalresultProduct.stockstatus == "instock") {
                                        if (userloggedinstatus == true) {
                                            if (productstatus == "alreadyexistproduct") {
                                                htmlforproductdetail +=
                                                    '<p  id="' +
                                                    boothproductid +
                                                    '"><a class="btn btn-success btn-small" >Added</a></p>';
                                            } else {
                                                if (
                                                    finalresultProduct.deposit_enable_type == "optional"
                                                ) {
                                                    if (
                                                        floorPlanSettings["tableSort"] == "checked" &&
                                                        parseInt(logInUser["priorityNum"]) <= TurnUsers &&
                                                        logInUser["status"] &&
                                                        logInUser["status"][0] == "checked" &&
                                                        (userlimit == undefined ||
                                                            userlimit == "" ||
                                                            totalCount < parseInt(userlimit) ||
                                                            (reservedStatus &&
                                                                reservedStatus == logInUser["ID"])) &&
                                                        (reservedStatus == "" ||
                                                            reservedStatus == logInUser["ID"])
                                                    ) {
                                                        if (
                                                            ((reservedStatus && reservedStatus == "") ||
                                                                reservedStatus == "" ||
                                                                reservedStatus == logInUser["ID"]) &&
                                                            (jQuery.inArray(
                                                                    logInUser["ID"].toString(),
                                                                    boothOwner
                                                                ) != -1 ||
                                                                boothOwner == "" ||
                                                                jQuery.inArray(
                                                                    logInUser["UserLevel"],
                                                                    LevelOfBooth[0]
                                                                ) != -1 || jQuery.inArray(
                                                                    logInUser["UserLevel"],
                                                                    LevelOfBooth
                                                                ) != -1) &&
                                                            (LevelOfBooth == "" ||
                                                                LevelOfBooth[0] == "" ||
                                                                jQuery.inArray(
                                                                    logInUser["UserLevel"],
                                                                    LevelOfBooth[0]
                                                                ) != -1 || jQuery.inArray(
                                                                    logInUser["UserLevel"],
                                                                    LevelOfBooth
                                                                ) != -1)
                                                                || ( (logInUser["UserLevel"] == 'subscriber') &&  (LevelOfBooth[0] == 'unassigned') )

                                                        ) {
                                                            htmlforproductdetail =
                                                                '<p  id="' +
                                                                boothproductid +
                                                                '"><div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Add To Cart</button><div class="dropdown-menu" ><a class="dropdown-item" onclick="addToCart(' +
                                                                postid +
                                                                ",'log' ,'deposit'," +
                                                                finalresultProduct.slug +
                                                                ')">Pay Deposit</a><a class="dropdown-item" onclick="addToCart(' +
                                                                postid +
                                                                ",'log' ,'full'," +
                                                                finalresultProduct.slug +
                                                                ')">Pay in Full</a></div></div></p>';
                                                        }
                                                        if (reservedCheck == "0" && reservedStatus == "") {
                                                            // console.log("In resereved");
                                                            buttonsdiv +=
                                                                "<div class='col-sm-4 R' id=" +
                                                                postid +
                                                                ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="ReservedTheBooth(' +
                                                                postid +
                                                                ",'log','full'," +
                                                                finalresultProduct.slug +
                                                                ')"  >Reserve The Booth</a></div>';
                                                        }
                                                    }
                                                } else {
                                                    htmlforproductdetail +=
                                                        '<p  id="' +
                                                        boothproductid +
                                                        '"><a class="btn btn-small btn-info myspecialbuttoncustomwidth"  onclick="addToCart(' +
                                                        postid +
                                                        ",'log','full'," +
                                                        finalresultProduct.slug +
                                                        ')"  >Add To Cart</a></p>';
                                                }
                                            }
                                        } else {
                                            if (
                                                finalresultProduct.deposit_enable_type == "optional"
                                            ) {
                                                //htmlforproductdetail += '<p  id="'+boothproductid+'"></p>';
                                                htmlforproductdetail =
                                                    '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                                    postid +
                                                    ' style="text-align: center;"><div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Add To Cart</button><div class="dropdown-menu" ><a class="dropdown-item" onclick="addToCart(' +
                                                    postid +
                                                    ",'log' ,'deposit'," +
                                                    finalresultProduct.slug +
                                                    ')">Pay Deposit</a><a class="dropdown-item" onclick="addToCart(' +
                                                    postid +
                                                    ",'log' ,'full'," +
                                                    finalresultProduct.slug +
                                                    ')">Pay in Full</a></div></div></div></div>';
                                            } else {
                                                //htmlforproductdetail += '<p  id="'+boothproductid+'"><a class="btn btn-small btn-info myspecialbuttoncustomwidth"  onclick="addToCart('+postid+',\'woo\')"  >Purchase Now</a></p>';
                                                htmlforproductdetail =
                                                    '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                                    postid +
                                                    ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                                    postid +
                                                    ",'log','full'," +
                                                    finalresultProduct.slug +
                                                    ')"  >Add To Cart</a></div></div>';
                                            }
                                        }
                                    } else {
                                        htmlforproductdetail +=
                                            "<p style='float:right;'><strong style='color:red'>Stock Out</strong></p>";
                                    }
                                    //arham
                                    if (finalresultProduct.productstatus == "exist" || boothOwner.includes(logInUser["ID"].toString())) {
                                      //if(userloggedinstatus == true){

                                        var openhtml =
                                            '<div class="row customedivproductview" style="margin-bottom: 25px;"><div class="col-sm-8" >' +
                                            productprice +
                                            "" +
                                            boothtitle +
                                            productDescription +
                                            '</div><div class="col-sm-2">' +
                                            productICon +
                                            "</div></div>";

                                        //}else{

                                        //  var openhtml = '<div class="row customedivproductview" style="margin-bottom: 25px;"><div class="col-sm-8" >'+boothtitle+productDescription+'</div><div class="col-sm-2">'+productICon+'</div></div>';
                                        //}

                                        var popupstatustitle = "Available for Purchase";
                                        if (reservedStatus != "") {
                                            var popupstatustitle = "Booth is Reserved";
                                        }
                                    } else {
                                        var openhtml =
                                            '<div class="row customedivproductview" style="margin-bottom: 25px;"><div class="col-sm-11" >' +
                                            productprice +
                                            boothtitle +
                                            htmlcompanydescription +
                                            "</div></div>";
                                        if (userlimit != PurchaseCount) {
                                            popupstatustitle = "Available for Purchase";
                                        } else {

                                            if (boothOwner.includes(logInUser["ID"].toString())) {

                                                var popupstatustitle = "Available for Purchase";
                                            }else{

                                                popupstatustitle = "Unavailable for Purchase";
                                            }
                                        }
                                    }

                                    //  var openhtml = '<div class="row" style="padding:30px;" ><div class="col-sm-5">'+imagesrc+''+htmlforaddress+''+htmlforassignedbooth+'<hr>'+htmlcompanydescription+'</div><div class="col-sm-5">'+htmlforproductdetail+'</div></div>';

                                    //if(userloggedinstatus == true){       
                                    //arham                                 
                                    if (finalresultProduct.productstatus == "exist") {
                                        // console.log("Qsaim00001");
                                        if (floorplanstatus == "unlock") {
                                            // console.log("Qsaim0001");
                                            if (finalresultProduct.stockstatus == "instock") {
                                                // console.log("Qsaim001");
                                                if (
                                                    mxUserentryflow == "checked" &&
                                                    mxCurrentPackageBooths.length !== 0
                                                ) {

                                                    // console.log("Qsaim1");
                                                    if (
                                                        jQuery.inArray(boothID, mxCurrentPackageBooths) !==
                                                        -1
                                                    ) {
                                                        // console.log("Qsaim2");
                                                        if (userloggedinstatus == true) {
                                                            // console.log("Qsaim3");
                                                            if (
                                                                productstatus == "alreadyexistproduct" &&
                                                                reservedStatus == ""
                                                            ) {
                                                                // console.log("Qsaim4");
                                                                buttonsdiv =
                                                                    '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                                                    postid +
                                                                    ' style="text-align: center;"><a class="btn btn-success btn-small" >Added</a><p style="font-size: 14px;margin-top: 10px;color: #005e00;"><b>This booth is included in your package. The price of this booth will be updated to $0 during checkout</b></p></div></div>';
                                                            } else {
                                                                //if (finalresultProduct.deposit_enable_type == 'optional') {

                                                                //buttonsdiv = '<p  id="' + boothproductid + '"><div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Add To Cart</button><div class="dropdown-menu" ><a class="dropdown-item" onclick="addToCart(' + postid + ',\'log\' ,\'deposit\',' + finalresultProduct.slug + ')">Pay Deposit</a><a class="dropdown-item" onclick="addToCart(' + postid + ',\'log\' ,\'full\',' + finalresultProduct.slug + ')">Pay in Full</a></div></div><p style="font-size: 11px;margin-top: 10px;color: #005e00;">This Booth is included in current selected package.</p></p>'

                                                                //} else {
                                                                // console.log("Qsaim5");

                                                                if (
                                                                    flowstatus.indexOf("mood=wizard") != -1 &&
                                                                    reservedStatus == ""
                                                                ) {

                                                                    // console.log("Qsaim6");
                                                                    buttonsdiv =
                                                                        '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                                                        postid +
                                                                        ' style="text-align: center;"><a class="btn btn-small btn-info myspecialbuttoncustomwidth"  onclick="addToCart(' +
                                                                        postid +
                                                                        ",'log','full'," +
                                                                        finalresultProduct.slug +
                                                                        ')"  >Add To Cart</a><p style="font-size: 14px;margin-top: 10px;color: #005e00;"><b>This booth is included in your package. The price of this booth will be updated to $0 during checkout.</b></p></div></div>';
                                                                } else {
                                                                    // console.log("Qsaim7");
                                                                    buttonsdiv = "";
                                                                }
                                                                //}
                                                            }
                                                        } else {
                                                            // console.log("Qsaim8");
                                                            if (flowstatus.indexOf("mood=wizard") != -1) {
                                                                // console.log("Qsaim9");
                                                                if (
                                                                    productstatus == "alreadyexistproduct" &&
                                                                    reservedStatus == ""
                                                                ) {

                                                                    // console.log("Qsaim10");
                                                                    buttonsdiv =
                                                                        '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                                                        postid +
                                                                        ' style="text-align: center;"><a class="btn btn-success btn-small" >Added</a><p style="font-size: 14px;margin-top: 10px;color: #005e00;"><b>This booth is included in your package. The price of this booth will be updated to $0 during checkout.</b></p></div></div>';
                                                                } else if (reservedStatus == "") {
                                                                    // console.log("Qsaim11");
                                                                    buttonsdiv =
                                                                        '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                                                        postid +
                                                                        ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                                                        postid +
                                                                        ",'log','full'," +
                                                                        finalresultProduct.slug +
                                                                        ')"  >Add To Cart</a><p style="font-size: 14px;margin-top: 10px;color: #005e00;"><b>This booth is included in your package. The price of this booth will be updated to $0 during checkout.</b></p></div></div>';
                                                                }
                                                            } else {
                                                                // console.log("Qsaim12");
                                                                buttonsdiv = "";
                                                            }
                                                        }
                                                    } else {
                                                        // console.log("Qsaim13");
                                                        if (
                                                            finalresultProduct.deposit_enable_type ==
                                                            "optional" &&
                                                            reservedStatus == ""
                                                        ) {
                                                            // console.log("Qsaim14");
                                                            //htmlforproductdetail += '<p  id="'+boothproductid+'"></p>';
                                                            buttonsdiv =
                                                                '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                                                postid +
                                                                ' style="text-align: center;"><div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Add To Cart</button><div class="dropdown-menu" ><a class="dropdown-item" onclick="addToCart(' +
                                                                postid +
                                                                ",'log' ,'deposit'," +
                                                                finalresultProduct.slug +
                                                                ')">Pay Deposit</a><a class="dropdown-item" onclick="addToCart(' +
                                                                postid +
                                                                ",'log' ,'full'," +
                                                                finalresultProduct.slug +
                                                                ')">Pay in Full</a></div></div></div></div>';
                                                        } else {

                                                            // console.log("Qsaim15");
                                                            //htmlforproductdetail += '<p  id="'+boothproductid+'"><a class="btn btn-small btn-info myspecialbuttoncustomwidth"  onclick="addToCart('+postid+',\'woo\')"  >Purchase Now</a></p>';
                                                            //---------------------------Add To cart of First Time---------------------------//
                                                            //---------------------------Code By Abdullah EXHIBITOR ENTRY FLOW------------------------------------//
                                                            if (
                                                                floorPlanSettings["tableSort"] == "checked" &&
                                                                parseInt(logInUser["priorityNum"]) <=
                                                                TurnUsers &&
                                                                logInUser["status"] &&
                                                                logInUser["status"][0] == "checked" &&
                                                                ((userlimit != undefined &&
                                                                        (userlimit == "" ||
                                                                            totalCount < parseInt(userlimit))) ||
                                                                    (reservedStatus &&
                                                                        reservedStatus == logInUser["ID"]))
                                                            ) {

                                                                // console.log("Qsaim16");
                                                                if (
                                                                    (reservedStatus == "" ||
                                                                        reservedStatus == logInUser["ID"]) &&
                                                                    (boothOwner == logInUser["ID"] ||
                                                                        boothOwner == "") &&
                                                                    (LevelOfBooth[0] == logInUser["UserLevel"] ||
                                                                        LevelOfBooth[0] == "")
                                                                      || ( (logInUser["UserLevel"] == 'subscriber') &&  (LevelOfBooth[0] == 'unassigned') )
                                                                ) {

                                                                    // console.log("Qsaim17");
                                                                    buttonsdiv =
                                                                        '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;display: flex;"><div class="col-sm-12" id=' +
                                                                        postid +
                                                                        ' style="text-align: center;display: flex;justify-content: space-evenly;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                                                        postid +
                                                                        ",'log','full'," +
                                                                        finalresultProduct.slug +
                                                                        ')"  >Add To Cart</a></div>';

                                                                    if (
                                                                        reservedCheck == "0" &&
                                                                        reservedStatus == ""
                                                                    ) {

                                                                        // console.log("Qsaim17");
                                                                        // console.log("In resereved");
                                                                        buttonsdiv +=
                                                                            "<div class='col-sm-12' id=" +
                                                                            postid +
                                                                            ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="ReservedTheBooth(' +
                                                                            postid +
                                                                            ",'log','full'," +
                                                                            finalresultProduct.slug +
                                                                            ')"  >Reserve The Booth</a></div>';
                                                                    }
                                                                } else {
                                                                    // console.log("Qsaim18");
                                                                    buttonsdiv = "";
                                                                }
                                                            } else if (
                                                                floorPlanSettings["tableSort"] != "checked"
                                                            ) {

                                                                // console.log("Qsaim19");
                                                                if (
                                                                    (userlimit == undefined ||
                                                                        userlimit == "" ||
                                                                        totalCount < parseInt(userlimit) ||
                                                                        (reservedStatus &&
                                                                            reservedStatus == logInUser["ID"])) &&
                                                                    (reservedStatus == "" ||
                                                                        reservedStatus == logInUser["ID"]) &&
                                                                    (jQuery.inArray(
                                                                            logInUser["ID"].toString(),
                                                                            boothOwner
                                                                        ) == 0 ||
                                                                        boothOwner == "" ||
                                                                        jQuery.inArray(
                                                                            logInUser["UserLevel"],
                                                                            LevelOfBooth[0]
                                                                        ) == 0 || jQuery.inArray(
                                                                            logInUser["UserLevel"],
                                                                            LevelOfBooth
                                                                        ) == 0) &&
                                                                    (LevelOfBooth == "" ||
                                                                        jQuery.inArray(
                                                                            logInUser["UserLevel"],
                                                                            LevelOfBooth[0]
                                                                        ) == 0 || jQuery.inArray(
                                                                            logInUser["UserLevel"],
                                                                            LevelOfBooth
                                                                        ) == 0)
                                                                        || ( (logInUser["UserLevel"] == 'subscriber') &&  (LevelOfBooth[0] == 'unassigned') )

                                                                ) {

                                                                    // console.log("Qsaim20");
                                                                    buttonsdiv =
                                                                        '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;display:flex;"><div class="col-sm-12" id=' +
                                                                        postid +
                                                                        ' style="text-align: center;display: flex;justify-content: space-evenly;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                                                        postid +
                                                                        ",'log','full'," +
                                                                        finalresultProduct.slug +
                                                                        ')"  >Add To Cart</a></div>';

                                                                    if (
                                                                        reservedCheck == "0" &&
                                                                        reservedStatus == "" &&
                                                                        userloggedinstatus == true
                                                                    ) {
                                                                        // console.log("Qsaim21");
                                                                        // console.log("In resereved");
                                                                        buttonsdiv +=
                                                                            "<div class='col-sm-4' id=" +
                                                                            postid +
                                                                            ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="ReservedTheBooth(' +
                                                                            postid +
                                                                            ",'log','full'," +
                                                                            finalresultProduct.slug +
                                                                            ')"  >Reserve The Booth</a></div>';
                                                                    }
                                                                } else if (priority == 'true') {


                                                                    buttonsdiv =
                                                                        '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;display:flex;"><div class="col-sm-12" id=' +
                                                                        postid +
                                                                        ' style="text-align: center;display: flex;justify-content: space-evenly;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                                                        postid +
                                                                        ",'log','full'," +
                                                                        finalresultProduct.slug +
                                                                        ')"  >Add To Cart</a></div>';


                                                                } else {
                                                                    buttonsdiv = "";
                                                                }
                                                            }
                                                        }
                                                    }
                                                    //---------------------------Code By Abdullah------------------------------------//
                                                } else {
                                                    // console.log("Qsaim22");
                                                    if (userloggedinstatus == true && priority == "false") {

                                                        if (productstatus == "alreadyexistproduct") {
                                                            // console.log("Qsaim23");
                                                            buttonsdiv =
                                                                '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div style="text-align: center;display: flex;justify-content: space-evenly;" class="col-sm-12" id=' +
                                                                postid +
                                                                '><a class="btn btn-danger btn-small" onclick="removeFromCart(' +
                                                                postid +
                                                                ')">Remove</a></div><div class="col-sm-4 hideElem" ><a class="btn btn-small btn-info "   href="' +
                                                                baseCurrentSiteURl +
                                                                '/product-category/add-ons/" target="_blank" >View Add-Ons</a></div><div class="col-sm-2 hideElem" ><a '+disableStyle+' class="btn btn-small btn-info " id="' +
                                                                boothproductid +
                                                                '_checkout" href="' +
                                                                checkouturl +
                                                                '" target="_parent"  >Check Out</a></div></div>';
                                                        } else {
                                                            if (
                                                                finalresultProduct.deposit_enable_type ==
                                                                "optional"
                                                            ) {

                                                                // console.log("Qsaim24");
                                                                if (
                                                                    floorPlanSettings["tableSort"] == "checked" &&
                                                                    parseInt(logInUser["priorityNum"]) <=
                                                                    TurnUsers &&
                                                                    logInUser["status"] &&
                                                                    logInUser["status"][0] == "checked" &&
                                                                    ((userlimit != undefined &&
                                                                            (userlimit == "" ||
                                                                                totalCount < parseInt(userlimit))) ||
                                                                        (reservedStatus &&
                                                                            reservedStatus == logInUser["ID"]))
                                                                ) {
                                                                    // console.log("Qsaim25");
                                                                    //arham
                                                                    if (
                                                                        (reservedStatus == "" ||
                                                                            reservedStatus == logInUser["ID"]) &&
                                                                        (boothOwner == logInUser["ID"] ||
                                                                            boothOwner == "") &&
                                                                        (LevelOfBooth[0] == logInUser["UserLevel"] ||
                                                                            LevelOfBooth[0] == "")
                                                                        || ( (logInUser["UserLevel"] == 'subscriber') &&  (LevelOfBooth[0] == 'unassigned') )   
                                                                    ) {
                                                                        // console.log("Qsaim26");
                                                                        buttonsdiv =
                                                                            '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;    display: flex;"><div style="text-align: center;display: flex;justify-content: space-evenly;" class="col-sm-12" id=' +
                                                                            postid +
                                                                            '><div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Add To Cart</button><div class="dropdown-menu" ><a class="dropdown-item" onclick="addToCart(' +
                                                                            postid +
                                                                            ",'log' ,'deposit'," +
                                                                            finalresultProduct.slug +
                                                                            ')">Pay Deposit</a><a class="dropdown-item" onclick="addToCart(' +
                                                                            postid +
                                                                            ",'log' ,'full'," +
                                                                            finalresultProduct.slug +
                                                                            ')">Pay in Full</a></div></div></div><div class="col-sm-4 hideElem" ><a class="btn btn-small btn-info "  href="' +
                                                                            baseCurrentSiteURl +
                                                                            '/product-category/add-ons/" target="_blank" >View Add-Ons</a></div><div class="col-sm-2 hideElem" ><a '+disableStyle+' class="btn btn-small btn-info " id="' +
                                                                            boothproductid +
                                                                            '_checkout" href="' +
                                                                            checkouturl +
                                                                            '" target="_parent" disabled="true" >Check Out</a></div>';
                                                                    }

                                                                    if (
                                                                        reservedCheck == "0" &&
                                                                        reservedStatus == ""
                                                                    ) {
                                                                        // console.log("In resereved");
                                                                        // console.log("Qsaim27");
                                                                        buttonsdiv +=
                                                                            "<div class='col-sm-4 R' id=" +
                                                                            postid +
                                                                            ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="ReservedTheBooth(' +
                                                                            postid +
                                                                            ",'log','full'," +
                                                                            finalresultProduct.slug +
                                                                            ')"  >Reserve The Booth</a></div>';
                                                                    }
                                                                } else if (
                                                                    floorPlanSettings["tableSort"] != "checked"
                                                                ) {
                                                                    //For Reservation for Specific Level////
                                                                    if (
                                                                        (userlimit == undefined ||
                                                                            userlimit == "" ||
                                                                            totalCount < parseInt(userlimit) ||
                                                                            (reservedStatus &&
                                                                                reservedStatus == logInUser["ID"])) &&
                                                                        (reservedStatus == "" ||
                                                                            reservedStatus == logInUser["ID"]) &&
                                                                        (jQuery.inArray(
                                                                                logInUser["ID"].toString(),
                                                                                boothOwner
                                                                            ) != -1 ||
                                                                            boothOwner == "" ||
                                                                            jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth[0]
                                                                            ) != -1 || jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth
                                                                            ) != -1) &&
                                                                        (LevelOfBooth == "" ||
                                                                            LevelOfBooth[0] == "" ||
                                                                            jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth[0]
                                                                            ) != -1 || jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth
                                                                            ) != -1)
                                                                            || ( (logInUser["UserLevel"] == 'subscriber') &&  (LevelOfBooth[0] == 'unassigned') )


                                                                    ) {
                                                                        // console.log("Qsaim28");
                                                                        buttonsdiv =
                                                                            '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;display: flex;"><div style="text-align: center;display: flex;justify-content: space-evenly;" class="col-sm-12" id=' +
                                                                            postid +
                                                                            '><div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Add To Cart</button><div class="dropdown-menu" ><a class="dropdown-item" onclick="addToCart(' +
                                                                            postid +
                                                                            ",'log' ,'deposit'," +
                                                                            finalresultProduct.slug +
                                                                            ')">Pay Deposit</a><a class="dropdown-item" onclick="addToCart(' +
                                                                            postid +
                                                                            ",'log' ,'full'," +
                                                                            finalresultProduct.slug +
                                                                            ')">Pay in Full</a></div></div></div><div class="col-sm-4 hideElem" ><a class="btn btn-small btn-info "  href="' +
                                                                            baseCurrentSiteURl +
                                                                            '/product-category/add-ons/" target="_blank" >View Add-Ons</a></div><div class="col-sm-2 hideElem" ><a '+disableStyle+' class="btn btn-small btn-info " id="' +
                                                                            boothproductid +
                                                                            '_checkout" href="' +
                                                                            checkouturl +
                                                                            '" target="_parent" disabled="true" >Check Out</a></div>';
                                                                    }

                                                                    if (
                                                                        reservedCheck == "0" &&
                                                                        reservedStatus == ""
                                                                    ) {
                                                                        // console.log("In resereved");
                                                                        // console.log("Qsaim29");
                                                                        buttonsdiv +=
                                                                            "<div class='col-sm-4 R' id=" +
                                                                            postid +
                                                                            ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="ReservedTheBooth(' +
                                                                            postid +
                                                                            ",'log','full'," +
                                                                            finalresultProduct.slug +
                                                                            ')"  >Reserve The Booth</a></div>';
                                                                    }
                                                                }
                                                            } else {
                                                                //htmlforproductdetail += '<p  id="'+boothproductid+'"><a class="btn btn-small btn-info myspecialbuttoncustomwidth"  onclick="addToCart('+postid+',\'woo\')"  >Purchase Now</a></p>';
                                                                //---------------------------Add To cart of First Time---------------------------//
                                                                //
                                                                //
                                                                //---------------------------Code By Abdullah------------------------------------//
                                                                if (
                                                                    floorPlanSettings["tableSort"] == "checked" &&
                                                                    parseInt(logInUser["priorityNum"]) <=
                                                                    TurnUsers &&
                                                                    logInUser["status"] &&
                                                                    logInUser["status"][0] == "checked" &&
                                                                    (userlimit == undefined ||
                                                                        userlimit == "" ||
                                                                        totalCount < parseInt(userlimit) ||
                                                                        (reservedStatus &&
                                                                            reservedStatus == logInUser["ID"])) &&
                                                                    (reservedStatus == "" ||
                                                                        reservedStatus == logInUser["ID"])
                                                                ) {
                                                                    if (
                                                                        ((reservedStatus && reservedStatus == "") ||
                                                                            reservedStatus == "" ||
                                                                            reservedStatus == logInUser["ID"]) &&
                                                                        (jQuery.inArray(
                                                                                logInUser["ID"].toString(),
                                                                                boothOwner
                                                                            ) != -1 ||
                                                                            boothOwner == "" ||
                                                                            jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth[0]
                                                                            ) != -1 || jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth
                                                                            ) != -1) &&
                                                                        (LevelOfBooth == "" ||
                                                                            LevelOfBooth[0] == "" ||
                                                                            jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth[0]
                                                                            ) != -1 || jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth
                                                                            ) != -1)
                                                                            || ( (logInUser["UserLevel"] == 'subscriber') &&  (LevelOfBooth[0] == 'unassigned') )

                                                                    ) {

                                                                        // console.log("Qsaim29");
                                                                        buttonsdiv =
                                                                            '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;display: flex;"><div class="col-sm-12" id=' +
                                                                            postid +
                                                                            ' style="text-align: center;display: flex;justify-content: space-evenly;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                                                            postid +
                                                                            ",'log','full'," +
                                                                            finalresultProduct.slug +
                                                                            ')"  >Add To Cart</a></div><div class="col-sm-4 hideElem" ><a class="btn btn-small btn-info "   href="' +
                                                                            baseCurrentSiteURl +
                                                                            '/product-category/add-ons/" target="_blank" >View Add-Ons</a></div><div class="col-sm-2 hideElem" ><a '+disableStyle+' class="btn btn-small btn-info " id="' +
                                                                            boothproductid +
                                                                            '_checkout" href="' +
                                                                            checkouturl +
                                                                            '" target="_parent"  >Check Out</a></div>';

                                                                        if (
                                                                            reservedCheck == "0" &&
                                                                            reservedStatus == ""
                                                                        ) {
                                                                            // console.log("In resereved");
                                                                            // console.log("Qsaim30");
                                                                            buttonsdiv +=
                                                                                "<div class='col-sm-4 R' id=" +
                                                                                postid +
                                                                                ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="ReservedTheBooth(' +
                                                                                postid +
                                                                                ",'log','full'," +
                                                                                finalresultProduct.slug +
                                                                                ')"  >Reserve The Booth</a></div>';
                                                                        }
                                                                    } else {
                                                                        buttonsdiv = "";
                                                                    }
                                                                } else if (
                                                                    floorPlanSettings["tableSort"] != "checked"
                                                                ) {
                                                                    //For Reservation for Specific Level////
                                                                    if (
                                                                        (userlimit == undefined ||
                                                                            userlimit == "" ||
                                                                            totalCount < parseInt(userlimit) ||
                                                                            (reservedStatus &&
                                                                                reservedStatus == logInUser["ID"])) &&
                                                                        (reservedStatus == "" ||
                                                                            reservedStatus == logInUser["ID"]) &&
                                                                        (jQuery.inArray(
                                                                                logInUser["ID"].toString(),
                                                                                boothOwner
                                                                            ) != -1 ||
                                                                            boothOwner == "" ||
                                                                            jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth[0]
                                                                            ) != -1 || jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth
                                                                            ) != -1) &&
                                                                        (LevelOfBooth == "" ||
                                                                            LevelOfBooth[0] == "" ||
                                                                            jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth[0]
                                                                            ) != -1 || jQuery.inArray(
                                                                                logInUser["UserLevel"],
                                                                                LevelOfBooth
                                                                            ) != -1)
                                                                            || ( (logInUser["UserLevel"] == 'subscriber') &&  (LevelOfBooth[0] == 'unassigned') )

                                                                    ) {
                                                                        // console.log("Qsaim30");
                                                                        buttonsdiv =
                                                                            '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;display: flex;"><div class="col-sm-12" id=' +
                                                                            postid +
                                                                            ' style="text-align: center;display: flex;justify-content: space-evenly;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                                                            postid +
                                                                            ",'log','full'," +
                                                                            finalresultProduct.slug +
                                                                            ')"  >Add To Cart</a></div><div class="col-sm-4 hideElem" ><a class="btn btn-small btn-info "   href="' +
                                                                            baseCurrentSiteURl +
                                                                            '/product-category/add-ons/" target="_blank" >View Add-Ons</a></div><div class="col-sm-2 hideElem" ><a '+disableStyle+' class="btn btn-small btn-info " id="' +
                                                                            boothproductid +
                                                                            '_checkout" href="' +
                                                                            checkouturl +
                                                                            '" target="_parent"  >Check Out</a></div>';

                                                                        if (
                                                                            reservedCheck == "0" &&
                                                                            reservedStatus == ""
                                                                        ) {
                                                                            // console.log("In resereved");
                                                                            buttonsdiv +=
                                                                                "<div class='col-sm-4 R' id=" +
                                                                                postid +
                                                                                ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="ReservedTheBooth(' +
                                                                                postid +
                                                                                ",'log','full'," +
                                                                                finalresultProduct.slug +
                                                                                ')"  >Reserve The Booth</a></div>';
                                                                        }
                                                                    } else {
                                                                        buttonsdiv = "";
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        //---------------------------Code By Abdullah------------------------------------//
                                                    } else {
                                                        //buttonsdiv = '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id='+postid+' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="addToCart('+postid+',\'woo\')"  >Purchase Now</a></div></div>'
                                                        if (flowstatus.indexOf("mood=wizard") != -1) {
                                                            if (
                                                                finalresultProduct.deposit_enable_type ==
                                                                "optional"
                                                            ) {
                                                                //htmlforproductdetail += '<p  id="'+boothproductid+'"></p>';
                                                                // console.log("Qsaim100");
                                                                buttonsdiv =
                                                                    '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                                                    postid +
                                                                    ' style="text-align: center;"><div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Add To Cart</button><div class="dropdown-menu" ><a class="dropdown-item" onclick="addToCart(' +
                                                                    postid +
                                                                    ",'log' ,'deposit'," +
                                                                    finalresultProduct.slug +
                                                                    ')">Pay Deposit</a><a class="dropdown-item" onclick="addToCart(' +
                                                                    postid +
                                                                    ",'log' ,'full'," +
                                                                    finalresultProduct.slug +
                                                                    ')">Pay in Full</a></div></div></div></div>';
                                                            } else if (
                                                                productstatus == "alreadyexistproduct"
                                                            ) {
                                                                // console.log("Qsaim101");
                                                                buttonsdiv =
                                                                    '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;text-align: center;"><div class="col-sm-12" id=' +
                                                                    postid +
                                                                    '><a class="btn btn-danger btn-small"  onclick="removeFromCart(' +
                                                                    postid +
                                                                    ')">Remove</a></div></div>';
                                                            } else {
                                                                //htmlforproductdetail += '<p  id="'+boothproductid+'"><a class="btn btn-small btn-info myspecialbuttoncustomwidth"  onclick="addToCart('+postid+',\'woo\')"  >Purchase Now</a></p>';
                                                                if (((userlimit <= PurchaseCount && userlimit != '') && PurchaseCount != 0) && (userloggedinstatus == "1")) {
                                          
                                                                } else {

                                                                    if (
                                                                        reservedCheck == "0" &&
                                                                        reservedStatus == ""
                                                                    ) {
                                                                        console.log("In resereved");
                                                                        // console.log("Qsaim30");

                                                                        buttonsdiv =
                                                                                '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-6" id=' +
                                                                                postid +
                                                                                ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                                                                postid +
                                                                                ",'log','full'," +
                                                                                finalresultProduct.slug +
                                                                                ')"  >Add To Cart</a></div>'+
                                                                            
                                                                                '<div class="col-sm-4" id=' +
                                                                                postid +
                                                                                ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="ReservedTheBooth(' +
                                                                                postid +
                                                                                ",'log','full'," +
                                                                                finalresultProduct.slug +
                                                                                ')"  >Reserve The Booth</a></div>'+
                                                                                '</div>';

                                                                       

                                                                    }else if(NumberOfReservedBooths != false && reservedStatus == logInUser["ID"]){

                                                                        buttonsdiv =
                                                                                '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                                                                postid +
                                                                                ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                                                                postid +
                                                                                ",'log','full'," +
                                                                                finalresultProduct.slug +
                                                                                ')"  >Add To Cart</a></div></div>';
                                                                    }else{

                                                                        if(reservedStatus != ""){

                                                                        }else{
                                                                            if(boothOwner.includes(logInUser["ID"].toString()) || Array.isArray(LevelOfBooth)){

                                                                                buttonsdiv =
                                                                                    '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                                                                    postid +
                                                                                    ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                                                                    postid +
                                                                                    ",'log','full'," +
                                                                                    finalresultProduct.slug +
                                                                                    ')"  >Add To Cart</a></div></div>';
                                                                            }else{

                                                                            }
                                                                            // console.log('Arham');
                                                                        }

                                                                       
                                                                        // console.log("Qsaim102");
                                                                    }

                                                               
                                                                }
                                                            }
                                                        } else {
                                                            // console.log("Qsaim103");
                                                            buttonsdiv = "";
                                                        }
                                                    }
                                                }
                                            } else {
                                                // console.log("Qsaim105");
                                                buttonsdiv =
                                                    '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><p style="text-align:center;"><strong style="color:red">No Longer Available </strong></p></div>';
                                            }
                                        } else {
                                            // console.log("Qsaim106");
                                            buttonsdiv =
                                                '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><p style="text-align:center;color:red;"><strong>Floorplan is currently being edited, please try again later.</strong></p><div>';
                                        }
                                    } else {


                                        // console.log("Qsaim107");
                                        //  console.log(LevelOfBooth);
                                        //  console.log(logInUser["UserLevel"]);
                                        // console.log(parseInt(logInUser["priorityNum"]) + ' <= ' + TurnUsers);
                                       

                                        if ((logInUser["status"] != "") && (userlimit != PurchaseCount) && (jQuery.inArray(logInUser["UserLevel"], LevelOfBooth[0]) != -1 || jQuery.inArray(logInUser["UserLevel"], LevelOfBooth) != -1 || jQuery.inArray("", LevelOfBooth) != -1) && (parseInt(logInUser["priorityNum"]) <= TurnUsers)) {
                                           
                                            buttonsdiv =
                                                '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                                postid +
                                                ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                                postid +
                                                ",'log','full'," +
                                                finalresultProduct.slug +
                                                ')"  >Add To Cart</a></div></div>';

                                        }else if (boothOwner.includes(logInUser["ID"].toString())) {

                                            buttonsdiv =
                                              '<div class="row footerdivfloorplan" style="margin-bottom: 25px;background: #fff;"><div class="col-sm-12" id=' +
                                              postid +
                                              ' style="text-align: center;"><a class="btn btn-small btn-info "  onclick="addToCart(' +
                                              postid +
                                              ",'log','full'," +
                                              finalresultProduct.slug +
                                              ')"  >Add To Cart</a></div></div>';
                      
                                        } else {

                                            buttonsdiv = "";
                                        }
                                    }

                                    jQuery("body").css("cursor", "default");

                                   
                                        if(userloggedinstatus == true){

                                            console.log("User logged in A is inside one iframe.");

                                            var newopenhtml =
                                            '<div class="tab"><button class="tablinks" >Product Info</button></div><div id="London" class="tabcontent">' +
                                            openhtml +
                                            "</div>" +
                                            buttonsdiv;




                                        }else{


                                            let depth = 0;
                                            let currentWindow = window;

                                            // Traverse up the window hierarchy
                                            while (currentWindow !== window.top) {
                                                depth++;
                                                try {
                                                    currentWindow = currentWindow.parent;
                                                } catch (e) {
                                                    console.warn("Cross-origin restriction: Unable to access parent window.");
                                                    break;
                                                }
                                            }

                                            console.log("Iframe A depth:", depth);

                                            if (depth === 1) {
                                                console.log("Iframe A is inside one iframe.");
                                                
                                                var newopenhtml =
                                                '<div class="tab"><button class="tablinks" >Product Info</button></div><div id="London" class="tabcontent">' +
                                                openhtml +
                                                "</div>" ;


                                            } else if (depth === 2) {
                                                console.log("Iframe A is inside two iframes.");
                                                var newopenhtml =
                                                '<div class="tab"><button class="tablinks" >Product Info</button></div><div id="London" class="tabcontent">' +
                                                openhtml +
                                                "</div>" +
                                                buttonsdiv;


                                            } else {
                                                console.log("Iframe A is not inside an iframe or has a different nesting level.");
                                            }


                                        }

                                       
                                    if (popupstatus == "off") {
                                        popupstatus = "on";
                                        checkopenfunction = jQuery.confirm({
                                            title:
                                                '<i class="far fa-id-card"></i> ' + popupstatustitle,
                                            content: newopenhtml,
                                            confirmButton: false,
                                            confirmButtonClass: "mycustomwidth",
                                            cancelButton: false,

                                            closeIcon: true,
                                            
                                            columnClass:
                                                "jconfirm-box-container-viewerBOx viewerBOxwhenproducton",
                                            cancel: function () {
                                                //close
                                                popupstatus = "off";
                                            },
                                        });

                                        jQuery(".closeIcon").each(function () {
                                            jQuery(this)
                                                .children()
                                                .removeClass("glyphicon glyphicon-remove");
                                            jQuery(this)
                                                .children()
                                                .addClass("customecloseicon btn btn-small btn-danger");
                                            jQuery(this).children().html("Close");
                                        });
                                    }
                                },
                            });
                        } else {
                            var tablehtml = "";
                            var curr_dat = "";
                            var companylogourlnew = "";
                            var htmlforassignedbooth = "";
                            var htmlforaddress = "";
                            if (
                                companydescription != "" &&
                                typeof companydescription !== "undefined"
                            ) {
                                htmlcompanydescription =
                                    '<div style="white-space: pre-wrap;">' +
                                    unescape(companydescription) +
                                    "</div>";
                            }

                            var productDescription =
                                "<h6 >" + htmlcompanydescription + "</h6>";
                            htmlforassignedbooth =
                                '<h5 id="boothName" >Booth Number:  <span style="font-size:14px;" >' +
                                assignedboothname +
                                "</span></h5>";
                            companylogourlnew =
                                baseCurrentSiteURl +
                                "/wp-content/plugins/floorplan/styles/default-placeholder-300x300.png";
                            var boothtitle =
                                "<h5 id='boothName'><strong>Booth Number: </strong>" +
                                assignedboothname +
                                "</h5>";
                            if (tagsnameslist == "") {
                                var boothtagslist = "";
                            } else {
                                var boothtagslist =
                                    "<p><h5><strong>Tags:</strong></h5> " +
                                    tagsnameslist +
                                    "</p>";
                            }

                            // openhtml = '<div class="maindiv" style="width:100%;min-height: 350px;"><div class="profiledive" style="width:30%;margin-top:6%;float:left;text-align:center"><img width="200" src="' + companylogourlnew + '" /></div><div class="descrpitiondiv" style="float:right;width:68%;margin-bottom: 30px;"><h1 ></h1>' + htmlforassignedbooth + '<hr>'+htmlcompanydescription+'</div></div>';
                            // openhtml = '<div class="row"><div class="col-sm-4" style="margin-top: 2%;">'+htmlforassignedbooth+'<hr>'+htmlcompanydescription+'</div><div class="col-sm-6"></div></div>';

                            //  var openhtml = '<div class="row" style="padding:30px;" ><div class="col-sm-5">'+imagesrc+''+htmlforaddress+''+htmlforassignedbooth+'<hr>'+htmlcompanydescription+'</div><div class="col-sm-5">'+htmlforproductdetail+'</div></div>';
                            var openhtml =
                                '<div class="row customedivproductview" style="margin-bottom: 25px;"><div class="col-sm-11" >' +
                                boothtitle +
                                "" +
                                productDescription +
                                boothtagslist +
                                "</div></div>";
                            var newopenhtml =
                                '<div class="tab"><button class="tablinks" >Booth Info</button></div><div id="London" class="tabcontent">' +
                                openhtml +
                                "</div>";

                            jQuery("body").css("cursor", "default");
                            // console.log(2);
                            if (popupstatus == "off") {
                                popupstatus = "on";
                                jQuery.confirm({
                                    title: '<i class="far fa-id-card"></i> ' + assignedboothname,
                                    content: newopenhtml,
                                    confirmButton: false,
                                    confirmButtonClass: "mycustomwidth",
                                    cancelButton: false,

                                    closeIcon: true,
                                    columnClass:
                                        "jconfirm-box-container-viewerBOx viewerBOxwhenproducton",
                                    cancel: function () {
                                        //close
                                        popupstatus = "off";
                                    },
                                });

                                jQuery(".closeIcon").each(function () {
                                    // console.log("google");
                                    jQuery(this)
                                        .children()
                                        .removeClass("glyphicon glyphicon-remove");
                                    jQuery(this)
                                        .children()
                                        .addClass("customecloseicon btn btn-small btn-danger");
                                    jQuery(this).children().html("Close");
                                });
                            }
                        }
                    }
                }
            });

            //   this.editor.graph.setEnabled(false);
        }

        if (!graph.pageVisible) {
            this.get("pageView").funct();
        }

        var fmt = graph.pageFormat;
        var ps = graph.pageScale;
        var cw = graph.container.clientWidth - 10;
        var ch = graph.container.clientHeight - 10;
        var scale =
            Math.floor(20 * Math.min(cw / fmt.width / ps, ch / fmt.height / ps)) / 20;
        if (mxCurrentfloorplanstatus != "viewer") {
            var topmargine = ch / 127;
        } else {
            var topmargine = ch / 20;

            if (md.phone() != null) {
                var scale =
                    Math.floor(
                        20 * Math.min(320 / fmt.width / ps, ch / fmt.height / ps)
                    ) / 20;
            }
        }

        graph.zoomTo(scale);

        if (mxUtils.hasScrollbars(graph.container)) {
            var pad = graph.getPagePadding();
            graph.container.scrollTop = pad.y * graph.view.scale - topmargine;
            graph.container.scrollLeft = Math.min(
                pad.x * graph.view.scale,
                (graph.container.scrollWidth - graph.container.clientWidth) / 2
            );
        }
    }

    //Set canvas background on page load
    this.SetbackgroundImageOnload();
};

function toggletabs(tabID) {
    var getID = jQuery(tabID).attr("id");
    // console.log(getID);
    if (getID == "mainprofile") {
        jQuery("#mainprofile").removeClass("unactive");
        jQuery("#contactus").addClass("unactive");
        jQuery("#mainprofilediv").show();
        jQuery("#contactdiv").hide();
    } else {
        jQuery("#contactus").removeClass("unactive");
        jQuery("#mainprofile").addClass("unactive");
        jQuery("#mainprofilediv").hide();
        jQuery("#contactdiv").show();
    }
}

function removeFromCart(p_id, request, price) {
    // console.log("Remove From Cart");
    jQuery("body").css("cursor", "progress");
    var data = new FormData();
    // data.append("wc_deposit_option", "no");
    data.append("quantity", 1);
    data.append("p_id", p_id);
    jQuery.ajax({
        url:
            baseCurrentSiteURl +
            "/wp-content/plugins/floorplan/floorplan.php?floorplanRequest=productremoverequest",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: "POST",
        success: function (data) {
            var checkouturl = baseCurrentSiteURl + "/checkout/";
            var addONs = baseCurrentSiteURl + "/product-category/add-ons/";
            var numberslug = 2;
            // console.log(data);
            jQuery("#" + p_id).empty();
            jQuery("#" + p_id + "_checkout").attr("disabled", false);

            var enbutton =
                '<a  class="btn btn-primary btn-info"  onclick="addToCart( ' +
                p_id +
                ",'log','full'," +
                numberslug +
                ')"  >Add To Cart</a>';

            jQuery("#" + p_id).append(enbutton);

            var productcount = parseInt(
                window.parent.jQuery("#entryflowcartcounter").text()
            );
            // console.log(productcount + "------------------");
            window.parent.jQuery("#entryflowcartcounter").empty();
            window.parent.jQuery("#entryflowcartcounter").text(productcount);
            jQuery("body").css("cursor", "default");
        },
    });
}

function addToCart(p_id, request, price, slug) {


    var data1 = new FormData();
    var data3 = new FormData();
    data3.append("boothproductid", p_id);
    if(prePaid != "checked" || (prePaid == "checked" && userloggedinstatus != 1) || (prePaid != "checked" && userloggedinstatus == 1)){
        
        // console.log('boothid------------'+p_id);
    
        
    jQuery.ajax({
        url:
            baseCurrentSiteURl +
            "/wp-content/plugins/floorplan/floorplan.php?floorplanRequest=cart_total",
        data: data1,
        cache: false,
        contentType: false,
        processData: false,
        type: "POST",

        success: function (data) {
            // console.log(data);
            data = data.trim();

            if (
                parseInt(userlimit) > parseInt(data) ||
                userlimit == "" ||
                userlimit == undefined
            ) {
                jQuery("#cart_div").remove();
                // console.log("Remove From Cart");
                jQuery("body").css("cursor", "progress");
                var data = new FormData();
                if (price == "full") {
                    data.append("wc_deposit_option", "no");
                } else {
                    data.append("wc_deposit_option", "yes");
                }
                window.top.scrollTo({top: 0, behavior: "smooth"});
                data.append("quantity", 1);
                data.append("add-to-cart", p_id);
                // console.log(data);
                jQuery.ajax({
                    url: baseCurrentSiteURl + "/?add-to-cart=199&quantity=1",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: "POST",

                    success: function (data) {


                        // jQuery.ajax({
                        //     url:
                        //         baseCurrentSiteURl +
                        //         "/wp-content/plugins/floorplan/floorplan.php?floorplanRequest=boothdiscount_price",
                        //     data: data3,
                        //     cache: false,
                        //     contentType: false,
                        //     processData: false,
                        //     type: "POST",
                    
                        //     success: function (data) {

                        //     }
                        // });
                        var checkouturl = baseCurrentSiteURl + "/checkout/";
                        var addONs = baseCurrentSiteURl + "/product-category/add-ons/";
                        jQuery("#" + p_id).empty();
                        jQuery("#" + p_id + "_checkout").attr("disabled", false);

                        if (request == "log") {
                            var enbutton =
                                "<a   class='btn btn-danger btn-small' onclick='removeFromCart(" +
                                p_id +
                                ")'>Remove</a>";
                            jQuery("#" + p_id).append(enbutton);

                            var productcount = parseInt(
                                window.parent.jQuery("#entryflowcartcounter").text()
                            );
                            // console.log(productcount + "------------------");
                            productcount = productcount + 1;
                            window.parent.jQuery("#entryflowcartcounter").empty();
                            window.parent.jQuery("#entryflowcartcounter").text(productcount);
                            // checkopenfunction.close();
                            window.top.scrollTo({top: 0, behavior: "smooth"});
                        } else {
                            top.window.location.href =
                                baseCurrentSiteURl + "/exhibitor-entry/";
                        }
                        jQuery("body").css("cursor", "default");
                    },
                });
            } else {
                jQuery("#" + p_id).empty();
                var div =
                    '<div id="cart_div"><p style="  text-align: center;font-size: 16px;vertical-align: c;margin-top: 10px;"><strong style="color:red">Booth limit exceeded</strong></p></div>';
                jQuery("#" + p_id).append(div);
            }
        },
    });

    }else{

        var originalString = jQuery('#boothName').text();
        var boothName = originalString.replace(/booth number:\s*[A-Z]\s*/gi, '');
        // console.log('boothName--------'+boothName);
        var newData = new FormData();
        newData.append('booth_productid',p_id);
        newData.append('userlimit',userlimit);
        newData.append('purchCount',purchCount);
        newData.append('userloggedinstatus',userloggedinstatus);
        var content = 'After clicking "Confirm", you will be immediately assigned to this booth, and this cannot be undone. To be removed from this booth, you will need to contact show management.'
        jQuery('.customecloseicon').trigger('click');


        Swal.fire( 
            {
                title: "Are you sure?",
                text: content,
                icon: "info",
                showCancelButton: true,
                confirmButtonClass: " btn",
                confirmButtonColor: '#8cd4f5',
                cancelButtonClass: "btn-danger",
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true,
            },

        ).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {


                
        jQuery.ajax({
            url:
                baseCurrentSiteURl +
                "/wp-content/plugins/floorplan/floorplan.php?floorplanRequest=boothselfassignment",
            data: newData,
            cache: false,
            contentType: false,
            processData: false,
            type: "POST",
    
            success: function (data) {

                data = data.trim();
                if(data == 'limitreached'){
                    Swal.fire({
                        icon: "info",
                        title: "Limit Reached",
                        text: "Booth purchase limit reached.",
                        confirmButtonClass: " btn",
                        confirmButtonColor: '#8cd4f5',
                        showConfirmButton: true,
                    }).then(function (isConfirm) {
            
                       
                    })
                }else if(data == 'assigned'){
                    Swal.fire({
                        icon: "info",
                        title: "Already Assigned",
                        text: boothName+" is already assigned to somone.",
                        confirmButtonClass: " btn",
                        confirmButtonColor: '#8cd4f5',
                        showConfirmButton: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                            
                        }
                    })
                }else{

                    Swal.fire({
                        icon: "info",
                        title: "Booth Assigned!",
                        text: 'Now you should see your company assigned to this booth.',
                        showConfirmButton: true,
                        confirmButtonText: "Close",
                        confirmButtonClass: " btn",
                        confirmButtonColor: '#8cd4f5',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                            
                        }
                    });
                }
                
         
            }
        });
    
                
            } 
        })
   
       
    }
}

function ReservedTheBooth(p_id, request, price, slug) {
    // console.log("Remove From Cart");
    // console.log(p_id);
    // console.log(price);
    jQuery("body").css("cursor", "progress");
    var data = new FormData();
    if (price == "full") {
        data.append("wc_deposit_option", "no");
    } else {
        data.append("wc_deposit_option", "yes");
    }

    data.append("quantity", 1);
    data.append("p_id", p_id);
    // console.log(data);
    jQuery.ajax({
        url:
            baseCurrentSiteURl +
            "/wp-content/plugins/floorplan/floorplan.php?floorplanRequest=reservedBoothRequest",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: "POST",

        success: function (data) {
            jQuery(".R").empty();
            jQuery("#" + p_id + "_checkout").attr("disabled", false);
            if (request == "log") {
                // console.log("Reserved");
            } else {
                top.window.location.href = baseCurrentSiteURl + "/exhibitor-entry/";
            }
            jQuery("body").css("cursor", "default");
            location.reload();
        },
    });
}

// Extends mxEventSource
mxUtils.extend(EditorUi, mxEventSource);

/**
 * Global config that specifies if the compact UI elements should be used.
 */
EditorUi.compactUi = true;

/**
 * Specifies the size of the split bar.
 */
EditorUi.prototype.splitSize =
    mxClient.IS_TOUCH || mxClient.IS_POINTER ? 12 : 8;

/**
 * Specifies the height of the menubar. Default is 34.
 */
EditorUi.prototype.menubarHeight = 60;

/**
 * Specifies the width of the format panel should be enabled. Default is true.
 */
EditorUi.prototype.formatEnabled = true;

/**
 * Specifies the width of the format panel. Default is 240.
 */
EditorUi.prototype.formatWidth = 280;

/**
 * Specifies the height of the toolbar. Default is 36.
 */
EditorUi.prototype.toolbarHeight = 34;

/**
 * Specifies the height of the footer. Default is 28.
 */
EditorUi.prototype.footerHeight = 28;

/**
 * Specifies the height of the optional sidebarFooterContainer. Default is 34.
 */
EditorUi.prototype.sidebarFooterHeight = 34;

/**
 * Specifies the link for the edit button in chromeless mode.
 */
EditorUi.prototype.editButtonLink = null;

/**
 * Specifies the position of the horizontal split bar. Default is 204 or 120 for
 * screen widths <= 500px.
 */
EditorUi.prototype.hsplitPosition = screen.width <= 500 ? 116 : 208;

/**
 * Specifies if animations are allowed in <executeLayout>. Default is true.
 */
EditorUi.prototype.allowAnimation = true;

/**
 * Installs the listeners to update the action states.
 */
EditorUi.prototype.init = function () {
    /**
     * Keypress starts immediate editing on selection cell
     */
    var graph = this.editor.graph;

    mxEvent.addListener(
        graph.container,
        "keydown",
        mxUtils.bind(this, function (evt) {
            // Tab selects next cell
            if (evt.which == 9 && graph.isEnabled() && !mxEvent.isAltDown(evt)) {
                if (graph.isEditing()) {
                    graph.stopEditing(false);
                } else {
                    graph.selectCell(!mxEvent.isShiftDown(evt));
                }

                mxEvent.consume(evt);
            }
        })
    );

    mxEvent.addListener(
        graph.container,
        "keypress",
        mxUtils.bind(this, function (evt) {
            // KNOWN: Focus does not work if label is empty in quirks mode
            if (
                this.isImmediateEditingEvent(evt) &&
                !graph.isEditing() &&
                !graph.isSelectionEmpty() &&
                evt.which !== 0 &&
                !mxEvent.isAltDown(evt) &&
                !mxEvent.isControlDown(evt) &&
                !mxEvent.isMetaDown(evt)
            ) {
                graph.escape();
                graph.startEditing();

                // Workaround for FF where char is lost if cursor is placed before char
                if (mxClient.IS_FF) {
                    var ce = graph.cellEditor;
                    ce.textarea.innerHTML = String.fromCharCode(evt.which);

                    // Moves cursor to end of textarea
                    var range = document.createRange();
                    range.selectNodeContents(ce.textarea);
                    range.collapse(false);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        })
    );

    // Updates action states
    this.addUndoListener();
    this.addBeforeUnloadListener();

    graph.getSelectionModel().addListener(
        mxEvent.CHANGE,
        mxUtils.bind(this, function () {
            this.updateActionStates();
        })
    );

    graph.getModel().addListener(
        mxEvent.CHANGE,
        mxUtils.bind(this, function () {
            this.updateActionStates();
        })
    );

    // Changes action states after change of default parent
    var graphSetDefaultParent = graph.setDefaultParent;
    var ui = this;

    this.editor.graph.setDefaultParent = function () {
        graphSetDefaultParent.apply(this, arguments);
        ui.updateActionStates();
    };

    // Hack to make editLink available in vertex handler
    //	graph.editLink = ui.actions.get('editLink').funct;

    this.updateActionStates();
    this.initClipboard();
    this.initCanvas();

    if (this.format != null) {
        this.format.init();
    }
};

/**
 * Returns true if the given event should start editing. This implementation returns true.
 */
EditorUi.prototype.isImmediateEditingEvent = function (evt) {
    return true;
};

/**
 * Private helper method.
 */
EditorUi.prototype.getCssClassForMarker = function (
    prefix,
    shape,
    marker,
    fill
) {
    var result = "";

    if (shape == "flexArrow") {
        result =
            marker != null && marker != mxConstants.NONE
                ? "geSprite geSprite-" + prefix + "blocktrans"
                : "geSprite geSprite-noarrow";
    } else {
        if (marker == mxConstants.ARROW_CLASSIC) {
            result =
                fill == "1"
                    ? "geSprite geSprite-" + prefix + "classic"
                    : "geSprite geSprite-" + prefix + "classictrans";
        } else if (marker == mxConstants.ARROW_CLASSIC_THIN) {
            result =
                fill == "1"
                    ? "geSprite geSprite-" + prefix + "classicthin"
                    : "geSprite geSprite-" + prefix + "classicthintrans";
        } else if (marker == mxConstants.ARROW_OPEN) {
            result = "geSprite geSprite-" + prefix + "open";
        } else if (marker == mxConstants.ARROW_OPEN_THIN) {
            result = "geSprite geSprite-" + prefix + "openthin";
        } else if (marker == mxConstants.ARROW_BLOCK) {
            result =
                fill == "1"
                    ? "geSprite geSprite-" + prefix + "block"
                    : "geSprite geSprite-" + prefix + "blocktrans";
        } else if (marker == mxConstants.ARROW_BLOCK_THIN) {
            result =
                fill == "1"
                    ? "geSprite geSprite-" + prefix + "blockthin"
                    : "geSprite geSprite-" + prefix + "blockthintrans";
        } else if (marker == mxConstants.ARROW_OVAL) {
            result =
                fill == "1"
                    ? "geSprite geSprite-" + prefix + "oval"
                    : "geSprite geSprite-" + prefix + "ovaltrans";
        } else if (marker == mxConstants.ARROW_DIAMOND) {
            result =
                fill == "1"
                    ? "geSprite geSprite-" + prefix + "diamond"
                    : "geSprite geSprite-" + prefix + "diamondtrans";
        } else if (marker == mxConstants.ARROW_DIAMOND_THIN) {
            result =
                fill == "1"
                    ? "geSprite geSprite-" + prefix + "thindiamond"
                    : "geSprite geSprite-" + prefix + "thindiamondtrans";
        } else if (marker == "openAsync") {
            result = "geSprite geSprite-" + prefix + "openasync";
        } else if (marker == "dash") {
            result = "geSprite geSprite-" + prefix + "dash";
        } else if (marker == "cross") {
            result = "geSprite geSprite-" + prefix + "cross";
        } else if (marker == "async") {
            result =
                fill == "1"
                    ? "geSprite geSprite-" + prefix + "async"
                    : "geSprite geSprite-" + prefix + "asynctrans";
        } else if (marker == "circle" || marker == "circlePlus") {
            result =
                fill == "1" || marker == "circle"
                    ? "geSprite geSprite-" + prefix + "circle"
                    : "geSprite geSprite-" + prefix + "circleplus";
        } else if (marker == "ERone") {
            result = "geSprite geSprite-" + prefix + "erone";
        } else if (marker == "ERmandOne") {
            result = "geSprite geSprite-" + prefix + "eronetoone";
        } else if (marker == "ERmany") {
            result = "geSprite geSprite-" + prefix + "ermany";
        } else if (marker == "ERoneToMany") {
            result = "geSprite geSprite-" + prefix + "eronetomany";
        } else if (marker == "ERzeroToOne") {
            result = "geSprite geSprite-" + prefix + "eroneopt";
        } else if (marker == "ERzeroToMany") {
            result = "geSprite geSprite-" + prefix + "ermanyopt";
        } else {
            result = "geSprite geSprite-noarrow";
        }
    }

    return result;
};

/**
 * Overridden in Menus.js
 */
EditorUi.prototype.createMenus = function () {
    return null;
};

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.updatePasteActionStates = function () {
    var graph = this.editor.graph;
    var paste = this.actions.get("paste");
    var pasteHere = this.actions.get("pasteHere");

    paste.setEnabled(
        this.editor.graph.cellEditor.isContentEditing() ||
        (!mxClipboard.isEmpty() &&
            graph.isEnabled() &&
            !graph.isCellLocked(graph.getDefaultParent()))
    );
    pasteHere.setEnabled(paste.isEnabled());
};

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.initClipboard = function () {
    var ui = this;

    var mxClipboardCut = mxClipboard.cut;
    mxClipboard.cut = function (graph) {
        if (graph.cellEditor.isContentEditing()) {
            document.execCommand("cut", false, null);
        } else {
            mxClipboardCut.apply(this, arguments);
        }

        ui.updatePasteActionStates();
    };

    var mxClipboardCopy = mxClipboard.copy;
    mxClipboard.copy = function (graph) {
        if (graph.cellEditor.isContentEditing()) {
            document.execCommand("copy", false, null);
        } else {
            mxClipboardCopy.apply(this, arguments);
        }

        ui.updatePasteActionStates();
    };

    var mxClipboardPaste = mxClipboard.paste;
    mxClipboard.paste = function (graph) {
        var result = null;

        if (graph.cellEditor.isContentEditing()) {
            document.execCommand("paste", false, null);
        } else {
            result = mxClipboardPaste.apply(this, arguments);
        }

        ui.updatePasteActionStates();

        return result;
    };

    // Overrides cell editor to update paste action state
    var cellEditorStartEditing = this.editor.graph.cellEditor.startEditing;

    this.editor.graph.cellEditor.startEditing = function () {
        cellEditorStartEditing.apply(this, arguments);
        ui.updatePasteActionStates();
    };

    var cellEditorStopEditing = this.editor.graph.cellEditor.stopEditing;

    this.editor.graph.cellEditor.stopEditing = function (cell, trigger) {
        cellEditorStopEditing.apply(this, arguments);
        ui.updatePasteActionStates();
    };

    this.updatePasteActionStates();
};

/**
 * Initializes the infinite canvas.
 */
EditorUi.prototype.initCanvas = function () {
    var graph = this.editor.graph;
    checkinitalstatus = true;
    // Initial page layout view, scrollBuffer and timer-based scrolling
    var graph = this.editor.graph;
    graph.timerAutoScroll = true;

    /**
     * Returns the padding for pages in page view with scrollbars.
     */
    graph.getPagePadding = function () {
        return new mxPoint(
            Math.max(
                0,
                Math.round((graph.container.offsetWidth - 34) / graph.view.scale)
            ),
            Math.max(
                0,
                Math.round((graph.container.offsetHeight - 34) / graph.view.scale)
            )
        );
    };

    // Fits the number of background pages to the graph
    graph.view.getBackgroundPageBounds = function () {
        var layout = this.graph.getPageLayout();
        var page = this.graph.getPageSize();

        return new mxRectangle(
            this.scale * (this.translate.x + layout.x * page.width),
            this.scale * (this.translate.y + layout.y * page.height),
            this.scale * layout.width * page.width,
            this.scale * layout.height * page.height
        );
    };

    graph.getPreferredPageSize = function (bounds, width, height) {
        var pages = this.getPageLayout();
        var size = this.getPageSize();

        return new mxRectangle(
            0,
            0,
            pages.width * size.width,
            pages.height * size.height
        );
    };

    // Scales pages/graph to fit available size
    var resize = null;

    if (this.editor.chromeless) {
        resize = mxUtils.bind(this, function (autoscale) {
            if (graph.container != null) {
                var b = graph.pageVisible
                    ? graph.view.getBackgroundPageBounds()
                    : graph.getGraphBounds();
                var tr = graph.view.translate;
                var s = graph.view.scale;

                // Normalizes the bounds
                b = mxRectangle.fromRectangle(b);
                b.x = b.x / s - tr.x;
                b.y = b.y / s - tr.y;
                b.width /= s;
                b.height /= s;

                var st = graph.container.scrollTop;
                var sl = graph.container.scrollLeft;
                var sb = mxClient.IS_QUIRKS || document.documentMode >= 8 ? 20 : 14;

                if (document.documentMode == 8 || document.documentMode == 9) {
                    sb += 3;
                }

                var cw = graph.container.offsetWidth - sb;
                var ch = graph.container.offsetHeight - sb;

                var ns = autoscale ? Math.max(0.3, Math.min(1, cw / b.width)) : s;
                var dx = Math.max((cw - ns * b.width) / 2, 0) / ns;
                var dy = Math.max((ch - ns * b.height) / 4, 0) / ns;

                graph.view.scaleAndTranslate(ns, dx - b.x, dy - b.y);

                graph.container.scrollTop = (st * ns) / s;
                graph.container.scrollLeft = (sl * ns) / s;
            }
        });

        // Hack to make function available to subclassers
        this.chromelessResize = resize;

        // Removable resize listener
        var autoscaleResize = mxUtils.bind(this, function () {
            resize(false);
        });

        mxEvent.addListener(window, "resize", autoscaleResize);

        this.destroyFunctions.push(function () {
            mxEvent.removeListener(window, "resize", autoscaleResize);
        });

        this.editor.addListener(
            "resetGraphView",
            mxUtils.bind(this, function () {
                resize(true);
            })
        );

        this.actions.get("zoomIn").funct = function (evt) {
            graph.zoomIn();
            resize(false);
        };
        this.actions.get("zoomOut").funct = function (evt) {
            graph.zoomOut();
            resize(false);
        };

        // Creates toolbar for viewer - do not use CSS here
        // as this may be used in a viewer that has no CSS
        this.chromelessToolbar = document.createElement("div");
        this.chromelessToolbar.style.position = "fixed";
        this.chromelessToolbar.style.overflow = "hidden";
        this.chromelessToolbar.style.boxSizing = "border-box";
        this.chromelessToolbar.style.whiteSpace = "nowrap";
        this.chromelessToolbar.style.backgroundColor = "#000000";
        this.chromelessToolbar.style.padding = "10px 10px 8px 10px";
        this.chromelessToolbar.style.left = "50%";
        mxUtils.setPrefixedStyle(
            this.chromelessToolbar.style,
            "borderRadius",
            "20px"
        );
        mxUtils.setPrefixedStyle(
            this.chromelessToolbar.style,
            "transition",
            "opacity 600ms ease-in-out"
        );

        var updateChromelessToolbarPosition = mxUtils.bind(this, function () {
            var css = mxUtils.getCurrentStyle(graph.container);
            this.chromelessToolbar.style.bottom =
                (css != null ? parseInt(css["margin-bottom"] || 0) : 0) +
                (this.tabContainer != null
                    ? 20 + parseInt(this.tabContainer.style.height)
                    : 20) +
                "px";
        });

        this.editor.addListener("resetGraphView", updateChromelessToolbarPosition);
        updateChromelessToolbarPosition();

        var btnCount = 0;

        var addButton = mxUtils.bind(this, function (fn, imgSrc, tip) {
            btnCount++;

            var a = document.createElement("span");
            a.style.paddingLeft = "8px";
            a.style.paddingRight = "8px";
            a.style.cursor = "pointer";
            mxEvent.addListener(a, "click", fn);

            if (tip != null) {
                a.setAttribute("title", tip);
            }

            var img = document.createElement("img");
            img.setAttribute("border", "0");
            img.setAttribute("src", imgSrc);

            a.appendChild(img);
            this.chromelessToolbar.appendChild(a);

            return a;
        });

        var prevButton = addButton(
            mxUtils.bind(this, function (evt) {
                this.actions.get("previousPage").funct();
                mxEvent.consume(evt);
            }),
            Editor.previousLargeImage,
            mxResources.get("previousPage") || "Previous Page"
        );

        var pageInfo = document.createElement("div");
        pageInfo.style.display = "inline-block";
        pageInfo.style.verticalAlign = "top";
        pageInfo.style.fontFamily = "Helvetica,Arial";
        pageInfo.style.marginTop = "8px";
        pageInfo.style.color = "#ffffff";
        this.chromelessToolbar.appendChild(pageInfo);

        var nextButton = addButton(
            mxUtils.bind(this, function (evt) {
                this.actions.get("nextPage").funct();
                mxEvent.consume(evt);
            }),
            Editor.nextLargeImage,
            mxResources.get("nextPage") || "Next Page"
        );

        var updatePageInfo = mxUtils.bind(this, function () {
            if (
                this.pages != null &&
                this.pages.length > 1 &&
                this.currentPage != null
            ) {
                pageInfo.innerHTML = "";
                mxUtils.write(
                    pageInfo,
                    mxUtils.indexOf(this.pages, this.currentPage) +
                    1 +
                    " / " +
                    this.pages.length
                );
            }
        });

        prevButton.style.paddingLeft = "0px";
        prevButton.style.paddingRight = "4px";
        nextButton.style.paddingLeft = "4px";
        nextButton.style.paddingRight = "0px";

        var updatePageButtons = mxUtils.bind(this, function () {
            if (
                this.pages != null &&
                this.pages.length > 1 &&
                this.currentPage != null
            ) {
                nextButton.style.display = "";
                prevButton.style.display = "";
                pageInfo.style.display = "inline-block";
            } else {
                nextButton.style.display = "none";
                prevButton.style.display = "none";
                pageInfo.style.display = "none";
            }

            updatePageInfo();
        });

        this.editor.addListener("resetGraphView", updatePageButtons);
        this.editor.addListener("pageSelected", updatePageInfo);

        addButton(
            mxUtils.bind(this, function (evt) {
                this.actions.get("zoomOut").funct();
                mxEvent.consume(evt);
            }),
            Editor.zoomOutLargeImage,
            (mxResources.get("zoomOut") || "Zoom Out") + " (Alt+Mousewheel)"
        );

        addButton(
            mxUtils.bind(this, function (evt) {
                this.actions.get("zoomIn").funct();
                mxEvent.consume(evt);
            }),
            Editor.zoomInLargeImage,
            (mxResources.get("zoomIn") || "Zoom In") + " (Alt+Mousewheel)"
        );

        addButton(
            mxUtils.bind(this, function (evt) {
                if (graph.lightbox) {
                    if (graph.view.scale == 1) {
                        this.lightboxFit();
                    } else {
                        graph.zoomTo(1);
                    }

                    resize(false);
                } else {
                    resize(true);
                }

                mxEvent.consume(evt);
            }),
            Editor.actualSizeLargeImage,
            mxResources.get("fit") || "Fit"
        );

        // Changes toolbar opacity on hover
        var fadeThread = null;
        var fadeThread2 = null;

        var fadeOut = mxUtils.bind(this, function (delay) {
            if (fadeThread != null) {
                window.clearTimeout(fadeThread);
                fadeThead = null;
            }

            if (fadeThread2 != null) {
                window.clearTimeout(fadeThread2);
                fadeThead2 = null;
            }

            fadeThread = window.setTimeout(
                mxUtils.bind(this, function () {
                    mxUtils.setOpacity(this.chromelessToolbar, 0);
                    fadeThread = null;

                    fadeThread2 = window.setTimeout(
                        mxUtils.bind(this, function () {
                            this.chromelessToolbar.style.display = "none";
                            fadeThread2 = null;
                        }),
                        600
                    );
                }),
                delay || 200
            );
        });

        var fadeIn = mxUtils.bind(this, function (opacity) {
            if (fadeThread != null) {
                window.clearTimeout(fadeThread);
                fadeThead = null;
            }

            if (fadeThread2 != null) {
                window.clearTimeout(fadeThread2);
                fadeThead2 = null;
            }

            this.chromelessToolbar.style.display = "";
            mxUtils.setOpacity(this.chromelessToolbar, opacity || 30);
        });

        if (urlParams["layers"] == "1") {
            this.layersDialog = null;

            var layersButton = addButton(
                mxUtils.bind(this, function (evt) {
                    if (this.layersDialog != null) {
                        this.layersDialog.parentNode.removeChild(this.layersDialog);
                        this.layersDialog = null;
                    } else {
                        this.layersDialog = graph.createLayersDialog();

                        mxEvent.addListener(
                            this.layersDialog,
                            "mouseleave",
                            mxUtils.bind(this, function () {
                                this.layersDialog.parentNode.removeChild(this.layersDialog);
                                this.layersDialog = null;
                            })
                        );

                        var r = layersButton.getBoundingClientRect();

                        mxUtils.setPrefixedStyle(
                            this.layersDialog.style,
                            "borderRadius",
                            "5px"
                        );
                        this.layersDialog.style.position = "fixed";
                        this.layersDialog.style.fontFamily = "Helvetica,Arial";
                        this.layersDialog.style.backgroundColor = "#000000";
                        this.layersDialog.style.width = "160px";
                        this.layersDialog.style.padding = "4px 2px 4px 2px";
                        this.layersDialog.style.color = "#ffffff";
                        mxUtils.setOpacity(this.layersDialog, 70);
                        this.layersDialog.style.left = r.left + "px";
                        this.layersDialog.style.bottom =
                            parseInt(this.chromelessToolbar.style.bottom) +
                            this.chromelessToolbar.offsetHeight +
                            4 +
                            "px";

                        // Puts the dialog on top of the container z-index
                        var style = mxUtils.getCurrentStyle(this.editor.graph.container);
                        this.layersDialog.style.zIndex = style.zIndex;

                        document.body.appendChild(this.layersDialog);
                    }

                    mxEvent.consume(evt);
                }),
                Editor.layersLargeImage,
                mxResources.get("layers") || "Layers"
            );

            // Shows/hides layers button depending on content
            var model = graph.getModel();

            model.addListener(mxEvent.CHANGE, function () {
                layersButton.style.display =
                    model.getChildCount(model.root) > 1 ? "" : "none";
            });
        }

        if (this.editor.editButtonLink != null) {
            addButton(
                mxUtils.bind(this, function (evt) {
                    if (this.editor.editButtonLink == "_blank") {
                        this.editor.editAsNew(this.getEditBlankXml(), null, true);
                    } else {
                        window.open(this.editor.editButtonLink, "editWindow");
                    }

                    mxEvent.consume(evt);
                }),
                Editor.editLargeImage,
                mxResources.get("openInNewWindow") || "Open in New Window"
            );
        }

        if (graph.lightbox && this.container != document.body) {
            addButton(
                mxUtils.bind(this, function (evt) {
                    if (urlParams["close"] == "1") {
                        window.close();
                    } else {
                        this.destroy();
                        mxEvent.consume(evt);
                    }
                }),
                Editor.closeLargeImage,
                (mxResources.get("close") || "Close") + " (Escape)"
            );
        }

        // Initial state invisible
        this.chromelessToolbar.style.display = "none";
        graph.container.appendChild(this.chromelessToolbar);
        this.chromelessToolbar.style.marginLeft = -(btnCount * 24 + 10) + "px";

        // Installs handling of hightligh and handling links to relative links and anchors
        this.addChromelessClickHandler();

        mxEvent.addListener(
            graph.container,
            mxClient.IS_POINTER ? "pointermove" : "mousemove",
            mxUtils.bind(this, function (evt) {
                if (!mxEvent.isTouchEvent(evt)) {
                    if (!mxEvent.isShiftDown(evt)) {
                        fadeIn(30);
                    }

                    fadeOut();
                }
            })
        );

        mxEvent.addListener(
            this.chromelessToolbar,
            mxClient.IS_POINTER ? "pointermove" : "mousemove",
            function (evt) {
                mxEvent.consume(evt);
            }
        );

        mxEvent.addListener(
            this.chromelessToolbar,
            "mouseenter",
            mxUtils.bind(this, function (evt) {
                if (!mxEvent.isShiftDown(evt)) {
                    fadeIn(100);
                } else {
                    fadeOut();
                }
            })
        );

        mxEvent.addListener(
            this.chromelessToolbar,
            "mousemove",
            mxUtils.bind(this, function (evt) {
                if (!mxEvent.isShiftDown(evt)) {
                    fadeIn(100);
                } else {
                    fadeOut();
                }

                mxEvent.consume(evt);
            })
        );

        mxEvent.addListener(
            this.chromelessToolbar,
            "mouseleave",
            mxUtils.bind(this, function (evt) {
                if (!mxEvent.isTouchEvent(evt)) {
                    fadeIn(30);
                }
            })
        );

        // Shows/hides toolbar for touch devices
        var tol = graph.getTolerance();
        var ui = this;

        graph.addMouseListener({
            startX: 0,
            startY: 0,
            scrollLeft: 0,
            scrollTop: 0,
            mouseDown: function (sender, me) {
                this.startX = me.getGraphX();
                this.startY = me.getGraphY();
                this.scrollLeft = graph.container.scrollLeft;
                this.scrollTop = graph.container.scrollTop;
            },
            mouseMove: function (sender, me) {
            },
            mouseUp: function (sender, me) {
                if (mxEvent.isTouchEvent(me.getEvent())) {
                    if (
                        Math.abs(this.scrollLeft - graph.container.scrollLeft) < tol &&
                        Math.abs(this.scrollTop - graph.container.scrollTop) < tol &&
                        Math.abs(this.startX - me.getGraphX()) < tol &&
                        Math.abs(this.startY - me.getGraphY()) < tol
                    ) {
                        if (parseFloat(ui.chromelessToolbar.style.opacity || 0) > 0) {
                            fadeOut();
                        } else {
                            fadeIn(30);
                        }
                    }
                }
            },
        });
    } else if (this.editor.extendCanvas) {
        /**
         * Guesses autoTranslate to avoid another repaint (see below).
         * Works if only the scale of the graph changes or if pages
         * are visible and the visible pages do not change.
         */
        var graphViewValidate = graph.view.validate;
        graph.view.validate = function () {
            if (
                this.graph.container != null &&
                mxUtils.hasScrollbars(this.graph.container)
            ) {
                var pad = this.graph.getPagePadding();
                var size = this.graph.getPageSize();

                // Updating scrollbars here causes flickering in quirks and is not needed
                // if zoom method is always used to set the current scale on the graph.
                var tx = this.translate.x;
                var ty = this.translate.y;
                this.translate.x = pad.x - (this.x0 || 0) * size.width;
                this.translate.y = pad.y - (this.y0 || 0) * size.height;
            }

            graphViewValidate.apply(this, arguments);
        };

        var graphSizeDidChange = graph.sizeDidChange;
        graph.sizeDidChange = function () {
            if (this.container != null && mxUtils.hasScrollbars(this.container)) {
                var pages = this.getPageLayout();
                var pad = this.getPagePadding();
                var size = this.getPageSize();

                // Updates the minimum graph size
                var minw = Math.ceil(2 * pad.x + pages.width * size.width);
                var minh = Math.ceil(2 * pad.y + pages.height * size.height);

                var min = graph.minimumGraphSize;

                // LATER: Fix flicker of scrollbar size in IE quirks mode
                // after delayed call in window.resize event handler
                if (min == null || min.width != minw || min.height != minh) {
                    graph.minimumGraphSize = new mxRectangle(0, 0, minw, minh);
                }

                // Updates auto-translate to include padding and graph size
                var dx = pad.x - pages.x * size.width;
                var dy = pad.y - pages.y * size.height;

                if (
                    !this.autoTranslate &&
                    (this.view.translate.x != dx || this.view.translate.y != dy)
                ) {
                    this.autoTranslate = true;
                    this.view.x0 = pages.x;
                    this.view.y0 = pages.y;

                    // NOTE: THIS INVOKES THIS METHOD AGAIN. UNFORTUNATELY THERE IS NO WAY AROUND THIS SINCE THE
                    // BOUNDS ARE KNOWN AFTER THE VALIDATION AND SETTING THE TRANSLATE TRIGGERS A REVALIDATION.
                    // SHOULD MOVE TRANSLATE/SCALE TO VIEW.
                    var tx = graph.view.translate.x;
                    var ty = graph.view.translate.y;
                    graph.view.setTranslate(dx, dy);

                    // LATER: Fix rounding errors for small zoom
                    graph.container.scrollLeft += Math.round(
                        (dx - tx) * graph.view.scale
                    );
                    graph.container.scrollTop += Math.round((dy - ty) * graph.view.scale);

                    this.autoTranslate = false;

                    return;
                }

                graphSizeDidChange.apply(this, arguments);
            }
        };
    }

    // Accumulates the zoom factor while the rendering is taking place
    // so that not the complete sequence of zoom steps must be painted
    graph.updateZoomTimeout = null;
    graph.cumulativeZoomFactor = 1;

    var cursorPosition = null;

    graph.lazyZoom = function (zoomIn) {
        if (this.updateZoomTimeout != null) {
            window.clearTimeout(this.updateZoomTimeout);
        }

        // Switches to 1% zoom steps below 15%
        // Lower bound depdends on rounding below
        if (zoomIn) {
            if (this.view.scale * this.cumulativeZoomFactor < 0.15) {
                this.cumulativeZoomFactor = (this.view.scale + 0.01) / this.view.scale;
            } else {
                // Uses to 5% zoom steps for better grid rendering in webkit
                // and to avoid rounding errors for zoom steps
                this.cumulativeZoomFactor *= this.zoomFactor;
                this.cumulativeZoomFactor =
                    Math.round(this.view.scale * this.cumulativeZoomFactor * 20) /
                    20 /
                    this.view.scale;
            }
        } else {
            if (this.view.scale * this.cumulativeZoomFactor <= 0.15) {
                this.cumulativeZoomFactor = (this.view.scale - 0.01) / this.view.scale;
            } else {
                // Uses to 5% zoom steps for better grid rendering in webkit
                // and to avoid rounding errors for zoom steps
                this.cumulativeZoomFactor /= this.zoomFactor;
                this.cumulativeZoomFactor =
                    Math.round(this.view.scale * this.cumulativeZoomFactor * 20) /
                    20 /
                    this.view.scale;
            }
        }

        this.cumulativeZoomFactor = Math.max(
            0.01,
            Math.min(this.view.scale * this.cumulativeZoomFactor, 160) /
            this.view.scale
        );

        this.updateZoomTimeout = window.setTimeout(
            mxUtils.bind(this, function () {
                this.zoom(this.cumulativeZoomFactor);

                if (resize != null) {
                    resize(false);
                }

                // Zooms to mouse position if scrollbars enabled
                if (cursorPosition != null && mxUtils.hasScrollbars(graph.container)) {
                    var offset = mxUtils.getOffset(graph.container);
                    var dx =
                        graph.container.offsetWidth / 2 - cursorPosition.x + offset.x;
                    var dy =
                        graph.container.offsetHeight / 2 - cursorPosition.y + offset.y;

                    graph.container.scrollLeft -= dx * (this.cumulativeZoomFactor - 1);
                    graph.container.scrollTop -= dy * (this.cumulativeZoomFactor - 1);
                }

                this.cumulativeZoomFactor = 1;
                this.updateZoomTimeout = null;
            }),
            20
        );
    };

    mxEvent.addMouseWheelListener(
        mxUtils.bind(this, function (evt, up) {
            // Ctrl+wheel (or pinch on touchpad) is a native browser zoom event is OS X
            // LATER: Add support for zoom via pinch on trackpad for Chrome in OS X
            if (
                (mxEvent.isAltDown(evt) ||
                    (mxEvent.isControlDown(evt) && !mxClient.IS_MAC) ||
                    graph.panningHandler.isActive()) &&
                (this.dialogs == null || this.dialogs.length == 0)
            ) {
                var source = mxEvent.getSource(evt);

                while (source != null) {
                    if (source == graph.container) {
                        cursorPosition = new mxPoint(
                            mxEvent.getClientX(evt),
                            mxEvent.getClientY(evt)
                        );
                        graph.lazyZoom(up);
                        mxEvent.consume(evt);

                        return;
                    }

                    source = source.parentNode;
                }
            }
        })
    );
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.createTemporaryGraph = function (stylesheet) {
    var graph = new Graph(document.createElement("div"), null, null, stylesheet);
    graph.resetViewOnRootChange = false;
    graph.setConnectable(false);
    graph.gridEnabled = false;
    graph.autoScroll = false;
    graph.setTooltips(false);
    graph.setEnabled(false);

    // Container must be in the DOM for correct HTML rendering
    graph.container.style.visibility = "hidden";
    graph.container.style.position = "absolute";
    graph.container.style.overflow = "hidden";
    graph.container.style.height = "1px";
    graph.container.style.width = "1px";

    return graph;
};

/**
 *
 */
EditorUi.prototype.addChromelessClickHandler = function () {
    var hl = urlParams["highlight"];

    // Adds leading # for highlight color code
    if (hl != null && hl.length > 0) {
        hl = "#" + hl;
    }

    this.editor.graph.addClickHandler(hl);
};

/**
 *
 */
EditorUi.prototype.toggleFormatPanel = function (forceHide) {
    this.formatWidth = forceHide || this.formatWidth > 0 ? 0 : 240;
    this.formatContainer.style.display =
        forceHide || this.formatWidth > 0 ? "" : "none";
    this.refresh();
    this.format.refresh();
    this.fireEvent(new mxEventObject("formatWidthChanged"));
};

/**
 * Adds support for placeholders in labels.
 */
EditorUi.prototype.lightboxFit = function () {
    // LATER: Use initial graph bounds to avoid rounding errors
    this.editor.graph.maxFitScale = 2;
    this.editor.graph.fit(60);
    this.editor.graph.maxFitScale = null;
};

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.isSelectionAllowed = function (evt) {
    return (
        mxEvent.getSource(evt).nodeName == "SELECT" ||
        (mxEvent.getSource(evt).nodeName == "INPUT" &&
            mxUtils.isAncestorNode(this.formatContainer, mxEvent.getSource(evt)))
    );
};

/**
 * Installs dialog if browser window is closed without saving
 * This must be disabled during save and image export.
 */
EditorUi.prototype.addBeforeUnloadListener = function () {
    // Installs dialog if browser window is closed without saving
    // This must be disabled during save and image export
    if (mxCurrentfloorplanstatus != "viewer") {
        window.onbeforeunload = mxUtils.bind(this, function () {
            if (!this.editor.chromeless) {
                return this.onBeforeUnload();
            }
        });
    }
};

/**
 * Sets the onbeforeunload for the application
 */
EditorUi.prototype.onBeforeUnload = function () {
    if (this.editor.modified) {
        return mxResources.get("allChangesLost");
    }
};

/**
 * Opens the current diagram via the window.opener if one exists.
 */
EditorUi.prototype.open = function () {
    // Cross-domain window access is not allowed in FF, so if we
    // were opened from another domain then this will fail.
    try {
        if (window.opener != null && window.opener.openFile != null) {
            window.opener.openFile.setConsumer(
                mxUtils.bind(this, function (xml, filename) {
                    try {
                        var doc = mxUtils.parseXml(xml);
                        this.editor.setGraphXml(doc.documentElement);
                        this.editor.setModified(false);
                        this.editor.undoManager.clear();

                        if (filename != null) {
                            this.editor.setFilename(filename);
                            this.updateDocumentTitle();
                        }

                        return;
                    } catch (e) {
                        mxUtils.alert(
                            mxResources.get("invalidOrMissingFile") + ": " + e.message
                        );
                    }
                })
            );
        }
    } catch (e) {
        // ignore
    }

    // Fires as the last step if no file was loaded
    this.editor.graph.view.validate();

    // Required only in special cases where an initial file is opened
    // and the minimumGraphSize changes and CSS must be updated.
    this.editor.graph.sizeDidChange();
    this.editor.fireEvent(new mxEventObject("resetGraphView"));
};

/**
 * Sets the current menu and element.
 */
EditorUi.prototype.setCurrentMenu = function (menu, elt) {
    this.currentMenuElt = elt;
    this.currentMenu = menu;
};

/**
 * Resets the current menu and element.
 */
EditorUi.prototype.resetCurrentMenu = function () {
    this.currentMenuElt = null;
    this.currentMenu = null;
};

/**
 * Hides and destroys the current menu.
 */
EditorUi.prototype.hideCurrentMenu = function (menu, elt) {
    if (this.currentMenu != null) {
        this.currentMenu.hideMenu();
        this.resetCurrentMenu();
    }
};

/**
 * Updates the document title.
 */
EditorUi.prototype.updateDocumentTitle = function () {
    var title = this.editor.getOrCreateFilename();

    if (this.editor.appName != null) {
        title += " - " + this.editor.appName;
    }

    document.title = title;
};

/**
 * Updates the document title.
 */
EditorUi.prototype.createHoverIcons = function () {
    return new HoverIcons(this.editor.graph);
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.redo = function (apply) {
    try {
        var graph = this.editor.graph;

        if (graph.isEditing()) {
            document.execCommand("redo", false, null);
        } else {
            this.editor.undoManager.redo();
        }
        apply =
            apply != null
                ? apply
                : mxUtils.bind(this, function (image) {
                    this.setPageFormat(
                        new mxRectangle(
                            0,
                            0,
                            parseInt(currentbgImage.width),
                            parseInt(currentbgImage.height)
                        )
                    );
                });
        var currentbgImage = graph.getBackgroundImage();
        if (currentbgImage) {
            apply(
                new mxImage(
                    currentbgImage.src,
                    currentbgImage.width,
                    currentbgImage.height
                )
            );
            jQuery("#currentImage").attr("href", currentbgImage.src);
            jQuery("#mainDivdownloadButton").show;
        }
    } catch (e) {
        // ignore all errors
    }
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.undo = function (apply) {
    try {
        var graph = this.editor.graph;

        if (graph.isEditing()) {
            // Stops editing and executes undo on graph if native undo
            // does not affect current editing value
            var value = graph.cellEditor.textarea.innerHTML;
            document.execCommand("undo", false, null);

            if (value == graph.cellEditor.textarea.innerHTML) {
                graph.stopEditing(true);
                this.editor.undoManager.undo();
            }
        } else {
            this.editor.undoManager.undo();
        }

        apply =
            apply != null
                ? apply
                : mxUtils.bind(this, function (image) {
                    //var change = new ChangePageSetup(this, null, image);
                    //change.ignoreColor = true;

                    //this.editor.graph.model.execute(change);
                    //this.setBackgroundImage(image);
                    this.setPageFormat(
                        new mxRectangle(
                            0,
                            0,
                            parseInt(currentbgImage.width),
                            parseInt(currentbgImage.height)
                        )
                    );
                });
        var currentbgImage = graph.getBackgroundImage();
        if (currentbgImage) {
            apply(
                new mxImage(
                    currentbgImage.src,
                    currentbgImage.width,
                    currentbgImage.height
                )
            );
            jQuery("#currentImage").attr("href", currentbgImage.src);
            jQuery("#mainDivdownloadButton").show;
        }
    } catch (e) {
        // ignore all errors
    }
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.canRedo = function () {
    return this.editor.graph.isEditing() || this.editor.undoManager.canRedo();
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.canUndo = function () {
    return this.editor.graph.isEditing() || this.editor.undoManager.canUndo();
};

/**
 *
 */
EditorUi.prototype.getEditBlankXml = function () {
    return mxUtils.getXml(this.getGraphXml());
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.getUrl = function (pathname) {
    var href = pathname != null ? pathname : window.location.pathname;
    var parms = href.indexOf("?") > 0 ? 1 : 0;

    // Removes template URL parameter for new blank diagram
    for (var key in urlParams) {
        if (parms == 0) {
            href += "?";
        } else {
            href += "&";
        }

        href += key + "=" + urlParams[key];
        parms++;
    }

    return href;
};

/**
 * Specifies if the graph has scrollbars.
 */
EditorUi.prototype.setScrollbars = function (value) {
    var graph = this.editor.graph;
    var prev = graph.container.style.overflow;
    graph.scrollbars = value;
    this.editor.updateGraphComponents();

    if (prev != graph.container.style.overflow) {
        if (graph.container.style.overflow == "hidden") {
            var t = graph.view.translate;
            //		graph.view.setTranslate(t.x - graph.container.scrollLeft / graph.view.scale, t.y - graph.container.scrollTop / graph.view.scale);
            graph.view.setTranslate(
                -bounds.x - (bounds.width - container.clientWidth) / 2,
                -bounds.y - (bounds.height - container.clientHeight) / 2
            );
            graph.container.scrollLeft = 0;
            graph.container.scrollTop = 0;
            graph.minimumGraphSize = null;
            graph.sizeDidChange();
        } else {
            var dx = graph.view.translate.x;
            var dy = graph.view.translate.y;

            graph.view.translate.x = 0;
            graph.view.translate.y = 0;
            graph.sizeDidChange();
            graph.container.scrollLeft -= Math.round(dx * graph.view.scale);
            graph.container.scrollTop -= Math.round(dy * graph.view.scale);
        }
    }

    this.fireEvent(new mxEventObject("scrollbarsChanged"));
};

/**
 * Returns true if the graph has scrollbars.
 */
EditorUi.prototype.hasScrollbars = function () {
    return this.editor.graph.scrollbars;
};

/**
 * Resets the state of the scrollbars.
 */
EditorUi.prototype.resetScrollbars = function () {
    var graph = this.editor.graph;

    if (!this.editor.extendCanvas) {
        graph.container.scrollTop = 0;
        graph.container.scrollLeft = 0;

        if (!mxUtils.hasScrollbars(graph.container)) {
            graph.view.setTranslate(0, 0);
        }
    } else if (!this.editor.chromeless) {
        if (mxUtils.hasScrollbars(graph.container)) {
            if (graph.pageVisible) {
                var pad = graph.getPagePadding();
                graph.container.scrollTop = Math.floor(
                    pad.y - this.editor.initialTopSpacing
                );
                graph.container.scrollLeft = Math.floor(
                    Math.min(
                        pad.x,
                        (graph.container.scrollWidth - graph.container.clientWidth) / 2
                    )
                );

                // Scrolls graph to visible area
                var bounds = graph.getGraphBounds();

                if (bounds.width > 0 && bounds.height > 0) {
                    if (
                        bounds.x >
                        graph.container.scrollLeft + graph.container.clientWidth * 0.9
                    ) {
                        graph.container.scrollLeft = Math.min(
                            bounds.x + bounds.width - graph.container.clientWidth,
                            bounds.x - 10
                        );
                    }

                    if (
                        bounds.y >
                        graph.container.scrollTop + graph.container.clientHeight * 0.9
                    ) {
                        graph.container.scrollTop = Math.min(
                            bounds.y + bounds.height - graph.container.clientHeight,
                            bounds.y - 10
                        );
                    }
                }
            } else {
                var bounds = graph.getGraphBounds();
                var width = Math.max(
                    bounds.width,
                    graph.scrollTileSize.width * graph.view.scale
                );
                var height = Math.max(
                    bounds.height,
                    graph.scrollTileSize.height * graph.view.scale
                );
                graph.container.scrollTop = Math.floor(
                    Math.max(
                        0,
                        bounds.y - Math.max(20, (graph.container.clientHeight - height) / 4)
                    )
                );
                graph.container.scrollLeft = Math.floor(
                    Math.max(
                        0,
                        bounds.x - Math.max(0, (graph.container.clientWidth - width) / 2)
                    )
                );
            }
        } else {
            // This code is not actively used since the default for scrollbars is always true
            if (graph.pageVisible) {
                var b = graph.view.getBackgroundPageBounds();
                graph.view.setTranslate(
                    Math.floor(
                        Math.max(0, (graph.container.clientWidth - b.width) / 2) - b.x
                    ),
                    Math.floor(
                        Math.max(0, (graph.container.clientHeight - b.height) / 2) - b.y
                    )
                );
            } else {
                var bounds = graph.getGraphBounds();
                graph.view.setTranslate(
                    Math.floor(
                        Math.max(
                            0,
                            Math.max(0, (graph.container.clientWidth - bounds.width) / 2) -
                            bounds.x
                        )
                    ),
                    Math.floor(
                        Math.max(
                            0,
                            Math.max(20, (graph.container.clientHeight - bounds.height) / 4)
                        ) - bounds.y
                    )
                );
            }
        }
    }
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageVisible = function (value) {
    var graph = this.editor.graph;
    var hasScrollbars = mxUtils.hasScrollbars(graph.container);
    var tx = 0;
    var ty = 0;

    if (hasScrollbars) {
        tx = graph.view.translate.x * graph.view.scale - graph.container.scrollLeft;
        ty = graph.view.translate.y * graph.view.scale - graph.container.scrollTop;
    }

    graph.pageVisible = value;
    graph.pageBreaksVisible = value;
    graph.preferPageSize = value;
    graph.view.validateBackground();

    // Workaround for possible handle offset
    if (hasScrollbars) {
        var cells = graph.getSelectionCells();
        graph.clearSelection();
        graph.setSelectionCells(cells);
    }

    // Calls updatePageBreaks
    graph.sizeDidChange();

    if (hasScrollbars) {
        graph.container.scrollLeft = graph.view.translate.x * graph.view.scale - tx;
        graph.container.scrollTop = graph.view.translate.y * graph.view.scale - ty;
    }

    this.fireEvent(new mxEventObject("pageViewChanged"));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setBackgroundColor = function (value) {
    this.editor.graph.background = value;
    this.editor.graph.view.validateBackground();

    this.fireEvent(new mxEventObject("backgroundColorChanged"));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setFoldingEnabled = function (value) {
    this.editor.graph.foldingEnabled = value;
    this.editor.graph.view.revalidate();

    this.fireEvent(new mxEventObject("foldingEnabledChanged"));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageFormat = function (value) {
    this.editor.graph.pageFormat = value;

    if (!this.editor.graph.pageVisible) {
        this.actions.get("pageView").funct();
    } else {
        this.editor.graph.view.validateBackground();
        this.editor.graph.sizeDidChange();
    }

    this.fireEvent(new mxEventObject("pageFormatChanged"));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageScale = function (value) {
    this.editor.graph.pageScale = value;

    if (!this.editor.graph.pageVisible) {
        this.actions.get("pageView").funct();
    } else {
        this.editor.graph.view.validateBackground();
        this.editor.graph.sizeDidChange();
    }

    this.fireEvent(new mxEventObject("pageScaleChanged"));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setGridColor = function (value) {
    this.editor.graph.view.gridColor = value;
    this.editor.graph.view.validateBackground();
    this.fireEvent(new mxEventObject("gridColorChanged"));
};

/**
 * Updates the states of the given undo/redo items.
 */
EditorUi.prototype.addUndoListener = function () {
    var undo = this.actions.get("undo");
    var redo = this.actions.get("redo");

    var undoMgr = this.editor.undoManager;

    var undoListener = mxUtils.bind(this, function () {
        if (mxCurrentfloorplanstatus != "viewer") {
            undo.setEnabled(this.canUndo());
            redo.setEnabled(this.canRedo());
        }
    });

    undoMgr.addListener(mxEvent.ADD, undoListener);
    undoMgr.addListener(mxEvent.UNDO, undoListener);
    undoMgr.addListener(mxEvent.REDO, undoListener);
    undoMgr.addListener(mxEvent.CLEAR, undoListener);

    // Overrides cell editor to update action states
    var cellEditorStartEditing = this.editor.graph.cellEditor.startEditing;

    this.editor.graph.cellEditor.startEditing = function () {
        cellEditorStartEditing.apply(this, arguments);
        undoListener();
    };

    var cellEditorStopEditing = this.editor.graph.cellEditor.stopEditing;

    this.editor.graph.cellEditor.stopEditing = function (cell, trigger) {
        cellEditorStopEditing.apply(this, arguments);
        undoListener();
    };

    // Updates the button states once
    undoListener();
};

/**
 * Updates the states of the given toolbar items based on the selection.
 */
EditorUi.prototype.updateActionStates = function () {
    var graph = this.editor.graph;
    var selected = !graph.isSelectionEmpty();
    var vertexSelected = false;
    var edgeSelected = false;

    var cells = graph.getSelectionCells();

    if (cells != null) {
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];

            if (graph.getModel().isEdge(cell)) {
                edgeSelected = true;
            }

            if (graph.getModel().isVertex(cell)) {
                vertexSelected = true;
            }

            if (edgeSelected && vertexSelected) {
                break;
            }
        }
    }

    // Updates action states
    var actions = [
        "cut",
        "copy",
        "bold",
        "italic",
        "underline",
        "delete",
        "duplicate",
        "editStyle",
        "editTooltip",
        "backgroundColor",
        "borderColor",
        "toFront",
        "toBack",
        "lockUnlock",
        "solid",
        "dashed",
        "dotted",
        "fillColor",
        "gradientColor",
        "shadow",
        "fontColor",
        "formattedText",
        "rounded",
        "toggleRounded",
        "sharp",
        "strokeColor",
    ];

    for (var i = 0; i < actions.length; i++) {
        this.actions.get(actions[i]).setEnabled(selected);
    }

    this.actions
        .get("setAsDefaultStyle")
        .setEnabled(graph.getSelectionCount() == 1);
    this.actions.get("clearWaypoints").setEnabled(!graph.isSelectionEmpty());
    this.actions.get("turn").setEnabled(!graph.isSelectionEmpty());
    this.actions.get("curved").setEnabled(edgeSelected);
    this.actions.get("rotation").setEnabled(vertexSelected);
    this.actions.get("wordWrap").setEnabled(vertexSelected);
    this.actions.get("autosize").setEnabled(vertexSelected);
    this.actions.get("collapsible").setEnabled(vertexSelected);
    var oneVertexSelected = vertexSelected && graph.getSelectionCount() == 1;
    this.actions
        .get("group")
        .setEnabled(
            graph.getSelectionCount() > 1 ||
            (oneVertexSelected && !graph.isContainer(graph.getSelectionCell()))
        );
    this.actions
        .get("ungroup")
        .setEnabled(
            graph.getSelectionCount() == 1 &&
            (graph.getModel().getChildCount(graph.getSelectionCell()) > 0 ||
                (oneVertexSelected && graph.isContainer(graph.getSelectionCell())))
        );
    this.actions
        .get("removeFromGroup")
        .setEnabled(
            oneVertexSelected &&
            graph
                .getModel()
                .isVertex(graph.getModel().getParent(graph.getSelectionCell()))
        );

    // Updates menu states
    var state = graph.view.getState(graph.getSelectionCell());
    this.menus
        .get("navigation")
        .setEnabled(selected || graph.view.currentRoot != null);
    this.actions
        .get("collapsible")
        .setEnabled(
            vertexSelected &&
            graph.getSelectionCount() == 1 &&
            (graph.isContainer(graph.getSelectionCell()) ||
                graph.model.getChildCount(graph.getSelectionCell()) > 0)
        );
    this.actions.get("home").setEnabled(graph.view.currentRoot != null);
    this.actions.get("exitGroup").setEnabled(graph.view.currentRoot != null);
    this.actions
        .get("enterGroup")
        .setEnabled(
            graph.getSelectionCount() == 1 &&
            graph.isValidRoot(graph.getSelectionCell())
        );
    var foldable =
        graph.getSelectionCount() == 1 &&
        graph.isCellFoldable(graph.getSelectionCell());
    this.actions.get("expand").setEnabled(foldable);
    this.actions.get("collapse").setEnabled(foldable);
    // this.actions.get('editLink').setEnabled(graph.getSelectionCount() == 1);
    this.actions
        .get("openLink")
        .setEnabled(
            graph.getSelectionCount() == 1 &&
            graph.getLinkForCell(graph.getSelectionCell()) != null
        );
    this.actions.get("guides").setEnabled(graph.isEnabled());
    this.actions.get("grid").setEnabled(!this.editor.chromeless);

    var unlocked =
        graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent());
    this.menus.get("layout").setEnabled(unlocked);
    this.menus.get("insert").setEnabled(unlocked);
    this.menus.get("direction").setEnabled(unlocked && vertexSelected);
    this.menus
        .get("align")
        .setEnabled(unlocked && vertexSelected && graph.getSelectionCount() > 1);
    this.menus
        .get("distribute")
        .setEnabled(unlocked && vertexSelected && graph.getSelectionCount() > 1);
    if (mxCurrentfloorplanstatus != "viewer") {
        this.actions.get("selectVertices").setEnabled(unlocked);
        this.actions.get("selectAll").setEnabled(unlocked);
        //this.actions.get('selectEdges').setEnabled(unlocked);
    }
    this.actions.get("selectNone").setEnabled(unlocked);

    this.updatePasteActionStates();
};

/**
 * Refreshes the viewport.
 */
EditorUi.prototype.refresh = function (sizeDidChange) {
    sizeDidChange = sizeDidChange != null ? sizeDidChange : true;

    var quirks =
        mxClient.IS_IE &&
        (document.documentMode == null || document.documentMode == 5);
    var w = this.container.clientWidth;
    var h = this.container.clientHeight;

    if (this.container == document.body) {
        w = document.body.clientWidth || document.documentElement.clientWidth;
        h = quirks
            ? document.body.clientHeight || document.documentElement.clientHeight
            : document.documentElement.clientHeight;
    }

    // Workaround for bug on iOS see
    // http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
    // FIXME: Fix if footer visible
    var off = 0;

    if (mxClient.IS_IOS && !window.navigator.standalone) {
        if (window.innerHeight != document.documentElement.clientHeight) {
            off = document.documentElement.clientHeight - window.innerHeight;
            window.scrollTo(0, 0);
        }
    }

    var effHsplitPosition = Math.max(
        0,
        Math.min(this.hsplitPosition, w - this.splitSize - 20)
    );

    var tmp = 0;

    if (this.menubar != null) {
        this.menubarContainer.style.height = "80px"; //Editing By Qasim this.menubarHeight + 'px';
        tmp += this.menubarHeight;
    }

    if (this.toolbar != null) {
        if (mxCurrentfloorplanstatus != "viewer") {
            this.toolbarContainer.style.top = "85px"; //Editing By Qasim riaz this.menubarHeight + 'px';
        } else {
            this.toolbarContainer.style.top = "0px";
        }
        this.toolbarContainer.style.height = this.toolbarHeight + "px";
        tmp += this.toolbarHeight;
    }

    if (tmp > 0 && !mxClient.IS_QUIRKS) {
        tmp += 1;
    }

    var sidebarFooterHeight = 0;

    if (this.sidebarFooterContainer != null) {
        var bottom = this.footerHeight + off;
        sidebarFooterHeight = Math.max(
            0,
            Math.min(h - tmp - bottom, this.sidebarFooterHeight)
        );
        this.sidebarFooterContainer.style.width = effHsplitPosition + "px";
        this.sidebarFooterContainer.style.height = sidebarFooterHeight + "px";
        this.sidebarFooterContainer.style.bottom = bottom + "px";
    }

    var fw = this.format != null ? this.formatWidth : 0;
    if (mxCurrentfloorplanstatus != "viewer") {
        this.sidebarContainer.style.top = "120px"; //Editing BY Qasim Riaz this.sidebarContainer.style.top;
    } else {
        this.sidebarContainer.style.top = "34px";
    }

    //this.sidebarContainer.style.top = '120px';//Editing By Qasim Riaz tmp + 'px';
    this.sidebarContainer.style.width = effHsplitPosition + "px";
    this.formatContainer.style.top = "120px"; //Editing BY Qasim Riaz tmp + 'px';
    this.formatContainer.style.width = fw + "px";
    this.formatContainer.style.display = this.format != null ? "" : "none";
    this.diagramContainer.style.left =
        this.hsplit.parentNode != null
            ? effHsplitPosition + this.splitSize + "px"
            : "0px";

    if (mxCurrentfloorplanstatus != "viewer") {
        this.diagramContainer.style.top = "120px"; //Editing BY Qasim Riaz this.sidebarContainer.style.top;
    } else {
        this.diagramContainer.style.top = "0px";
    }
    this.footerContainer.style.height = this.footerHeight + "px";
    this.hsplit.style.top = this.sidebarContainer.style.top;
    this.hsplit.style.bottom = this.footerHeight + off + "px";
    this.hsplit.style.left = effHsplitPosition + "px";

    if (this.tabContainer != null) {
        this.tabContainer.style.left = this.diagramContainer.style.left;
    }

    if (quirks) {
        this.menubarContainer.style.width = w + "px";
        this.toolbarContainer.style.width = this.menubarContainer.style.width;
        var sidebarHeight = Math.max(
            0,
            h - this.footerHeight - this.menubarHeight - this.toolbarHeight
        );
        this.sidebarContainer.style.height =
            sidebarHeight - sidebarFooterHeight + "px";
        this.formatContainer.style.height = sidebarHeight + "px";
        this.diagramContainer.style.width =
            this.hsplit.parentNode != null
                ? Math.max(0, w - effHsplitPosition - this.splitSize - fw) + "px"
                : w + "px";
        this.footerContainer.style.width = this.menubarContainer.style.width;
        var diagramHeight = Math.max(
            0,
            h - this.footerHeight - this.menubarHeight - this.toolbarHeight
        );

        if (this.tabContainer != null) {
            this.tabContainer.style.width = this.diagramContainer.style.width;
            this.tabContainer.style.bottom = this.footerHeight + off + "px";
            diagramHeight -= this.tabContainer.clientHeight;
        }

        this.diagramContainer.style.height = diagramHeight + "px";
        this.hsplit.style.height = diagramHeight + "px";
    } else {
        if (this.footerHeight > 0) {
            this.footerContainer.style.bottom = off + "px";
        }

        this.diagramContainer.style.right = fw + "px";
        var th = 0;

        if (this.tabContainer != null) {
            this.tabContainer.style.bottom = this.footerHeight + off + "px";
            this.tabContainer.style.right = this.diagramContainer.style.right;
            th = this.tabContainer.clientHeight;
        }

        this.sidebarContainer.style.bottom =
            this.footerHeight + sidebarFooterHeight + off + "px";
        this.formatContainer.style.bottom = this.footerHeight + off + "px";
        this.diagramContainer.style.bottom = this.footerHeight + off + th + "px";
    }

    if (sizeDidChange) {
        this.editor.graph.sizeDidChange();
    }
};

/**
 * Creates the required containers.
 */
EditorUi.prototype.createTabContainer = function () {
    return null;
};

/**
 * Creates the required containers.
 */
EditorUi.prototype.createDivs = function () {
    this.menubarContainer = this.createDiv("geMenubarContainer");
    this.toolbarContainer = this.createDiv("geToolbarContainer");
    this.sidebarContainer = this.createDiv("geSidebarContainer");
    this.formatContainer = this.createDiv("geSidebarContainer");
    this.diagramContainer = this.createDiv("geDiagramContainer");
    this.footerContainer = this.createDiv("geFooterContainer");
    this.hsplit = this.createDiv("geHsplit");
    this.hsplit.setAttribute("title", mxResources.get("collapseExpand"));

    // Sets static style for containers
    this.menubarContainer.style.top = "0px";
    this.menubarContainer.style.left = "2%";
    this.menubarContainer.style.right = "0px";
    this.menubarContainer.style.textAlign = "center";
    this.toolbarContainer.style.left = "0px";
    this.toolbarContainer.style.right = "0px";
    this.sidebarContainer.style.left = "0px";
    this.formatContainer.style.right = "0px";
    this.formatContainer.style.zIndex = "1";
    this.diagramContainer.style.right =
        (this.format != null ? this.formatWidth : 0) + "px";
    this.footerContainer.style.left = "0px";
    this.footerContainer.style.right = "0px";
    this.footerContainer.style.bottom = "0px";
    this.footerContainer.style.zIndex = mxPopupMenu.prototype.zIndex - 2;
    this.hsplit.style.width = this.splitSize + "px";

    // Only vertical scrollbars, no background in format sidebar
    this.formatContainer.style.backgroundColor = "whiteSmoke";
    this.formatContainer.style.overflowX = "hidden";
    this.formatContainer.style.overflowY = "auto";
    this.formatContainer.style.fontSize = "12px";

    this.sidebarFooterContainer = this.createSidebarFooterContainer();

    if (this.sidebarFooterContainer) {
        this.sidebarFooterContainer.style.left = "0px";
    }

    if (!this.editor.chromeless) {
        this.tabContainer = this.createTabContainer();
    }
};

/**
 * Hook for sidebar footer container. This implementation returns null.
 */
EditorUi.prototype.createSidebarFooterContainer = function () {
    return null;
};

/**
 * Creates the required containers.
 */
EditorUi.prototype.createUi = function () {
    // Creates menubar
    if (mxCurrentfloorplanstatus != "viewer") {
        this.menubar = this.editor.chromeless
            ? null
            : this.menus.createMenubar(this.createDiv("geMenubar"));
    }

    if (this.menubar != null) {
        this.menubarContainer.appendChild(this.menubar.container);
    }

    // Adds status bar in menubar
    if (this.menubar != null) {
        this.currentsitenamehtml = this.createStatusContainer();
        this.statusContainer = this.createStatusContainer();

        // Connects the status bar to the editor status
        this.editor.addListener(
            "statusChanged",
            mxUtils.bind(this, function () {
                this.setStatusText(this.editor.getStatus());
            })
        );

        this.setStatusText(this.editor.getStatus());
        this.menubar.container.appendChild(this.statusContainer);

        // Inserts into DOM
        this.container.appendChild(this.menubarContainer);
    }

    var sitenamedive = this.createDiv("sitename");

    if (mxCurrentfloorplanstatus != "viewer") {
        this.sitename = this.editor.chromeless
            ? null
            : this.menus.createMenubar(sitenamedive);
    }
    if (this.sitename != null) {
        this.currentsitenamehtml = this.createSiteTitleContainer();
        this.sitename.container.appendChild(this.currentsitenamehtml);
        // this.container.appendChild(this.menubarContainer);

        var backtodashboarddiv = this.createDiv("backtodashboard");

        this.backtodashboard = this.editor.chromeless
            ? null
            : this.menus.createMenubar(backtodashboarddiv);
        // this.menubarContainer.appendChild(this.backtodashboard.container);
        this.backdashboardhtml = this.createBackButtonContainer();
        var divcontent = '<div class="dropdown" ></div>';

        var helpbuttondiv = this.createDiv("helpbutton");
        var helpbutton = document.createElement("BUTTON");
        helpbutton.className = "helpbutton";
        helpbutton.title = "Help";
        helpbutton.innerHTML =
            '<i class="fa fa-info-circle" aria-hidden="true"></i>&nbsp;&nbsp;Help ';
        //helpbuttondiv.appendChild(helpbutton);

        var divmaintopbar = this.createDiv("backtodashtop");

        var sitenamehtml = document.createElement("div");
        var sitenamehtml3 = document.createElement("div");
        var sitenamehtml2 = document.createElement("div");

        sitenamehtml.className = "toast-fixed";
        sitenamehtml3.className = "js-toast-container";
        sitenamehtml2.className = "toast toast--error toast--dismiss";

        sitenamehtml2.innerHTML =
            '<p class="toast__text">Important: Your users cannot purchase booths online while you are in the floor plan editor. It is recommended to exit the editor as soon as you\'re done making edits.</p>';

        sitenamehtml3.append(sitenamehtml2);
        sitenamehtml.append(sitenamehtml3);
        divmaintopbar.append(sitenamehtml);

        mxEvent.addListener(sitenamehtml2, "click", function () {
            jQuery(".toast-fixed").remove();
        });

        this.backtodashboard.container.appendChild(helpbuttondiv);
        this.backtodashboard.container.appendChild(this.backdashboardhtml);
        this.backtodashboard.container.appendChild(divmaintopbar);

        this.menubarContainer.appendChild(this.sitename.container);
        this.menubarContainer.appendChild(this.backtodashboard.container);
    }

    // Creates the sidebar
    // if(mxCurrentfloorplanstatus !='viewer'){
    this.sidebar = this.editor.chromeless
        ? null
        : this.createSidebar(this.sidebarContainer);
    //  }

    if (mxCurrentfloorplanstatus != "viewer") {
        mxEvent.addListener(helpbutton, "click", function () {
            embedhelplightbox = jQuery.confirm({
                title: "",
                content:
                    '<p id="loadingicon" style="text-align:center;"><img width="50" src="' +
                    mxCurrentSiteUrl +
                    '/wp-content/plugins/EGPL/js/loading.gif"></p><p id="helpvidep" style="text-align: center;display:none;"><iframe onload="iframeLoaded()" height="600" src="https://help.expo-genie.com/floor-plan-editor/" width="100%"  frameborder="0" allowfullscreen="allowfullscreen"><span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start">?</span></iframe></p>',
                confirmButton: false,
                cancelButton: false,
                animation: "rotateY",
                columnClass: "jconfirm-box-container-mycustomespecial",
                closeIcon: true,
            });
        });
    }

    if (this.sidebar != null) {
        this.container.appendChild(this.sidebarContainer);
    }

    // Creates the format sidebar
    if (mxCurrentfloorplanstatus != "viewer") {
        this.format =
            this.editor.chromeless || !this.formatEnabled
                ? null
                : this.createFormat(this.formatContainer);
    }
    if (this.format != null) {
        this.container.appendChild(this.formatContainer);
    }

    // Creates the footer
    if (mxCurrentfloorplanstatus != "viewer") {
        var footer = this.editor.chromeless ? null : this.createFooter();
    }
    if (footer != null) {
        this.footerContainer.appendChild(footer);
        this.container.appendChild(this.footerContainer);
    }

    if (this.sidebar != null && this.sidebarFooterContainer) {
        this.container.appendChild(this.sidebarFooterContainer);
    }

    this.container.appendChild(this.diagramContainer);

    if (this.container != null && this.tabContainer != null) {
        this.container.appendChild(this.tabContainer);
    }

    // Creates toolbar

    this.toolbar = this.editor.chromeless
        ? null
        : this.createToolbar(this.createDiv("geToolbar"));

    if (this.toolbar != null) {
        this.toolbarContainer.appendChild(this.toolbar.container);
        this.container.appendChild(this.toolbarContainer);
    }

    // HSplit
    if (this.sidebar != null) {
        this.container.appendChild(this.hsplit);
        var widthscreensize = jQuery(window).width();
        // console.log(widthscreensize);
        if (md.phone() != null) {
            if (checkinitalstatus != true) {
                this.hsplitPosition = 0;
                this.refresh();
                checkinitalstatus = true;
            }
        }

        this.addSplitHandler(
            this.hsplit,
            true,
            0,
            mxUtils.bind(this, function (value) {
                if (value == 0) {
                    value = 208;
                } else {
                    value = 0;
                }
                this.hsplitPosition = value;
                this.refresh();
            })
        );
    }
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.createBackButtonContainer = function () {
    var div = this.createDiv("backtodash");
    var sitenamehtml = document.createElement("a");
    sitenamehtml.className = "customemenulink";
    sitenamehtml.innerHTML = "< Back to dashboard";
    sitenamehtml.href = mxCurrentSiteUrl + "/dashboard/";
    //div.append(sitenamehtml);
    return div;
};

//EditorUi.prototype.createBackButtonContainer = function()
//{
//	var div = this.createDiv('backtodash');
//
//
//        var sitenamehtml = document.createElement('div');
//        var sitenamehtml3 = document.createElement('div');
//        var sitenamehtml2 = document.createElement('div');
//
//
//        sitenamehtml.className = 'toast-fixed';
//        sitenamehtml3.className = 'js-toast-container';
//        sitenamehtml2.className = 'toast toast--error toast--dismiss';
//
//
//
//        sitenamehtml2.innerHTML  ='<p class="toast__text">Important: Your users cannot purchase booths online while you are in the floor plan editor. Be sure to exit the editor as soon as you\'re done making edits. You will also be logged out of the floor plan editor automatically if idle for 2 minutes.</p>';
//
//        sitenamehtml3.append(sitenamehtml2);
//        sitenamehtml.append(sitenamehtml3);
//        div.append(sitenamehtml);
//
//        mxEvent.addListener(sitenamehtml2, 'click', function()
//	{
//
//            jQuery(".toast-fixed").remove();
//
//        });
//
////        var sitenamehtml = document.createElement('a');
////        sitenamehtml.className = 'customemenulink';
////        sitenamehtml.innerHTML  ='< Back to dashboard';
////        sitenamehtml.href = mxCurrentSiteUrl+'/dashboard/';
////        div.append(sitenamehtml);
//        return div;
//};
EditorUi.prototype.createSiteTitleContainer = function () {
    var sitenamehtml = document.createElement("h2");

    sitenamehtml.style.color = "#000";

    sitenamehtml.style.fontSize = "20px";

    sitenamehtml.style.fontWeight = "normal";
    sitenamehtml.innerHTML =
        '<a class="customemenulink" style="margin-left: 3%;" href="' +
        mxCurrentSiteUrl +
        '" target="_blank">' +
        mxCurrentSiteTitle +
        "</a>";
    return sitenamehtml;
};
EditorUi.prototype.createStatusContainer = function () {
    var container = document.createElement("img");

    container.style.paddingTop = "6px";
    container.style.paddingLeft = "8px";
    container.style.paddingBottom = "6px";
    container.style.paddingRight = "8px";

    container.style.float = "left";
    container.style.height = "66px";
    container.src = mxCurrentSiteLogo; //'http://expo-genie.com/wp-content/uploads/2016/10/ExpoGenie-Logo-1.png';

    return container;
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.setStatusText = function (value) {
    this.statusContainer.innerHTML = value;
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.createToolbar = function (container) {
    return new Toolbar(this, container);
};

/**
 * Creates a new sidebar for the given container.
 */
EditorUi.prototype.createSidebar = function (container) {
    return new Sidebar(this, container);
};

/**
 * Creates a new sidebar for the given container.
 */
EditorUi.prototype.createFormat = function (container) {
    return new Format(this, container);
};

/**
 * Creates and returns a new footer.
 */
EditorUi.prototype.createFooter = function () {
    return this.createDiv("geFooter");
};

/**
 * Creates the actual toolbar for the toolbar container.
 */
EditorUi.prototype.createDiv = function (classname) {
    var elt = document.createElement("div");
    elt.className = classname;

    return elt;
};

/**
 * Updates the states of the given undo/redo items.
 */
EditorUi.prototype.addSplitHandler = function (elt, horizontal, dx, onChange) {
    var start = null;
    var initial = null;
    var ignoreClick = true;
    var last = null;

    // Disables built-in pan and zoom in IE10 and later
    if (mxClient.IS_POINTER) {
        elt.style.touchAction = "none";
    }

    var getValue = mxUtils.bind(this, function () {
        var result = parseInt(horizontal ? elt.style.left : elt.style.bottom);

        // Takes into account hidden footer
        if (!horizontal) {
            result = result + dx - this.footerHeight;
        }

        return result;
    });

    function moveHandler(evt) {
        if (start != null) {
            var pt = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
            onChange(
                Math.max(
                    0,
                    initial + (horizontal ? pt.x - start.x : start.y - pt.y) - dx
                )
            );
            mxEvent.consume(evt);

            if (initial != getValue()) {
                ignoreClick = true;
                last = null;
            }
        }
    }

    function dropHandler(evt) {
        moveHandler(evt);
        initial = null;
        start = null;
    }

    mxEvent.addGestureListeners(elt, function (evt) {
        start = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
        initial = getValue();
        ignoreClick = false;
        mxEvent.consume(evt);
    });

    mxEvent.addListener(elt, "click", function (evt) {
        if (!ignoreClick) {
            var next = last != null ? last - dx : 0;
            last = getValue();
            onChange(next);
            mxEvent.consume(evt);
        }
    });

    mxEvent.addGestureListeners(document, null, moveHandler, dropHandler);

    this.destroyFunctions.push(function () {
        mxEvent.removeGestureListeners(document, null, moveHandler, dropHandler);
    });
};

/**
 * Displays a print dialog.
 */
EditorUi.prototype.showDialog = function (elt, w, h, modal, closable, onClose) {
    this.editor.graph.tooltipHandler.hideTooltip();

    if (this.dialogs == null) {
        this.dialogs = [];
    }

    this.dialog = new Dialog(this, elt, w, h, modal, closable, onClose);
    this.dialogs.push(this.dialog);
};

/**
 * Displays a print dialog.
 */
EditorUi.prototype.hideDialog = function (cancel) {
    if (this.dialogs != null && this.dialogs.length > 0) {
        var dlg = this.dialogs.pop();
        dlg.close(cancel);

        this.dialog =
            this.dialogs.length > 0 ? this.dialogs[this.dialogs.length - 1] : null;

        if (
            this.dialog == null &&
            this.editor.graph.container.style.visibility != "hidden"
        ) {
            this.editor.graph.container.focus();
        }

        this.editor.fireEvent(new mxEventObject("hideDialog"));
    }
};

/**
 * Display a color dialog.
 */
EditorUi.prototype.pickColor = function (color, apply) {
    var graph = this.editor.graph;
    var selState = graph.cellEditor.saveSelection();

    var startfloorplanedtitng = {};

    startfloorplanedtitng.selectedcolor = color;
    startfloorplanedtitng.selectedcolorstate = selState;
    startfloorplanedtitng.datetime = new Date(jQuery.now());
    startfloorplanedtitng.event = "opencolordilogun/occ";
    expogenielogging.push(startfloorplanedtitng);

    var dlg = new ColorDialog(
        this,
        color || "none",
        function (color) {
            graph.cellEditor.restoreSelection(selState);
            apply(color);
        },
        function () {
            graph.cellEditor.restoreSelection(selState);
        }
    );
    this.showDialog(dlg.container, 220, 430, true, false);
    dlg.init();
};

/**
 * Adds the label menu items to the given menu and parent.
 */
EditorUi.prototype.openFile = function () {
    // Closes dialog after open
    window.openFile = new OpenFile(
        mxUtils.bind(this, function (cancel) {
            this.hideDialog(cancel);
        })
    );

    // Removes openFile if dialog is closed
    this.showDialog(
        new OpenDialog(this).container,
        Editor.useLocalStorage ? 640 : 320,
        Editor.useLocalStorage ? 480 : 220,
        true,
        true,
        function () {
            window.openFile = null;
        }
    );
};

/**
 * Extracs the graph model from the given HTML data from a data transfer event.
 */
EditorUi.prototype.extractGraphModelFromHtml = function (data) {
    var result = null;

    try {
        var idx = data.indexOf("&lt;mxGraphModel ");

        if (idx >= 0) {
            var idx2 = data.lastIndexOf("&lt;/mxGraphModel&gt;");

            if (idx2 > idx) {
                result = data
                    .substring(idx, idx2 + 21)
                    .replace(/&gt;/g, ">")
                    .replace(/&lt;/g, "<")
                    .replace(/\\&quot;/g, '"')
                    .replace(/\n/g, "");
            }
        }
    } catch (e) {
        // ignore
    }

    return result;
};

/**
 * Opens the given files in the editor.
 */
EditorUi.prototype.extractGraphModelFromEvent = function (evt) {
    var result = null;
    var data = null;

    if (evt != null) {
        var provider =
            evt.dataTransfer != null ? evt.dataTransfer : evt.clipboardData;
        // console.log(evt);
        if (provider != null) {
            if (document.documentMode == 10 || document.documentMode == 11) {
                data = provider.getData("Text");
            } else {
                data =
                    mxUtils.indexOf(provider.types, "text/html") >= 0
                        ? provider.getData("text/html")
                        : null;

                if (
                    mxUtils.indexOf(
                        provider.types,
                        "text/plain" && (data == null || data.length == 0)
                    )
                ) {
                    data = provider.getData("text/plain");
                }
            }

            if (data != null) {
                data = this.editor.graph.zapGremlins(mxUtils.trim(data));

                // Tries parsing as HTML document with embedded XML
                var xml = this.extractGraphModelFromHtml(data);

                if (xml != null) {
                    data = xml;
                }
            }
        }
    }

    if (data != null && this.isCompatibleString(data)) {
        result = data;
    }

    return result;
};

/**
 * Hook for subclassers to return true if event data is a supported format.
 * This implementation always returns false.
 */
EditorUi.prototype.isCompatibleString = function (data) {
    return false;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
EditorUi.prototype.updateGraphStatus = function () {
    this.editor.setModified(false);
};
EditorUi.prototype.saveFile = function (forceDialog) {
    if (!forceDialog && this.editor.filename != null) {
        this.save(this.editor.getOrCreateFilename());
    } else {
        var dlg = new FilenameDialog(
            this,
            this.editor.getOrCreateFilename(),
            mxResources.get("save"),
            mxUtils.bind(this, function (name) {
                this.save(name);
            }),
            null,
            mxUtils.bind(this, function (name) {
                if (name != null && name.length > 0) {
                    return true;
                }

                mxUtils.confirm(mxResources.get("invalidName"));

                return false;
            })
        );
        this.showDialog(dlg.container, 300, 100, true, true);
        dlg.init();
    }
};

/**
 * Saves the current graph under the given filename.
 */
EditorUi.prototype.save = function (name) {
    if (name != null) {
        if (this.editor.graph.isEditing()) {
            this.editor.graph.stopEditing();
        }

        var xml = mxUtils.getXml(this.editor.getGraphXml());

        try {
            if (Editor.useLocalStorage) {
                if (
                    localStorage.getItem(name) != null &&
                    !mxUtils.confirm(mxResources.get("replaceIt", [name]))
                ) {
                    return;
                }

                localStorage.setItem(name, xml);
                this.editor.setStatus(
                    mxUtils.htmlEntities(mxResources.get("saved")) + " " + new Date()
                );
            } else {
                if (xml.length < MAX_REQUEST_SIZE) {
                    new mxXmlRequest(
                        SAVE_URL,
                        "filename=" +
                        encodeURIComponent(name) +
                        "&xml=" +
                        encodeURIComponent(xml)
                    ).simulate(document, "_blank");
                } else {
                    mxUtils.alert(mxResources.get("drawingTooLarge"));
                    mxUtils.popup(xml);

                    return;
                }
            }

            this.editor.setModified(false);
            this.editor.setFilename(name);
            this.updateDocumentTitle();
        } catch (e) {
            this.editor.setStatus(
                mxUtils.htmlEntities(mxResources.get("errorSavingFile"))
            );
        }
    }
};

/**
 * Executes the given layout.
 */
EditorUi.prototype.executeLayout = function (exec, animate, post) {
    var graph = this.editor.graph;

    if (graph.isEnabled()) {
        graph.getModel().beginUpdate();
        try {
            exec();
        } catch (e) {
            throw e;
        } finally {
            // Animates the changes in the graph model except
            // for Camino, where animation is too slow
            if (
                this.allowAnimation &&
                animate &&
                navigator.userAgent.indexOf("Camino") < 0
            ) {
                // New API for animating graph layout results asynchronously
                var morph = new mxMorphing(graph);
                morph.addListener(
                    mxEvent.DONE,
                    mxUtils.bind(this, function () {
                        graph.getModel().endUpdate();

                        if (post != null) {
                            post();
                        }
                    })
                );

                morph.startAnimation();
            } else {
                graph.getModel().endUpdate();

                if (post != null) {
                    post();
                }
            }
        }
    }
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showImageDialog = function (
    title,
    value,
    fn,
    ignoreExisting
) {
    var cellEditor = this.editor.graph.cellEditor;
    var selState = cellEditor.saveSelection();
    var newValue = mxUtils.prompt(title, value);
    cellEditor.restoreSelection(selState);

    if (newValue != null && newValue.length > 0) {
        var img = new Image();

        img.onload = function () {
            fn(newValue, img.width, img.height);
        };
        img.onerror = function () {
            fn(null);
            mxUtils.alert(mxResources.get("fileNotFound"));
        };

        img.src = newValue;
    } else {
        fn(null);
    }
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showLinkDialog = function (value, btnLabel, fn) {
    var dlg = new LinkDialog(this, value, btnLabel, fn);
    this.showDialog(dlg.container, 420, 90, true, true);
    dlg.init();
};

EditorUi.prototype.showBackgroundImageDialog = function (apply) {
    apply =
        apply != null
            ? apply
            : mxUtils.bind(this, function (image) {
                var change = new ChangePageSetup(this, null, image);
                change.ignoreColor = true;

                this.editor.graph.model.execute(change);
                this.setBackgroundImage(image);
                this.setPageFormat(
                    new mxRectangle(0, 0, parseInt(image.width), parseInt(image.height))
                );
            });

    var newValue = this.newBackgroundImage.replace(/\s+/g, ""); //mxUtils.prompt(mxResources.get('backgroundImage'), '');
    // console.log("New Upload Image");
    // console.log(newValue);
    if (newValue != null && newValue.length > 0) {
        mxFloorBackground = newValue;
        jQuery("#currentImage").attr("href", mxFloorBackground);
        jQuery("#mainDivdownloadButton").show;
        var img = new Image();

        img.onload = function () {
            apply(new mxImage(newValue, img.width, img.height));
        };
        img.onerror = function () {
            apply(null);
            mxUtils.alert(mxResources.get("fileNotFound"));
        };

        img.src = newValue;
    } else {
        apply(null);
    }
};

EditorUi.prototype.SetbackgroundImageOnload = function (apply) {
    apply =
        apply != null
            ? apply
            : mxUtils.bind(this, function (image) {
                this.setBackgroundImage(image);

                //to resize canvas according to new background image
                if (image)
                    this.setPageFormat(
                        new mxRectangle(
                            0,
                            0,
                            parseInt(image.width),
                            parseInt(image.height)
                        )
                    );
            });
    // console.log("onload");
    var newValue = mxFloorBackground;

    if (newValue != null && newValue.length > 0) {
        var img = new Image();

        img.onload = function () {
            apply(new mxImage(newValue, img.width, img.height));
        };
        img.onerror = function () {
            apply(null);
            mxUtils.alert(mxResources.get("fileNotFound"));
        };

        img.src = newValue;
    } else {
        apply(null);
    }
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setBackgroundImage = function (image) {
    this.editor.graph.setBackgroundImage(image);
    this.editor.graph.view.validateBackgroundImage();

    this.fireEvent(new mxEventObject("backgroundImageChanged"));
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.confirm = function (msg, okFn, cancelFn) {
    if (mxUtils.confirm(msg)) {
        if (okFn != null) {
            okFn();
        }
    } else if (cancelFn != null) {
        cancelFn();
    }
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.createOutline = function (wnd) {
    var outline = new mxOutline(this.editor.graph);
    outline.border = 20;

    mxEvent.addListener(window, "resize", function () {
        outline.update();
    });

    this.addListener("pageFormatChanged", function () {
        outline.update();
    });

    return outline;
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.createKeyHandler = function (editor) {
    var editorUi = this;
    var graph = this.editor.graph;
    var keyHandler = new mxKeyHandler(graph);

    var isEventIgnored = keyHandler.isEventIgnored;
    keyHandler.isEventIgnored = function (evt) {
        // Handles undo/redo/ctrl+./,/u via action and allows ctrl+b/i only if editing value is HTML (except for FF and Safari)
        return (
            (!this.isControlDown(evt) ||
                mxEvent.isShiftDown(evt) ||
                (evt.keyCode != 90 &&
                    evt.keyCode != 89 &&
                    evt.keyCode != 188 &&
                    evt.keyCode != 190 &&
                    evt.keyCode != 85)) &&
            ((evt.keyCode != 66 && evt.keyCode != 73) ||
                !this.isControlDown(evt) ||
                (this.graph.cellEditor.isContentEditing() &&
                    !mxClient.IS_FF &&
                    !mxClient.IS_SF)) &&
            isEventIgnored.apply(this, arguments)
        );
    };

    // Ignores graph enabled state but not chromeless state
    keyHandler.isEnabledForEvent = function (evt) {
        return (
            !mxEvent.isConsumed(evt) && this.isGraphEvent(evt) && this.isEnabled()
        );
    };

    // Routes command-key to control-key on Mac
    keyHandler.isControlDown = function (evt) {
        return mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey);
    };

    var queue = [];
    var thread = null;

    // Helper function to move cells with the cursor keys
    function nudge(keyCode, stepSize, resize) {
        queue.push(function () {
            if (!graph.isSelectionEmpty() && graph.isEnabled()) {
                stepSize = stepSize != null ? stepSize : 1;

                if (resize) {
                    // Resizes all selected vertices
                    graph.getModel().beginUpdate();
                    try {
                        var cells = graph.getSelectionCells();

                        for (var i = 0; i < cells.length; i++) {
                            if (
                                graph.getModel().isVertex(cells[i]) &&
                                graph.isCellResizable(cells[i])
                            ) {
                                var geo = graph.getCellGeometry(cells[i]);

                                if (geo != null) {
                                    geo = geo.clone();

                                    if (keyCode == 37) {
                                        geo.width = Math.max(0, geo.width - stepSize);
                                    } else if (keyCode == 38) {
                                        geo.height = Math.max(0, geo.height - stepSize);
                                    } else if (keyCode == 39) {
                                        geo.width += stepSize;
                                    } else if (keyCode == 40) {
                                        geo.height += stepSize;
                                    }

                                    graph.getModel().setGeometry(cells[i], geo);
                                }
                            }
                        }
                    } finally {
                        graph.getModel().endUpdate();
                    }
                } else {
                    // Moves vertices up/down in a stack layout
                    var cell = graph.getSelectionCell();
                    var parent = graph.model.getParent(cell);
                    var layout = null;

                    if (
                        graph.getSelectionCount() == 1 &&
                        graph.model.isVertex(cell) &&
                        graph.layoutManager != null &&
                        !graph.isCellLocked(cell)
                    ) {
                        layout = graph.layoutManager.getLayout(parent);
                    }

                    if (layout != null && layout.constructor == mxStackLayout) {
                        var index = parent.getIndex(cell);

                        if (keyCode == 37 || keyCode == 38) {
                            graph.model.add(parent, cell, Math.max(0, index - 1));
                        } else if (keyCode == 39 || keyCode == 40) {
                            graph.model.add(
                                parent,
                                cell,
                                Math.min(graph.model.getChildCount(parent), index + 1)
                            );
                        }
                    } else {
                        var dx = 0;
                        var dy = 0;

                        if (keyCode == 37) {
                            dx = -stepSize;
                        } else if (keyCode == 38) {
                            dy = -stepSize;
                        } else if (keyCode == 39) {
                            dx = stepSize;
                        } else if (keyCode == 40) {
                            dy = stepSize;
                        }

                        graph.moveCells(
                            graph.getMovableCells(graph.getSelectionCells()),
                            dx,
                            dy
                        );
                    }
                }
            }
        });

        if (thread != null) {
            window.clearTimeout(thread);
        }

        thread = window.setTimeout(function () {
            if (queue.length > 0) {
                graph.getModel().beginUpdate();
                try {
                    for (var i = 0; i < queue.length; i++) {
                        queue[i]();
                    }

                    queue = [];
                } finally {
                    graph.getModel().endUpdate();
                }
                graph.scrollCellToVisible(graph.getSelectionCell());
            }
        }, 200);
    }

    // Overridden to handle special alt+shift+cursor keyboard shortcuts
    var directions = {
        37: mxConstants.DIRECTION_WEST,
        38: mxConstants.DIRECTION_NORTH,
        39: mxConstants.DIRECTION_EAST,
        40: mxConstants.DIRECTION_SOUTH,
    };

    var keyHandlerGetFunction = keyHandler.getFunction;

    // Alt+Shift+Keycode mapping to action
    var altShiftActions = {67: this.actions.get("clearWaypoints")}; // Alt+Shift+C

    mxKeyHandler.prototype.getFunction = function (evt) {
        if (graph.isEnabled()) {
            // TODO: Add alt modified state in core API, here are some specific cases
            if (
                !graph.isSelectionEmpty() &&
                mxEvent.isShiftDown(evt) &&
                mxEvent.isAltDown(evt)
            ) {
                var action = altShiftActions[evt.keyCode];

                if (action != null) {
                    return action.funct;
                }
            }

            if (evt.keyCode == 9 && mxEvent.isAltDown(evt)) {
                if (mxEvent.isShiftDown(evt)) {
                    // Alt+Shift+Tab
                    return function () {
                        graph.selectParentCell();
                    };
                } else {
                    // Alt+Tab
                    return function () {
                        graph.selectChildCell();
                    };
                }
            } else if (directions[evt.keyCode] != null && !graph.isSelectionEmpty()) {
                if (mxEvent.isShiftDown(evt) && mxEvent.isAltDown(evt)) {
                    if (graph.model.isVertex(graph.getSelectionCell())) {
                        return function () {
                            var cells = graph.connectVertex(
                                graph.getSelectionCell(),
                                directions[evt.keyCode],
                                graph.defaultEdgeLength,
                                evt,
                                true
                            );

                            if (cells != null && cells.length > 0) {
                                if (cells.length == 1 && graph.model.isEdge(cells[0])) {
                                    graph.setSelectionCell(
                                        graph.model.getTerminal(cells[0], false)
                                    );
                                } else {
                                    graph.setSelectionCell(cells[cells.length - 1]);
                                }

                                if (editorUi.hoverIcons != null) {
                                    editorUi.hoverIcons.update(
                                        graph.view.getState(graph.getSelectionCell())
                                    );
                                }
                            }
                        };
                    }
                } else {
                    // Avoids consuming event if no vertex is selected by returning null below
                    // Cursor keys move and resize (ctrl) cells
                    if (this.isControlDown(evt)) {
                        return function () {
                            nudge(
                                evt.keyCode,
                                mxEvent.isShiftDown(evt) ? graph.gridSize : null,
                                true
                            );
                        };
                    } else {
                        return function () {
                            nudge(
                                evt.keyCode,
                                mxEvent.isShiftDown(evt) ? graph.gridSize : null
                            );
                        };
                    }
                }
            }
        }

        return keyHandlerGetFunction.apply(this, arguments);
    };

    // Binds keystrokes to actions
    keyHandler.bindAction = mxUtils.bind(
        this,
        function (code, control, key, shift) {
            var action = this.actions.get(key);

            if (action != null) {
                var f = function () {
                    if (action.isEnabled()) {
                        action.funct();
                    }
                };

                if (control) {
                    if (shift) {
                        keyHandler.bindControlShiftKey(code, f);
                    } else {
                        keyHandler.bindControlKey(code, f);
                    }
                } else {
                    if (shift) {
                        keyHandler.bindShiftKey(code, f);
                    } else {
                        keyHandler.bindKey(code, f);
                    }
                }
            }
        }
    );

    var ui = this;
    var keyHandlerEscape = keyHandler.escape;
    keyHandler.escape = function (evt) {
        keyHandlerEscape.apply(this, arguments);
    };

    // Ignores enter keystroke. Remove this line if you want the
    // enter keystroke to stop editing. N, W, T are reserved.
    keyHandler.enter = function () {
    };

    keyHandler.bindControlShiftKey(36, function () {
        graph.exitGroup();
    }); // Ctrl+Shift+Home
    keyHandler.bindControlShiftKey(35, function () {
        graph.enterGroup();
    }); // Ctrl+Shift+End
    keyHandler.bindKey(36, function () {
        graph.home();
    }); // Home
    keyHandler.bindKey(35, function () {
        graph.refresh();
    }); // End
    keyHandler.bindAction(107, true, "zoomIn"); // Ctrl+Plus
    keyHandler.bindAction(109, true, "zoomOut"); // Ctrl+Minus
    keyHandler.bindAction(80, true, "print"); // Ctrl+P
    keyHandler.bindAction(79, true, "outline", true); // Ctrl+Shift+O
    keyHandler.bindAction(112, false, "about"); // F1

    if (!this.editor.chromeless) {
        keyHandler.bindControlKey(36, function () {
            if (graph.isEnabled()) {
                graph.foldCells(true);
            }
        }); // Ctrl+Home
        keyHandler.bindControlKey(35, function () {
            if (graph.isEnabled()) {
                graph.foldCells(false);
            }
        }); // Ctrl+End
        keyHandler.bindControlKey(13, function () {
            if (graph.isEnabled()) {
                graph.setSelectionCells(
                    graph.duplicateCells(graph.getSelectionCells(), false)
                );
            }
        }); // Ctrl+Enter
        keyHandler.bindAction(8, false, "delete"); // Backspace
        keyHandler.bindAction(8, true, "deleteAll"); // Backspace
        keyHandler.bindAction(46, false, "delete"); // Delete
        keyHandler.bindAction(46, true, "deleteAll"); // Ctrl+Delete
        keyHandler.bindAction(72, true, "resetView"); // Ctrl+H
        keyHandler.bindAction(72, true, "fitWindow", true); // Ctrl+Shift+H
        keyHandler.bindAction(74, true, "fitPage"); // Ctrl+J
        keyHandler.bindAction(74, true, "fitTwoPages", true); // Ctrl+Shift+J
        keyHandler.bindAction(48, true, "customZoom"); // Ctrl+0
        keyHandler.bindAction(82, true, "turn"); // Ctrl+R
        keyHandler.bindAction(82, true, "clearDefaultStyle", true); // Ctrl+Shift+R
        keyHandler.bindAction(83, true, "save"); // Ctrl+S
        keyHandler.bindAction(83, true, "saveAs", true); // Ctrl+Shift+S
        keyHandler.bindAction(65, true, "selectAll"); // Ctrl+A
        keyHandler.bindAction(65, true, "selectNone", true); // Ctrl+A
        keyHandler.bindAction(73, true, "selectVertices", true); // Ctrl+Shift+I
        keyHandler.bindAction(69, true, "selectEdges", true); // Ctrl+Shift+E
        keyHandler.bindAction(69, true, "editStyle"); // Ctrl+E
        keyHandler.bindAction(66, true, "bold"); // Ctrl+B
        keyHandler.bindAction(66, true, "toBack", true); // Ctrl+Shift+B
        keyHandler.bindAction(70, true, "toFront", true); // Ctrl+Shift+F
        keyHandler.bindAction(68, true, "duplicate"); // Ctrl+D
        keyHandler.bindAction(68, true, "setAsDefaultStyle", true); // Ctrl+Shift+D
        keyHandler.bindAction(90, true, "undo"); // Ctrl+Z
        keyHandler.bindAction(89, true, "autosize", true); // Ctrl+Shift+Y
        keyHandler.bindAction(88, true, "cut"); // Ctrl+X
        keyHandler.bindAction(67, true, "copy"); // Ctrl+C
        keyHandler.bindAction(81, true, "connectionArrows"); // Ctrl+Q
        keyHandler.bindAction(81, true, "connectionPoints", true); // Ctrl+Shift+Q
        keyHandler.bindAction(86, true, "paste"); // Ctrl+V
        keyHandler.bindAction(71, true, "group"); // Ctrl+G
        //keyHandler.bindAction(77, true, 'editData'); // Ctrl+M
        keyHandler.bindAction(71, true, "grid", true); // Ctrl+Shift+G
        keyHandler.bindAction(73, true, "italic"); // Ctrl+I
        keyHandler.bindAction(76, true, "lockUnlock"); // Ctrl+L
        //keyHandler.bindAction(76, true, 'layers', true); // Ctrl+Shift+L
        keyHandler.bindAction(80, true, "formatPanel", true); // Ctrl+Shift+P
        keyHandler.bindAction(85, true, "underline"); // Ctrl+U
        keyHandler.bindAction(85, true, "ungroup", true); // Ctrl+Shift+U
        keyHandler.bindAction(190, true, "superscript"); // Ctrl+.
        keyHandler.bindAction(188, true, "subscript"); // Ctrl+,
        keyHandler.bindKey(13, function () {
            if (graph.isEnabled()) {
                graph.startEditingAtCell();
            }
        }); // Enter
        keyHandler.bindKey(113, function () {
            if (graph.isEnabled()) {
                graph.startEditingAtCell();
            }
        }); // F2
    }

    if (!mxClient.IS_WIN) {
        keyHandler.bindAction(90, true, "redo", true); // Ctrl+Shift+Z
    } else {
        keyHandler.bindAction(89, true, "redo"); // Ctrl+Y
    }

    return keyHandler;
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.destroy = function () {
    if (this.editor != null) {
        this.editor.destroy();
        this.editor = null;
    }

    if (this.menubar != null) {
        this.menubar.destroy();
        this.menubar = null;
    }

    if (this.toolbar != null) {
        this.toolbar.destroy();
        this.toolbar = null;
    }

    if (this.sidebar != null) {
        this.sidebar.destroy();
        this.sidebar = null;
    }

    if (this.keyHandler != null) {
        this.keyHandler.destroy();
        this.keyHandler = null;
    }

    if (this.keydownHandler != null) {
        mxEvent.removeListener(document, "keydown", this.keydownHandler);
        this.keydownHandler = null;
    }

    if (this.keyupHandler != null) {
        mxEvent.removeListener(document, "keyup", this.keyupHandler);
        this.keyupHandler = null;
    }

    if (this.resizeHandler != null) {
        mxEvent.removeListener(window, "resize", this.resizeHandler);
        this.resizeHandler = null;
    }

    if (this.gestureHandler != null) {
        mxEvent.removeGestureListeners(document, this.gestureHandler);
        this.gestureHandler = null;
    }

    if (this.orientationChangeHandler != null) {
        mxEvent.removeListener(
            window,
            "orientationchange",
            this.orientationChangeHandler
        );
        this.orientationChangeHandler = null;
    }

    if (this.scrollHandler != null) {
        mxEvent.removeListener(window, "scroll", this.scrollHandler);
        this.scrollHandler = null;
    }

    if (this.destroyFunctions != null) {
        for (var i = 0; i < this.destroyFunctions.length; i++) {
            this.destroyFunctions[i]();
        }

        this.destroyFunctions = null;
    }

    var c = [
        this.menubarContainer,
        this.toolbarContainer,
        this.sidebarContainer,
        this.formatContainer,
        this.diagramContainer,
        this.footerContainer,
        this.chromelessToolbar,
        this.hsplit,
        this.sidebarFooterContainer,
        this.layersDialog,
    ];

    for (var i = 0; i < c.length; i++) {
        if (c[i] != null && c[i].parentNode != null) {
            c[i].parentNode.removeChild(c[i]);
        }
    }
};

/**
 * Change types
 */
function ChangePageSetup(ui, color, image, format) {
    this.ui = ui;
    this.color = color;
    this.previousColor = color;
    this.image = image;
    this.previousImage = image;
    this.format = format;
    this.previousFormat = format;

    // Needed since null are valid values for color and image
    this.ignoreColor = false;
    this.ignoreImage = false;
}

/**
 * Implementation of the undoable page rename.
 */
ChangePageSetup.prototype.execute = function () {
    var graph = this.ui.editor.graph;

    if (!this.ignoreColor) {
        this.color = this.previousColor;
        var tmp = graph.background;
        this.ui.setBackgroundColor(this.previousColor);
        this.previousColor = tmp;
    }

    if (!this.ignoreImage) {
        this.image = this.previousImage;
        var tmp = graph.backgroundImage;
        this.ui.setBackgroundImage(this.previousImage);
        this.previousImage = tmp;
    }

    if (this.previousFormat != null) {
        this.format = this.previousFormat;
        var tmp = graph.pageFormat;

        if (
            this.previousFormat.width != tmp.width ||
            this.previousFormat.height != tmp.height
        ) {
            this.ui.setPageFormat(this.previousFormat);
            this.previousFormat = tmp;
        }
    }

    if (
        this.foldingEnabled != null &&
        this.foldingEnabled != this.ui.editor.graph.foldingEnabled
    ) {
        this.ui.setFoldingEnabled(this.foldingEnabled);
        this.foldingEnabled = !this.foldingEnabled;
    }
};

// Registers codec for ChangePageSetup
(function () {
    var codec = new mxObjectCodec(new ChangePageSetup(), [
        "ui",
        "previousColor",
        "previousImage",
        "previousFormat",
    ]);

    codec.afterDecode = function (dec, node, obj) {
        obj.previousColor = obj.color;
        obj.previousImage = obj.image;
        obj.previousFormat = obj.format;

        if (obj.foldingEnabled != null) {
            obj.foldingEnabled = !obj.foldingEnabled;
        }

        return obj;
    };

    mxCodecRegistry.register(codec);
})();
