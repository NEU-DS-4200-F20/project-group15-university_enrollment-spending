//source: https://www.d3-graph-gallery.com/graph/violin_jitter.html

violinWidth = 800
violinHeight = 670

function violinPlotChart() {
	//Define the margins
	let margin = {top: 30, right: 50, bottom: 150, left: 25},
	width = violinWidth - margin.left - margin.right,
	height = violinHeight - margin.top - margin.bottom,
	xFields = [],
	xLabelText = '',
	yLabelText = '',
	xScale = d3.scaleBand(),
	xSubScale = d3.scaleLinear(),
	yScale = d3.scaleLinear(),
	selectableElements = d3.select(null),
	dispatcher;

	// Create the chart by adding an svg to the div with the id
	// specified by the selector using the given data
	function chart(selector, data, legends) {
		let svg = d3
		.select(selector)
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)

		svg = svg
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		//get Max Y value from all xFields value.

		// Find the maximum value to determine the scale of the y-axis
		let maxY = 0;
		data.forEach((record) => {xFields.forEach((field) => {
			const fieldMax = parseFloat(record[field]);
			// I parsed it because it was treating the number as text
			if (maxY < fieldMax) {maxY = fieldMax;}
		});});

		// build the y-axis
		yScale
		.domain([0, maxY * 1.05]) // 5% cushion added to the top of the violin plot chart
		.rangeRound([height, 0]);

		//add y-axis to the bottom of svg
		const yAxis = svg
		.append('g')
		.call(d3.axisLeft(yScale));

		// Build the x-axis
		xScale
		.range([0, width])
		.domain(xFields)
		.padding(0.05);
		// padding(0.05) is the space between 2 violins. 0 = no padding. 1 = maximum.

		//add x-axis to the bottom of svg
		const xAxis = svg
		.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(xScale));

		// format the x-axis labels
		xAxis
		.selectAll('text')
		.attr('transform', 'rotate(-45)')
		.attr('text-anchor', 'end')
		.attr('font-size', '14px')

		//Features of the histogram
		const histogram = d3
		.bin() // d3.histogram is v4
		.domain(yScale.domain())
		.thresholds(yScale.ticks(35))
		.value((d) => parseFloat(d));

		//Getting Histogram Values by SchoolName
		xFields.forEach((field) => {
			let sumstat = d3.rollup(data,(v) =>{
					const input = v.map((se) => se[field]);
					const bins = histogram(input);
					return bins;},
				(d) => {return d.SchoolName;}
			);


			//get array from Map type --> we are turning it into key, value
			sumstat = Array.from(sumstat.entries()).map(([key, value]) => ({
				key: key,
				value: value,
			}));

			//get max bandwidth of each violin plot.
			let maxNum = 0;

			for (i in sumstat) {
				let allBins = sumstat[i].value;
				lengths = allBins.map(function (a) {
					return a.length;
				});
				longuest = d3.max(lengths);
				if (longuest > maxNum) {
					maxNum = longuest;
				}
			}

			// The maximum width of a violin must be x.bandwidth = the width dedicated to a group
			xSubScale
			.range([0, xScale.bandwidth()])
			.domain([-maxNum, maxNum]);

			svg
			.selectAll('myViolin')
			.data(sumstat)
			.enter() // Now we are working group per group
			.append('g')
			.attr('transform', function () {return 'translate(' + xScale(field) + ' ,0)';})
			// Translation on the right to be at the group position
			.append('path')
			.datum(function (d) {return d.value;}) // Now we are working bin per bin
			.style('fill', 'grey')
			.style('stroke', 'grey')
			.attr('d', d3
				.area()
				.x0(xSubScale(0))
				.x1(function (d) {return xSubScale(d.length);})
				.y(function (d) {return yScale(d.x0);})
				.curve(d3.curveCatmullRom)
			);
			// This makes the line smoother to give the violin appearance.
			// Try d3.curveStep to see the difference
		},);

		// Add individual points with jitter
		let jitterWidth = 40;
		svg
		.selectAll('.indPoints')
		.data(data)
		.enter()
		.append('g')
		.selectAll('circle')
		.data((d) => Object.entries(d)
			.filter(([key, _]) => xFields.includes(key))
			.map((e) => ({
				field: e[0],
				value: e[1],
				name: d.SchoolName,
				year: d.Year,
			}))
		)

		.enter()
		.append('circle')
		.attr('cx', (d) => {
			d.cx = xScale(d.field) + xScale.bandwidth()/2 - Math.random() * jitterWidth;
			return d.cx;
		})
		.attr('cy', function (d) {d.cy = yScale(parseFloat(d.value));return d.cy;})
		.attr('r', 3) // 'r' is the size of the plots
		.style('fill', function (d) {
			const matched = legends.find((l) => l.name === d.name);
			return matched.color;
		})
		.attr('stroke', 'black')

		// // What happens to the plots when hovering
		// .on('mouseover',
		// 	function (e, d) {
		// 		d3
		// 		.select(this)
		// 		.style('stroke', 'blue')
		// 		.style('stroke-width', 2);
		// 	}
		// )

		// // What happens to the plots when no longer hovering
		// .on('mouseout',
		// 	function (e, d) {
		// 		d3
		// 		.select(this)
		// 		.style('stroke', 'white')
		// 		.style('stroke-width', 1);
		// 	}
		// );

		// Format X axis label
		xAxis
		.append('text')
		.attr('class', 'axisLabel')
		.attr('text-anchor', 'end')
		.attr('transform', `translate(
			${width}, ${margin.bottom -16})`
			// (x,-y) position bottom right corner of text
			// from bottom left corner of graph
			)
		.text(xLabelText);

		// Format Y axis label
		yAxis
		.append('text')
		.attr('class', 'axisLabel')
		.attr('text-anchor', 'start')
		.attr('transform',`translate(
			${-margin.left}, -10)`)
			// (x,-y) position bottom left corner of text
			// from top left corner of graph
		.text(yLabelText);

		svg.call(brush);

		//points variable for storing selectable elements
		let points = svg.selectAll('circle');

		selectableElements = points;

		// Highlight points when brushed
		function brush(g) {
			const brush = d3
			.brush()
			.on('start brush', highlight)
			.on('end', brushEnd)
			// define the brushable area next
			.extent([
				[-margin.right,-margin.top],
				// (x,-y) position top left corner of brushing area
				// from top left corner of graph
				[width+margin.left,height+margin.bottom],
				// (x,-y) position bottom right corner of brushing area
				// from top left corner of graph
			]);
			g.call(brush); // Adds the brush to this element

			// Highlight the selected circles
			function highlight(event, d) {
				if (event.selection === null) return;
				const [[x0, y0],[x1, y1]] = event.selection;
				points.classed(
					'selected',
					(d) => x0 <= d.cx && d.cx <= x1 && y0 <= d.cy && d.cy <= y1
				);
			}

			function brushEnd(event, d) {
				// We don't want infinite recursion
				if (
					event.sourceEvent !== undefined &&
					event.sourceEvent.type != 'end'
				)
				// then
				{
					d3.select(this).call(brush.move, null);

					// Get the name of our dispatcher's event
					let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

					// Let other charts know
					dispatcher.call(dispatchString,this,svg.selectAll('.selected').data());
				}
			}
		}

		return chart;
	}

	chart.xFields = function (_) {
		if (!arguments.length) return xFields;
		xFields = _;
		return chart;
	};

	chart.xLabel = function (_) {
		if (!arguments.length) return xLabelText;
		xLabelText = _;
		return chart;
	};

	chart.yLabel = function (_) {
		if (!arguments.length) return yLabelText;
		yLabelText = _;
		return chart;
	};

	// Gets or sets the dispatcher we use for selection events
	chart.selectionDispatcher = function (_) {
		if (!arguments.length) return dispatcher;
		dispatcher = _;
		return chart;
	};

	// Given selected data from another visualization
	// select the relevant elements here (linking)
	chart.updateSelection = function (selectedData) {
		if (!arguments.length) return;

		// Select an element if its datum was selected
		selectableElements.classed(
			'selected',
			(d) => selectedData.includes(d.name));
	};

	//Adding Interactivity on hovering from linechart to violin plot
	chart.updateHighlight = function (hoveredData, field) {
		if (!arguments.length) return;
		if (hoveredData) {
		selectableElements.each(function (d) {
		//set opacity as 1 for hovered Data
		if (
			hoveredData.SchoolName === d.name &&
			hoveredData.Year === d.year &&
			field === d.field &&
			hoveredData[field] === d.value
		) {
			d3.select(this)
			.style('opacity', 1)
			.style('r', 8);
		} else {
			//others will be oapcity 0.1
			d3.select(this)
			.style('opacity', 0.05);
			}
		});
		} else {
		//when hover out, restores all opacity of circles.
		selectableElements
		.style('opacity', 1)
		.style('r', 3);
		}
	};

	return chart;
}
