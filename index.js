var NORTH_FILENAME = './N_seaice_extent_daily_v2.1.csv',
    SOUTH_FILENAME = './S_seaice_extent_daily_v2.1.csv';

var w = 800,
    h = 800;

var transition_duration = [500, 2000]

var ice_data = {};
var maxes = {};
var scales = {};

var svg = d3.select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h)
  .style('float', 'left')
  .style('border', '1px solid #d2d2d2');

var ul = d3.select('body')
  .append('ul')
  .style('float', 'right')

var line = d3.radialLine();

// takes a single row from the CSVs 
function cleanRow(d) {
    return {
                Year: +d.Year,
                Month: +d[' Month'],
                Day: +d[' Day'],
                Extent: +d['     Extent'],
                date: new Date(+d.Year, +d[' Month'] - 1, +d[' Day']),
                similar_date: new Date(2000, +d[' Month'] - 1, +d[' Day'])
            }
}

var date_scale = d3.scaleTime() 
    .domain([new Date(2000, 1, 1), new Date(2000, 12, 31)])
    .range([0, Math.PI * 2])

line
  .angle(function(d) {
      return date_scale(d.similar_date);
  })
  //.interpolate('linear');

function loadData() {
    d3.csv(NORTH_FILENAME)
      .row(cleanRow)
      .get(function(data) {
        ice_data.north = data.slice(1);
        maxes.north = d3.max(ice_data.north, function(d) {
            return d.Extent;
        });
        scales.north = d3.scaleLinear()
          .domain([0, maxes.north])
          .range([0, w/2]);
        ready();
    });
    d3.csv(SOUTH_FILENAME)
      .row(cleanRow)
      .get(function(data) {
        ice_data.south = data.slice(1);
        maxes.south = d3.max(ice_data.south, function(d) {
            return d.Extent;
        });
        scales.south = d3.scaleLinear()
          .domain([0, maxes.south])
          .range([0, w/2]);
        ready();
    });
};

function make_summary() {
    ice_data.summary = [];
    for (var i = 0; i < ice_data.north.length; i++) {
        var n = ice_data.north[i];
        var s = ice_data.south[i];
        var combined = Object.assign({}, n)
        combined.Extent += s.Extent;
        ice_data.summary.push(combined);
    }
    maxes.summary = d3.max(ice_data.summary, function(d) {
        return d.Extent;
    })
    scales.summary = d3.scaleLinear()
      .domain([0, maxes.summary])
      .range([0, w/2])
}

function ready() {
    if (ice_data.north !== undefined && ice_data.south !== undefined) {
        make_summary();
        buildChart();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function buildChart() {
    line
      .radius(function(d) {
          return scales.summary(d.Extent);
      });
    var years = d3.extent(ice_data.summary, function(d) {
        return d.Year;
    });
    scales.color = d3.scaleSequential(d3.interpolateViridis)
      .domain(years)
    scales.transition_duration = d3.scaleLinear()
      .domain(years)
      .range(transition_duration)
    var g = svg.append('g')
      .attr('transform', 'translate(' + h/2 + ',' + w/2 + ')')

    console.log('about to draw')

    for (var y = years[0]; y <= years[1]; y++) {
        var year = ice_data.summary.filter(function(d) {
            return d.Year === y;
        });
        var color = scales.color(y);
        var li = ul.append('li')
          .text(y)
          .style('color', color);
        var path = g.append('path')
          .attr('stroke', color)
          .attr('id', y)
          .attr('d', line(year));
        
        var totalLength = path.node().getTotalLength();
        path
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
        path
          .transition()
            .duration(scales.transition_duration(y))
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);
        await sleep(scales.transition_duration(y));

    };


    // var path = g.append('path')
    // path
    //   .attr('stroke', 'black')

    // for (var i = 1; i < ice_data.summary.length; i++) {
    // //for (var i = 1; i < 100; i++) {
    //     pathData = line(ice_data.summary.slice(0, i))
    //     //stop1.attr('stop-color', scales.color(i))
    //     path.attr('d', pathData);
    //     await sleep(10);
    // }
    console.log('drawn')

}

loadData()