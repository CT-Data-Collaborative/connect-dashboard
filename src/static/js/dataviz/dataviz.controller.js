angular.module('app')
.controller('DataVizController',
    function($scope, $http, $log, $q, lodash, dataConfig, dataProvider, townList, reusableCharts){
        var lo = lodash;
        $scope.offcanvas = false;
        $scope.data = dataConfig;
        $scope.townCrosswalk = townList;
        $scope.chartObjects = [];
        $scope.regionMapData = {
            "data" : '',
            "type" : "regionmap"
        };
        $scope.regions = reusableCharts.regions;
        $scope.selectedRegion = reusableCharts.selectedRegion;

        $scope.categories = [
            {
                'name' : 'Behavioral Health',
                'notes' : 'category notes'
            },
            {
                'name' : 'Education',
                'notes' : 'category notes'
            },
            {
                'name' : 'Early Childhood',
                'notes' : 'category notes'
            },
            {
                'name' : 'Child Welfare',
                'notes' : 'category notes'
            },
            {
                'name' : 'Health',
                'notes' : 'category notes'
            },
            {
                'name' : 'Demographics',
                'notes' : 'category notes'
            },
            {
                'name' : 'Juvenile Justice',
                'notes' : 'category notes'
            }
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
        //  Push data into local config data structure
        //  - should only happen once
        // -----------------------------------------
        $scope.push = function(data) {
            return $q(function(resolve, reject) {
                resolve(data.forEach(function(d) {
                        var toUpdate = lo.find($scope.data, function(o) {
                            return o.name == d.name;
                        });
                        toUpdate.data = d.data;
                    }));
            });
        };

        // -----------------------------------------
        // Data Load
        //  - should only happen once
        // -----------------------------------------
        var dataPromise = dataProvider.loadData();
        dataPromise.then(function(results) {
            var updatePromise = $scope.push(results);
            updatePromise.then(function(r) {
                $scope.updateData();
            });
            // Trigger initial rendering of statewide data

            //$scope.log();
        });
        // -----------------------------------------
        // End Data Load
        // -----------------------------------------

        // -----------------------------------------
        // Update Data
        // -----------------------------------------
        $scope.updateData = function() {
            if (typeof($scope.data[0].data) === 'undefined' || $scope.selectedRegion.selected.id == '') {
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
            });

            return;
        };
        // -----------------------------------------
        // End Update Data
        // -----------------------------------------


        // -----------------------------------------
        // Update Region Map
        // -----------------------------------------
        $scope.updateRegionMap = function() {
            $scope.regionMapData = {
                "data" : $scope.selectedRegion.selected.id,
                "type" : "regionmap"
            };

            return;
        }
        // -----------------------------------------
        // End Update Region Map
        // -----------------------------------------

        // -----------------------------------------
        // Main watch function on selected Region
        // -----------------------------------------
        $scope.$watch(function() {
            return $scope.selectedRegion;
        }, function() {
            reusableCharts.updateRegion($scope.selectedRegion.selected);
            $scope.updateData();
            $scope.updateRegionMap();
        }, true);
        // -----------------------------------------
        // End of Watch function on selected Region
        // -----------------------------------------
});
