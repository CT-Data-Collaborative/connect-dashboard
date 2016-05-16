angular.module('app')
.controller('DataVizController',
    ['$scope', '$http', '$log', 'lodash', 'dataProcessor', 'dataProvider',
    function($scope, $http, $log, lodash, dataProcessor, dataProvider){
        var lo = lodash;

        $scope.data = [];
        $scope.chartObjects = [];

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

            $scope.chartObjects = [];

            $scope.data.forEach(function(dataset) {
                // angular.copy() takes deep copy, without matching hash keys
                // allowing us to edit the object without editing the original data.
                var chart = angular.copy(dataset);

                // filter the data of this chart object
                chart.data.records = chart.data.records[$scope.selectedRegion.selected.id];

                // add to list
                $scope.chartObjects.push(chart);
            });

            $scope.chartObjects = $scope.chartObjects.filter(function(chart) {
                return ((typeof chart.data.records !== "undefined") && (chart.data.records.length > 0));
            })

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
