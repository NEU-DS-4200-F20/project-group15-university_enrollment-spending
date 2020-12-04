// Immediately Invoked Function Expression to limit access to our variables and prevent conflicts

// General event type for selections, used by d3-dispatch -> https://github.com/d3/d3-dispatch

(() => {

// get the data from the csv file
d3.csv('data/Data.csv').then((data) => {
	const dispatchUpdateSelectionString = 'selectionUpdated',

	dispatchFilterString = 'filterCircles';
	// console.log(data, 'This is all the data') //--> Uncomment to debug

	// Define the columns (fields) used in the violinplot and linecharts
	const fields = [
		{
			slabel: 'Instruction_Pct',
			dlabel: 'Instruction_PerFTE',
			tooltipFields: [
				'Instruction_Pct',
				'Instruction_PerFTE'
			],
		},
		{
			slabel: 'PublicService_Pct',
			dlabel: 'PublicService_PerFTE',
			tooltipFields: [
				'PublicService_Pct',
				'PublicService_PerFTE'
			],
		},
		{
			slabel: 'AcademicSupport_Pct',
			dlabel: 'AcademicSupport_PerFTE',
			tooltipFields: [
				'AcademicSupport_Pct',
				'AcademicSupport_PerFTE'
			],
		},
		{
			slabel: 'StudentServices_Pct',
			dlabel: 'StudentServices_PerFTE',
			tooltipFields: [
				'StudentServices_Pct',
				'StudentServices_PerFTE'
			],
		},
		{
		slabel: 'InstitutionalSupport_Pct',
		dlabel: 'InstitutionalSupport_PerFTE',
		tooltipFields: [
				'InstitutionalSupport_Pct',
				'InstitutionalSupport_PerFTE',
			],
		},
		{
			slabel: 'NetScholarships_Pct',
			dlabel: 'NetScholarships_PerFTE',
			tooltipFields: [
			'NetScholarships_Pct',
			'NetScholarships_PerFTE'
		],
		},
		{
			slabel: 'AuxiliaryEnterprises_Pct',
			dlabel: 'AuxiliaryEnterprises_PerFTE',
			tooltipFields: [
				'AuxiliaryEnterprises_Pct',
				'AuxiliaryEnterprises_PerFTE',
			],
		},
		{
			slabel: 'Other_Pct',
			dlabel: 'Other_PerFTE',
			tooltipFields: [
				'Other_Pct',
				'Other_PerFTE'
			],
		},
			// {
			// slabel: 'TotalExpenses_PerFTE',
			// dlabel: 'TotalExpenses_PerFTE',
			// tooltipFields: [
			// 	'TotalExpenses_PerFTE',
			// 	'TotalExpenses_PerFTE'
			// 	],
			// },
			// {
			// slabel: 'TotalWages_Pct',
			// dlabel: 'TotalWages_PerFTE',
			// tooltipFields: [
			// 	'TotalWages_Pct',
			// 	'TotalWages_PerFTE'
			// 	],
			// },
			// {
			// slabel: 'TotalFringeBenefits_Pct',
			// dlabel: 'TotalFringeBenefits_PerFTE',
			// tooltipFields: [
			// 	'TotalFringeBenefits_Pct',
			// 	'TotalFringeBenefits_PerFTE'
			// 	],
			// },
	]; // end fields

	// Assign a color to each university -> https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
	const legends = [
		...new Set(data.map((e) => e.SchoolName)),
		].map((sn, i) => ({ name: sn, color: colors[i] }));
		// console.log(legends, 'These are the colors') //--> Uncomment to debug

	//Create legend for schoolnames
	const legendChart = legend()
		.selectionDispatcher(d3.dispatch(dispatchFilterString))
		('.legend-zone', legends);

	//Create Total FTE chart
	ftelinechart()
		.x((d) => d['Year'])
		.xLabel('Year')
		.y((d) => d['Total_FTE_Students'])
		.yLabel('Total FTE Students')
		.tooltipFields(['Total_FTE_Students'])
		.yLabelOffset(40)('.total-fte-holder', data, legends);

	// Used this to generate some data for Kurt. Please do not delete.
	// ftelinechart()
	// 	.x((d) => d['Year'])
	// 	.xLabel('Year')
	// 	.y((d) => d['TotalExpenses_PerFTE'])
	// 	.yLabel('Total Expenses per FTE Student')
	// 	.tooltipFields(['TotalExpenses_PerFTE'])
	// 	.yLabelOffset(40)('.total-fte-holder', data, legends);

	// Get linecharts holder element for adding each linechart dynamically
	const linechartsHolder = d3.select('.linecharts-holder');


	// Add divs for each line chart, each holding a different school
	linechartsHolder
		.selectAll('chart')
		.data(fields)
		.enter()
		.append('div')
		.attr('class', (d) => `line-chart-container line-chart-${d.slabel}`);

	// Now build the line graphs using the data.csv file
	updateLineCharts(data);

	// Create the violinplots, similar to Assignment 8, slightly modified
	const violin = violinplotchart()
		.xFields(fields.map((d) => d.slabel))
		.xLabel(`Expense Categories`)
		.yLabel('Percent of Total Expenses')
		.selectionDispatcher(d3.dispatch(dispatchUpdateSelectionString))(
			'.violinplot-holder',
			data,
			legends
		); // End selectionDispatcher

	//When use click schoolName circle, tell the linechart to update it's circles
	legendChart
		.selectionDispatcher()
		.on(
			dispatchFilterString,

			function (selectedSchools) {
			// console.log(selectedSchools, 'selectedSchools');

				// get filtered data from selection Data.
				const reDrawData = data.filter(
					(record) => selectedSchools.includes(record.SchoolName)
				); // End data.filter

				violin.updateSelection(selectedSchools);

				updateLineCharts(reDrawData);

				ftelinechart()
					.x((d) => d['Year'])
					.xLabel('Year')
					.y((d) => d['Total_FTE_Students'])
					.yLabel('Total FTE Students')
					.tooltipFields(['Total_FTE_Students'])
					.yLabelOffset(40)(
						'.total-fte-holder',
						reDrawData,
						legends,
					); // End ftelinechart
			}
		);


// BRUSHING
// When the violin selection is brushed, tell the linechart to update it's selection (linking)
	violin.selectionDispatcher().on(
		dispatchUpdateSelectionString,
		function (selectedData) {
			const one = selectedData[0];
			// console.log(selectedData, 'This was selected') // Uncomment to debug;

			// find records that match the brushed plots
			if (one) {

				// unique schoolNames from selected Data
				const schoolNames = [...new Set(selectedData.map((record) => record.name))];
				// console.log(schoolNames, 'schoolnames') // Uncomment to debug;

				const years = [...new Set(selectedData.map((d) => d.year))];

				// get filtered data from selection Data.
				const reDrawData = data
					.filter((d) => years.includes(d['Year']))
					.filter((record) => schoolNames.includes(record.SchoolName));
				const dlabel = fields
					.find((e) => e.slabel === one.field).dlabel;
				const tooltips = fields
					.find((e) => e.slabel === one.field).tooltipFields;

				// Now build the linegraph based on what is brushed in the violins
				linechart()
					.x((d) => d['Year'])
					.xLabel('Year')
					.y((d) => d[dlabel])
					.yLabel(dlabel)
					.yLabelOffset(40)
					.tooltipFields(tooltips)(
						`.line-chart-${one.field}`, //*** one.field
						reDrawData, // *** reDrawData
						legends
						); // end .tooltipFields(
			} // end if

			// If the user brushes nothing, show everything
			else {
				updateLineCharts(data);
			} // end else

		} // end 'function (selectedData)'

	); // end 'violin.selectionDispatcher().on('


	// add line charts for fields
	function updateLineCharts(visualData) {
		fields.forEach(
			(field) => {
				linechart()
				.x((d) => d['Year'])
				.xLabel('Year')
				.y((d) => d[field.dlabel])
				.yLabel(field.dlabel)
				.tooltipFields(field.tooltipFields)
				.yLabelOffset(40)(
					`.line-chart-${field.slabel}`,
					visualData,
					legends
				);
			} // end '(field) =>'
		); // end 'fields.forEach'
	} // end 'function updateLineCharts(visualData)'


}); // end 'd3.csv('data/Data.csv').then((data) =>'

})(); // end IFFY
