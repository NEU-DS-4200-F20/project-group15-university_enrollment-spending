/* global D3 */



// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv('data/violin_data.csv', function(data) {

  // Build and Show the Y scale
  var y = d3.scaleLinear()
    .domain([ 0,100 ])          // Note that here the Y scale is set manually
    .range([height, 0])
  svg.append("g").call( d3.axisLeft(y) )

  // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["Instruction", "Academic Support", "Student Services", "Institutional Support", "Auxiliary enterprises"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Features of the histogram
  var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)

  // Compute the binning for each group of the dataset
  var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Species;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) { return g.Sepal_Length;})    // Keep the variable called Sepal_Length
      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

  // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum = 0
  for ( i in sumstat ){
    allBins = sumstat[i].value
    lengths = allBins.map(function(a){return a.length;})
    longuest = d3.max(lengths)
    if (longuest > maxNum) { maxNum = longuest }
  }

  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum,maxNum])

  // Add the shape to this svg!
  svg
    .selectAll("myViolin")
    .data(sumstat)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .attr("d", d3.area()
            .x0(function(d){ return(xNum(-d.length)) } )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        )
})


/*
d3.csv('data/violin_data.csv', function(d) {
    var colorScale = d3.scaleOrdinal().range(["blue","red","yellow","orange",""])
    var normal = d3.randomNormal()    
    var sampleData1 = d.
    var sampleData2 = d3.range(100).map(d => normal())
    var sampleData3 = d3.range(100).map(d => normal())
    
    
    var histoChart = d3.histogram();
    
    histoChart
        .domain([0,100])
        .thresholds([0,10,20,30,40,50,60,70,80,90,100])
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
    .attr("transform",(d,i) => `translate(${50 + i * 100}, 10)`).append("path")
        .style("fill",(d,i) => colorScale(i))
        .attr("d", d => area(histoChart(d)))

}*/
