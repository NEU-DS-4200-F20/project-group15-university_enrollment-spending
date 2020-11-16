// // Immediately Invoked Function Expression to limit access to our 
// // variables and prevent 


//  ((() => {


// d3.csv('data/mergedDataFinal2.csv').then(data => {
//      // General event type for selections, used by d3-dispatch
//     // https://github.com/d3/d3-dispatch
//     const dispatchString = 'selectionUpdated';
//     console.log(data)
//     // Create a line chart given x and y attributes, labels, offsets; 
//     // a dispatcher (d3-dispatch) for selection events; 
//     // a div id selector to put our svg in; and the data to use.
//     let lcYearPoverty = linechart()
//       .x(d => d.YearData)
//       .xLabel('YEAR')
//       .y(d => d.Student_Services)
//       .yLabel('POVERTY RATE')
//       .yLabelOffset(40)
//       .selectionDispatcher(d3.dispatch(dispatchString))
//       ('#linechart', data);
// });

// })());


// We have to do it in getter-setter method
// We have to change the colors
// I think we should add filter in case somone is looking at a specific school
// We should generate a linegraph for each expensee (So in the end we have 5 line graphs)
// For the brushing, when the user highlights certain points,
// the same points in other violin plots are highlighted. Also, the line graphs are adjusted accordingly
