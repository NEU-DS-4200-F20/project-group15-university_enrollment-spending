function violinplot() {
    
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;


    // append the svg object to the body of the page
    var svg = d3.select("#violinplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    //Loading Data File
    //The problem we had is that the data was loading by each row ".then" combines it 
    d3.csv("data/mergedDataFinal2.csv").then(function (data) {
        //console.log(data, "This is the data") //--> Uncomment to see what it displays
        //These are the fields we are going to be constantly using
        const xFields = [
          "Instruction",
          "Academic_Support",
          "Student_Services",
          "Institutional_Support",
          "Auxillary_Enterprises",
        ];

        let maxY = 0;
        
        //get Max Y value from all xFields value.
        //This will help in setting the Y-axis Max Value
        //This was done to replace the code you see commented below
        data.forEach((record) => {
            //console.log(record, "This is a record") //--> Uncomment to see each individual record
            
            xFields.forEach((field) => {
                //console.log(field, "This is a field") //--> uncomment to see what is meant by field
                //I parsed it because it was treating the number as text
                const fieldMax = parseFloat(record[field]);
                //console.log(fieldMax, "This is the value in each record") 
                if (maxY < fieldMax) {
                    maxY = fieldMax;
                }
            });
        });

        //The above replaces the below
        /*
          const maxY = d3.max([
            d3.max(data.map((d) => parseFloat(d.Instruction))),
            d3.max(data.map((d) => parseFloat(d.Academic_Support))),
            d3.max(data.map((d) => parseFloat(d.Student_Services))),
            d3.max(data.map((d) => parseFloat(d.Institutional_Support))),
            d3.max(data.map((d) => parseFloat(d.Auxillary_Enterprises))),
    ]); 
    */

    //Setting and appending y-scale
        var y = d3
        .scaleLinear()
        .domain([0, maxY + 10]) // Note that here the Y scale is set manually Otherwise plots look cut
        .range([height, 0]);
         svg.append("g").call(d3.axisLeft(y));

    //Setting up x-axis
        var x = d3
        .scaleBand()
        .range([0, width])
        .domain(xFields)
        .padding(0.05); // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum. 
   
    //add x-axis at the bottom of svg
       svg
         .append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x));

    //Features of the histogram
    var histogram = d3
      .bin() //d3.histogram is v4
      .domain(y.domain())
      .thresholds(y.ticks(20)) 
      .value((d) => parseFloat(d));
    
    //color scale for the plot
    var violinColor = d3
      .scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([0, 4]);

    //color scale for the dots
    var dotColor = d3
      .scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([0, 100]);

    //Getting Histogram Values by SchoolName
    
    xFields.forEach((field) => {
        var sumstat = d3.rollup(
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
            //console.log(sumstat,"second") --> after turning into key-value

	//get max bandwidth of each violin plot.
      var maxNum = 0;
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
        var xNum = d3
         .scaleLinear()
         .range([0, x.bandwidth()])
         .domain([-maxNum, maxNum]);
        svg
        .selectAll("myViolin")
        .data(sumstat)
        .enter() // So now we are working group per group
        .append("g")
        .attr("transform", function () {
          return "translate(" + x(field) + " ,0)";
        }) // Translation on the right to be at the group position
        .append("path")
        .datum(function (d) {
          return d.value;
		}) // So now we are working bin per bin
		.style("fill", 'grey')
        .style("stroke", 'grey')
        .attr(
            "d",
            d3
              .area()
              .x0(xNum(0))
              .x1(function (d) {
                return xNum(d.length);
              })
              .y(function (d) {
                return y(d.x0);
              })
              .curve(d3.curveCatmullRom) // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
          );

        //To color violin plot by uni --> we will use it later
        /*

        .style("stroke", (d, i) => violinColor(i)) --> To color violin plot by uni
        .style("fill", (d, i) => violinColor(i))
        .style("fill-opacity", 0.3)

        */

        // Add individual points with jitter
    var jitterWidth = 40;
    svg
    .selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
        return x(field) + x.bandwidth() / 2 - Math.random() * jitterWidth;
     })
    .attr("cy", function (d) {
        return y(parseFloat(d[field]));
     })
     .attr("r", 3)
     .style("fill", function (d) {
         return dotColor(parseFloat(d[field]));
        })
        .attr("stroke", "white");
    });

});

// Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
}
violinplot();


