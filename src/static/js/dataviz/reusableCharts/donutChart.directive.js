(function() {
'use strict';

angular.module('app')
.directive('ctdDonutChart', function(libraries) {
    return {
        template: '<div id="donut"></div',
        link: function(scope, elem) {
            libraries.d3.csv('./data/treatment_all.csv', function(results) {
                var formattedResults = results.filter(function(d) {
                    return d.Race === 'Total' && d.Label === 'Tx' && d.Region === 'State' && d.Group !== '0 - 21';
                }).map(function(obj) {
                    return {
                        value: obj.Value,
                        type: obj.Group
                    };
                });

                var pie = libraries.d3.layout.pie()
                .sort(null)
                .value(function(d) {
                    return d.value;
                });
                draw(pie(formattedResults));
            });

            var chart = libraries.d4.charts.donut()
            .outerWidth($('#donut').width())
            .margin({
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            })
            .radius(function() {
                return this.width / 8;
            })
            .arcWidth(50)
            .using('arcLabels', function(labels) {
                labels.text(function(d) {
                    return d.data.value;
                })
                labels.centroid(180);
            })
            .using('arcs', function(slices) {
                slices.key(function(d) {
                    return d.data.type;
                });
            });

            function draw(data) {
                var builtChart = libraries.d3.select('#donut')
                  .datum(data)
                  .call(chart);
                //Legend
                var keyList = [];
                libraries.d3.keys(data.forEach(function(obj) { keyList.push(obj.data.type); }));
                addLegend(builtChart, keyList);
            }

            /* Should probably be its own directive */
            function addLegend(chart, keys) {
                d3.select(chart[0][0]).selectAll(".legend").remove()
                var legend = chart.append('div')
                    .attr('class', 'legend grouped-bar-legend')
                   .append('ul')
                    .attr('class', 'list-inline');

                var keys = legend.selectAll('li.key')
                    .data(keys);

                var entries = keys.enter().append('li')
                    .attr('class', 'legend-entry');

                entries.append('div')
                    .attr('class', function(obj, index) {return 'key series' + index;});

                entries.append('span')
                    .attr('class', 'legend-text')
                    .text(function(d) {
                        return d;
                    });
            }
        }
    }
});

})();