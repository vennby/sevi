const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#hero").append("svg")
  .attr("width", width)
  .attr("height", height);

const projection = d3.geoMercator()
  .center([78.9629, 22.5937]) // India center
  .scale(width * 1.5)
  .translate([width / 2, height / 2]);

const path = d3.geoPath(projection);

const tooltip = d3.select("#tooltip");

// Example SEVI scores for Indian states
const seviData = {
  "Maharashtra": 0.65,
  "Karnataka": 0.58,
  "Delhi": 0.72,
  "Tamil Nadu": 0.49,
  "Uttar Pradesh": 0.79,
  "West Bengal": 0.68
  // Add more states as needed
};

// Load India GeoJSON
d3.json("https://raw.githubusercontent.com/Geohacker/india/master/state/india_state.geojson").then(india => {
  svg.selectAll(".state")
    .data(india.features)
    .join("path")
    .attr("class", "state")
    .attr("d", path)
    .on("mousemove", (event, d) => {
      const [x, y] = d3.pointer(event);
      const stateName = d.properties.name;
      const score = seviData[stateName];
      tooltip
        .style("left", (x + 20) + "px")
        .style("top", (y + 20) + "px")
        .style("opacity", 1)
        .html(`<strong>${stateName}</strong><br>SEVI Score: ${score !== undefined ? score : "N/A"}`);
    })
    .on("mouseout", () => tooltip.style("opacity", 0));
});
