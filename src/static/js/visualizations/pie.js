// Number formatters
var si = d3.format("s");
var formatters = {
    "string" : function(val) {return val; },
    "currency" : function(val) {
        if (val.toString().length > 4) {
            return d3.format("$.2s")(val).replace(/G/, "B");
        } else {
            return d3.format("$,.0f")(val);
        }
    },
    "integer" : function(val) {
        if (val.toString().length > 4) {
            return d3.format(".3s")(val).replace(/G/, "B");
        } else {
            return d3.format(",0f")(val);
        }
    },
    "decimal" : function(val) {
        if (val.toString().length > 4) {
            return d3.format(".2s")(val).replace(/G/, "B");
        } else {
            return d3.format(",2f")(val);
        }
    },
    "percent" : d3.format(".1%")
};

function pieChart() {

    function chart(selection) {
        var $graphic = this[0][0];
        var aspect_height = 10;
        var aspect_width = 16;
        var mobile_threshold = 500;

        //var margin = {top : 65, left : 20, bottom : 70, right : 20};
        var margin = {top : 20, left : 20, bottom : 20, right : 20};
        var width = $graphic.getBoundingClientRect().width - margin.left - margin.right;
        var height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom - 6;
        
        var radius = Math.min(height, width) / 2;
        var innerRadius = 0;
        var outerRadius = radius * 0.9;
        var pie = d3.layout.pie()
                    .sort(null)
                    .startAngle(0)
                    .endAngle(2*Math.PI);
        var arc = d3.svg.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);
        var colors = d3.scale.category20();
        var order = false;

        selection.each(function(dataset) {

            var charLimit = Math.round(Math.floor((width + margin.right + margin.left) / 6) / 5) * 5;

            var data = dataset['data']['records'][0];
            var config = dataset['config'];
            
            data = d3.keys(data).map(function(d) {
                return {"label" : d, "type" : data[d].type, "value": data[d].value};
            }).filter(function(o) {
                return o.value > 0
            });

            var total = 0;
            data.forEach(function(d) {
                total += +d.value;
            });

            // build accessors
            var label = function(d) { return d.label; }
                dataLabel = function(d) {
                    return formatters["string"](d.value);
                },
                value = function(d) {
                    return parseFloat(d.value, 10);
                };

            // update pie function object with accessor
            pie.value(value)

            // if we have a sort order
            if ("order" in config && config.order !== false) {
                // update pie function
                pie.sort(function(a, b) {
                    return config.order.indexOf(a.label) > config.order.indexOf(b.label) ? 1 : -1;
                })

                // also sort data
                data = data.sort(function(a, b) {
                    return config.order.indexOf(a.label) > config.order.indexOf(b.label) ? 1 : -1;
                });
            }

            if ("title" in config && config.title !== "") {
                var title = d3.select(this).append("h5")
                    .classed("chart-title", true)
                    .text(function () {
                        if (config.calculate_total) {
                            return config.title + " (n = " + formatters.integer(total) + ")";
                        } else {
                            return config.title
                        }

                    })
            }

            // // Legend
            var legend = d3.select(this)
                .append("div")
                .classed("legend pie-legend", true)
                //.append("ul")
                //.classed("list-inline", true)
                .selectAll("div")
                .data(data)
                .enter()
                .append("div")
                .classed("legend-entry", true)
                .each(function(entryData, entryIndex) {
                    entry = d3.select(this)

                    entry.append("div")
                        .classed("key", true)
                        .style("background-color", colors(entryIndex))

                    entry.append("div")
                        .classed("legend-text", true)
                        .text(entryData.label)
                })

            // SVG Container
            var svg = d3.select(this).append("svg")
                .attr("width", (width + margin.left + margin.right))
                .attr("height", (height + margin.top + margin.bottom))
                .attr("font-family", "RobotoCondensed")
                .attr("font-weight", 300)
                .attr("xmlns", "http://www.w3.org/2000/svg");

            // Debug Container for testing layour
            //svg.append("rect")
            //    .attr("height", svg.attr("height"))
            //    .attr("width", svg.attr("width"))
            //    .attr("fill", "red")
            //    .attr("stroke", "red")
            //    .attr("stroke-width", "1px")
            //    .attr("fill-opacity", 0);
            //

            var pieGroup = svg.append("g")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("transform", "translate(" + ((width / 2) + margin.left) + "," + ((height / 2) + margin.top) + ")");

            var labelGroup = svg.append("g")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("transform", "translate(" + ((width / 2) + margin.left) + "," + ((height / 2) + margin.top) + ")");

            // Pie slices
            var slices = pieGroup.selectAll("path")
                .data(pie(data))
                .enter()
                .append("path")
                    .attr("fill", function(d, i) { return colors(i); })
                    .attr("stroke", "#FAFAFA")
                    .attr("stroke-width", 0.5)
                    .attr("d", arc);


            // Labels
            // var labelDots = labelGroup.selectAll("circle")
            //         .data(pie(data))
            //         .enter()
            //         .append("circle")
            //             .attr("x", 0)
            //             .attr("y", 0)
            //             .attr("r", 2)
            //             .attr("fill", "black")
            //             .attr("transform", function(d, i) {
            //                 var midAngle = Math.atan2(arc.centroid(d)[1], arc.centroid(d)[0])
            //                 var translateX = Math.cos(midAngle) * outerRadius * 0.9;
            //                 var translateY = Math.sin(midAngle) * outerRadius * 0.9;
            //                 return "translate("+translateX+", "+translateY+")";
            //             });

            var labelLines = labelGroup.selectAll("line")
                    .data(pie(data))
                    .enter()
                    .append("line")
                        .attr("stroke", "black")
                        .attr("stroke-width", "0.5px")
                        .attr("x1", function(d, i) {
                            midAngle = Math.atan2(arc.centroid(d)[1], arc.centroid(d)[0])
                            return Math.cos(midAngle) * outerRadius * 0.9;
                        })
                        .attr("x2", function(d, i) {
                            midAngle = Math.atan2(arc.centroid(d)[1], arc.centroid(d)[0])
                            return Math.cos(midAngle) * outerRadius * 1.25;
                        })
                        .attr("y1", function(d, i) {
                            midAngle = Math.atan2(arc.centroid(d)[1], arc.centroid(d)[0])
                            return Math.sin(midAngle) * outerRadius * 0.9;
                        })
                        .attr("y2", function(d, i) {
                            midAngle = Math.atan2(arc.centroid(d)[1], arc.centroid(d)[0])
                            return Math.sin(midAngle) * outerRadius * 1.15;
                        });

            var textElementsByAnchor = {"start" : [], "end" : []};
            var labelText = labelGroup.selectAll("text")
                    .data(pie(data))
                    .enter()
                    .append("text")
                        .text(function(d) {return formatters.integer(dataLabel(d.data)); })
                        .attr("fill", "#202020")
                        // .attr("font-size", "1em")
                        .attr("x", function(d, i) {
                            midAngle = Math.atan2(arc.centroid(d)[1], arc.centroid(d)[0])
                            x = Math.cos(midAngle) * outerRadius * 1.25;
                            sign = (x > 0) ? 1 : -1
                            return x;
                        })
                        .attr("y", function(d, i) {
                            midAngle = Math.atan2(arc.centroid(d)[1], arc.centroid(d)[0])
                            y = Math.sin(midAngle) * outerRadius * 1.15;
                            return y;
                        })
                        .attr("text-anchor", function(d, i) {
                            midAngle = Math.atan2(arc.centroid(d)[1], arc.centroid(d)[0])
                            anchor = (Math.cos(midAngle) > 0) ? "start" : "end";
                            textElementsByAnchor[anchor].push(this);
                            return anchor;
                        })
                        .attr("class", function(d, i) {
                            midAngle = Math.atan2(arc.centroid(d)[1], arc.centroid(d)[0])
                            anchor = (Math.cos(midAngle) > 0) ? "start" : "end";
                            textElementsByAnchor[anchor].push(this);
                            return "anchor-"+anchor;
                        })


            do {
                again = false;
                labelText.each(function (d, i) {
                    a = this;
                    da = d3.select(a);
                    y1 = da.attr("y");
                    labelText.each(function (d, j) {
                        b = this;
                        // a & b are the same element and don't collide.
                        if (a == b) return;
                        db = d3.select(b);
                        // a & b are on opposite sides of the chart and
                        // don't collide
                        if (da.attr("text-anchor") != db.attr("text-anchor")) return;
                        // Now let's calculate the distance between
                        // these elements. 
                        y2 = db.attr("y");
                        deltaY = y1 - y2;
                        
                        // Our spacing is greater than our specified spacing,
                        // so they don't collide.
                        if (Math.abs(deltaY) > 8) return;
                        
                        // If the labels collide, we'll push each 
                        // of the two labels up and down a little bit.
                        again = true;
                        sign = deltaY > 0 ? 1 : -1;
                        adjust = sign * 1;
                        da.attr("y",+y1 + (adjust * 2));
                        db.attr("y",+y2 - (adjust / 2));
                    });
                });
                // Adjust our line leaders here
                // so that they follow the labels. 
                if(again) {
                    labelElements = labelText[0];
                    labelLines.attr("y2",function(d,i) {
                        labelForLine = d3.select(labelElements[i]);
                        return labelForLine.attr("y");
                    });
                }
            } while (again == true)

            // if ("source" in config && config.source !== "") {
            //     // source
            //     var source = svg.append("text")
            //         .attr("x", width + margin.left + margin.right)
            //         .attr("y", height+margin.top+margin.bottom)
            //         .attr("dy", "-1pt")
            //         .attr("text-anchor", "end")
                    // .attr("font-size", "1em")
            //         .attr("font-style", "italic")
            //         .attr("fill", "#888")
            //         .attr("fill", "#C0C0C0")
            //         .text(config.source);
            // }
        });
    }

    /**
     * Getter-Setter functions for chart function object
     */
    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _ - margin.left - margin.right;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _ - margin.top - margin.bottom;
        return chart;
    };

    chart.radius = function(_) {
      if (!arguments.length) return radius;
      radius = _;

      // Also update calculated outer radius of arc
      outerRadius = _ * 0.9;
      arc.outerRadius(outerRadius);
      
      return chart;  
    };

    chart.innerRadius = function(_) {
      if (!arguments.length) return innerRadius;
      innerRadius = _;
      arc.innerRadius(innerRadius);
      return chart;  
    };

    chart.outerRadius = function(_) {
      if (!arguments.length) return outerRadius;
      outerRadius = _;
      arc.outerRadius(outerRadius);
      return chart;  
    };

    chart.startAngle = function(_) {
      if (!arguments.length) return startAngle;
      startAngle = _;
      pie.startAngle(startAngle);
      return chart;  
    };

    chart.endAngle = function(_) {
      if (!arguments.length) return endAngle;
      endAngle = _;
      pie.endAngle(endAngle);
      return chart;  
    };

    chart.order = function(_) {
      if (!arguments.length) return order;
      order = _;
      return chart;  
    };

    chart.colors = function(_) {
      if (!arguments.length) return colors;
      colors = d3.scale.ordinal()
                        .range(_);
      return chart;  
    };

    // These will probably never be used, but keeping for posterity
    chart.label = function(_) {
        if (!arguments.length) return label;
        label = _;
        return chart;
    };

    chart.value = function(_) {
        if (!arguments.length) return value;
        value = _;
        return chart;
    };

    return chart;
}
