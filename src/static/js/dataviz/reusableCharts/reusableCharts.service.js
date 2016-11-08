(function() {
'use strict';

angular.module('app')
.service('reusableCharts', function ($rootScope, lodash) {
    const lo = lodash;

    const ageLookup = {
        '0 - 5': 0,
        '6 - 9': 1,
        '10 - 15': 2,
        '16 - 19': 3,
        '20 - 21': 4,
        '0 - 21': 5
    };

    const raceSortLookup = {
        'White': 1,
        'Black': 2,
        'Hispanic': 3,
        'Other': 3,
        'Total': 4
    };

    const regions = [
        {'name' : 'Southwest Region', 'code' : 'Southwest', 'id' : '1'},
        {'name' : 'South Central Region', 'code' : 'South Central', 'id' : '2'},
        {'name' : 'Eastern Region', 'code' : 'East', 'id' : '3'},
        {'name' : 'North Central Region', 'code' : 'North Central', 'id' : '4'},
        {'name' : 'Western Region', 'code' : 'West', 'id' : '5'},
        {'name' : 'Central Region', 'code' : 'Central', 'id' : '6'},
        {'name' : 'Statewide', 'code' : 'State', 'id' : 'State'}
    ];

    let selectedRegion = {};
    selectedRegion.selected = lo.find(regions, {code:'State'});

    function updateRegion(newRegion) {
        selectedRegion.selected = newRegion;
        $rootScope.$emit('region:changed', newRegion);
    }

    function sortByAge(a, b) {
        return ageLookup[a.key] - ageLookup[b.key];
    }

    function sortKeysByAge(a, b) {
        return ageLookup[a] - ageLookup[b]
    }

    function sortByRace(a, b) {
        return raceSortLookup[a.Race] - raceSortLookup[b.Race];
    }
        

    return {
        regions,
        selectedRegion,
        updateRegion,
        sortByAge,
        sortKeysByAge,
        sortByRace
    };
});

})();