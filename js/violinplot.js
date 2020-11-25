//source: https://www.d3-graph-gallery.com/graph/violin_jitter.html

function violinplotchart() {
  //Define the margins
  let margin = { top: 40, right: 30, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
    xFields = [],
    xLabelText = "",
    yLabelText = "",
    yLabelOffsetPx = 0,
    xScale = d3.scaleBand(),
    xSubScale = d3.scaleLinear(),
    yScale = d3.scaleLinear(),
    dispatcher;

  function chart(selector, data, legends) {
    let svg = d3
      .select(selector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    svg = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //get Max Y value from all xFields value.
    //This will help in setting the Y-axis Max Value
    let maxY = 0;
    data.forEach((record) => {
      xFields.forEach((field) => {
        //console.log(field, "This is a field") //--> uncomment to see what is meant by field
        //I parsed it because it was treating the number as text
        const fieldMax = parseFloat(record[field]);
        //console.log(fieldMax, "This is the value in each record")
        if (maxY < fieldMax) {maxY = fieldMax;}
        // console.log(maxY, 'Final value of maxY')
      });
    });

    yScale
      .domain([0, maxY + maxY*.05]) // 5% cushion added to the top of the violin plot chart
      .rangeRound([height, 0]);

    const yAxis = svg
      .append("g")
      .call(d3.axisLeft(yScale));

    //Setting up x-axis
    xScale.range([0, width]).domain(xFields).padding(0.05);
    // padding(0.05) is the space between 2 violins. 0 = no padding. 1 = maximum.

    //add x-axis at the bottom of svg
    const xAxis = svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    //Features of the histogram
    const histogram = d3
      .bin() //d3.histogram is v4
      .domain(yScale.domain())
      .thresholds(yScale.ticks(20))
      .value((d) => parseFloat(d));

    //Getting Histogram Values by SchoolName
    xFields.forEach((field) => {
      let sumstat = d3.rollup(
        data,
        (v) => {
          const input = v.map((se) => se[field]);
          const bins = histogram(input);
          return bins;
        },
        (d) => d.SchoolName
      );

      //get array from Map type --> we are turning it into key, value
      //console.log(sumstat, "Befor turning into key-value") //--> uncomment to see how it looks like
      sumstat = Array.from(sumstat.entries()).map(([key, value]) => ({
        key: key,
        value: value,
      }));
      // console.log(sumstat,"second") //--> after turning into key-value

      //get max bandwidth of each violin plot.
      let maxNum = 0;
      for (i in sumstat) {
        let allBins = sumstat[i].value;
        lengths = allBins.map(function (a) {
          return a.length;
        });
        longuest = d3.max(lengths);
        if (longuest > maxNum) {
          maxNum = longuest;
        }
      }
      // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
      xSubScale.range([0, xScale.bandwidth()]).domain([-maxNum, maxNum]);
      svg
        .selectAll("myViolin")
        .data(sumstat)
        .enter() // So now we are working group per group
        .append("g")
        .attr("transform", function () {
          return "translate(" + xScale(field) + " ,0)";
        }) // Translation on the right to be at the group position
        .append("path")
        .datum(function (d) {
          return d.value;
        }) // So now we are working bin per bin
        .style("fill", "grey")
        .style("stroke", "grey")
        .attr(
          "d",
          d3
            .area()
            .x0(xSubScale(0))
            .x1(function (d) {
              return xSubScale(d.length);
            })
            .y(function (d) {
              return yScale(d.x0);
            })
            .curve(d3.curveCatmullRom)
            // This makes the line smoother to give the violin appearance.
            // Try d3.curveStep to see the difference
        );
    });

    // Add individual points with jitter
    let jitterWidth = 40;
    svg
      .selectAll(".indPoints")
      .data(data)
      .enter()
      .append("g")
      .selectAll("circle")
      .data((d) =>
        Object.entries(d)
          .filter(([key, _]) => xFields.includes(key))
          .map((e) => ({
            field: e[0],
            value: e[1],
            name: d.SchoolName,
            year: d.Year,
          }))
      )
      .enter()
      .append("circle")
      .attr("cx", (d) => {
        d.cx =
          xScale(d.field) +
          xScale.bandwidth() / 2 -
          Math.random() * jitterWidth;
        return d.cx;
      })
      .attr("cy", function (d) {
        d.cy = yScale(parseFloat(d.value));
        return d.cy;
      })
      .attr("r", 5)
      .style("fill", function (d) {
        const matched = legends.find((l) => l.name === d.name);
        return matched.color;
      })
      .attr("stroke", "black")
      .on("mouseover", function (e, d) {
        d3.select(this).style("stroke", "blue").style("stroke-width", 2);
      })
      .on("mouseout", function (e, d) {
        d3.select(this).style("stroke", "white").style("stroke-width", 1);
      });

    // X axis label
    xAxis
      .append("text")
      .attr("class", "axisLabel")
      .attr("text-anchor", "end")
      .attr("transform", "translate(" + width + ",-10)")
      .text(xLabelText);

    // Y axis and label
    yAxis
      .append("text")
      .attr("class", "axisLabel")
      .attr("text-anchor", "start")
      .attr(
        "transform",
        "translate(" + (yLabelOffsetPx - margin.left) + ", -10)"
      )
      .text(yLabelText);

    svg.call(brush);
    //points variable for storing selectable elements
    let points = svg.selectAll("circle");
    selectableElements = points;

    // Highlight points when brushed
    function brush(g) {
      const brush = d3
        .brush()
        .on("start brush", highlight)
        .on("end", brushEnd)
        .extent([
          [-margin.left, -margin.bottom],
          [width + margin.right, height + margin.top],
        ]);

      g.call(brush); // Adds the brush to this element

      // Highlight the selected circles
      function highlight(event, d) {
        if (event.selection === null) return;
        const [[x0, y0], [x1, y1]] = event.selection;
        points.classed(
          "selected",
          (d) => x0 <= d.cx && d.cx <= x1 && y0 <= d.cy && d.cy <= y1
        );
      }

      function brushEnd(event, d) {
        // We don't want infinite recursion
        if (
          event.sourceEvent !== undefined &&
          event.sourceEvent.type != "end"
        ) {
          d3.select(this).call(brush.move, null);
          // Get the name of our dispatcher's event
          let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

          // Let other charts know
          dispatcher.call(
            dispatchString,
            this,
            svg.selectAll(".selected").data()
          );
        }
      }
    }
    return chart;
  }

  chart.xFields = function (_) {
    if (!arguments.length) return xFields;
    xFields = _;
    return chart;
  };

  chart.xLabel = function (_) {
    if (!arguments.length) return xLabelText;
    xLabelText = _;
    return chart;
  };

  chart.yLabel = function (_) {
    if (!arguments.length) return yLabelText;
    yLabelText = _;
    return chart;
  };

  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  return chart;
}


