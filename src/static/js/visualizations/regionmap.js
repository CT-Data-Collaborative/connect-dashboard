function regionmapChart() {

    function chart(selection) {
        var $graphic = this[0][0];
        this.selectAll("*").remove();
        var aspect_height = 12;
        var aspect_width = 16;
        var mobile_threshold = 500;

        var margin = {top: 0, right: 50, bottom: 30, left: 50};
        var width = 175,
            height = 125;
        // var width = $graphic.getBoundingClientRect().width - margin.left - margin.right;
        // var height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom - 6;

        selection.each(function(data) {
            data = data.data;

            // SVG Container
            var svg = d3.select(this).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("font-family", "RobotoCondensed")
                .attr("font-weight", 300)
                .attr("xmlns", "http://www.w3.org/2000/svg");

            var map = svg.append("g")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("transform", "translate("+margin.left+", "+margin.top+")");

            var center = [-72.713, 41.671];

            // create a first guess for the projection - a unit project of 1px centered at 0,0
            var projection = d3.geo.equirectangular()
                .scale(6500)
                .center(center)
                .translate([margin.left+15, height / 2]);

            var path = d3.geo.path().projection(projection);

            // map features
            map.selectAll("path")
                .data(TOWNGEOJSON.features)
                .enter()
                .append("path")
                    // .datum(feature.geometry)
                    .attr("d", path)
                    // .attr("stroke-width", "0.5px")
                    // .attr("stroke", "black")
                    .attr("class", function(d, i) {
                        var classes = ["town"];
                        if (data == 'State' || +d.properties.REGION == data) {
                            classes.push("region")
                        }

                        return classes.join(" ");
                    })
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

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
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

    chart.update = function(_) {
        if (!arguments.length) return data;
        data = _;
        console.log("data received");
        return chart;

    };

    return chart;
}
