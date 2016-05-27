var d3 = require('d3');

// Helper Functions
var regionlookup = {
    'State': 'State',
    'Central': '6',
    'East': '3',
    'South West': '1',
    'South Central': '2',
    'North Central': '4',
    'West': '5'
}

var sortLookup = {
    '0 - 5': 0,
    '6 - 9': 1,
    '10 - 15': 2,
    '16 - 19': 3,
    '20 - 21': 4
}

var racesortLookup = {
    'Black': 0,
    'Hispanic': 1,
    'White': 2,
    'Other': 3,
    'Age': 4
}

var sorter = function(a, b) {
    return sortLookup[a.Group] - sortLookup[b.Group]
}

var raceSort = function(a, b) {
    return racesortLookup[Object.keys(a)[0]] - racesortLookup[Object.keys(b)[0]]
}



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




fs.readFile('treatment_state.csv', 'utf8', function(err, data) { statedata = d3.csv.parse(data);});
var statenested = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(statedata);
treatment['State'] = statenested;

fs.readFile('treatment_sw.csv', 'utf8', function(err, data) { swdata = d3.csv.parse(data);});
treatment['1'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(swdata);

fs.readFile('treatment_sc.csv', 'utf8', function(err, data) { scdata = d3.csv.parse(data);});
treatment['2'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(scdata);

fs.readFile('treatment_east.csv', 'utf8', function(err, data) { eastdata = d3.csv.parse(data);});
treatment['3'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(eastdata);

fs.readFile('treatment_nc.csv', 'utf8', function(err, data) { ncdata = d3.csv.parse(data);});
treatment['4'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(ncdata);

fs.readFile('treatment_west.csv', 'utf8', function(err, data) { westdata = d3.csv.parse(data);});
treatment['5'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(westdata);

fs.readFile('treatment_central.csv', 'utf8', function(err, data) { centraldata = d3.csv.parse(data);});
treatment['6'] = d3.nest().key(function (d) {return d.Group;}).key(function(d) { return d.Label}).entries(centraldata);



JSON.stringify(treatment)


var d3 = require('d3');

fs.readFile('treatment_all.csv', 'utf8', function(err, data) { alldata = d3.csv.parse(data);});
var dataFiltered = alldata.filter(function (d) { return d.Label == 'Tx'});
var ageFiltered = dataFiltered.filter(function(d) { return d.Group != '0 - 21'});
var raceFiltered = ageFiltered.filter(function(d) { return d.Race != 'Total'});
var sortedData = raceFiltered.sort(sorter)
var groupedData = d3.nest().key(function(d) { return d.Region}).key(function(d) { return d.Group }).entries(sortedData)


var records = {};
groupedData.forEach(function(d) {
    var geo = regionlookup[d.key];
    records[geo] = [];
    var values = d.values;
    values.forEach(function(v) {
        var vDict = {};
        vDict['Age'] = {type: 'string', 'value': v.key}
        var raceValues = v.values;
        raceValues.forEach(function(r) {
            //console.log(r);
            vDict[r.Race] = {type: 'integer', 'value': r.Value}
        })
        records[geo].push(vDict);
    });
})

JSON.stringify(records)



// Age Rollup
var groupedData = d3.nest().key(function(d) { return d.Region}).key(function(d) { return d.Group }).rollup(function(d) { return {type: 'integer', value: d3.sum(d, function(d) { return +d.Value})}}).entries(sortedData)

var records = {};
groupedData.forEach(function(d) {
    var geo = regionlookup[d.key];
    records[geo] = [];
    var values = d.values;
    var valDict = {};
    values.forEach(function(v) {
        valDict[v.key] = v.values;
    })
    records[geo].push(valDict);

});
JSON.stringify(records)

// old age rollup data
{
    "State": [
    {
        "16 - 19": {
            "type": "integer",
            "value": "14263"
        },
        "20 - 21": {
            "type": "integer",
            "value": "6707"
        },
        "10 - 15": {
            "type": "integer",
            "value": "20607"
        },
        "6 - 9": {
            "type": "integer",
            "value": "12728"
        },
        "0 - 5": {
            "type": "integer",
            "value": "17421"
        }
    }
],
    "1": [
    {
        "16 - 19": {
            "type": "integer",
            "value": "2580"
        },
        "20 - 21": {
            "type": "integer",
            "value": "1043"
        },
        "10 - 15": {
            "type": "integer",
            "value": "4232"
        },
        "6 - 9": {
            "type": "integer",
            "value": "2707"
        },
        "0 - 5": {
            "type": "integer",
            "value": "3791"
        }
    }
],
    "3": [
    {
        "16 - 19": {
            "type": "integer",
            "value": "2861"
        },
        "20 - 21": {
            "type": "integer",
            "value": "1652"
        },
        "10 - 15": {
            "type": "integer",
            "value": "3557"
        },
        "6 - 9": {
            "type": "integer",
            "value": "2177"
        },
        "0 - 5": {
            "type": "integer",
            "value": "2862"
        }
    }
],
    "2": [
    {
        "16 - 19": {
            "type": "integer",
            "value": "2185"
        },
        "20 - 21": {
            "type": "integer",
            "value": "1225"
        },
        "10 - 15": {
            "type": "integer",
            "value": "2673"
        },
        "6 - 9": {
            "type": "integer",
            "value": "1646"
        },
        "0 - 5": {
            "type": "integer",
            "value": "2405"
        }
    }
],
    "5": [
    {
        "16 - 19": {
            "type": "integer",
            "value": "2383"
        },
        "20 - 21": {
            "type": "integer",
            "value": "919"
        },
        "10 - 15": {
            "type": "integer",
            "value": "3751"
        },
        "6 - 9": {
            "type": "integer",
            "value": "2278"
        },
        "0 - 5": {
            "type": "integer",
            "value": "2951"
        }
    }
],
    "4": [
    {
        "16 - 19": {
            "type": "integer",
            "value": "2439"
        },
        "20 - 21": {
            "type": "integer",
            "value": "1111"
        },
        "10 - 15": {
            "type": "integer",
            "value": "3564"
        },
        "6 - 9": {
            "type": "integer",
            "value": "2183"
        },
        "0 - 5": {
            "type": "integer",
            "value": "3064"
        }
    }
],
    "6": [
    {
        "16 - 19": {
            "type": "integer",
            "value": "1815"
        },
        "20 - 21": {
            "type": "integer",
            "value": "757"
        },
        "10 - 15": {
            "type": "integer",
            "value": "2830"
        },
        "6 - 9": {
            "type": "integer",
            "value": "1737"
        },
        "0 - 5": {
            "type": "integer",
            "value": "2348"
        }
    }
]
}

// Race Rollup
var groupedData = d3.nest().key(function(d) { return d.Region}).key(function(d) { return d.Race }).rollup(function(d) { return {type: 'integer', value: d3.sum(d, function(d) { return +d.Value})}}).entries(sortedData)

var records = {};
groupedData.forEach(function(d) {
    var geo = regionlookup[d.key];
    records[geo] = [];
    var values = d.values;
    var valDict = {};
    values.forEach(function(v) {
        valDict[v.key] = v.values;
    })
    records[geo].push(valDict);

});
JSON.stringify(records)
// old race rollup
{
    "State": [
    {
        "Hispanic": {
            "type": "integer",
            "value": "13874"
        },
        "Black": {
            "type": "integer",
            "value": "8070"
        },
        "White": {
            "type": "integer",
            "value": "44050"
        },
        "Other": {
            "type": "integer",
            "value": "5728"
        }
    }
],
    "1": [
    {
        "Hispanic": {
            "type": "integer",
            "value": "3328"
        },
        "Black": {
            "type": "integer",
            "value": "2050"
        },
        "White": {
            "type": "integer",
            "value": "7844"
        },
        "Other": {
            "type": "integer",
            "value": "1130"
        }
    }
],
    "3": [
    {
        "Hispanic": {
            "type": "integer",
            "value": "1473"
        },
        "Black": {
            "type": "integer",
            "value": "600"
        },
        "White": {
            "type": "integer",
            "value": "9907"
        },
        "Other": {
            "type": "integer",
            "value": "1128"
        }
    }
],
    "2": [
    {
        "Hispanic": {
            "type": "integer",
            "value": "2017"
        },
        "Black": {
            "type": "integer",
            "value": "1847"
        },
        "White": {
            "type": "integer",
            "value": "5426"
        },
        "Other": {
            "type": "integer",
            "value": "842"
        }
    }
],
    "5": [
    {
        "Hispanic": {
            "type": "integer",
            "value": "2205"
        },
        "Black": {
            "type": "integer",
            "value": "779"
        },
        "White": {
            "type": "integer",
            "value": "8409"
        },
        "Other": {
            "type": "integer",
            "value": "890"
        }
    }
],
    "4": [
    {
        "Hispanic": {
            "type": "integer",
            "value": "2798"
        },
        "Black": {
            "type": "integer",
            "value": "2303"
        },
        "White": {
            "type": "integer",
            "value": "6211"
        },
        "Other": {
            "type": "integer",
            "value": "1050"
        }
    }
],
    "6": [
    {
        "Hispanic": {
            "type": "integer",
            "value": "2053"
        },
        "Black": {
            "type": "integer",
            "value": "491"
        },
        "White": {
            "type": "integer",
            "value": "6253"
        },
        "Other": {
            "type": "integer",
            "value": "688"
        }
    }
]
}