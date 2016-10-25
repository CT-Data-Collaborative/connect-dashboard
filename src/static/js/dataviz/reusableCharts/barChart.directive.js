(function() {
'use strict';

angular.module('app')
.directive('ctdBarChart', function(lodash, reusableCharts, libraries) {
    return {
        scope: {
            data: '=',
            name: '=',
            grouping: '='
        },
        templateUrl: './partials/directives/bar-chart.html',
        link: function(scope, elem) {
            const lo = lodash;
            let data;
            let divName = '#' + scope.name;
            scope.regions = reusableCharts.regions;
            scope.currentRegion = lo.find(scope.regions, {id:'State'});

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
                d3.select(divName).selectAll(".d4").remove();
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
                            return val;
                        }
                    })
                    .ticks(5);
                });

                var builtChart = libraries.d3.select(divName)
                .datum(parsedData.data)
                .call(chart);

                //Add legend if this is a grouped bar chart
                if (!!scope.grouping) {
                    var keys = [];
                    libraries.d3.keys(parsedData.data[0].values.forEach(obj => keys.push(obj[scope.grouping])));
                    scope.$broadcast('legend:add', {chart:builtChart, keys, divName});
                }
            }
            

        }
    }
});

})();