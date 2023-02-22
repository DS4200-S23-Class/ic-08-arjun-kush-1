const FRAME_HEIGHT = 480;
const FRAME_WIDTH = 480; 
const MARGINS = {left: 40, right: 40, top: 40, bottom: 40};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 


const FRAME1 = d3.select("#vis1") 
                  .append("svg") 
                  .attr("height", FRAME_HEIGHT)   
                  .attr("width", FRAME_WIDTH)
                  .attr("class", "frame"); 

function build_bar_chart() {
  /// Load data from CSV
  d3.csv("data/data.csv").then((data) => {
    const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });

  
      // Set the ranges and scales for the x-axis and y-axis
      const X_Scale = d3.scaleBand()
                .range([MARGINS.left, VIS_WIDTH])
                .padding(0.3);
      const Y_Scale = d3.scaleLinear()
                .range([VIS_HEIGHT, MARGINS.top]);

      // Map the data to the x and y domains
      X_Scale.domain(data.map(function(d) { return d.Category; }));
      Y_Scale.domain([0, d3.max(data, function(d) { return +d.Value; })+1]);

      // Add x-axis
    FRAME1.append("g") 
          .attr("transform", "translate(" + 0 + "," + (VIS_HEIGHT+MARGINS.top) + ")") 
          .call(d3.axisBottom(X_Scale)) 
          .attr("class", "axes-font"); 

    // Add y-axis
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")") 
          .call(d3.axisLeft(Y_Scale)) 
          .attr("class", "axes-font");

      // Add the bars to the chart
      FRAME1.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return X_Scale(d.Category); })
         .attr("y", function(d) { return Y_Scale(d.Value) + MARGINS.top; })
         .attr("width", X_Scale.bandwidth())
         .attr("height", function(d) { return VIS_HEIGHT - Y_Scale(d.Value); });


         // Tooltip

     // To add a tooltip, we will need a blank div that we 
    //  fill in with the appropriate text. Be use to note the
    //  styling we set here and in the .css
    const TOOLTIP = d3.select("#vis1")
                        .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0); 

    // Define event handler functions for tooltips
    function handleMouseover(event, d) {
      // on mouseover, make opaque 
      TOOLTIP.style("opacity", 1); 
      
    }

    function handleMousemove(event, d) {
      // position the tooltip and fill in information 
      TOOLTIP.html("Category: " + d.Category + "<br>Amount: " + d.Value)
              .style("left", (event.pageX + 10) + "px") //add offset from mouse
              .style("top", (event.pageY - 50) + "px"); 
    }

    function handleMouseleave(event, d) {
      // on mouseleave, make transparant again 
      TOOLTIP.style("opacity", 0); 
    } 

    // Add event listeners
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);
          // Add the mouseover event for the tooltip
  });
};

//
build_bar_chart()