(function() {
'use strict';

angular.module('app')
.directive('ctdDonutChart', function(libraries) {
    return {
        scope: {
            data: '='
        },
        template: '<div id="donut"></div',
        link: function(scope, elem) {
            let data;

            let unbindWatcher = scope.$watch('data', function(newValue) {
                data = scope.data;
                if(!!data) {
                    var pie = libraries.d3.layout.pie()
                    .sort(null)
                    .value(function(d) {
                        return d.value;
                    });
                    draw(pie(data));
                    unbindWatcher();
                }
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