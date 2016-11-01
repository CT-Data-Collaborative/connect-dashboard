(function() {
'use strict';

angular.module('app')
.service('chartData', function ($q, lodash, libraries) {
    let lo = lodash;

    function getSubstanceSanctionsData() {
        return $q(function(resolve, reject) {
            libraries.d3.csv('./data/substance_sanctions_all_towns.csv', function(substanceData) {
                libraries.d3.csv('./data/towns_and_regions.csv', function(regionsData) {
                    let substanceBarChartData = substanceData
                    .filter(d => d.Year === '2009')
                    .map(d => {
                        d.Region = lo.find(regionsData, function(o) { return o.Town === d.Town; }).Region;
                        return d;
                    });
                    let groupedByRegion = lo.groupBy(substanceBarChartData, d => d.Region); 

                    let initial = {
                        'Alcohol': 0,
                        'Illegal Drug': 0,
                        'Prescription/Over the counter drug': 0,
                        'Tobacco': 0
                    };

                    let reducer = function(accumulator, item) {
                        accumulator[item.Substance] += +item.Value;
                        return accumulator;
                    };
                    let data = [];
                    let regionalData = {
                        'Region 1:Southwest': {},
                        'Region 2:South Central': {},
                        'Region 3:Eastern': {},
                        'Region 4:North Central': {},
                        'Region 5:Western': {},
                        'Region 6:Central': {},
                        'Connecticut': {}
                    }
                    let regionTranslator = {
                        'Region 1:Southwest' : 'Southwest',
                        'Region 2:South Central' : 'South Central',
                        'Region 3:Eastern' : 'East',
                        'Region 4:North Central' : 'North Central',
                        'Region 5:Western' : 'West',
                        'Region 6:Central' : 'Central',
                        'Connecticut' : 'State'
                    };

                    for (let region in groupedByRegion) {
                        regionalData[region]  = lo.reduce(groupedByRegion[region], reducer, angular.copy(initial));

                        for (let r in regionalData[region]) {
                            data.push({
                                Group: r,
                                Value: regionalData[region][r],
                                Region: regionTranslator[region]
                            });
                        }
                    }
                    regionalData.Connecticut = lo.reduce(substanceBarChartData, reducer, initial);
                    for (let r in regionalData.Connecticut) {
                        data.push({
                            Group: r,
                            Value: regionalData.Connecticut[r],
                            Region: 'State'
                        });
                    }
                    resolve(data);
                });
            });
        });
    }

    function getTreatmentData() {
        return $q(function(resolve, reject) {
            libraries.d3.csv('./data/treatment_all.csv', function(csv) {
                let treatmentBarChartData = csv
                .filter(d => d.Label === 'Tx' && d.Group !== '0 - 21' && d.Race !== 'Total')
                .map(d => {
                    d.Value = +d.Value;
                    return d;
                });

                let treatmentDonutChartData = csv
                .filter(d => d.Race === 'Total' && d.Label === 'Tx' && d.Region === 'State' && d.Group !== '0 - 21')
                .map(obj => {return {value: obj.Value, type: obj.Group}});

                let treatmentByRaceDonutChartData = csv
                .filter(d => d.Race !== 'Total' && d.Label === 'Tx' && d.Region === 'State' && d.Group === '0 - 21')
                .map(obj => {return {value: obj.Value, type: obj.Race}});

                resolve({treatmentBarChartData, treatmentDonutChartData, treatmentByRaceDonutChartData});
            });
        });
    }

    function getSanctionsByTypeData() {
        return $q(function(resolve, reject) {
            libraries.d3.csv('./data/sanctions_by_type.csv', function(csv) {
                let data = csv
                .map(d => {
                    d.Value = +d.Value;
                    return d;
                });
                resolve(data);
            });
        });
    }

    function getEducationNeedsData() {
        return $q(function(resolve, reject) {
            libraries.d3.csv('./data/educational_needs__tidier.csv', function(csv) {
                let educationalNeedsChartData = csv
                .filter(d => d.Value !== '*');

                let groupedByRegion = lo.groupBy(educationalNeedsChartData, d => d.Region);
                let data = [];

                let initial = {
                    'Eligible for Free or Reduced Price Lunch': {
                        total: 0,
                        subtotal: 0
                    },
                    'Special Education': {
                        total: 0,
                        subtotal: 0
                    },
                    'English Language Learner': {
                        total: 0,
                        subtotal: 0
                    }
                };

                let reducer = function(accumulator, item) {
                    accumulator[item.Group].subtotal += +item.Value;
                    accumulator[item.Group].total += +item.Total;
                    return accumulator;
                };
                let regionalData = {
                    'Southwest': {},
                    'South Central': {},
                    'East': {},
                    'North Central': {},
                    'West': {},
                    'Central': {},
                    'State': {}
                }
                for (let region in groupedByRegion) {
                    regionalData[region]  = lo.reduce(groupedByRegion[region], reducer, angular.copy(initial));

                    for (let variable in regionalData[region]) {
                        let percentage = regionalData[region][variable].subtotal / regionalData[region][variable].total;
                        data.push({
                            Group: variable,
                            Value: percentage,
                            Region: region
                        });
                    }
                }
                regionalData.State = lo.reduce(educationalNeedsChartData, reducer, angular.copy(initial));
                for (let variable in regionalData.State) {
                    let percentage = regionalData.State[variable].subtotal / regionalData.State[variable].total;
                    data.push({
                        Group: variable,
                        Value: percentage,
                        Region: 'State'
                    });
                }

                resolve(data);
            })
        })
    }

    return {
        getTreatmentData,
        getSanctionsByTypeData,
        getSubstanceSanctionsData,
        getEducationNeedsData
    };
});

})();