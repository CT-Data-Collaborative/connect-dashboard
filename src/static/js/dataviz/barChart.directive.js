(function() {
'use strict';

angular.module('app')
.directive('barChart', function(libraries) {
    return {
        template: '<div id="example"></div>',
        link: function(scope, elem) {
            var data = [];

            function sortByAge(a, b) {
                var ageLookup = {
                    '0 - 5': 0,
                    '6 - 9': 1,
                    '10 - 15': 2,
                    '16 - 19': 3,
                    '20 - 21': 4
                };

                return ageLookup[a.key] - ageLookup[b.key];
            }

            function drawGroupedColumnGraphic() {
                //User should be able to change which filter to use
                var filteredData = data.filter(function(d) {
                    return d.Region === 'State';
                });
                var parsedData = libraries.d4.parsers.nestedGroup()
                    .x('Group')
                    .y('Value')
                    .value('Value')(filteredData);

                parsedData.data.sort(sortByAge);

                var chart = libraries.d4.charts.groupedColumn();

                chart
                .outerWidth(elem[0].clientWidth)
                .x(function(x) {
                    x.key('Group');
                    x.rangeRoundBands([0, chart.width()]);
                })
                .mixout('barLabels')
                /*.groups(function(groups) {
                    groups.key('Race');
                }) */             
                .y(function(y) {
                    y.key('Value');
                })
                .groupsOf(parsedData.data[0].values.length)
                .using('yAxis', function(axis) {
                    axis.tickFormat(function(val) {
                        if (val.toString().length > 4) {
                            return libraries.d3.format('.2s')(val);
                        } else {
                            return libraries.d3.format('.1s')(val);
                        }
                    });
                });

                var builtChart = libraries.d3.select('#example')
                .datum(parsedData.data)
                .call(chart);

                //Legend
                var keyList = [];
                libraries.d3.keys(parsedData.data[0].values.forEach(function(obj) { keyList.push(obj.Race); }));
                addLegend(builtChart, keyList);
            }
            libraries.d3.csv('./data/treatment_all.csv', function(result) {
                data = result;
                data.forEach(function(d) {
                    d.Value = +d.Value;
                });
                data = data.filter(function(d) {
                    return d.Label === 'Tx' && d.Group !== '0 - 21' && d.Race !== 'Total';
                });
                drawGroupedColumnGraphic();
                window.onresize = drawGroupedColumnGraphic;
            });

            function addLegend(chart, keys) {
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

                entries.append('div')
                    .attr('class', 'legend-text')
                    .text(function(d) {
                        return d;
                    });
            }
        }
    }
});

})();