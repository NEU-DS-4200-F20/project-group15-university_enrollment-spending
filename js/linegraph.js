//Source: https://www.d3-graph-gallery.com/graph/line_several_group.html

var parseDate = d3.timeParse('%Y')

function linegraph() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    var colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
    // append the svg object to the body of the page
    var svg = d3.select("#linegraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Reading Data File
    d3.csv("data/mergedDataFinal2.csv").then(function (data) {

        // Retrieving the unique names for the schools,
        // from all the datapoints in the CSV
        const schools = [];
        for (const el of data) {
            //If the school is not found then the result is -1 --> So it will push it to the list
            if (schools.indexOf(el.SchoolName) === -1) {
                schools.push(el.SchoolName);
            }
        }


        // Iterates over schools and generates array of objects,
        // with 3 properties, name, points and color.
        const schoolsData = schools.map((e, i) => ({ name: e, points: [], color: colors[i] }));

        // Iterates over CSV datapoints and fills the points
        // array of each school object created earlier.
        for (const school of schoolsData) {
            for (const el of data) {
                if (el.SchoolName === school.name) {
                    school.points.push({ year: el.YearData, value: Number(el.Instruction_Current_year_total) });
                }
            }
        }

        // Add X axis with exten from 0 to the last year
        // Choosing school [0] since they all have same years.
        var x = d3.scaleTime()
            .domain(d3.extent(schoolsData[0].points, function (d) { return d.year; }))
            //To keep room for a legend
            .range([0, width - 240]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            //Formatting the years, it was showing in a weird format before that
            .call(
                d3.axisBottom(x).tickFormat((d, i) => schoolsData[0].points[i].year)
            );

        // Add Y axis with extent from 0 to the maximum
        // value in the whole CSV datapoints.
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +Number(d.Instruction_Current_year_total); })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Iterating over all schools and using their
        // points, we draw each line. Next to this,
        // each legend item is drawn accordingly.
        let i = 0;
        for (const school of schoolsData) {
            // Drawing legend
            svg.append("circle").attr("cx", 400).attr("cy", 130 + (i * 20)).attr("r", 6).style("fill", school.color)
            svg.append("text").attr("x", 420).attr("y", 130 + (i * 20)).text(school.name).style("font-size", "13px").attr("alignment-baseline", "middle")
            // Add the line
            svg.append("path")
                .datum(school.points)
                .attr("fill", "none")
                .attr("stroke", school.color)
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.year) })
                    .y(function (d) { return y(d.value) })
                )
            i++;
        }


    });


}
linegraph();