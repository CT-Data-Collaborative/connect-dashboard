(function() {
'use strict';

angular.module('app')
.directive('ctdTable', function($rootScope, reusableCharts) {
    return {
        scope: {
            data: '=',
            config: '='
        },
        templateUrl: './partials/directives/table.html',
        link: function(scope, elem) {
            let selectedRegion = reusableCharts.selectedRegion;
            let data;

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
                let filteredData = data.filter(d => d.dcf_region === selectedRegion.selected.code);

                scope.nestedData = d3.nest()
                    .key(function(d) { return d[scope.config['nest_key']]; })
                    .entries(filteredData);
            }
        }
    }
});

})();