angular.module('app')
.filter('sluggify', ['$filter', 'lodash', function($filter, lodash) {
    var lo = lodash;
    
    return function(input) {
        var first = parseFloat(input.toString().slice(0, 1));
        if (lo.range(10).indexOf(first) !== -1) {
            input = "_" + input;
        }

        return input
            .toLowerCase()
            .replace(/[^0-9a-zA-Z]/ig, "_")
            .replace(/_+/ig, "_");
    };
}]);