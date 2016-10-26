(function() {
'use strict';

angular.module('app')
.directive('ctdDonutChart', function(libraries) {
    return {
        scope: {
            data: '=',
            name: '=',
            config: '='
        },
        template: '<div class="donut" id="{{name}}"><ctd-legend></ctd-legend></div',
        link: function(scope, elem) {
            let data;
            let divName = '#' + scope.name;
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
            .outerWidth($(divName).context.documentElement.clientWidth)
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
                var builtChart = libraries.d3.select(divName)
                  .datum(data)
                  .call(chart);
                //Legend
                var keyList = [];
                libraries.d3.keys(data.forEach(function(obj) { keyList.push(obj.data.type); }));
                scope.$broadcast('legend:add', {chart:builtChart, keys:keyList, divName});

            }
        }
    }
});

})();