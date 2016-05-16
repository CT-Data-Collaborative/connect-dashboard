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

function simpletableChart() {
    // Vars
    var colspan = null;
    
    function chart(selection) {
        var $graphic = this[0][0];

        selection.each(function(dataset) {
            var data = dataset['data']['records'];
            var config = dataset['config'];

            // outermost container
            var container = d3.select(this).append("div")
                    .attr("class", "table_container")

            container = container.append("div");

            if ("title" in config && config.title !== "") {
                var title = container.append("h4")
                    .attr("class", "chart-title")
                    .text(config.title);
            }

            container = container.append("div");
            
            // Table
            var table = container.append("table");

            // thead element
            var thead = table.append("thead"),
                headerData = data.shift();

            // determine colspan of header
            // Calculate colspan
            // if header cells < data cells, per row.
            var noblankColumns = headerData.filter(function(col) { return col.id !== "" & col.id !== "_id"})

            if (noblankColumns.length < data[0].length-1 && noblankColumns.length > 0) {
                colspan = Math.floor((data[0].length)/(noblankColumns.length))
                colspan = (colspan > 1 ? colspan : null)
            }
            
            // populate header - simpletable assumes row 1 is header cells
            tr = thead.append("tr");

            if (config.header_offset) {
                headerData.unshift({
                    "type" : "string",
                    "value" : (config.header_offset === true ? "" : config.header_offset)
                });
            }

            tr.selectAll("th")
                    .data(headerData)
                    .enter()
                    .append("th")
                        .text(function(d) {
                            return formatters[d.type](d.value);
                        })
                        .attr("colspan", function(d, i) {
                            if (config.header_offset && i === 0) {
                                return 1;
                            } else {
                                return colspan
                            }
                        });

            // tbody element
            var tbody = table.append("tbody");

            // populate body
            var rows = tbody.selectAll("tr")
                .data(data)
                .enter()
                .append("tr")
                    .datum(function(d) {return d;});

            rows.each(function(rowData) {
                d3.select(this).selectAll("td")
                    .data(rowData)
                    .enter()
                    .append("td")
                        .text(function(d) { return formatters[d.type](d.value); })
            })

        });
    }

    /**
     * Getter-Setter functions for chart function object
     */
    // chart.width = function(_) {
    //     if (!arguments.length) return width;
    //     width = _;
    //     return chart;
    // };

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