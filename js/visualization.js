// Immediately Invoked Function Expression limits access to our variables and prevent conflicts

// General event type for selections, used by d3-dispatch -> https://github.com/d3/d3-dispatch



(() => {
fileName = 'data/Data.csv'

// get the data from the csv file
d3.csv(fileName).then((data) => {
	const dispatchUpdateSelectionString = 'selectionUpdated',
	dispatchFilterString = 'filterCircles',
	dispatchHoverString = 'hoverUpdated';

	// Define the columns (fields) used in the violinplot and linecharts
	const fields = [
		{
			slabel: 'Instruction_Pct',
			dlabel: 'Instruction_PerFTE',
			tooltipFields: [
				'Instruction_Pct',
				'Instruction_PerFTE',
				'Instruction (Pct of Expenses)',
				'Instruction (Per FTE Student)',
			],
		},
		{
			slabel: 'PublicService_Pct',
			dlabel: 'PublicService_PerFTE',
			tooltipFields: [
				'PublicService_Pct',
				'PublicService_PerFTE',
				'Public Service (Pct of Expenses)',
				'Public Service (Per FTE Student)',
			],
		},
		{
			slabel: 'AcademicSupport_Pct',
			dlabel: 'AcademicSupport_PerFTE',
			tooltipFields: [
				'AcademicSupport_Pct',
				'AcademicSupport_PerFTE',
				'Academic Support (Pct of Expenses)',
				'Academic Support (Per FTE Student)',
			],
		},
		{
			slabel: 'StudentServices_Pct',
			dlabel: 'StudentServices_PerFTE',
			tooltipFields: [
				'StudentServices_Pct',
				'StudentServices_PerFTE',
				'Student Services (Pct of Expenses)',
				'Student Services (Per FTE Student)',
			],
		},
		{
			slabel: 'InstitutionalSupport_Pct',
			dlabel: 'InstitutionalSupport_PerFTE',
			tooltipFields: [
				'InstitutionalSupport_Pct',
				'InstitutionalSupport_PerFTE',
				'Institutional Support (Pct of Expenses)',
				'Institutional Support (Per FTE Student)',
			],
		},
		{
			slabel: 'NetScholarships_Pct',
			dlabel: 'NetScholarships_PerFTE',
			tooltipFields: [
				'NetScholarships_Pct',
				'NetScholarships_PerFTE',
				'Net Scholarships (Pct of Expenses)',
				'Net Scholarships (Per FTE Student)',
		],
		},
		{
			slabel: 'AuxiliaryEnterprises_Pct',
			dlabel: 'AuxiliaryEnterprises_PerFTE',
			tooltipFields: [
				'AuxiliaryEnterprises_Pct',
				'AuxiliaryEnterprises_PerFTE',
				'Auxiliary Enterprises (Pct of Expenses)',
				'Auxiliary Enterprises (Per FTE Student)',
			],
		},
		{
			slabel: 'Other_Pct',
			dlabel: 'Other_PerFTE',
			tooltipFields: [
				'Other_Pct',
				'Other_PerFTE',
				'Other (Pct of Expenses)',
				'Other (Per FTE Student)',
			],
		},
	];

	// Assign a color to each university. Credit:
	// https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
	const legends = [...new Set(data.map((e) => e.SchoolName)),]
	.map((sn, i) => ({ name: sn, color: colors[i] }));

	//Create legend for schoolNames
	const legendChart = legend()
	.selectionDispatcher(d3.dispatch(dispatchFilterString))(
		'.legend-zone',
		legends
	);

	//Create Total FTE chart
	ftelinechart()
	.x((d) => d['Year'])
	.xLabel('Year')
	.y((d) => d['Total_FTE_Students'])
	.yLabel('Total FTE Students')
	.tooltipFields(['Total_FTE_Students', 'FTE_Student_Growth'])
	.yLabelOffset(5)('.total-fte-holder', data, legends);

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
	const violin = violinPlotChart()
	.xFields(fields.map((d) => d.slabel))
	.xLabel('Expense Categories')
	.yLabel('Percent of Total Expenses')
	.selectionDispatcher(d3.dispatch(dispatchUpdateSelectionString))('.violinplot-holder',data,legends,);

	// Allow school filtering directly in the legend. When user clicks
	// any circle, tell the linechart to update it's circles
	legendChart.selectionDispatcher().on(dispatchFilterString,function (selectedSchools) {

		// Add the selection to the list of schools to filter by
		const reDrawData = data.filter((record) => selectedSchools.includes(record.SchoolName));

		// Update the violins to highlight data from the selected schools
		violin.updateSelection(selectedSchools)

		// Update the linegraphs to only show filtered data
		updateLineCharts(reDrawData)

		// Update the FTE line graph only show filtered data
		ftelinechart()
		.x((d) => d['Year'])
		.xLabel('Year')
		.y((d) => d['Total_FTE_Students'])
		.yLabel('Total FTE Students')
		.tooltipFields(['Total_FTE_Students','FTE_Student_Growth'])
		.yLabelOffset(5)(
			'.total-fte-holder',
			reDrawData,
			legends,
		); // End ftelinechart
	}); // End legendChart.selectionDispatcher


	// When the violin plots are brushed, tell the linechart to update it's selection
	violin.selectionDispatcher().on(dispatchUpdateSelectionString, function (selectedData) {

		const one = selectedData[0];

		// find records that match the brushed plots (if the user actually brushed plots)
		if (one) {

			// unique schoolNames from selected Data
			const schoolNames = [...new Set(selectedData.map((record) => record.name))];
			const years = [...new Set(selectedData.map((d) => d.year))];

			// save filtered schoolNames and Years to reDrawData.
			const reDrawData = data
			.filter((d) => years.includes(d['Year']))
			.filter((record) => schoolNames.includes(record.SchoolName));

			// set the dlabel to match the brushed points
			const dlabel = fields
			.find((e) => e.slabel === one.field).dlabel;

			// set the tooltips to match the brushed points
			const tooltips = fields
			.find((e) => e.slabel === one.field).tooltipFields;

			// Now rebuild the linegraphs based on what was brushed in the violins
			const currentChart = linechart()
			.x((d) => d['Year'])
			.xLabel('Year')
			.y((d) => d[dlabel])
			.yLabel(dlabel)
			.yLabelOffset(5)
			.tooltipFields(tooltips)
			.hoverDispatcher(d3.dispatch(dispatchHoverString))(
				`.line-chart-${one.field}`,
				reDrawData,
				legends
			);

			//add handler for hovering action
			currentChart
			.hoverDispatcher()
			.on(dispatchHoverString, function (hoveredData) {
				dispatchCallback(hoveredData, one.field);
			});
		}

		// If the user brushed nothing (or just clicked in the area) show everything
		else {
			updateLineCharts(data)

			ftelinechart()
			.x((d) => d['Year'])
			.xLabel('Year')
			.y((d) => d['Total_FTE_Students'])
			.yLabel('Total FTE Students')
			.tooltipFields(['Total_FTE_Students', 'FTE_Student_Growth'])
			.yLabelOffset(5)('.total-fte-holder', data, legends);
		}
	}); // End violin.selectionDispatcher


	// add line charts for fields
	function updateLineCharts(visualData) {fields.forEach((field) => {
		let curLineChart = linechart()
		.x((d) => d['Year'])
		.xLabel('Year')
		.y((d) => d[field.dlabel])
		.yLabel(field.dlabel)
		.tooltipFields(field.tooltipFields)
		.yLabelOffset(5)
		//added dispatcher for interaction
		.hoverDispatcher(d3.dispatch(dispatchHoverString))(
			`.line-chart-${field.slabel}`,visualData,legends);

		//added handler for hovering action
		curLineChart
		.hoverDispatcher()
		.on(dispatchHoverString, function (hoveredData) {
			//call hovering manage function
			dispatchCallback(hoveredData, field.slabel);
		});
	});}

	//event for hovering of line charts
	function dispatchCallback(hoveredData, field) {
		// console.log(hoveredData, 'hoveredD!');
		violin.updateHighlight(hoveredData, field);
	}

}); // end 'd3.csv('data/Data.csv').then((data) =>'

})(); // end IFFY