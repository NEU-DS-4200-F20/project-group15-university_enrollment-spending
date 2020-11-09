/* global D3 */
// Initialize a line chart. Modeled after Mike Bostock's

function violinplot() {

    var colorScale = d3.scaleOrdinal().range(["blue","red","yellow"])
    var normal = d3.randomNormal()    
    var sampleData1 = d3.range(100).map(d => normal())
    var sampleData2 = d3.range(100).map(d => normal())
    var sampleData3 = d3.range(100).map(d => normal())
    
    var histoChart = d3.histogram();
    
    histoChart
        .domain([-3,3])
        .thresholds([-3,-2.5,-2,-1.5,-1,-0.5,0,0.5,1,1.5,2,2.5,3])
        .value(d => d)    
    d3.select("#violinplot").append("svg").attr("width",500).attr("height",500);
    
    var yScale = d3.scaleLinear().domain([-3,3]).range([400,0])
    var yAxis = d3.axisRight().scale(yScale)
        .tickSize(300)
    
    d3.select("svg").append("g").call(yAxis)
        .attr("class","yAxis")
		.attr("transform","translate(0,10)")

    var area = d3.area()
        .x0(d => -d.length) 
        .x1(d => d.length)
        .y(d => yScale(d.x0))   
        .curve(d3.curveCatmullRom)
        
    
    d3.select("svg").selectAll("g.violin")
    .data([sampleData1,sampleData2,sampleData3]).enter()    
    .append("g")
    .attr("transform",(d,i) => `translate(${50 + i * 100}, 10)`)    .append("path")
        .style("stroke","black")
        .style("stroke-width", 2)
        .style("fill",(d,i) => colorScale(i))
        .attr("d", d => area(histoChart(d)))

}
violinplot();
