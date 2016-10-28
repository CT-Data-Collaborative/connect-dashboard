(function() {
'use strict';

angular.module('app')
.service('reusableCharts', function ($http, lodash) {

    const regions = [
        {'name' : 'Southwest Region', 'id' : 'Southwest'},
        {'name' : 'South Central Region', 'id' : 'South Central'},
        {'name' : 'Eastern Region', 'id' : 'East'},
        {'name' : 'North Central Region', 'id' : 'North Central'},
        {'name' : 'Western Region', 'id' : 'West'},
        {'name' : 'Central Region', 'id' : 'Central'},
        {'name' : 'Statewide', 'id' : 'State'}
    ];

    function sortByAge(a, b) {
        var ageLookup = {
            '0 - 5': 0,
            '6 - 9': 1,
            '10 - 15': 2,
            '16 - 19': 3,
            '20 - 21': 4
        };

        return ageLookup[a.key] - ageLookup[b.key];
    }

    return {
        regions,
        sortByAge
    };
});

})();