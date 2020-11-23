// Immediately Invoked Function Expression to limit access to our
// variables and prevent conflicts

(() => {
  d3.csv("data/FTEData.csv").then((data) => {
    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";

    //console.log(data, "This is all the data") //--> Uncomment to see what data looks like

    // Create a line chart given x and y attributes, labels, offsets;
    // a dispatcher (d3-dispatch) for selection events;
    // a div id selector to put our svg in; and the data to use.

    // define the five fields used in the violingraph and linechart
    // slabels are used in the linegraphs, dlabels are used in the violinplots
    const fields = [
      {slabel: "Instruction Expenses per FTE", dlabel: "Instruction Expenses per FTE"},
      {slabel: "Academic Support Expenses per FTE", dlabel: "Academic Support Expenses per FTE"},
      {slabel: "Student Services Expenses per FTE", dlabel: "Student Services Expenses per FTE"},
      {slabel: "Institutional Support Expenses per FTE", dlabel: "Institutional Support Expenses per FTE"},
      {slabel: "Other Expenses per FTE", dlabel: "Other Expenses per FTE"},
    ];

/*
These are the columns in the FTEData.csv file

TotalFTE
TuitionAndFeeRevenues
AuxiliaryEnterprisesRevenues
OperatingRevenues
NonoperatingRevenues
TotalRevenues

InstructionExpenses
PublicServiceExpenses
AcademicSupportExpenses
StudentServicesExpenses
InstitutionalSupportExpenses
NetScholarshipsExpenses
AuxiliaryEnterprisesExpenses
OtherExpenses
TotalExpenses
TotalWagesExpenses
TotalFringeBenefitsExpenses
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
// I have no idea what *this* ^ is or what it does

      updateLineCharts();

    //Same concept as Assignment 8, slightly modified
    const violin = violinplotchart()
      .xFields(fields.map((d) => d.slabel))
      .xLabel("Category")
      .yLabel("Dollars Spent per FTE")
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