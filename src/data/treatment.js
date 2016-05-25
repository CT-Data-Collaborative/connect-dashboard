var d3 = require('d3');

var files = {
    'State': 'treatment.csv',
    '1': 'treatment_sw.csv',
    '2': 'treatment_sc.csv',
    '3': 'treatment_east.csv',
    '4': 'treatment_nc.csv',
    '5': 'treatment_west.csv',
    '6': 'treatment_central.csv'
};

var treatment = { 'State': [], '1': [], '2': [], '3': [], '4': [], '5': [], '6': [] };


Object.keys(files).forEach(function(k) {
    var filename = files[k];
    var csvdata;
    fs.readFile(filename, 'utf8', function(err, data) { csvdata = d3.csv.parse(data);});
    treatment[k] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(csvdata)
});


var csvdata;

fs.readFile('treatment.csv', 'utf8', function(err, data) { csvdata = d3.csv.parse(data);});
treatment['State'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(csvdata)

fs.readFile('treatment_sw.csv', 'utf8', function(err, data) { csvdata = d3.csv.parse(data);});
treatment['1'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(csvdata)

fs.readFile('treatment_sc.csv', 'utf8', function(err, data) { csvdata = d3.csv.parse(data);});
treatment['2'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(csvdata)

fs.readFile('treatment_east.csv', 'utf8', function(err, data) { csvdata = d3.csv.parse(data);});
treatment['2'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(csvdata)

fs.readFile('treatment_nc.csv', 'utf8', function(err, data) { csvdata = d3.csv.parse(data);});
treatment['4'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(csvdata)

fs.readFile('treatment_west.csv', 'utf8', function(err, data) { csvdata = d3.csv.parse(data);});
treatment['5'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(csvdata)

fs.readFile('treatment_central.csv', 'utf8', function(err, data) { csvdata = d3.csv.parse(data);});
treatment['6'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(csvdata)



JSON.stringify(treatment)