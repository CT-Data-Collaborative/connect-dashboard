(function() {
'use strict';

angular.module('app')
.directive('ctdNestedTable', function($rootScope, reusableCharts) {
    return {
        scope: {
            data: '=',
            config: '='
        },
        templateUrl: './partials/directives/nested-table.html',
        link: function(scope, elem) {
            let selectedRegion = reusableCharts.selectedRegion;
            let data;
            scope.sortByAge = reusableCharts.sortKeysByAge;
            scope.sortByRace = reusableCharts.sortByRace;

            $rootScope.$on('region:changed', function() {
                formatData();
            });

            let unbindWatcher = scope.$watch('data', function() {
                data = scope.data;
                if(!!data) {
                    formatData();
                    unbindWatcher();
                }
            });

            function formatData() {
                let filteredData = data.filter(d => d.Region === selectedRegion.selected.code);

                scope.nestedData = d3.nest()
                    .key(function(d) { return d[scope.config['nest_key_1']]; }).sortKeys(scope.config['nest_sort_1'])
                    .key(function(d) { return d[scope.config['nest_key_2']]; }).sortValues(scope.config['nest_sort_2'])
                    .entries(filteredData);
            }
        }
    }
});

})();