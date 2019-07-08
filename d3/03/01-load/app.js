d3.csv('data/harry_potter.csv').then(res => {
    console.log('Local csv:', res)
})

d3.json('data/harry_potter.json').then(res => {
    console.log('Local json:', res)
})

d3.json('https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=bedb0f0c91120ec4b98fa3ab4e8893c4')
.then(res => {console.log('API json:', res)})

const potter = d3.csv('data/harry_potter.csv');
const rings = d3.csv('data/lord_of_the_rings.csv');

Promise.all([potter,rings]).then(res=>{
    console.log('Multiple requests: ',res);
    console.log('Multiple requests concat: ', [...res[0], ...res[1]])
})