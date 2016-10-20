(function() {
'use strict';

angular.module('app')
.controller('ReusableChartsController', function(libraries){
    let vm = this;

    libraries.d3.csv('./data/treatment_all.csv', function(result) {
        vm.treatmentBarChartData = result
        .filter(d => d.Label === 'Tx' && d.Group !== '0 - 21' && d.Race !== 'Total')
        .map(d => {
            d.Value = +d.Value;
            return d;
        });
    });

    libraries.d3.csv('./data/treatment_all.csv', function(results) {
        vm.treatmentDonutChartData = results
        .filter(d => d.Race === 'Total' && d.Label === 'Tx' && d.Region === 'State' && d.Group !== '0 - 21')
        .map(obj => {return {value: obj.Value, type: obj.Group}});
    });

});

})();
