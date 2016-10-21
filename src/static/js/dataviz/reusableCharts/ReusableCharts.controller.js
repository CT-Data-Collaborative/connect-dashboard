(function() {
'use strict';

angular.module('app')
.controller('ReusableChartsController', function(lodash, libraries){
    const lo = lodash;
    let vm = this;

    libraries.d3.csv('./data/treatment_all.csv', function(csv) {
        vm.treatmentBarChartData = csv
        .filter(d => d.Label === 'Tx' && d.Group !== '0 - 21' && d.Race !== 'Total')
        .map(d => {
            d.Value = +d.Value;
            return d;
        });

        vm.treatmentDonutChartData = csv
        .filter(d => d.Race === 'Total' && d.Label === 'Tx' && d.Region === 'State' && d.Group !== '0 - 21')
        .map(obj => {return {value: obj.Value, type: obj.Group}});
    });

    libraries.d3.csv('./data/substance_sanctions_all_towns.csv', function(substanceData) {
        libraries.d3.csv('./data/towns_and_regions.csv', function(regionsData) {
            vm.substanceBarChartData = substanceData
            .filter(d => d.Year === '2009')
            .map(d => {
                d.Region = lo.find(regionsData, function(o) { return o.Town === d.Town; }).Region;
                return d;
            });
            let groupedByRegion = lo.groupBy(vm.substanceBarChartData, d => d.Region); 

            let initial = {
                'Alcohol': 0,
                'Illegal Drug': 0,
                'Prescription/Over the counter drug': 0,
                'Tobacco': 0
            };

            let totals = angular.copy(initial);

            let reducer = function(accumulator, item) {
                accumulator[item.Substance] += +item.Value;
                return accumulator;
            };
            let regionalData = {
                'Region 1:Southwest': {},
                'Region 2:South Central': {},
                'Region 3:Eastern': {},
                'Region 4:North Central': {},
                'Region 5:Western': {},
                'Region 6:Central': {},
                'Connecticut': {}
            }
            for (let region in groupedByRegion) {
                regionalData[region]  = lo.reduce(groupedByRegion[region], reducer, angular.copy(initial));
            }
            regionalData.Connecticut = lo.reduce(vm.substanceBarChartData, reducer, initial);

            console.log(regionalData);
        });
    });
});

})();
