// Immediately Invoked Function Expression to limit access to our variables and prevent conflicts

// General event type for selections, used by d3-dispatch -> https://github.com/d3/d3-dispatch

(() => {
  d3.csv("data/Data.csv").then((data) => {
    const dispatchString = "selectionUpdated";
    //console.log(data, "This is all the data") //--> Uncomment to see what data looks like

    // Create a line chart

    // First, define the fields used in the violinplot and linechart
    const fields = [
    // The slabels are used in the violinplots, dlabels are used in the linegraphs
      // {slabel: "TotalFTE", dlabel: "TotalFTE"},
      // {slabel: "TuitionAndFeesRevenuesPct", dlabel: "TuitionAndFeesRevenuesPerFTE"},
      // {slabel: "AuxiliaryEnterprisesRevenuesPct", dlabel: "AuxiliaryEnterprisesRevenuesPerFTE"},
      // {slabel: "OperatingRevenuesPct", dlabel: "OperatingRevenuesPerFTE"},
      // {slabel: "NonoperatingRevenuesPct", dlabel: "NonoperatingRevenuesPerFTE"},
      // {slabel: "TotalRevenues", dlabel: "TotalRevenues"},
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
    ];

    // Assign a color to each university -> https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
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

    // When the violin selection is brushed, tell the linechart to update it's selection (linking)
    violin.selectionDispatcher().on(dispatchString, function (selectedData) {
      const one = selectedData[0];
    // console.log(selectedData, 'This was selected');

      // find records that match the brushed plots
      if (one) {
        //unique schoolNames from selected Data
        const schoolNames = [
          ...new Set(selectedData.map((record) => record.name)),
        ];
        console.log(schoolNames, "schoolnames");
        const years = [...new Set(selectedData.map((d) => d.year))];
        //get filtered data from selection Data.
        const reDrawData = data
          .filter((d) => years.includes(d["Year"]))
          .filter((record) => schoolNames.includes(record.SchoolName));
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
            one.field === fields[fields.length - 1].slabel ? true : false
          );
      }
      // If the user brushes nothing, show everything?
      else {updateLineCharts();}
    });

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
            legends,
            field.slabel === fields[fields.length - 1].slabel ? true : false
          );
      });
    }
  });
})();
