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
var tickFormatters = {
    "string" : function(val) {return val; },
    "currency" : function(val) {
        if (val.toString().length > 4) {
            return d3.format("$.1s")(val).replace(/G/, "B");
        } else {
            return d3.format("$,.0f")(val);
        }
    },
    "integer" : function(val) {
        if (val.toString().length > 4) {
            return d3.format(".1s")(val).replace(/G/, "B");
        } else {
            return d3.format(",0f")(val);
        }
    },
    "decimal" : function(val) {
        if (val.toString().length > 4) {
            return d3.format(".1s")(val).replace(/G/, "B");
        } else {
            return d3.format(",1f")(val);
        }
    },
    "percent" : d3.format(".0%")
};


// get body from jsdom, call chart function
function barChart() {
    // bar widths
    var defaultBarWidth = true,
    barWidth = 40;

    function chart(selection) {
        var $graphic = this[0][0];
        var aspect_height = 10;
        var aspect_width = 16;
        var mobile_threshold = 500;

        var margin = {top: 10, right: 10, bottom: 60, left: 50};
        var width = $graphic.getBoundingClientRect().width - margin.left - margin.right;
        var height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom - 6;

        var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], 0.1);

        var y = d3.scale.linear()
          .range([height, 0]);

        var color = d3.scale.category20();

        // axes
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        function wrap(text, width) {
          text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
              }
            }
          });
        }

        selection.each(function(dataset) {
            var charLimit = Math.round(Math.floor((width + margin.right + margin.left) / 6) / 5) * 5;
            // Should this be a parameter? passed in config?

            var data = dataset['data']['records'];
            var config = dataset['config'];
            if (config.color) {
              var color = config.color;
            }
            if (config.metadata) {
              var metadata = config.metadata;
            }

            x.domain(data.map(function(d) { return Object.keys(d)[0]}));

            var maxVal = d3.max(data, function(d) {
                key = Object.keys(d)[0]
                return +d[key].value;
            });

            if (maxVal < 1.0) {
                y.domain([0,1]);
            } else {
                y.domain([0, maxVal]);
            }

            var getTickType = function(d) {
                key = d3.keys(d)[0];
                return d[key].type;
            }

            yAxis.tickFormat(tickFormatters[getTickType(data[0])]);

            // title
            if ("title" in config && config.title !== "") {
                var title = d3.select(this).append("h4")
                .attr("class", "chart-title")
                .text(config.title);
            }

            // end title

            // main render
            var svg = d3.select(this).append('svg')
                    .attr("xmlns", "http://www.w3.org/2000/svg")
                    .attr("height", height + margin.top + margin.bottom )
                    .attr("font-family", "RobotoCondensed")
                    .attr("width", width + margin.left + margin.right )
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
             .selectAll(".tick text")
              .call(wrap, x.rangeBand());


            svg.append("g")
              .attr("class", "y axis")
              .attr("transform", "translate(0,0)")
              .call(yAxis)
              .call(function(g) {
                  g.selectAll("g").selectAll("text")
                      .attr("x", 0);
                  g.selectAll("g").selectAll("line")
                      .attr("x1", 0)
                      .attr("x2", width)
              });

            svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) {
                // we need this deal to center the bars
                adj = d3.min([x.rangeBand(), barWidth]);
                pos = x(Object.keys(d)[0]);
                return pos + (x.rangeBand()/2) - adj/2;
                })
              .attr("width", function(d) {
                return d3.min([x.rangeBand(), barWidth]);
                })
              .attr("y", function(d) {
               return y(d[Object.keys(d)[0]].value); })
              .attr("height", function(d) { return height - y(d[Object.keys(d)[0]].value); })
              .attr("fill", function() {
                if (color) {
                  return color;
                } else {
                  return "#1EACF1";
                }
              })
              .attr("tooltip-append-to-body", true)
              .attr("tooltip", function(d) {
                  return d.value;
              });


            if ("source" in config && config.source !== "") {
                var source = d3.select(this).append("p")
                    .attr("class", "chart-source")
                    .text(config.source);
            }
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

    chart.barWidth = function(_) {
        if (!arguments.length) return barWidth;
        barWidth = _;
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

