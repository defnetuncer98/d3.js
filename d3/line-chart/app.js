// Type conversion.
const parseDate = string => d3.utcParse('%Y-%m-%d')(string);
const parseNA = string => (string === 'NA' ? undefined : string);

function type(d) {
  const date = parseDate(d.release_date);

  return {
    budget: +d.budget,
    genre: parseNA(d.genre),
    genres: JSON.parse(d.genres).map(d => d.name),
    homepage: parseNA(d.homepage),
    id: +d.id,
    imdb_id: parseNA(d.imdb_id),
    original_language: parseNA(d.original_language),
    overview: parseNA(d.overview),
    popularity: +d.popularity,
    poster_path: parseNA(d.poster_path),
    production_countries: JSON.parse(d.production_countries),
    release_date: date,
    release_year: date.getFullYear(),
    revenue: +d.revenue,
    runtime: +d.runtime,
    tagline: parseNA(d.tagline),
    title: parseNA(d.title),
    vote_average: +d.vote_average,
    vote_count: +d.vote_count,
  };
}

// Data utilities,
function filterData(data) {
  return data.filter(d => {
    return (
      d.release_year > 1999 &&
      d.release_year < 2010 &&
      d.revenue > 0 &&
      d.budget > 0 &&
      d.genre &&
      d.title
    );
  });
}

// Drawing utilities.
function formatTicks(d) {
  return d3
    .format('~s')(d)
    .replace('M', ' mil')
    .replace('G', ' bil')
    .replace('T', ' tril');
}

function prepareLineChartData(data){
  const revenueMap = d3.rollup(data, values => d3.sum(values, leaf => leaf.revenue), d => d.release_year);
  const budgetMap = d3.rollup(data, values => d3.sum(values, leaf => leaf.budget), d => d.release_year);
  const revenue = Array.from(revenueMap).sort((a,b) => a[0] - b[0]);
  const budget = Array.from(budgetMap).sort((a,b) => a[0] - b[0]);
  const parseYear = d3.timeParse('%Y');
  const dates = revenue.map(d => parseYear(d[0]));
  const yValues = [
    ...Array.from(revenueMap.values()),
    ...Array.from(budgetMap.values()),
  ];
  const yMax = d3.max(yValues);
  const lineData = {
    series: [{
      name: 'Revenue',
      color: 'dodgerblue',
      values: revenue.map(d => ({date: parseYear(d[0]), value: d[1]})),
    },
    {
      name: 'Budget',
      color: 'darkorange',
      values: budget.map(d => ({date: parseYear(d[0]), value: d[1]})),
    },
  ],
  dates: dates,
  yMax: yMax,
  };
  
  return lineData;
}

// Main function.
function ready(movies) {
  // Data prep.
  const moviesClean = filterData(movies);
  const lineChartData = prepareLineChartData(moviesClean);
  // Dimensions.
  const margin = { top: 80, right: 60, bottom: 40, left: 60 };
  const width = 500 - margin.right - margin.left;
  const height = 500 - margin.top - margin.bottom;

  // Scale data.
  const xScale = d3.scaleTime()
    .domain(d3.extent(lineChartData.dates))
    .range([0,width]);
  console.log(lineChartData);
  const yScale = d3.scaleLinear()
    .domain([0, lineChartData.yMax])
    .range([height, 0]);

  const lineGen = d3
    .line()
    .x(d=>xScale(d.date))
    .y(d=>yScale(d.value));

  // Draw base.
  const svg = d3
    .select('.line-chart-container')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Draw x axis.
  const xAxis = d3.axisBottom(xScale);
  const xAxisDraw = svg.append('g').attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`).call(xAxis);

  xAxisDraw.selectAll('text').attr('dy', '1em');

  // Draw y axis.
  const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(formatTicks).tickSizeInner(-height).tickSizeOuter(0);
  const yAxisDraw = svg.append('g')
    .attr('class', 'y axis').call(yAxis);

    debugger;

  // Draw marks.
  const chartGroup = svg.append('g').attr('class','line-chart');
  chartGroup
    .selectAll('.line-series')
    .data(lineChartData.series)
    .enter()
    .append('path')
    .attr('class', d=>`line-series ${d.name.toLowerCase()}`)
    .attr('d', d=>lineGen(d.values))
    .style('fill', 'none')
    .style('stroke', d=>d.color);

  // Draw header.
  const header = svg
    .append('g')
    .attr('class', 'bar-header')
    .attr('transform', `translate(0, ${-margin.top / 2})`)
    .append('text');

    header.append('tspan').text('Budget and Revenue over time in $US');
    header.append('tspan').text('Films w/ budget and revenue figures, 2000-2009')
  .attr('x', 0)
  .attr('dy', '1.5em')
  .style('font-size', '0.8em')
  .style('fill','#555');
  
  // Draw label
  chartGroup
    .append('g')
    .attr('class', 'series-labels')
    .selectAll('.series-label')
    .data(lineChartData.series)
    .enter()
    .append('text')
    .attr('x', d=>xScale(d.values[d.values.length-1].date) + 5)
    .attr('y', d=>yScale(d.values[d.values.length-1].value))
    .text(d=>d.name)
    .style('dominant-baseline', 'central')
    .style('font-size', '0.7em')
    .style('font-weight', 'bold')
    .style('fill', d=>d.color);
}

// Load data.
d3.csv('data/movies.csv', type).then(res => {
  ready(res);
});
