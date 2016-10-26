(function() {
'use strict';

angular.module('app')
.directive('ctdBarChart', function(lodash, reusableCharts, libraries) {
    return {
        scope: {
            data: '=',
            name: '=',
            grouping: '=',
            config: '='
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

            d4.feature('xAxis', function(name) {
                var axis = d3.svg.axis()
                    .orient('bottom')
                    .tickPadding(10)
                    .tickSize(0);

                var textRect = function(text, klasses) {
                    var rect = d4.helpers.textSize(text, klasses);
                    rect.text = text;
                    return rect;
                };

                var positionText = function(obj, aligned, klass, scaleId) {
                    if (obj.text) {
                        var axis = this.container.selectAll('.' + scaleId + '.axis');
                        var axisBB = axis.node().getBBox();
                        var textHeight = obj.height * 0.8;
                        var text = axis.append('text')
                            .text(obj.text)
                            .attr('class', '' + klass);

                        if (aligned.toLowerCase() === 'bottom') {
                            text.attr('transform', 'translate(0,' + (axisBB.height + textHeight) + ')');
                        } else {
                            text.attr('transform', 'translate(0,' + (axisBB.y - (textHeight / 2)) + ')');
                        }
                    }
                };

                var alignAxis = function(align, axis) {
                    switch (true) {
                        case align.toLowerCase() === 'top':
                            axis.attr('transform', 'translate(0,0)');
                            break;
                        case align.toLowerCase() === 'bottom':
                            axis.attr('transform', 'translate(0,' + this.height + ')');
                            break;
                    }
                };

                var obj = {
                    accessors: {
                        align: 'bottom',

                        stagger: true,

                        wrap: false,

                        subtitle: undefined,

                        title: undefined,

                        scaleId: function() {
                            return 'x';
                        }
                    },
                    proxies: [{
                        target: axis
                    }],

                    render: function(scope, data, selection) {
                        var scaleId = d4.functor(scope.accessors.scaleId).bind(this)();
                        scope.scale(this[scaleId]);
                        var title = textRect(d4.functor(scope.accessors.title).bind(this)(), 'title');
                        var subtitle = textRect(d4.functor(scope.accessors.subtitle).bind(this)(), 'subtitle');
                        var aligned = d4.functor(scope.accessors.align).bind(this)();
                        var group = d4.appendOnce(selection, 'g.' + scaleId + '.axis.' + name)
                            .attr('data-scale', this[scaleId].$scale)
                            .call(axis);
                        alignAxis.bind(this)(aligned, group);
                        if (d4.functor(scope.accessors.wrap).bind(this)()) {

                            // FIXME: This should be moved into a helper injected using DI.
                            group.selectAll('.tick text').call(d4.helpers.wrapText, 125);
                        }
                        if (d4.functor(scope.accessors.stagger).bind(this)()) {

                            // FIXME: This should be moved into a helper injected using DI.
                            group.selectAll('.tick text').call(d4.helpers.staggerTextVertically, 1);
                        }
                        if (aligned === 'top') {
                            positionText.bind(this)(subtitle, aligned, 'subtitle', scaleId);
                            positionText.bind(this)(title, aligned, 'title', scaleId);
                        } else {
                            positionText.bind(this)(title, aligned, 'title', scaleId);
                            positionText.bind(this)(subtitle, aligned, 'subtitle', scaleId);
                        }
                        return group;
                    }
                };
                return obj;
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
                .using('xAxis', function(axis) {
                    axis.wrap(true);
                })
                .mixout('barLabels')
                .y(function(y) {
                    y.key('Value');
                })
                .groupsOf(parsedData.data[0].values.length)
                .using('yAxis', function(axis) {
                    axis.tickFormat(function(val) {
                        if (scope.config.percentage) {
                            return libraries.d3.format('.0%')(val);
                        } else if (+val === 0) {
                            return libraries.d3.format('.1s')(val);
                        } else {
                            return libraries.d3.format('.2s')(val);
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