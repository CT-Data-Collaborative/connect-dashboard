(function() {
'use strict';

angular.module('app')
.controller('ReusableChartsController', function($scope, chartData, chartConfig){
    let vm = this;
    
    vm.config = chartConfig;

    chartData.getSubstanceSanctionsData()
    .then(function(data) {
        vm.processedSubstanceData = data;            
    });

    chartData.getTreatmentData()
    .then(function(data) {
        vm.treatmentBarChartData = data.treatmentBarChartData;
        vm.treatmentDonutChartData = data.treatmentDonutChartData;
    });
});

})();
