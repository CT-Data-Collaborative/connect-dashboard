(function() {
'use strict';

angular.module('app')
.directive('ctdRegionSelector', function(reusableCharts) {
    return {
        templateUrl: './partials/directives/region-selector.html',
        link: function(scope) {
            scope.regions = reusableCharts.regions;
            scope.selectedRegion = reusableCharts.selectedRegion;
            scope.updateRegion = function(newRegion) {
                reusableCharts.updateRegion(newRegion);
            };
        }
    }
});

})();