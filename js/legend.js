function legend() {
	const margin = {top: 20, left: 20},
	width = violinWidth,
	height = 130;

	let selectedSchools = [];

	function chart(selector, data) {
		let svg = d3
		.select(selector)
		.append('svg')
		.attr('width', width - margin.left)
		.attr('height', height);

		svg = svg
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

		// add legends into chart if applicable
		let yPos = 0,
		xPos = 0;

		const legendG = svg
		.selectAll('.legend-for-schoolname')
		.data(data)
		.enter()
		.append('g')
		.attr('class', 'legend-for-schoolname')
		.attr('transform', (_, i) => {
			if (i % 3 === 0) { // 3 is the number of columns
				yPos += 25; // legend row height
				xPos = 0; // no horizontal cushion needed
			} else {
				xPos = (i % 3) * (violinWidth - margin.left)/3;
				// Add horizontal cushion
			}
			return `translate(${xPos}, ${yPos})`;
		});

		legendG
		.append('circle')
		.style('fill', (d) => d.color)
		.attr('stroke', 'black')
		.attr('r', 7)

		.on('click', function (event, d) {
			// If the selection is already in the filter list, remove it
			if (selectedSchools.includes(d.name)) {
				selectedSchools = selectedSchools.filter((s) => s !== d.name);
				d3.select(this)
				.attr('r', 7)
				.style('stroke', 'black')
				.style('stroke-width', 1)
				;
			}

			// otherwise, add the selection to the filter list
			else {
				selectedSchools = [...selectedSchools, d.name];
				d3.select(this)
				.attr('r', 10)
				.style('stroke', 'pink')
				.style('stroke-width', 5)
				;
			}

			// Get the name of our dispatcher's event
			let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

			// // Let other charts know
			dispatcher.call(dispatchString, this, selectedSchools);
		});

		legendG
		.append('text')
		.attr('class', 'legend-text')
		.attr('dx', '1em')
		.attr('dy', '.4em')
		.style('fill', 'black')
		.text((d) => d.name);

		return chart;
	}

	// Gets or sets the dispatcher we use for selection events
	chart.selectionDispatcher = function (_) {
		if (!arguments.length) return dispatcher;
		dispatcher = _;
		return chart;
	};

	return chart;
}