// Script for transforming csv file of treatment data into data structures for Connect Visuals
// CSV file is assumed to have the following column headings: Group,Race,Label,Value,Region
// Transformation for the treatment table do not produce output suitable for the PDF version.

var d3 = require('d3');
var fs = require('fs');
// Helper Functions and data structures

var regionLookup = {
    'State': 'State',
    'Central': '6',
    'East': '3',
    'South West': '1',
    'South Central': '2',
    'North Central': '4',
    'West': '5'
};

var sortLookup = {
    '0 - 5': 0,
    '6 - 9': 1,
    '10 - 15': 2,
    '16 - 19': 3,
    '20 - 21': 4
};

var ageLookup = {
    '0 - 5': 0,
    '6 - 9': 1,
    '10 - 15': 2,
    '16 - 19': 3,
    '20 - 21': 4,
    '0 - 21': 5
};

var racesortLookup = {
    'Black': 0,
    'Hispanic': 1,
    'White': 2,
    'Other': 3,
    'Age': 4
};

var racesortLookup2 = {
    'White': 1,
    'Black': 2,
    'Hispanic': 3,
    'Other': 3,
    'Total': 4
};

var sortByRace = function(a, b) {
    return racesortLookup2[a.Race] - racesortLookup2[b.Race];
};


var sortByAge = function(a, b) {
    return ageLookup[a] - ageLookup[b];
}
var sorter = function(a, b) {
    return sortLookup[a.Group] - sortLookup[b.Group]
};

var raceSort = function(a, b) {
    return racesortLookup[Object.keys(a)[0]] - racesortLookup[Object.keys(b)[0]]
};

function jsonToFile(data, outputFilename) {
    var jsonStr = JSON.stringify(data, null, 4);
    fs.writeFile(outputFilename, jsonStr, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + outputFilename );
        }
    });
}

function parseCSV(filename) {
    return d3.csv.parse(fs.readFileSync(filename, 'utf8'))
}


function prepTreatmentTableData(filename) {
    var data = parseCSV(filename);
    var nested = d3.nest()
        .key(function(d) {return regionLookup[d.Region]})
        .key(function(d) { return d.Group }).sortKeys(sortByAge)
        .key(function(d) { return d.Label})
        .sortValues(sortByRace)
        .entries(data);
    var final = {};
    nested.forEach(function(d) { final[d.key] = d.values })
    return final;
}

function prepTreatmentSubCharts(data) {
    var dataFiltered = data.filter(function (d) { return d.Label == 'Tx'});
    // Drop 0 to 21 age group
    var ageFiltered = dataFiltered.filter(function(d) { return d.Group != '0 - 21'});
    // Drop Race/Ethnicity Totals
    return ageFiltered.filter(function(d) { return d.Race != 'Total'});
}

function prepTreatmentChartData(filename) {
    var data = parseCSV(filename);
    var records = {};
    var preppedData = prepTreatmentSubCharts(data);
    var groupedData = d3.nest()
        .key(function(d) { return d.Region})
        .key(function(d) { return d.Group })
        .entries(preppedData);
    groupedData.forEach(function(d) {
        var geo = regionLookup[d.key];
        records[geo] = [];
        var values = d.values;
        values.forEach(function(v) {
            var vDict = {};
            vDict['Age'] = {type: 'string', 'value': v.key}
            var raceValues = v.values;
            raceValues.forEach(function(r) {
                //console.log(r);
                vDict[r.Race] = {type: 'integer', 'value': r.Value}
            });
            records[geo].push(vDict);
        });
    });
    return records;
}

function prepTreatmentByAgePieChartData(filename) {
    var data = parseCSV(filename);
    var records = {};
    var preppedData = prepTreatmentSubCharts(data);
    var groupedData = d3.nest()
        .key(function(d) { return d.Region})
        .key(function(d) { return d.Group })
        .rollup(function(d) {
            return {
                type: 'integer',
                value: d3.sum(d, function(d) { return +d.Value})}
        })
        .entries(preppedData);
    groupedData.forEach(function(d) {
        var geo = regionLookup[d.key];
        records[geo] = [];
        var values = d.values;
        var valDict = {};
        values.forEach(function(v) {
            valDict[v.key] = v.values;
        });
        records[geo].push(valDict);
    });
    return records;
}

function prepTreatmentByRacePieChartData(filename) {
    var data = parseCSV(filename);
    var records = {};
    var preppedData = prepTreatmentSubCharts(data);
    var groupedData = d3.nest()
        .key(function(d) { return d.Region})
        .key(function(d) { return d.Race })
        .rollup(function(d) {
            return {
                type: 'integer',
                value: d3.sum(d, function(d) { return +d.Value})
            }})
        .entries(preppedData);
    groupedData.forEach(function(d) {
        var geo = regionLookup[d.key];
        records[geo] = [];
        var values = d.values;
        var valDict = {};
        values.forEach(function(v) {
            valDict[v.key] = v.values;
        });
        records[geo].push(valDict);
    });
    return records;
}

// Process data for Treatment Table
var treatmentTableData = prepTreatmentTableData('treatment_all.csv');
jsonToFile(treatmentTableData, 'treatment_table.json');


// Process data for Treatment Chart
var treatmentChartData = prepTreatmentChartData('treatment_all.csv');
jsonToFile(treatmentChartData, 'treatment_chart.json');


// Process data for Treatment by Age Pie Chart
var treatmentByAgePieChartData = prepTreatmentByAgePieChartData('treatment_all.csv');
jsonToFile(treatmentByAgePieChartData, 'treatment_by_age_pie_chart.json');


// Process data for Treatment by Race Pie Chart
var treatmentByRacePieChartData = prepTreatmentByRacePieChartData('treatment_all.csv');
jsonToFile(treatmentByRacePieChartData, 'treatment_by_race_pie_chart.json');
