const svg = d3.select('svg');

function mouseover(){
    svg.selectAll('circle')
    .data([0,1,2,3,4,5,6,7], d=>d)
    .join(
        enter=>enter,
        update=>update
            .attr('fill', (d,i)=> i==this.__data__ ? 'coral' : 'dodgerblue')
            .transition()
            .attr('cy', (d,i)=> i==this.__data__ ? 50 : 200)
            .duration(500)
            .transition()
            .attr('cy', (d,i)=> i==this.__data__ ? 200 : 200)
            .duration(500)
            .ease(d3.easeBounce)
            .attr('fill', (d,i)=> i==this.__data__ ? 'dodgerblue' : 'dodgerblue'),
        exit=>exit
    )
}

svg.selectAll('circle')
        .data([0,1,2,3,4,5,6,7], d=>d)
        .join('circle')
        .attr('fill','coral')
        .attr('cy',50)
        .attr('cx', (d,i) => i*25 + 12.5)
        .attr('r',10)
        .transition()
        .duration(1000)
        .delay((d,i)=>i*100)
        .ease(d3.easeBounce)
        .attr('fill', 'dodgerblue')
        .attr('cy', 200)

svg.selectAll('circle').on('mouseover', mouseover);

// hover not working ?

svg.append('text').text('hello world') 
.attr('x', 0)
.attr('y', 250)
.style('font-size', 20)
.style('fill','coral')
.style('fill-opacity','0.5')
.on('mouseover', function(d,i) {
    d3.select(this).transition()
      .ease('cubic-out')
      .duration('200')
      .attr('font-size', 32)
      .attr('fill', 'springgreen');
  })
  .on('mouseout', function(d,i) {
    d3.select(this).transition()
      .ease('cubic-out')
      .duration('200')
      .attr('font-size', 20)
      .attr('fill', 'coral');
  });
