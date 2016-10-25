(function() {
'use strict';

angular.module('app')
.directive('ctdLegend', function() {
    return {
        link: function(scope, elem) {
            scope.$on('legend:add', function(e, args) {
                d3.select(args.divName).selectAll(".legend").remove()
                var legend = args.chart.append('div')
                    .attr('class', 'legend grouped-bar-legend')
                   .append('ul')
                    .attr('class', 'list-inline');

                var keys = legend.selectAll('li.key')
                    .data(args.keys);

                var entries = keys.enter().append('li')
                    .attr('class', 'legend-entry');

                entries.append('div')
                    .attr('class', function(obj, index) {return 'key series' + index;});

                entries.append('span')
                    .attr('class', 'legend-text')
                    .text(function(d) {
                        return d;
                    });
            });
        }
    }
});

})();