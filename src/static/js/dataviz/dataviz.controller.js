angular.module('app')
.controller('DataVizController',
    ['$scope', '$http', '$log', 'lodash', 'dataProcessor', 'dataProvider',
    function($scope, $http, $log, lodash, dataProcessor, dataProvider){
        var lo = lodash;

        $scope.regions = [
            {'name' : 'Region 1: Southwest', 'id' : '1'},
            {'name' : 'Region 2: South Central', 'id' : '2'},
            {'name' : 'Region 3: Eastern', 'id' : '3'},
            {'name' : 'Region 4: North Central', 'id' : '4'},
            {'name' : 'Region 5: Western', 'id' : '5'},
            {'name' : 'Region 6: Central', 'id' : '6'},
            {'name' : 'Statewide', 'id' : 'State'}
        ]

        $scope.selectedRegion = $scope.regions[0];

        $scope.categories = [
            'Demographics',
            'Early Childhood',
            'Education',
            'Behavioral Health',
            'Child Welfare',
            'Juvenile Justice'
        ];

        // -----------------------------------------
        // Scroll to selection
        // -----------------------------------------
        $scope.scrollElement = function(anchorHash, containerHash) {
            var $anchor = $(anchorHash);
            var $container = $(containerHash);

            var containerTop = $container.scrollTop();
            var containerBottom = containerTop + $container.height();
            var elemTop = $anchor.get(0).offsetTop;
            var elemBottom = elemTop + $anchor.height();

            if (elemTop < containerTop) {
                $container.scrollTop(elemTop);
            } else if (elemBottom > containerBottom) {
                $container.scrollTop(elemBottom - $container.height());
            }
        }
        // -----------------------------------------
        // END Scroll to selection
        // -----------------------------------------

        // -----------------------------------------
        // Data Load
        //  - should only happen once
        // -----------------------------------------
        var dataPromise = dataProvider.loadData();
        dataPromise.then(function(results) {
            $scope.data = results
        });
        // -----------------------------------------
        // End Data Load
        // -----------------------------------------

        // -----------------------------------------
        // Update Data
        // -----------------------------------------
        $scope.updateData = function() {
            // filter all data objects so that the only data present in them is the selected region's
            // use dataProcessor?
            // ? reshape so that:
            //  {
            //      section: [list of viz],
            //      . . .
            //  } 

            return;
        }
        // -----------------------------------------
        // End Update Data
        // -----------------------------------------

        // -----------------------------------------
        // Main watch function on selected Region
        // -----------------------------------------
        $scope.$watchCollection(function() {
            return $scope.selectedRegion;
        }, function() {
            $scope.updateData();
        }, true);
        // -----------------------------------------
        // End of Watch function on selected Region
        // -----------------------------------------
}]);
