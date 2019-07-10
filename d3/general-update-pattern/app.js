function click(){
    const dataset = friends[this.dataset.name]
    update(dataset);
}

function update(data){
    svg
    .selectAll('text')
    .data(data, d=>d)
    .join(
        enter => enter
            .append('text')
            .text(d => d)
            .attr('x', 30)
            .attr('y', (d,i)=>i*30+50)
            .style('fill','dodgerblue'),
        update => update
            .style('fill','gray')
            .attr('y',(d,i)=>i*30+50),
        exit => exit
            .remove()
    )
}

const friends = {
    biff: ['1', '4', '5'],
    chip: ['1', '4'],
    kipper: ['1', '2', '3', '4'],
};

const svg = d3.select('svg');

d3.selectAll('button').on('click', click);
