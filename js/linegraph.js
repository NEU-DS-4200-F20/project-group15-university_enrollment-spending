// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/

// Based on Mike Bostock's margin convention
// https://bl.ocks.org/mbostock/3019563

let lineWidth = 500
// when adjusting this number also look at:
//		style.css .linecharts-holder {width}

function linechart() {
	let margin = {top: 30, left: 45, right: 10, bottom: 40},
	width = lineWidth - margin.left - margin.right,
	height = 280 - margin.top - margin.bottom,
	xValue = (d) => d[0],
	yValue = (d) => d[1],
	xLabelText = '',
	yLabelText = '',
	xScale = d3.scalePoint(),
	yScale = d3.scaleLinear(),
	tooltipFields = [],
	dispatcher;


	// Create the chart by adding an svg to the div with the id
	// specified by the selector using the given data
	function chart(selector, data, legends) {

		//clear all svg elements before start to draw new chart
		d3.select(selector).selectAll('*').remove();

		let svg = d3
		.select(selector)
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom);

		svg = svg
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		//Define scales
		xScale
		.domain(d3.group(data, xValue).keys())
		.rangeRound([0, width]);

		yScale
		.domain([
			d3.min(data, (d) => parseFloat(yValue(d))),
			d3.max(data, (d) => parseFloat(yValue(d))),
		])
		.rangeRound([height, 0]);

		// X axis and label
		svg
		.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(xScale))
		.selectAll('text')
		.style('text-anchor', 'end')
		.attr('dx', '-.8em')
		.attr('dy', '.15em')
		.attr('transform', 'rotate(-65)') // Put X axis tick labels at an angle
		.append('text')
		.attr('class', 'axisLabel')
		.attr('text-anchor', 'end')
		.attr('transform', 'translate(' + width + ',-10)')
		.text(xLabelText);

		// Y axis and label
		svg
		.append('g')
		.call(d3.axisLeft(yScale))
		.append('text')
		.attr('class', 'axisLabel')
		.attr('text-anchor', 'start')
		.attr('transform', `translate(${-margin.left}, -10)`)
		.text(yLabelText);

		// group path data per each school
		const sumstat = d3.group(data, (d) => d.SchoolName);

		// Add the lines
		const pathG = svg
		.selectAll('.path-g')
		.data(Array.from(sumstat))
		.enter()
		.append('g');

		pathG
		.append('path')
		.attr('fill', 'none')
		.attr('stroke', (d) => {
			//d[0] is schoolname, d[1] is line data to draw line
			const matchedColor = legends
			.find((e) => e.name === d[0]).color;
			return matchedColor;
		})
		.attr('stroke-width', 3)
		.attr('d', (d) => d3.line().x(X).y(Y)(d[1]));

		//define the tooltip
		var ttip = d3
		.select("body")
		.append("div")
		.attr("class", "tooltip tooltip-" + selector.substr(1, selector.length))
		.style("opacity", 0);

		// Add the points to the linegraph
		pathG
		.selectAll(".line-point")
		.data((d) => d[1])
		.enter()
		.append("circle")
		.attr("class", "point line-point")
		.style("stroke-width", 1.5)
		.style("stroke", "rgb(225, 225, 225)")
		.style("fill", (d) => {
			d.color = legends.find((e) => e.name === d.SchoolName).color;
			return d.color;
		})
		.attr("cx", X)
		.attr("cy", Y)
		.attr("r", 3)


		//mouse events
		.on("mouseover", function (event, d) {
			ttip
			.transition()
			.duration(200)
			.style('opacity', 0.9);

			ttip.html(
				`<b>${d.SchoolName}<br />Year: </b>${d.Year}<br />
				<b>${tooltipFields[2]}</b>: ${parseFloat(d[tooltipFields[0]])}%<br />
				<b>${tooltipFields[3]}</b>: $${parseFloat(d[tooltipFields[1]])}`)
				// tooltipFields[0] is Pct, [1] is FTE, [2] is percent name, [3] is fte name
				.style('width', 275+'px')
				.style('left', event.pageX-275 + 'px')
				.style('top', event.pageY-75 + 'px');


			//use raise() to bring the element forward when hovering the mouse
			//hide when mouse moves away
			const selection = d3.select(this);

			selection
			.transition()
			.delay('20')
			.duration('200')
			.attr("r", 10)
			.style("opacity", 1)
			.style("fill", d.color);

			// Get the name of our dispatcher's event (dispatchString = 'hoverUpdated')
			let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

			// Let other charts know
			dispatcher.call(dispatchString, this, d);
		})

		.on("mouseout", function (d) {
			ttip
			.transition()
			.duration(500)
			.style("opacity", 0);

			const selection = d3.select(this);

			selection
			.transition()
			.delay(20)
			.duration(200)
			.attr("r", 3)

			.style("opacity", 1);

			// Get the name of our dispatcher's event
			let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

			// Let other charts know
			dispatcher.call(dispatchString, this, null);
		});

		return chart;

	}


	// The x-accessor from the datum
	function X(d) {
		return xScale(xValue(d));
	}

	// The y-accessor from the datum
	function Y(d) {
		return yScale(yValue(d));
	}

	chart.margin = function (_) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	chart.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	chart.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	chart.x = function (_) {
		if (!arguments.length) return xValue;
		xValue = _;
		return chart;
	};

	chart.y = function (_) {
		if (!arguments.length) return yValue;
		yValue = _;
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

	// chart.yLabelOffset = function (_) {
	// 	if (!arguments.length) return yLabelOffsetPx;
	// 	yLabelOffsetPx = _;
	// 	return chart;
	// };

	chart.tooltipFields = function (_) {
		if (!arguments.length) return tooltipFields;
		tooltipFields = _;
		return chart;
	};

	// Gets or sets the dispatcher we use for selection events
	chart.hoverDispatcher = function (_) {
		if (!arguments.length) return dispatcher;
		dispatcher = _;
		return chart;
	};

	return chart;
}