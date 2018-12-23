// D3.js Data Journalism - create interactie scatter
// Level 1: D3 Dabbler
// poverty vs. healthcare

// svg wrapper dimensions
var svgWidth = 800;
var svgHeight = 520;
var margin = {top: 20,right: 40,bottom: 60,left: 80};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart").append("svg").attr("style", "outline: thin solid #f2f2f2;").attr("width", svgWidth).attr("height", svgHeight);
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(demData) {
  // Step 1: Parse Data/Cast as numbers ==============================
  demData.forEach(function(data) {data.poverty = +data.poverty; data.healthcare = +data.healthcare;});
  // Step 2: Create scale functions =================================
  var xLinearScale = d3.scaleLinear().domain([8, d3.max(demData, d => d.poverty)+2]).range([0, width-1]);
  var yLinearScale = d3.scaleLinear().domain([2, d3.max(demData, d => d.healthcare)+2]).range([height, 20]);
  // Step 3: Create axis functions ==================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  // Step 4: Append Axes to the chart ================================
  chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
  chartGroup.append("g").call(leftAxis);
  // Step 5a: Create Circles ==========================================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(demData)
  .enter()
  .append("circle")
  .attr("class", "stateCircle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "12") 
  // Step 5b: add text to circles ======================================
  var circlesGroup2 = chartGroup.selectAll("text")
  .data(demData)
  .enter()
  .append('text')
  .attr("class", "stateText")
  .selectAll("tspan")
  .data(demData)
  .enter()
  .append("tspan")
    .attr("x", function(d) {return xLinearScale(d.poverty - 0);})
    .attr("y", function(d) {return yLinearScale(d.healthcare - 0.2);})
    .text(function(d) {return d.abbr});
  // Step 6: Initialize tool tip =========================================
  var toolTip = d3.tip().attr("class", "d3-tip").offset([80, -60]).html(function(d) {return (`${d.state}<br> In Poverty: ${d.poverty}%<br> Lacks Healthare: ${d.healthcare}%`);
    });
  // Step 7: Create tooltip in the chart ==================================
  chartGroup.call(toolTip);
  // Step 8: Create event listeners to display / hide tooltip =============
  circlesGroup2.on("click", function(data) {toolTip.show(data, this);}).on("mouseout", function(data, index) {toolTip.hide(data);});
  // Step 9: Create axes labels and Title =================================
  chartGroup.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left + 20).attr("x", -20 - (height / 2)).attr("dy", "1em").attr("class", "aText").text("Lacks Healthare (%)");
  chartGroup.append("text").attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`).attr("class", "aText").text("In Poverty (%)");
  chartGroup.append('text').classed('title', true).attr("transform", `translate(${width/2}, ${height - 430})`).attr('text-anchor', 'middle').attr('font-size', '21px').text(`Percent in Poverty vs Percent that Lacks Healthcare by U.S. State`).style("font-weight", "bold").style("fill", "#464646");
  
  });

