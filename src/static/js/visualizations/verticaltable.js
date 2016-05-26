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

function verticalTable() {
    // Vars

    function chart(selection) {
        var $graphic = this[0][0];

        selection.each(function(dataset) {
            var colspan = null;

            var data = dataset['data']['records'];
            var config = dataset['config'];

            // outermost container
            var container = d3.select(this).append("div")
                .attr("class", "table_container")

            container = container.append("div");

            if ("title" in config && config.title !== "") {
                var title = container.append("h5")
                    .attr("class", "chart-title")
                    .text(config.title);
            }

            container = container.append("div");

            // Table
            var table = container.append("table")
                .attr("class", "ctdata-table ctdata-table-wide ctdata-verticaltable");

            // Calculate rowspan
            var outerRowspan = data[0].values.length;
            var outerValues = data.map(function(v) { return v.key});
            // Gather headers
            var headerVar = config.header;
            var headers = data[0].values[0].values.map(function(v) { return {label: v[headerVar], class: 'val'}});

            // Determine header row padding
            if (config.header_offset) {
                headers.unshift({label: 'Age Group', class:''} ,{label: "Label", class: ''})
            } else {
                headers.unshift("")
            }

            // thead element
            var thead = table.append("thead");
            var tr = thead.append("tr");

            tr.selectAll("th")
                .data(headers)
                .enter()
                .append("th")
                .attr("class", function(d) {
                    return "col-name " + d.class;
                })
                .text(function(d) {
                    return d.label;
                });


            // tbody element
            //var tbody = table.append("tbody");

            var groups = table.selectAll("tbody")
                .data(data).enter()
                .append("tbody");

            groups.each(function(groupData){
                var group = this;
                var outerLabel = groupData.key;
                var values = groupData.values;
                values.forEach(function(value, index) {
                    var tr = d3.select(group).append("tr");
                    if (index == 0) {
                        tr.append("td")
                            .attr("rowspan", outerRowspan)
                            .attr("class", "group-label")
                            .text(outerLabel);
                    }
                    tr.append("td")
                        .attr("class", "row-label")
                        .text(value.key);
                    value.values.forEach(function(v) {
                        tr.append("td")
                            .attr("class", "value")
                            .text(formatters.integer(v.Value))
                    });
                });
            });
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
