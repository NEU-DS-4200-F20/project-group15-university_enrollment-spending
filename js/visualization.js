// // Immediately Invoked Function Expression to limit access to our 
// // variables and prevent 

// // Based on Mike Bostock's margin convention
// // https://bl.ocks.org/mbostock/3019563 --> Margins from last assignment
// //SVG Margins

// let margin = {
//   top: 60,
//   left: 50,
//   right: 30,
//   bottom: 20
// },
//   //Standard width is 500 I did 600 so that x-axis is visble
//   width = 600 - margin.left - margin.right,
//   height = 500 - margin.top - margin.bottom;


// //Creating SVG
  
// let svg = d3.select('#violinplot')
//   .append('svg')
//     .attr('preserveAspectRatio', 'xMidYMid meet')
//     .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
//       //.classed('svg-content', true);
//   .append('g')
//     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//     // svg = svg.append('g')
//     //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// //Reading CSV file

// d3.csv('../data/mergedDataFinal2.csv', function(data) {

//   w = Object.keys(data)[9]
//     x = Object.values(data)[25] //First Val
//   //console.log(w, "Keys")
//     console.log(x, "Values")

  
//   // Build and Show the Y scale
//   //HOW CAN WE CHANGE INTERVALS IN THIS SCALE?
//   var y = d3.scaleLinear()
//     .domain([0,0.6])          // Note that here the Y scale is set manually
//     .range([height, 0])
//   svg.append("g").call( d3.axisLeft(y) )


//   // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
//   var x = d3.scaleBand()
//     .range([ 0, width ])
//     //We can make it so that it takes they key values by itself (But we have few anyways so maybe uneccessary for our case)
//     .domain(['Instruction', 'Academic Support', 'Student Services', 'Institutional Support', 'Auxillary Enterprises'])
//     .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
//   svg.append('g')
//     .attr('transform', 'translate(0,' + height + ')')
//     .call(d3.axisBottom(x))

//   // Features of the histogram
//   var histogram = d3.histogram()
//         .domain(y.domain())
//         .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
//         .value(d => d)
  
//   // Compute the binning for each group of the dataset
//   var sumstat = d3.group()  // nest function allows to group the calculation per level of a factor
//     .keys(function(d) { return d.Instruction;})
    
//     .rollup(function(d) {   // For each key..
//       input = d.map(function(g) { return g.Sepal_Length;})    // Keep the variable called Sepal_Length
//       bins = histogram(input)   // And compute the binning on it.
//       return(bins)
//     })
//     .entries(data)
  
//   //console.log(Object.key(function(d) { return d.PercentageoffInstructionCurrentyeartotal}),"BALALALAL")
  
//   // Compute the binning for each group of the dataset
//   //var sumstat = d3.group()  // nest function allows to group the calculation per level of a factor
//     //.key(function(d) { return d.Species;})
//     //console.log(getkeybyvalue(function(data) { return d.PercentageoffInstructionCurrentyeartotal}),"BALALALAL")
    
//     // .rollup(function(d) {   // For each key..
//     //   input = d.map(function(g) { return g.Sepal_Length;})    // Keep the variable called Sepal_Length
//     //   bins = histogram(input)   // And compute the binning on it.
//     //   return(bins)
//     // })
//     // .entries(data)

// })
// //function chart(selector, data) --> We will do getter-sette in the second stage


