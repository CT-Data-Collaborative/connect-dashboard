angular.module('app')
.filter('pretty', ['$filter', function($filter) {
    return function(input, replacer, space) {
        if (undefined === replacer || !(replacer instanceof Function)) {
            replacer = null;
        }
        if (undefined === space || parseInt(space) !== space) {
            space = 4;
        }
        return JSON.stringify(input, null, 4);
    };
}]);