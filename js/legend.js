function legend() {
    const margin = {
        top: 10,
        right: 20,
        bottom: 10,
        left: 20,
      },
      width = 800,
      height = 80;
    function chart(selector, data) {
      let svg = d3
        .select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
  
      svg = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      // add legends into chart if applicable
      let yPos = 0,
        xPos = 0;
      const legendG = svg
        .selectAll(".legend-for-schoolname")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "legend-for-schoolname")
        .attr("transform", (_, i) => {
          if (i % 3 === 0) {
            yPos += 30;
            xPos = 0;
          } else {
            xPos = (i % 3) * 220;
          }
          return `translate(${xPos}, ${yPos})`;
        });
  
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
        .style("fill", "black")
        .text((d) => d.name);
    }
    return chart;
  }
  