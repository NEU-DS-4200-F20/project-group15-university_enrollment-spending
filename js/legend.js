function legend() {
	const margin = {
		top: 10,
		right: 10,
		bottom: 10,
		left: 50,
		},
		width = 1300,
		height = 200;

	let selectedSchools = [];

	function chart(selector, data) {
		let svg = d3
		.select(selector)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

		svg = svg
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// add legends into chart if applicable
		let
			yPos = 0,
			xPos = 0;
		const legendG = svg
			.selectAll(".legend-for-schoolname")
			.data(data)
			.enter()
			.append("g")
			.attr("class", "legend-for-schoolname")
			.attr(
				"transform",
				(_, i) => {
					if (i % 4 === 0) {
						yPos += 30;
						xPos = 0;
					}
					else {
						xPos = (i % 4) * 300;
					}
					return `translate(${xPos}, ${yPos})`;
				}
			);

		legendG
		.append("circle")
		.style("fill", (d) => d.color)
		.attr("stroke", "black")
		.attr("r", 7)
		.on(
			"click",
			function (event, d) {
				if (selectedSchools.includes(d.name)) {
					selectedSchools = selectedSchools.filter((s) => s !== d.name);
					d3.select(this).style("stroke", "black").style("stroke-width", 1);
				}
				else{
					selectedSchools = [...selectedSchools, d.name];
					d3.select(this).style("stroke", "pink").style("stroke-width", 3);
				}

				// Get the name of our dispatcher's event
				let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

				// // Let other charts know
				dispatcher.call(dispatchString, this, selectedSchools);
			}
		);

		legendG
			.append("text")
			.attr("class", "legend-text")
			.attr("dx", "1em")
			.attr("dy", ".4em")
			.style("fill", "black")
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
