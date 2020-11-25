// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/

// Based on Mike Bostock's margin convention
// https://bl.ocks.org/mbostock/3019563

let w=600

function linechart() {
  let margin = {top: 40,left: 80,right: 20,bottom: 40,},
    width = w - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom,
    xValue = (d) => d[0],
    yValue = (d) => d[1],
    xLabelText = "",
    yLabelText = "",
    yLabelOffsetPx = 0,
    xScale = d3.scalePoint(),
    yScale = d3.scaleLinear();
  // selectableElements = d3.select(null),
  // dispatcher;

  //define tooltip
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute");

  // Create the chart by adding an svg to the div with the id
  // specified by the selector using the given data
  function chart(selector, data, legends, hasLegends = false) {

    //if legends exists, chart width must be increased.
    // if (hasLegends) {margin.right = w;}

    //clear all svg elements before start to draw new chart
    d3.select(selector).selectAll("*").remove();

    let svg = d3
      .select(selector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // add legends into chart if applicable
    // if (hasLegends) {
    //   const legendsG = svg
    //     .append("g")
    //     .attr("class", "legends-g")
    //     .attr(
    //       "transform",
    //       `translate(${width + margin.left + 100}, ${margin.top + 20})`
    //     );

    //   const legendG = legendsG
    //     .selectAll(".legend")
    //     .data(legends)
    //     .enter()
    //     .append("g")
    //     .attr("class", "legend-g")
    //     .attr("transform", (_, i) => `translate(0, ${i * 30})`);

    //   legendG
    //     .append("circle")
    //     .style("fill", (d) => d.color)
    //     .attr("stroke", "black")
    //     .attr("r", 7);

    //   legendG
    //     .append("text")
    //     .attr("class", "legend-text")
    //     .attr("dx", "1em")
    //     .attr("dy", ".4em")
    //     .text((d) => d.name);
    // }

    svg = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define scales
    xScale
      .domain(d3.group(data, xValue).keys())
      .rangeRound([0, width]);

    yScale
      .domain([
        d3.min(data, (d) => parseFloat(yValue(d))),
        d3.max(data, (d) => parseFloat(yValue(d))),
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
      .data(Array.from(sumstat))
      .enter()
      .append("g");

    pathG
      .append("path")
      .attr("fill", "none")
      .attr("stroke", (d) => {
        //d[0] is schoolname, d[1] is line data to draw line
        const matchedColor = legends.find((e) => e.name === d[0]).color;
        return matchedColor;
      })
      .attr("stroke-width", 3)
      .attr("d", (d) => d3.line().x(X).y(Y)(d[1]));

    // Add the points
    let points = pathG
      .selectAll(".line-point")
      .data((d) => d[1])
      .enter()
      .append("circle")
      .attr("class", "point line-point")
      .style("stroke-width", 2)
      .attr("cx", X)
      .attr("cy", Y)
      .attr("r", 2)

    //mouse events
    .on('mouseover', function(d) {

      // tooltip.transition()
      //  .delay(30)
      //  .duration(200)
      //  .style("opacity", 1);

      //tooltip.html(d.measurement)
      // .style("left", (d3.event.PageX+ 25) + "px")
      // .style("top", (d3.event.PageY) + "px");

       //use raise() to bring the element forward when hovering the mouse
       //hide when mouse moves away

       const selection = d3.select(this).raise();
        selection.transition();
        repeat();
        // ref line: https://bl.ocks.org/d3noob/bf44061b1d443f455b3f857f82721372
        // stop transition: https://stackoverflow.com/questions/26903355/how-to-cancel-scheduled-transition-in-d3
        function repeat() {
          selection
            .attr("r", 2)
            .style("opacity", 1)
            .transition()
            .delay(20)
            .duration(1000)
            .attr("r", 10)
            .style("opacity", 0)
            .transition()
            .delay(20)
            .duration(200)
            .attr("r", 2)
            .style("opacity", 1)
            .on("end", repeat);
        }
      })
      .on("mouseout", function (d) {
        // tooltip.transition().duration(100).style("opacity", 0);

        const selection = d3.select(this);
        selection
          .transition()
          .delay(20)
          .duration(200)
          .attr("r", 2)
          .style("opacity", 1);
      });

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
