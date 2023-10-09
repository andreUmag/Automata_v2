function init() {
      var $ = go.GraphObject.make;  // for conciseness in defining templates
      // some constants that will be reused within templates
      var roundedRectangleParams = {
        parameter1: 2,  // set the rounded corner
        spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight  // make content go all the way to inside edges of rounded corners
      };

      myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
          {
            "animationManager.initialAnimationStyle": go.AnimationManager.None,
            "InitialAnimationStarting": function(e) {
                var animation = e.subject.defaultAnimation;
                animation.easing = go.Animation.EaseOutExpo;
                animation.duration = 1;
                animation.add(e.diagram, 'scale', 0.1, 1);
                animation.add(e.diagram, 'opacity', 0, 1);
            },

            // have mouse wheel events zoom in and out instead of scroll up and down
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            // support double-click in background creating a new node
            "clickCreatingTool.archetypeNodeData": { text: "new node" },
            // enable undo & redo
            "undoManager.isEnabled": true,
            positionComputation: function (diagram, pt) {
              return new go.Point(Math.floor(pt.x+20), Math.floor(pt.y));
            }
          });

      // when the document is modified, add a "*" to the title and enable the "Save" button
      myDiagram.addDiagramListener("Modified", function (e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx);
        }
      });

      // define the Node template
      myDiagram.nodeTemplate =
        $(go.Node, "Auto",
          {
            locationSpot: go.Spot.Top,
            isShadowed: true, shadowBlur: 5,
            shadowOffset: new go.Point(0, 1),
            shadowColor: "rgba(0, 0, 0, .14)"
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          // define the node's outer shape, which will surround the TextBlock
          $(go.Shape, "Circle", roundedRectangleParams,
            {
              name: "SHAPE", fill: "white", strokeWidth: 10,
              stroke: null,
              portId: "",  // this Shape is the Node's port, not the whole Node
              fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
              toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
              cursor: "pointer",
              
            }

            ),
            $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(65, 65), strokeWidth: 2, stroke: "black" }),
          $(go.TextBlock,
            {
              font: "bold 11pt helvetica, bold arial, sans-serif", margin: 7, stroke: "rgba(0, 0, 0, .87)",
              editable: true  // editing the text automatically updates the model data
            },
            new go.Binding("text").makeTwoWay())
        );



      // unlike the normal selection Adornment, this one includes a Button
      myDiagram.nodeTemplate.selectionAdornmentTemplate =
        $(go.Adornment, "Spot",
          $(go.Panel, "Auto",
            $(go.Shape, "RoundedRectangle", roundedRectangleParams,
            { fill: null, stroke: "#7986cb", strokeWidth: 3 }),new go.Binding("fill", "color"),
            $(go.Placeholder)  // a Placeholder sizes itself to the selected Node
          ),
          // the button to create a "next" node, at the top-right corner
          $("Button",
            {
              alignment: go.Spot.TopRight,
              click: addNodeAndLink  // this function is defined below
            },
            $(go.Shape, "PlusLine", { width: 6, height: 6 })
          ) // end button
        ); // end Adornment

        myDiagram.nodeTemplateMap.add("Start",
        $(go.Node, "Spot", { desiredSize: new go.Size(75, 75) },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "Circle",
            {
              name: "SHAPE",
              fill: "white",
              strokeWidth: 2,
              stroke: "black",
              portId: "",
              fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
              toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
              cursor: "pointer"
            }),
            $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(65, 65), strokeWidth: 0, stroke: "black" }),
          $(go.TextBlock, "q0",
            {
              font: "bold 16pt helvetica, bold arial, sans-serif",
              stroke: "black"
              
            })
        )
      );

      myDiagram.nodeTemplateMap.add("End",
        $(go.Node, "Spot", { desiredSize: new go.Size(75, 75) },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "Circle",
            {
              fill: "white",
              strokeWidth: 2,
              stroke: "black",
              portId: "",
              fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
              toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
              cursor: "pointer"
            }),
          $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(65, 65), strokeWidth: 2, stroke: "black" }),
          $(go.TextBlock, "q1",
            {
              font: "bold 16pt helvetica, bold arial, sans-serif",
              stroke: "black"
            })
        )
      );

      myDiagram.nodeTemplateMap.add("accept",
      $(go.Node, "Spot",
      {
        locationSpot: go.Spot.Top,
        isShadowed: true, shadowBlur: 1,
        shadowOffset: new go.Point(0, 1),
        shadowColor: "rgba(0, 0, 0, .14)",
        desiredSize: new go.Size(75, 75)
      }, 
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      // define the node's outer shape, which will surround the TextBlock
      $(go.Shape, "Circle",
        {
          name: "SHAPE",
          fill: "white", 
          strokeWidth: 2,
          stroke: "black",
          portId: "",  // this Shape is the Node's port, not the whole Node
          fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
          toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
          cursor: "pointer"
        }),
        $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(60, 60), strokeWidth: 2, stroke: "black"}),
      $(go.TextBlock,
        {
          font: "bold 11pt helvetica, bold arial, sans-serif", margin: 2, stroke: "rgba(0, 0, 0, .87)",
          editable: false  // editing the text automatically updates the model data
        },
        new go.Binding("text").makeTwoWay())
    ));

    myDiagram.nodeTemplateMap.add("op",
    $(go.Node, "Spot",
    {
      locationSpot: go.Spot.Top,
      isShadowed: true, shadowBlur: 1,
      shadowOffset: new go.Point(0, 1),
      shadowColor: "rgba(0, 0, 0, .14)",
      desiredSize: new go.Size(75, 75)
    }, 
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    // define the node's outer shape, which will surround the TextBlock
    $(go.Shape, "Circle",
      {
        fill: null, 
        strokeWidth: 0,
        stroke: "black",
        portId: "",  // this Shape is the Node's port, not the whole Node
        fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
        toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
        cursor: "pointer"
      }),
      $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(60, 60), strokeWidth: 0, stroke: "black"}),
    $(go.TextBlock,
      {
        font: "bold small-caps 11pt helvetica, bold arial, sans-serif", margin: 2, stroke: "rgba(0, 0, 0, .87)",
        editable: false  // editing the text automatically updates the model data
      },
      new go.Binding("text").makeTwoWay())
  ));

      // clicking the button inserts a new node to the right of the selected node, and adds a link to that new node
      function addNodeAndLink(e, obj) {
        var adornment = obj.part;
        var diagram = e.diagram;
        diagram.startTransaction("Add State");

        // get the node data for which the user clicked the button
        var fromNode = adornment.adornedPart;
        var fromData = fromNode.data;
        // create a new "State" data object, positioned off to the right of the adorned Node
        var toData = { text: "new" };
        var p = fromNode.location.copy();
        p.x += 200;
        toData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
        // add the new node data to the model
        var model = diagram.model;
        model.addNodeData(toData);

        // create a link data from the old node data to the new node data
        var linkdata = {
          from: model.getKeyForNodeData(fromData),  // or just: fromData.id
          to: model.getKeyForNodeData(toData),
          text: "transition"
        };
        // and add the link data to the model
        model.addLinkData(linkdata);

        // select the new Node
        var newnode = diagram.findNodeForData(toData);
        diagram.select(newnode);

        diagram.commitTransaction("Add State");

        // if the new node is off-screen, scroll the diagram to show the new node
        diagram.scrollToRect(newnode.actualBounds);
      }

      // replace the default Link template in the linkTemplateMap
      myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
          {
            curve: go.Link.Bezier,
            adjusting: go.Link.Stretch,
            reshapable: true, relinkableFrom: true, relinkableTo: true,
            toShortLength: 3
          },
          new go.Binding("points").makeTwoWay(),
          new go.Binding("curviness"),
          $(go.Shape,  // the link shape
            { strokeWidth: 1.5 },
            new go.Binding('stroke', 'progress', progress => progress ? "black" /* green */ : 'black'),
            new go.Binding('strokeWidth', 'progress', progress => progress ? 1.5 : 1.5)),
          $(go.Shape,  // the arrowhead
            { name: "arrow",toArrow: "Standard", stroke: null },
            new go.Binding('fill', 'progress', progress => progress ? "#black" /* green */ : 'black')),
          $(go.Panel, "Auto",
            $(go.Shape,  // the label background, which becomes transparent around the edges
              {
                fill: $(go.Brush, "Radial",
                  { 0: "rgb(245, 245, 245)", 0.7: "rgb(245, 245, 245)", 1: "rgba(245, 245, 245, 0)" }),
                stroke: null
              }),
            $(go.TextBlock, "transition",  // the label text
              {
                textAlign: "center",
                font: "12pt helvetica, arial, sans-serif",
                margin: 1,
                editable: true  // enable in-place editing
              },
              // editing the text automatically updates the model data
              new go.Binding("text").makeTwoWay())
          )
        );
      // read in the JSON data from the "mySavedModel" element
      load();
    }

    // Show the diagram's model in JSON format
    function save() {
      document.getElementById("mySavedModel").value = myDiagram.model.toJson();
      myDiagram.isModified = false;
    }
    function load() {
      myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    }

    window.addEventListener('DOMContentLoaded', init);