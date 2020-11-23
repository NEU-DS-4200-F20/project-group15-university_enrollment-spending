// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/

// Based on Mike Bostock's margin convention
// https://bl.ocks.org/mbostock/3019563

function linechart() {
  let margin = {top: 40,left: 80,right: 20,bottom: 40,},
    width = 330 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom,
    xValue = (d) => d[0],
    yValue = (d) => d[1],
    xLabelText = "",
    yLabelText = "",
    yLabelOffsetPx = 0,
    xScale = d3.scalePoint(),
    yScale = d3.scaleLinear();
  // selectableElements = d3.select(null),
  // dispatcher;

  // Create the chart by adding an svg to the div with the id
  // specified by the selector using the given data
  function chart(selector, data, legends, hasLegends = false) {

    //if legends exists, chart width must be increased.
    if (hasLegends) {margin.right = 330;}

    //clear all svg elements before start to draw new chart
    d3.select(selector).selectAll("*").remove();

    let svg = d3
      .select(selector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // add legends into chart if applicable
    if (hasLegends) {
      const legendsG = svg
        .append("g")
        .attr("class", "legends-g")
        .attr(
          "transform",
          `translate(${width + margin.left + 100}, ${margin.top + 20})`
        );

      const legendG = legendsG
        .selectAll(".legend")
        .data(legends)
        .enter()
        .append("g")
        .attr("class", "legend-g")
        .attr("transform", (_, i) => `translate(0, ${i * 30})`);

      legendG
        .append("circle")
        .style("fill", (d) => d.color)
        .attr("stroke", "black")
        .attr("r", 7);

      legendG
        .append("text")
        .attr("class", "legend-text")
        .attr("dx", "1em")
        .attr("dy", ".4em")
        .text((d) => d.name);
    }

    svg = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define scales
    xScale
      .domain(d3.group(data, xValue).keys())
      .rangeRound([0, width]);

    ///////////// temporarily hard-coded the y-axis scale ///////////////
    yScale
      .domain([
        d3.min(data, (d) => parseFloat(yValue(d))),
        d3.max(data, (d) => parseFloat(yValue(d))),
        // 0,100000000
      ])
      .rangeRound([height, 0]);

    // X axis and label
    let xAxis = svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)") // Put X axis tick labels at an angle
      .append("text")
      .attr("class", "axisLabel")
      .attr("text-anchor", "end")
      .attr("transform", "translate(" + width + ",-10)")
      .text(xLabelText);

    // Y axis and label
    let yAxis = svg
      .append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("class", "axisLabel")
      .attr("text-anchor", "start")
      .attr("transform","translate(" + (yLabelOffsetPx - margin.left) + ", -10)")
      .text(yLabelText);

    // group path data per each school
    const sumstat = d3.group(data, (d) => d.SchoolName);

    // Add the lines
    const pathG = svg
      .selectAll(".path-g")
      .data(Array.from(sumstat.values()))
      .enter()
      .append("g");

    pathG
      .append("path")
      .attr("fill", "none")
      .attr("stroke", (_, i) => colors[i])
      .attr("stroke-width", 3)
      .attr("d", (d) => d3.line().x(X).y(Y)(d));

    // Add the points
    let points = pathG
      .selectAll(".line-point")
      .data((d) => d)
      .enter()
      .append("circle")
      .attr("class", "point line-point")
      .style("stroke-width", 2)
      .attr("cx", X)
      .attr("cy", Y)
      .attr("r", 2);

    return chart;
  }

  // The x-accessor from the datum
  function X(d) {
    return xScale(xValue(d));
  }

    // The y-accessor from the datum
  function Y(d) {
    return yScale(yValue(d));
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function (_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
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

  chart.yLabelOffset = function (_) {
    if (!arguments.length) return yLabelOffsetPx;
    yLabelOffsetPx = _;
    return chart;
  };

  return chart;
}
