angular.module('app')
.service('libraries', function() {
<<<<<<< HEAD
    var internalLibs = {
=======
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

    return {
>>>>>>> moved patch xAxis into library service. Added accessor for xRangeBand which allows determination of width value by textWrap
        d4: d4,
        d3: d3
    };

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

    return internalLibs
});