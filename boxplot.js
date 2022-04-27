var domain = ['3-28-22_210.csv',
'3-28-22_211.csv',
'3-28-22_212.csv',
'3-28-22_213.csv',
'3-28-22_214.csv',
'3-28-22_215.csv',
'3-28-22_216.csv',
'3-28-22_217.csv',
'newData_210.csv',
'newData_211.csv',
'newData_212.csv',
'newData_213.csv',
'newData_214.csv',
'newData_215.csv',
'newData_216.csv',
'newData_217.csv',
'newData_218.csv',
'newData_219.csv']

var t = [150, 550]
var d = [0, 4]

var attribute = 'T'

var margin = {top: 10, right: 30, bottom: 50, left: 100},
    width = window.innerWidth / 3 - margin.left - margin.right,
    height = window.innerHeight - margin.top * 5 - margin.bottom;

d3.select('#attribute').on('change', ()=>{
    attribute = d3.select('#attribute').node().value;
    boxplot(attribute)
})

boxplot(attribute)



function boxplot(attribute){
    d3.select('#boxplot').select('svg').remove();
    d3.select('#jitter').select('svg').remove();

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    
    var svg = d3.select("#boxplot")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // var jitter = d3.select("#jitter")
    // .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    // .append("g")
    //     .attr("transform",
    //         "translate(" + margin.left + "," + margin.top + ")");

    // Read the data and compute summary statistics for each specie
    d3.csv("data/ioData.csv").then(function(data) {
        console.log(data)

        var sumstat = d3.rollup(data, (v) => {
            // console.log(v)
            q1 = d3.quantile(v.map(function(g) { return g[attribute];}).sort(d3.ascending),.25)
            median = d3.quantile(v.map(function(g) { return g[attribute];}).sort(d3.ascending),.5)
            q3 = d3.quantile(v.map(function(g) { return g[attribute];}).sort(d3.ascending),.75)
            interQuantileRange = q3 - q1
            min = q1 - 1.5 * interQuantileRange
            max = q3 + 1.5 * interQuantileRange

            var minmax = v.map(function(g) { return g[attribute];}).sort(d3.ascending)
            min = +minmax[0]
            max = +minmax[minmax.length - 1]   
            // console.log(min,min1, max, max1)

            return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})

        }, d => d.name)

        console.log(sumstat)

    // Show the Y scale
    var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(domain)
        .padding(.4);
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()

        // jitter.append("g")
        // .call(d3.axisLeft(y).tickSize(0))
        // .select(".domain").remove()

    // Show the X scale
    var x = d3.scaleLinear()
        .domain(attribute == 'T' ? t : d)
        .range([0, width])

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5))
        // .select(".domain").remove()

      // jitter.append("g")
      //   .attr("transform", "translate(0," + height + ")")
      //   .call(d3.axisBottom(x).ticks(5))

    // Color scale
    var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([4,8])

  //   var jitterWidth = y.bandwidth()

  // jitter
  //   .selectAll("indPoints")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //     .attr("cx", function(d){ return(x(d[attribute]))})
  //     .attr("cy", function(d){ return( y(d.name) + (y.bandwidth()/2) - jitterWidth/2 + Math.random()*jitterWidth )})
  //     .attr("r", 0.5)
  //     .style("fill", function(d){ return(myColor(+d[attribute])) })
      // .attr("stroke", "black")



    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 3* margin.left + margin.right)
        .attr("y", height + margin.top + 30)
        .text(attribute);

    // Show the main vertical line
    svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){
            //   console.log(d[1])
            return(x(d[1].min))})
        .attr("x2", function(d){return(x(d[1].max))})
        .attr("y1", function(d){
            //   console.log(d)
            return(y(d[0]) + y.bandwidth()/2)})
        .attr("y2", function(d){return(y(d[0]) + y.bandwidth()/2)})
        .attr("stroke", "black")
        .style("width", 40)
        .on("mouseover", function(event,d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(`
            Min : ${d[1].min} <br/>
            Q1: ${d[1].q1} <br/>
            Median: ${d[1].median} <br/>
            Q3: ${d[1].q3} <br/>
            Max: ${d[1].max} <br/>
            `)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });


    // rectangle for the main box
    svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d[1].q1))}) // console.log(x(d.value.q1)) ;
            .attr("width", function(d){ ; return(x(d[1].q3)-x(d[1].q1))}) //console.log(x(d.value.q3)-x(d.value.q1))
            .attr("y", function(d) { return y(d[0]); })
            .attr("height", y.bandwidth() )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")
            .style("opacity", 0.3)
            .on("mouseover", function(event,d) {
                div.transition()
                  .duration(200)
                  .style("opacity", .9);
                div.html(`
                Min : ${d[1].min} <br/>
                Q1: ${d[1].q1} <br/>
                Median: ${d[1].median} <br/>
                Q3: ${d[1].q3} <br/>
                Max: ${d[1].max} <br/>
                `)
                  .style("left", (event.pageX) + "px")
                  .style("top", (event.pageY - 28) + "px");
                })
              .on("mouseout", function(d) {
                div.transition()
                  .duration(500)
                  .style("opacity", 0);
                });

    // Show the median
    svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("y1", function(d){return(y(d[0]))})
        .attr("y2", function(d){return(y(d[0]) + y.bandwidth())})
        .attr("x1", function(d){return(x(d[1].median))})
        .attr("x2", function(d){return(x(d[1].median))})
        .attr("stroke", "black")
        .style("width", 80)
        .on("mouseover", function(event,d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(`
            Min : ${d[1].min} <br/>
            Q1: ${d[1].q1} <br/>
            Median: ${d[1].median} <br/>
            Q3: ${d[1].q3} <br/>
            Max: ${d[1].max} <br/>
            `)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });



        // Show the min
    svg
    .selectAll("minLines")
    .data(sumstat)
    .enter()
    .append("line")
        .attr("y1", function(d){return(y(d[0]))})
        .attr("y2", function(d){return(y(d[0]) + y.bandwidth())})
        .attr("x1", function(d){return(x(d[1].min))})
        .attr("x2", function(d){return(x(d[1].min))})
        .attr("stroke", "black")
        .style("width", 80)
        .on("mouseover", function(event,d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(`
            Min : ${d[1].min} <br/>
            Q1: ${d[1].q1} <br/>
            Median: ${d[1].median} <br/>
            Q3: ${d[1].q3} <br/>
            Max: ${d[1].max} <br/>
            `)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });



        // Show the max
    svg
    .selectAll("maxLines")
    .data(sumstat)
    .enter()
    .append("line")
        .attr("y1", function(d){return(y(d[0]))})
        .attr("y2", function(d){return(y(d[0]) + y.bandwidth())})
        .attr("x1", function(d){return(x(d[1].max))})
        .attr("x2", function(d){return(x(d[1].max))})
        .attr("stroke", "black")
        .style("width", 80)
        .on("mouseover", function(event,d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(`
            Min : ${d[1].min} <br/>
            Q1: ${d[1].q1} <br/>
            Median: ${d[1].median} <br/>
            Q3: ${d[1].q3} <br/>
            Max: ${d[1].max} <br/>
            `)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });


    })

}




