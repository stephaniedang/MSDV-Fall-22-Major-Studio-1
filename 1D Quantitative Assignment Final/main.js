/* global d3 */

let sdg_data;
let allPlaces =[];
let sortedPlaces = [];
let worldAverage = [];

d3.json('data.json').then(data => {
    sdg_data = data;
    console.log('FROM THE INSIDE', data)
   analyzeData();
    console.log('FROM ANALYZE DATA', allPlaces)
  displayData();
});

 function analyzeData(){
   // go through the array of data
   data = sdg_data
   
   data.forEach(function(n) {
     let countryName = n.GeoAreaName;
     let value = n.Value;
     
      if(value >= 0){allPlaces.push({
      name: countryName,
      percent: value
      })}
      
  // sort by amount of items in the list
      allPlaces.sort( (a,b) => a.percent-b.percent );
      allPlaces.reverse();
     });
     
     sortedPlaces = sortedPlaces.concat(allPlaces.slice(0,25));
   
   console.log('Hello', allPlaces);
   console.log('Helloo', sortedPlaces);
   console.log('Hellooo', worldAverage);
 }
 
function displayData(){

  // define dimensions and margins for the graphic
  const margin = ({top: 100, right: 50, bottom: 100, left: 80})
  const width = window.innerWidth;
  const height = window.innerHeight;

  // let's define our scales.
  // yScale corresponds with % per country
  const yScale = d3.scaleLinear()
                   .domain([0, d3.max(sortedPlaces, d => parseInt(d.percent))+1])
                   .range([height - margin.bottom, margin.top]);

  // xScale corresponds with country names
  const xScale = d3.scaleBand()
                 .domain(sortedPlaces.map(d => d.name))
                .range([margin.left, width - margin.right])

  const sequentialScale = d3.scaleSequential()
                            .domain([0, d3.max(sortedPlaces, d => parseInt(d.percent))])
                            .interpolator(d3.interpolateOranges);

  // create an svg container from scratch
  const svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)

  // attach a graphic element, and append rectangles to it
  svg.append('g')
     .selectAll('rect')
     .data(sortedPlaces)
     .join('rect')
     .attr('x', function(d){return xScale(d.name) })
     .attr('y', function(d){return yScale(d.percent) })
     .attr('height', function(d){return yScale(0)-yScale(d.percent) })
     .attr('width', function(d){return xScale.bandwidth() - 2 })
     .style('fill', function(d) {return sequentialScale(d.percent);});
     
  svg.append("line")
     .style("stroke", "white")
     .style("stroke-width", 4)
     .style("stroke-dasharray", ("5, 5"))
     .attr("x1", 0)
     .attr("y1", yScale(8.4))
     .attr("x2", width)
     .attr("y2", yScale(8.4));
     
  svg.append("text")
    .text("World Average: 8.4%")
    .attr('font-family', 'sans-serif')
    // .attr('font-weight', 'bold')
    .attr('fill', 'white')
    .attr("x", 88)
    .attr("y", yScale(6.8));

  // AXES

  // Y Axis
  const yAxis =  d3.axisLeft(yScale).ticks(5)

  svg.append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .call(yAxis);

  // X Axis
  const xAxis =  d3.axisBottom(xScale).tickSize(0);
  svg.append('g')
  .attr('transform', `translate(0,${height - margin.bottom})`)
  .call(xAxis)
  .selectAll('text')
  .style('text-anchor', 'end')
  .attr('dx', '-.6em')
  .attr('dy', '-0.1em')
  .attr('transform', function(d) {return 'rotate(-35)' });

      // Labelling the graph
    svg.append('text')
    .attr('font-family', 'sans-serif')
    .attr('font-weight', 'bold')
    .attr('font-size', 20)
    .attr('y', margin.top-20)
    .attr('x', margin.left)
    .attr('fill', 'black')
    .attr('text-anchor', 'start')
    .text('Prevalence of undernourishment (%) by Country (Top 25), Source: Food and Agriculture Organization of the United Nations (FAO)')
}

window.onresize = function(){ location.reload(); }