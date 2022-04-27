
var iceD = [7000, 24472]
var totalD = [0, 110000]

var margin = {top: 10, right: 30, bottom: 50, left: 100},
    width = window.innerWidth / 2.5 - margin.left - margin.right,
    height = window.innerHeight - margin.top * 5 - margin.bottom;


var svg = d3.select("#stackbar")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

d3.csv("data/particleInfo.csv").then(function(data) {
    // console.log(data)
    // Add X axis
    var x = d3.scaleLinear()
        .domain(totalD)
        .range([ 0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 2.5 * margin.left)
        .attr("y", height + margin.top + 40)
        .text("Particles");
    
    // Y axis
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.name; }))
        .padding(.1);
    svg.append("g")
        .call(d3.axisLeft(y))
    
    //Bars
    svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d.name); })
        .attr("width", function(d) { return x(d.total); })
        .attr("height", y.bandwidth() )
        .attr("fill", "#1b9e77")
        .on("mouseover", function(event,d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(`
            Name: ${d.name} <br/>
            Total Particles: ${d.total} <br/>
            Ice Particles: ${d.ice}
            `)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });
    

        svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d.name); })
        .attr("width", function(d) { return x(d.ice); })
        .attr("height", y.bandwidth() )
        .attr("fill", "#a6cee3")
        .on("mouseover", function(event,d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(`
            Name: ${d.name} <br/>
            Total Particles: ${d.total} <br/>
            Ice Particles: ${d.ice}
            `)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });
    
        // .attr("x", function(d) { return x(d.Country); })
        // .attr("y", function(d) { return y(d.Value); })
        // .attr("width", x.bandwidth())
        // .attr("height", function(d) { return height - y(d.Value); })
        // .attr("fill", "#69b3a2")
    
    })           