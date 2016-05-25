angular.module('app')
.directive('chart', [function(){
    var charts = {
        "bar" : barChart(),
        "horizontalbar" : horizontalbarChart(),
        "groupedbar" : groupedbarChart(),
        "stackedbar" : stackedbarChart(),
        "horizontalstackedbar": horizontalstackedbarChart(),
        "table" : tableChart(),
        "simpletable" : simpletableChart(),
        "pie" : pieChart(),
        "regionmap" : regionmapChart()
    };
    
    return {
        restrict: 'E',
        scope: {
            data: "=data"
        },
        link: function(scope, element, attrs) {
            scope.render = function() {
                var width = element[0].clientWidth;
                var data = scope.data;
                if (data.type == 'bar') {
                    var series = data.data.records.length;
                    //console.log(series + ', ' + width);
                    if ((width / series) < 80) {
                        // We really want to call the vertical plot here
                        d3.select(element[0]).datum(data).call(charts['horizontalbar'])
                    } else {
                        d3.select(element[0]).datum(data).call(charts[data.type])
                    }
                } else if (data.type == 'stackedbar') {
                    var series = data.data.records.length;
                    //console.log(series + ', ' + width);
                    if ((width / series) < 80) {
                        // We really want to call the vertical plot here
                        d3.select(element[0]).datum(data).call(charts['horizontalstackedbar'])
                    } else {
                        d3.select(element[0]).datum(data).call(charts[data.type])
                    }
                } else {
                    d3.select(element[0]).datum(data).call(charts[data.type])
                }
            }

            scope.$watchCollection(function() {
                return scope.data;
            }, function() {
                scope.render();
            }, true);
        }
    }
}]);
