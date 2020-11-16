//Source: https://www.d3-graph-gallery.com/graph/line_several_group.html
//This Copy is Kept to be potentially used in the future



var parseDate = d3.timeParse('%Y')

function linegraph() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#linegraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Reading Data File
    d3.csv("data/mergedDataFinal2.csv").then(function (data) {
        //console.log(data, "Hello")

        //These are the fields we are going to be constantly using
        //We will only use one field this time, but my thought is that we can have one constantly changing line graph 
        //I am not sure wether to include dollar value or percentage? 

        const xFields = [
            "Instruction_Current_year_total",
        ];

        xFields.forEach((field) => {
            var sumstat = d3.rollup(
                data,
                (v) => {
                    const input = v.map((se) => se[field]);
                    console.log(input, "THISS")

                },
                (d) => d.SchoolName
            );

            //console.log(sumstat,"THISS")
        })

        var y = d3
            .scaleLinear()
            .domain([0, maxY + 10]) // Note that here the Y scale is set manually Otherwise plots look cut
            .range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));


        //     sumstat = Array.from(sumstat.entries()).map(([key, value]) => ({
        //         key: key,
        //         value: value,

        //     }));
        //     console.log(sumstat, "HELLOO")
        // })



        //var sumstat = d3.group(data, d=> d.SchoolName) // nest function allows to group the calculation per level of a factor
        //console.log(d3.group().entries(data), "THISSS")
        //.entries(data);
        // console.log(sumstat,"THSISISIS")


        // //sumstat = Array.from(sumstat.entries()).map(([key, value]) => ({
        //     key: key,
        //     value: value,

        // }));


        // sumstat = Array.from(sumstat.entries()).map(([key, value]) => ({
        //     key: key,
        //     value: value,

        // }));
        // con

        //Inputting x-Values
        var x = d3.scaleLinear()
            //How to parse the date so that only year is showing? I did parsdate but the number turned to millions
            .domain(d3.extent(data, function (d) { return d.YearData; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5));

        /*
            // color palette
            var res = sumstat.map(function(d){ return d.key }) // list of group names
            console.log(res, "THISS")
             var color = d3.scaleOrdinal()
             .domain(res)
             .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33'])
            */

    })



    // sumstat = Array.from(sumstat.entries()).map(([key, value]) => ({
    //     key: key,
    //     value: value,
    // }));
    /*
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

        xFields.forEach((field) => {
            var sumstat = d3.rollup(
                data,
                (v) => {					
                    const input = v.map((se) => se[field]);
                    //console.log(input, "This is it") //--> This is the y value for each school
                    //const bins = histogram(input);
                    //return bins;
        },
        (d) => d.SchoolName
              
        );
            
        
        //console.log(sumstat, "THiss")
    
    // Add X axis --> it is a date format
  var x = d3.scaleLinear()
  //How to parse the date so that only year is showing? I did parsdate but the number turned to millions
    .domain(d3.extent(data, function(d) { return d.YearData; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x).ticks(5));
    
    
    
    });


    })
}
*/
}
linegraph();