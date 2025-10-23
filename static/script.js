// Set up the dimensions for the SVG map
const width = window.innerWidth;
const height = window.innerHeight;

// Append an SVG element to the #hero section
const svg = d3.select("#hero").append("svg")
  .attr("viewBox", [0, 0, width, height]);

// Define the map projection
const projection = d3.geoNaturalEarth1()
  .scale(width / 6.3) // Scale the map to fit the screen
  .translate([width / 2, height / 2]); // Center the map

// Create a path generator using the projection
const path = d3.geoPath(projection);

// Select the tooltip element
const tooltip = d3.select("#tooltip");

// Example SEVI scores for countries
const seviData = {
  "India": 0.72,
  "United States of America": 0.38,
  "Brazil": 0.55,
  "China": 0.41,
  "Nigeria": 0.79,
  "Australia": 0.29
};

// Load the world map data
// Using TopoJSON to render country shapes
// Source: World Atlas dataset
// Countries are rendered as paths
// Tooltip shows SEVI score on hover

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(world => {
  const countries = topojson.feature(world, world.objects.countries).features;

  svg.selectAll(".country")
    .data(countries)
    .join("path")
    .attr("class", "country")
    .attr("d", path)
    .on("mousemove", (event, d) => {
      const [x, y] = d3.pointer(event);
      const countryName = d.properties.name || "Unknown";
      const score = seviData[countryName];
      tooltip
        .style("left", (x + 20) + "px")
        .style("top", (y + 20) + "px")
        .style("opacity", 1)
        .html(`
          <strong>${countryName}</strong><br>
          SEVI Score: ${score !== undefined ? score : "N/A"}
        `);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
});