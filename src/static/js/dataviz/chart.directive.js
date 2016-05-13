angular.module('app')
.directive('chart', [function(){
    var charts = {
        "bar" : barChart(),
        "groupedbar" : groupedbarChart(),
        "stackedbar" : stackedbarChart(),
        "table" : tableChart(),
        "simpletable" : simpletableChart(),
        "pie" : pieChart()
    }
    return {
        restrict: 'E',
        scope: {
            data: "=data"
        },
        link: function(scope, element, attrs) {
            scope.render = function() {
                data = scope.data
                d3.select(element[0]).datum(data).call(charts[data.type])
            }

            scope.$watchCollection(function() {
                return scope.data;
            }, function() {
                scope.render();
            }, true);
        }
    }
}]);
