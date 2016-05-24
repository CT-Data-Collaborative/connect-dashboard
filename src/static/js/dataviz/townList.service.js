angular.module('app')
    .service('townList', function() {
        var regionsList = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: []
        };

        TOWNGEOJSON.features.forEach(function(t) {
                regionsList[t.properties.REGION].push(t.properties.NAME);
        });
        return regionsList;
    });