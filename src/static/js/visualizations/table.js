// Number formatters
var si = d3.format("s");
var formatters = {
    "string" : function(val) {return val; },
    "currency" : d3.format("$,.0f"),
    "integer" : d3.format(",.0f"),
    "decimal" : d3.format(",.2f"),
    "percent" : d3.format(".1%"),
    "superscript" : function(val) {
        return val.toString()
            .split("")
            .map(function(character) { return SUPERSCRIPT[+character]})
            .join("");
    },
    "subscript" : function(val) {
        return val.toString()
            .split("")
            .map(function(character) { return SUBSCRIPT[+character]})
            .join("");
    }
};

function tableChart() {
    // Vars
    var colspan = null;
    
    function chart(selection) {
        selection.each(function(dataset) {
            var data = dataset['data']['records'];
            var config = dataset['config'];

            if ("nest" in config) {
                nestedData = d3.nest();

                config.nest.forEach(function(key, keyInd, keyArr) {
                    if ("order" in config && key in config.order) {
                        nestedData.key(function (d) { return formatters[d[key].type](d[key].value); })
                                .sortKeys(function(a, b) {
                                    return config.order[key].indexOf(a) - config.order[key].indexOf(b);
                                });
                    } else {
                        nestedData.key(function (d) { return formatters[d[key].type](d[key].value); });
                    }
                });

                nestedData.rollup(function(leaf) {
                    leaf = leaf.pop();
                    for (key in leaf) {
                        if (config.nest.indexOf(key) !== -1) {
                            delete leaf[key];
                        }
                    }
                    if ("order" in config && "leaf" in config.order) {
                        newLeaf = {};
                        config.order.leaf
                                .filter(function(key) { return key in leaf; })
                                .forEach(function(key, keyI, keyA) {
                                    newLeaf[key] = leaf[key];
                                });
                        leaf = newLeaf;
                    }
                    return leaf;
                });


                data = nestedData.map(data)
            }

            // useful debugging of nest functions
            // var container = d3.select(this).append("pre")
            //     .text(JSON.stringify(data, null, 4));
            // return chart;

            // outermost container
            var container = d3.select(this).append("div")
                    .attr("class", "table_container");

            container = container.append("div");

            if ("title" in config && config.title !== "") {
                var title = container.append("h4")
                    .attr("class", "chart-title")
                    .text(config.title);
            }

            container = container.append("div");
            
            // Table
            var table = container.append("table")
                .attr("class", "ctdata-table ctdata-table-wide");

            // table header
            var thead = table.append("thead");

            // tbody element
            var tbody = table.append("tbody");

            if (!("header" in config) || config.header == true) {
                // now populate thead with th cells appropriately
                populateHeader = function(data, thead, header_zero, level) {
                    if (data instanceof Object && data[d3.keys(data)[0]] instanceof Object) {
                        var theadTR = thead.selectAll("tr#level_"+level);
                        if (theadTR.empty()) {
                            theadTR = thead.append("tr")
                                                        .attr("id", "level_"+level);
                            theadTR.append("th")
                                .attr("class", "col-name");
                            if (header_zero !== false) {
                                theadTR.select("th")
                                    .text(header_zero);
                            }
                        }
                        for (var key in data) {
                            theadTR.append("th")
                                .attr("class", "col-name")
                                .text(key)
                                .attr("colspan", d3.keys(data[key]).length);
                                populateHeader(data[key], thead, header_zero, level + 1)
                        }
                    } else {
                        if (level <= 1 || "header_leaf" in config && config.header_leaf == true) {
                            // Remove colspan from lowest level (leaf-level) <th> elements
                            thead.selectAll("tr#level_"+(level-1)).selectAll("th")
                                    .attr("colspan", null);
                        } else {
                            // remove leaf level headers altogether
                            thead.selectAll("tr#level_"+(level-1)).remove();
                        }
                        return
                    }
                }

                var header_zero = false;
                if ("header_zero" in config && config.header_zero == true) {
                    header_zero = config.nest[0];
                }
                populateHeader(data[d3.keys(data)[0]], thead, header_zero, 0);
            }

            // populate body
            populateCells = function(data, thead, tr, level) {
                if (data instanceof Object && data[d3.keys(data)[0]] instanceof Object) {
                    for (var key in data) {
                        populateCells(data[key], thead, tr, level + 1);
                    }
                } else {
                    tr.append("td")
                        .class("value")
                        .text(formatters[data.type](data.value));
                }
            }

            for (rowKey in data) {
                var tr = tbody.append("tr");
                tr.append("td")
                    .class("name")
                    .text(rowKey);
                populateCells(data[rowKey], thead, tr, 0);
            }

            // Some cleanup.
            table.selectAll("th[colspan], td[colspan]")
                .attr("colspan", function() {
                    return (d3.select(this).attr("colspan") < 2 ? null : d3.select(this).attr("colspan"));
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
