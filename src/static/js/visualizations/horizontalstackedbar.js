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


// get body from jsdom, call chart function
function horizontalstackedbarChart() {
    // bar widths
    var defaultBarWidth = true;
    var barWidth = 20;
    var tip = d3.tip()
        .attr("class", "ctdata-tooltip")
        .offset([-4, 0])
        .html(function(d) {
            return [d.name, d.label].join(": ");
        })

    function chart(selection) {
        console.log("horizontalstackedbar")
        var $graphic = this[0][0];
        var color = d3.scale.category20();

        function wrap(text, width) {
            text.each(function() {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    x = text.attr("x");
                dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy/2 + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width && words.length > 0) {
                        line.pop();
                        tspan.text(line.join(" "));
                        tspan.attr("dy", 0);
                        line = [word];
                        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + "em").text(word);
                    }
                }
            });
        }

        //function wrap(text, width) {
        //    text.each(function() {
        //        var text = d3.select(this),
        //            words = text.text().split(/\s+/).reverse(),
        //            word,
        //            line = [],
        //            lineNumber = 0,
        //            lineHeight = 1.1, // ems
        //            y = text.attr("y"),
        //            dy = parseFloat(text.attr("dy")),
        //            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        //        while (word = words.pop()) {
        //            line.push(word);
        //            tspan.text(line.join(" "));
        //            if (tspan.node().getComputedTextLength() > width) {
        //                line.pop();
        //                tspan.text(line.join(" "));
        //                line = [word];
        //                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        //            }
        //        }
        //    });
        //}

        selection.each(function(dataset) {
            var mobile_threshold = 500;
            if (dataset.config.width > 8) {
                var aspect_height = 12;
                var aspect_width = 16;
            } else {
                var aspect_height = 10;
                var aspect_width = 12;
            }
            var margin = {top: 10, right: 10, bottom: 60, left: 50};
            var width = $graphic.getBoundingClientRect().width - margin.left - margin.right;
            var height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom - 6;
            // scales
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1),
                y = d3.scale.linear()
                    .range([height, 0]),


            // axes
                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom"),

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(8);

            var charLimit = Math.round(Math.floor((width + margin.right + margin.left) / 6) / 5) * 5;
            // Should this be a parameter? passed in config?

            var data = dataset['data']['records'];
            var config = dataset['config'];
            var grouping = config.grouping;

            // check if we have a grouping value, if not, we're just producing a standard bar chart
            if (grouping) {
                var groupLabels = d3.keys(data[0]).filter(function(key) { return key !== grouping && key !== "_id"; }).sort();

                // This is the step that seems to be the most confused and broken - what shape am i aiming for?
                data.forEach(function(d) {
                    d.values = groupLabels.map(function(label) {
                        yAxis.tickFormat(formatters[d[label].type]); // there should really only be one of these?
                        return {name: label, label: formatters[d[label].type](d[label].value), value: +d[label].value};
                    });
                });

            } else {
                // This is the step that seems to be the most confused and broken - what shape am i aiming for?
                data.map(function(d) {
                    key = Object.keys(d);
                    d.values =  {name: key, label: formatters[d[key].type](d[key].value), value: +d[key].value}
                });
            }

            if ("colors" in config && config.colors.length >= data[0].values.length) {
                color.range(config.colors)
            }

            // container, margined interior container

            if ("title" in config && config.title !== "") {
                var title = d3.select(this).append("h5")
                    .attr("class", "chart-title")
                    .text(config.title);
            }

            // legends
            var legend = d3.select(this).append("div")
                .attr("class", "legend stacked-bar-legend")
                .append("ul")
                .attr("class", "list-inline");

            var keys = legend.selectAll('li.key')
                .data(groupLabels);

            var entries = keys.enter().append('li')
                .attr('class', 'legend-entry')
                .style('max-width', function() {
                    return 100 / groupLabels.length + "%"
                });

            entries.append('div')
                .attr('class', 'key')
                .style('background-color', function(d) { return color(d);});

            entries.append('div')
                .attr('class', 'legend-text')
                .text(function(d) {
                    return d;
                });

            var svg = d3.select(this).append('svg')
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("height", height + margin.top + margin.bottom )
                .attr("font-family", "RobotoCondensed")
                .attr("width", width + margin.left + margin.right );


            var barGroup = svg.append("g")
                .attr("height", height)
                .attr("width", width)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //  set domain for group scale
            x.domain(data.map(function(d) { return d[grouping].value; }))
                .rangeRoundBands([0, width], 0.1);

            // set y-scale domain, scaling so there is always a y-axis line above the highest value
            maxY = data.map(function(d) {
                var sum = 0;
                d.values.map(function(v) { sum += +v.value; })
                return sum;
            })

            y.domain([0, 1.1*d3.max(maxY)])

            // x axis, includes group labels automatically
            var xAxisGroup = barGroup.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll(".tick text")
                .call(wrap, x.rangeBand());

            // Y axis
            var yAxisGroup = barGroup.append("g")
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

            // group containers
            var groups = barGroup.selectAll(".group")
                .data(data)
                .enter()
                .append("g")
                .attr("transform", function(d) { return "translate(" + x(d[grouping].value) + ", 0)"})
                .datum(function(d) { return d.values; })
                .each(function(barData, barIndex) {
                    group = d3.select(this);

                    offset = 0
                    barData.map(function(d) {
                        d.height = y(0) - y(d.value);
                        d.y = y(offset) - d.height;

                        offset += d.value;
                        return d;
                    })

                    group.selectAll("rect")
                        .data(barData)
                        .enter()
                        .append("rect")
                        .attr("x", 0)
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) { return d.y; })
                        .attr("height", function(d) { return d.height; })
                        .attr("fill", function(d) { return color(d.name); })
                        .attr("stroke", "white")
                        .call(tip)
                        .on("mouseover", tip.show)
                        .on("mouseout", tip.hide)
                })

            // if ("source" in config && config.source !== "") {
            //     var source = d3.select(this).append("p")
            //         .attr("class", "chart-source")
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
