// Immediately Invoked Function Expression to limit access to our
// variables and prevent conflicts

(() => {
  d3.csv("data/Data.csv").then((data) => {
    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";

    //console.log(data, "This is all the data") //--> Uncomment to see what data looks like

    // Create a line chart given x and y attributes, labels, offsets;
    // a dispatcher (d3-dispatch) for selection events;
    // a div id selector to put our svg in; and the data to use.

    // define the five fields used in the violinplot and linechart
    // slabels are used in the violinplots, dlabels are used in the linegraphs
    const fields = [
      {slabel: "Instruction_Pct", dlabel: "Instruction_PerFTE"},
      {slabel: "AcademicSupport_Pct", dlabel: "AcademicSupport_PerFTE"},
      {slabel: "StudentServices_Pct", dlabel: "StudentServices_PerFTE"},
      {slabel: "InstitutionalSupport_Pct", dlabel: "InstitutionalSupport_PerFTE"},
      {slabel: "AuxiliaryEnterprises_Pct", dlabel: "AuxiliaryEnterprises_PerFTE"},
    ];

/*
These are the columns in the Data.csv file

SchoolName
Year
TotalFTE

TuitionAndFeesRevenuesPerFTE
TuitionAndFeesRevenues%
AuxiliaryEnterprisesRevenuesPerFTE
Auxiliary EnterprisesRevenues%
OperatingRevenuesPerFTE
OperatingRevenues%
NonoperatingRevenuesPerFTE
NonoperatingRevenues%
TotalRevenues

Instruction_PerFTE
Instruction_%
PublicService_PerFTE
PublicService_%
AcademicSupport_PerFTE
AcademicSupport_%
StudentServices_PerFTE
StudentServices_%
InstitutionalSupport_PerFTE
InstitutionalSupport_%
NetScholarships_PerFTE
NetScholarships_%
AuxiliaryEnterprises_PerFTE
AuxiliaryEnterprises_%
Other_PerFTE
Other_%
Total_
TotalWages_PerFTE
TotalWages_%
TotalFringeBenefits_PerFTE
TotalFringeBenefits_%
ChangeInNetPosition
*/

    // Assign a color to each university
    // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    const legends = [...new Set(data.map((e) => e.SchoolName))].map(
      (sn, i) => ({name: sn, color: colors[i]}));
    // console.log(legends, "These are the colors") //--> Uncomment to see how it looks like

    // get linecharts holder element for adding each linechart dynamically
    const linechartsHolder = d3.select(".linecharts-holder");
    // adding 5 divs for each line chart and they will have 5 different schools
    linechartsHolder
      .selectAll("chart")
      .data(fields)
      .enter()
      .append("div")
      .attr("class", (d) => `line-chart-container line-chart-${d.slabel}`);

      updateLineCharts();

    //Same concept as Assignment 8, slightly modified
    const violin = violinplotchart()
      .xFields(fields.map((d) => d.slabel))
      .xLabel("Category")
      .yLabel("Percent of Total Expenses")
      .selectionDispatcher(d3.dispatch(dispatchString))(".violinplot-holder",data,legends);

    // When the violin selection is updated via brushing,
    // tell the linechart to update it's selection (linking)
    violin.selectionDispatcher().on(dispatchString, function (selectedData) {
      const one = selectedData[0];
      console.log(selectedData, 'This was selected');

      // find matching records
      if (one) {
        const years = [...new Set(selectedData.map((d) => d.year))];
        const reDrawData = data.filter((d) => years.includes(d["Year"]));
        const dlabel = fields.find((e) => e.slabel === one.field).dlabel;
        linechart()
          .x((d) => d["Year"])
          .xLabel("Year")
          .y((d) => d[dlabel])
          .yLabel(dlabel)
          .yLabelOffset(40)(
            `.line-chart-${one.field}`, //*** one.field
            reDrawData, // *** reDrawData
            legends,
            // this last param presents if this linechart has legends or not.
            one.field === fields[fields.length - 1].slabel ? true : false
          )
      }
      // if there are no matching records, show everything?
      else {updateLineCharts();}
    });

    // add line charts for five fields
    function updateLineCharts() {
      fields.forEach((field, i) => {
        linechart()
          .x((d) => d["Year"])
          .xLabel("Year")
          .y((d) => d[field.dlabel])
          .yLabel(field.dlabel)
          .yLabelOffset(40)(
            `.line-chart-${field.slabel}`,
            data,
            legends,
            field.slabel === fields[fields.length - 1].slabel ? true : false
          );
      });
    }
  });
})();
