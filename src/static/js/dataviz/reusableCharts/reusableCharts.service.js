(function() {
'use strict';

angular.module('app')
.service('reusableCharts', function ($http, lodash) {

    const regions = [
        {'name' : 'Southwest Region', 'id' : 'South West'},
        {'name' : 'South Central Region', 'id' : 'South Central'},
        {'name' : 'Eastern Region', 'id' : 'East'},
        {'name' : 'North Central Region', 'id' : 'North Central'},
        {'name' : 'Western Region', 'id' : 'West'},
        {'name' : 'Central Region', 'id' : 'Central'},
        {'name' : 'Statewide', 'id' : 'State'}
    ];

    return {
        regions
    }
});

})();