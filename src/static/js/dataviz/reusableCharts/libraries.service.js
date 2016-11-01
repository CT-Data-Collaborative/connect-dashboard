angular.module('app')
.service('libraries', function() {
    var internalLibs = {
        d4: d4,
        d3: d3
    };

    internalLibs.d4.feature('arcLabels', function(name) {
        var arc = d3.svg.arc();
        return {
            accessors: {
                classes: function(d, n) {
                    return 'arc stroke fill series' + n;
                },

                duration: 750,

                key: d4.functor(d4.defaultKey),

                rotate: true,

                text: function(d) {
                    return d.value;
                },

                x: function() {
                    return this.width / 2;
                },

                y: function() {
                    return this.height / 2;
                }
            },
            proxies: [{
                target: arc
            }],
            render: function(scope, data, selection) {
                var rotateBool = d4.functor(scope.accessors.rotate).bind(this)();
                var labelAngle = function(d) {
                    if (rotateBool) {
                        return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
                    } else {
                        return 0;
                    }

                };

                // extracted from: http://bl.ocks.org/mbostock/1346410
                // Store the displayed angles in _current.
                // Then, interpolate from _current to the new angles.
                // During the transition, _current is updated in-place by d3.interpolate.
                var arcTween = function(d) {
                    var i = d3.interpolate(this._current, d);
                    this._current = i(0);
                    return function(t) {
                        return 'translate(' + arc.centroid(i(t)) + ') rotate(' + labelAngle(d) + ')';
                    };
                };

                // FIXME: #radius() is assumed to be provided by the enclosing chart. maybe we should default back to a feature based implementation if it doesn't find it?
                var r = d4.functor(this.radius).bind(this)(),
                    x = d4.functor(scope.accessors.x).bind(this)(),
                    y = d4.functor(scope.accessors.y).bind(this)();
                arc
                    .innerRadius(r)
                    .outerRadius(r + 10);

                var group = selection.selectAll('g.' + name).data(data);
                group.enter()
                    .append('g')
                    .attr('class', name)
                    .attr('transform', 'translate(' + x + ',' + y + ')');

                var labels = group.selectAll('text')
                    .data(function(d) {
                        return d.values;
                    }, d4.functor(scope.accessors.key).bind(this));

                // update
                labels.transition()
                    .duration(d4.functor(scope.accessors.duration).bind(this)())
                    .attrTween('transform', arcTween);

                // create new elements as needed
                labels.enter()
                    .append('text')
                    .attr('dy', 5)
                    .style('text-anchor', 'start')
                    .text(d4.functor(scope.accessors.text).bind(this))
                    .attr('transform', function(d) {
                        if(arc.centroid(d)[0] < 0) {
                            var arr = arc.centroid(d);
                            arr[0] -= this.getBBox().width;
                            return 'translate(' + arr + ') rotate(' + labelAngle(d) + ')';
                        } else {
                            return 'translate(' + arc.centroid(d) + ') rotate(' + labelAngle(d) + ')';
                        }
                    })
                    .attr('class', d4.functor(scope.accessors.classes).bind(this))
                    .attr('data-key', d4.functor(scope.accessors.key).bind(this))
                    .attr('d', arc)
                    .each(function(d) {
                        this._current = d;
                    });

                //remove old elements as needed
                labels.exit().remove();
                group.exit().remove();
                return arc;
            }
        };
    });

    internalLibs.d4.feature('xAxis', function(name) {
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

                rangeBand: undefined,

                scaleId: function() {
                    return 'x';
                }
            },
            proxies: [{
                target: axis
            }],

            render: function(scope, data, selection) {
                var xRangeBand = d4.functor(scope.accessors.rangeBand).bind(this)();
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
                    group.selectAll('.tick text').call(d4.helpers.wrapText, xRangeBand);
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

    return internalLibs;
});