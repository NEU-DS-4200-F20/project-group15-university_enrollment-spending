// // Immediately Invoked Function Expression to limit access to our 
// // variables and prevent 


 ((() => {


d3.csv('data/mergedDataFinal2.csv').then(data => {
     // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = 'selectionUpdated';
    console.log(data)
    // Create a line chart given x and y attributes, labels, offsets; 
    // a dispatcher (d3-dispatch) for selection events; 
    // a div id selector to put our svg in; and the data to use.
    let lcYearPoverty = linechart()
      .x(d => d.YearData)
      .xLabel('YEAR')
      .y(d => d.Student_Services)
      .yLabel('POVERTY RATE')
      .yLabelOffset(40)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ('#linechart', data);
});

})());
