(function() {
'use strict';

angular.module('app')
.directive('ctdRegionSelector', function() {
    return {
        scope: {
            regions: '=',
            currentRegion: '=',
            update: '='
        },
        templateUrl: './partials/directives/region-selector.html'
    }
});

})();