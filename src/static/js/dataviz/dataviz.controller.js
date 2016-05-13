angular.module('app')
.controller('DataVizController',
    ['$scope', '$http', '$log', 'lodash', 'dataProcessor', 'dataProvider',
    function($scope, $http, $log, lodash, dataProcessor, dataProvider){
        var lo = lodash;

        $scope.data = [];
        $scope.vizData = [];

        $scope.regions = [
            {'name' : 'Region 1: Southwest', 'id' : '1'},
            {'name' : 'Region 2: South Central', 'id' : '2'},
            {'name' : 'Region 3: Eastern', 'id' : '3'},
            {'name' : 'Region 4: North Central', 'id' : '4'},
            {'name' : 'Region 5: Western', 'id' : '5'},
            {'name' : 'Region 6: Central', 'id' : '6'},
            {'name' : 'Statewide', 'id' : 'State'}
        ]

        $scope.selectedRegion = {'selected' : {'name' : 'Please Select a Region', 'id' : ''}};

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
        $scope.scrollContent = function(category) {
            var $anchor = $("#"+category);
            var $container = $("#content");

            $container.animate({
                scrollTop: $anchor.get(0).offsetTop - 70
            }, {
                duration: 400,
                specialEasing: {
                    width: 'linear',
                    height: 'easeOutBounce'
                }
            });
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
            if ($scope.data.length === 0 || $scope.selectedRegion.selected.id == '') {
                return
            }

            $scope.vizData = $scope.data.map(function(viz) {
                viz.data.records = viz.data.records[$scope.selectedRegion.selected.id];
                return viz;
            }).filter(function(viz) {
                return viz.data.records.length > 0;
            });

            console.log($scope.vizData);

            return;
        }
        // -----------------------------------------
        // End Update Data
        // -----------------------------------------

        // -----------------------------------------
        // Main watch function on selected Region
        // -----------------------------------------
        $scope.$watch(function() {
            return $scope.selectedRegion;
        }, function() {
            $scope.updateData();
        }, true);
        // -----------------------------------------
        // End of Watch function on selected Region
        // -----------------------------------------
}]);
