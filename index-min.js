function cleanRow(a){return{Year:+a.Year,Month:+a[" Month"],Day:+a[" Day"],Extent:+a["     Extent"],date:new Date(+a.Year,+a[" Month"],+a[" Day"]),similar_date:new Date(2e3,+a[" Month"],+a[" Day"])}}function loadData(){d3.csv(NORTH_FILENAME).row(cleanRow).get(function(a){ice_data.north=a.slice(1),maxes.north=d3.max(ice_data.north,function(a){return a.Extent}),scales.north=d3.scaleLinear().domain([0,maxes.north]).range([0,w/2]),ready()}),d3.csv(SOUTH_FILENAME).row(cleanRow).get(function(a){ice_data.south=a.slice(1),maxes.south=d3.max(ice_data.south,function(a){return a.Extent}),scales.south=d3.scaleLinear().domain([0,maxes.south]).range([0,w/2]),ready()})}function make_summary(){ice_data.summary=[];for(var a=0;a<ice_data.north.length;a++){var e=ice_data.north[a],t=ice_data.south[a],n=Object.assign({},e);n.Extent+=t.Extent,ice_data.summary.push(n)}maxes.summary=d3.max(ice_data.summary,function(a){return a.Extent}),scales.summary=d3.scaleLinear().domain([0,maxes.summary]).range([0,w/2])}function ready(){void 0!==ice_data.north&&void 0!==ice_data.south&&(make_summary(),buildChart())}function buildChart(){line.radius(function(a){return scales.summary(a.Extent)});var a=svg.append("g").attr("transform","translate("+h/2+","+w/2+")"),e=a.append("path");console.log("about to draw");for(var t=1;t<100;t++)pathData=line(ice_data.summary.slice(0,t)),e.attr("d",pathData);console.log("drawn")}var NORTH_FILENAME="./N_seaice_extent_daily_v2.1.csv",SOUTH_FILENAME="./S_seaice_extent_daily_v2.1.csv",w=800,h=800,ice_data={},maxes={},scales={},svg=d3.select("body").append("svg").attr("width",w).attr("height",h).style("border","1px solid #d2d2d2"),line=d3.radialLine(),date_scale=d3.scaleTime().domain([new Date(2e3,1,1),new Date(2e3,12,31)]).range([0,2*Math.PI]);line.angle(function(a){return date_scale(a.similar_date)}),loadData();