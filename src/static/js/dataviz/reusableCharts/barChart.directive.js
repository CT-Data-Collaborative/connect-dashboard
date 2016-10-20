(function() {
'use strict';

angular.module('app')
.directive('barChart', function(reusableCharts, libraries) {
    return {
        scope: {
            data: '='
        },
        templateUrl: './partials/directives/bar-chart.html',
        link: function(scope, elem) {
            let data;
            scope.currentRegion = {'name' : 'Statewide', 'id' : 'State'};
            scope.regions = reusableCharts.regions;

            scope.update = function(newRegion) {
                scope.currentRegion = newRegion;
                drawGroupedColumnGraphic();
            }

            let unbindWatcher = scope.$watch('data', function(newValue) {
                data = scope.data;
                if(!!data) {
                    drawGroupedColumnGraphic();
                    unbindWatcher();
                }
            });

            function drawGroupedColumnGraphic(x) {
                d3.select("#example").selectAll(".d4").remove();
                //User should be able to change which filter to use
                var filteredData = data.filter(function(d) {
                    return d.Region === scope.currentRegion.id;
                });
                var parsedData = libraries.d4.parsers.nestedGroup()
                    .x('Group')
                    .y('Value')
                    .value('Value')(filteredData);
                parsedData.data.sort(reusableCharts.sortByAge);

                var chart = libraries.d4.charts.groupedColumn();

                chart
                .outerWidth(elem[0].clientWidth)
                .x(function(x) {
                    x.key('Group');
                    x.rangeRoundBands([0, chart.width()]);
                })
                .mixout('barLabels')
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
            

            /* Should probably be its own directive */
            function addLegend(chart, keys) {
                d3.select('#example').selectAll(".legend").remove()
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