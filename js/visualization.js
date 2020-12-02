// Immediately Invoked Function Expression to limit access to our variables and prevent conflicts

// General event type for selections, used by d3-dispatch -> https://github.com/d3/d3-dispatch

(() => {


// get the data from the csv file
  d3.csv("data/Data.csv").then((data) => {
    const dispatchString = "selectionUpdated";
    // console.log(data, "This is all the data") //--> Uncomment to debug

// Define the columns (fields) used in the violinplot and linecharts
    const fields = [
    // The slabels are used in the violinplots
    // dlabels are used in the linegraphs
      // {slabel: "TotalFTE", dlabel: "TotalFTE"},
      // {slabel: "TuitionAndFeesRevenues_Pct", dlabel: "TuitionAndFeesRevenues_PerFTE"},
      // {slabel: "AuxiliaryEnterprisesRevenues_Pct", dlabel: "AuxiliaryEnterprisesRevenues_PerFTE"},
      // {slabel: "OperatingRevenues_Pct", dlabel: "OperatingRevenues_PerFTE"},
      // {slabel: "NonoperatingRevenues_Pct", dlabel: "NonoperatingRevenues_PerFTE"},
      // {slabel: "TotalRevenues_PerFTE", dlabel: "TotalRevenues_PerFTE"},
      {slabel: "Instruction_Pct", dlabel: "Instruction_PerFTE"},
      {slabel: "PublicService_Pct", dlabel: "PublicService_PerFTE"},
      {slabel: "AcademicSupport_Pct", dlabel: "AcademicSupport_PerFTE"},
      {slabel: "StudentServices_Pct", dlabel: "StudentServices_PerFTE"},
      {slabel: "InstitutionalSupport_Pct", dlabel: "InstitutionalSupport_PerFTE"},
      {slabel: "NetScholarships_Pct", dlabel: "NetScholarships_PerFTE"},
      {slabel: "AuxiliaryEnterprises_Pct", dlabel: "AuxiliaryEnterprises_PerFTE"},
      {slabel: "Other_Pct", dlabel: "Other_PerFTE"},
      // {slabel: "TotalExpenses", dlabel: "TotalExpenses"},
      // {slabel: "TotalWages_Pct", dlabel: "TotalWages_PerFTE"},
      // {slabel: "TotalFringeBenefits_Pct", dlabel: "TotalFringeBenefits_PerFTE"},
    ];              // end fields


// Assign a color to each university -> https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
const legends = [
  ...new Set(data.map((e) => e.SchoolName)),
].map((sn, i) => ({ name: sn, color: colors[i] }));
// console.log(legends, "These are the colors") //--> Uncomment to debug

//Create legend for schoolnames
legend()(".legend-zone", legends);

//Create Total FTE chart
    const linechartFTEHolder = ftelinechart()
      .x((d) => d["Year"])
      .xLabel("Year")
      .y((d) => d["TotalFTE"])
      .yLabel("Total FTE Students")
      .yLabelOffset(40)(".total-fte-holder", data, legends);

    // const linechartFTEHolder = ftelinechart()
    //   .x((d) => d["Year"])
    //   .xLabel("Year")
    //   .y((d) => d["OperatingRevenues_PerFTE"])
    //   .yLabel("Total Operating Revenues per FTE")
    //   .yLabelOffset(40)(".total-fte-holder", data, legends);




// Get linecharts holder element for adding each linechart dynamically
    const linechartsHolder = d3.select(".linecharts-holder");

// Get fte holder element for adding the line chart dynamically
    const fte = d3.select(".linecharts-holder");

    // Add divs for each line chart, each holding a different school
    linechartsHolder
      .selectAll("chart")
      .data(fields)
      .enter()
      .append("div")
      .attr("class", (d) => `line-chart-container line-chart-${d.slabel}`);

      updateLineCharts();




// Create the violinplots, similar to Assignment 8, slightly modified
    const violin = violinplotchart()
      .xFields(fields.map((d) => d.slabel))
      .xLabel("Category")
      .yLabel("Percent of Total Expenses")
      .selectionDispatcher(d3.dispatch(dispatchString))(".violinplot-holder",data,legends);





// BRUSHING
// When the violin selection is brushed, tell the linechart to update it's selection (linking)
    violin.selectionDispatcher().on(dispatchString, function (selectedData) {
      const one = selectedData[0];
    // console.log(selectedData, 'This was selected') // Uncomment to debug;

      // find records that match the brushed plots
      if (one) {

        // unique schoolNames from selected Data
        const schoolNames = [...new Set(selectedData.map((record) => record.name))];

        // console.log(schoolNames, "schoolnames") // Uncomment to debug;
        const years = [...new Set(selectedData.map((d) => d.year))];

        // get filtered data from selection Data.
        const reDrawData = data
          .filter((d) => years.includes(d["Year"]))
          .filter((record) => schoolNames.includes(record.SchoolName));
        const dlabel = fields.find((e) => e.slabel === one.field).dlabel;

        // Now build the linegraph based on what is brushed in the violins
        linechart()
          .x((d) => d["Year"])
          .xLabel("Year")
          .y((d) => d[dlabel])
          .yLabel(dlabel)
          .yLabelOffset(40)(
            `.line-chart-${one.field}`, //*** one.field
            reDrawData, // *** reDrawData
            legends
          );        // end .ylabelOffset(
      }             // end if

      // If the user brushes nothing, show everything
      else {updateLineCharts();}
    }               // end function (selectedData) {
    );              // end violin.selectionDispatcher().on(


    // add line charts for fields
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
            legends
          );
      }             // end => {
      );            // end forEach(
    }               // end updateLineCharts{


  });               // end d3.csv.then( => {
})();               // end IFFY
