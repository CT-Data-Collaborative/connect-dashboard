(function() {
'use strict';

angular.module('app')
.constant('chartConfig', {
    substanceSanctions: {
        "category": "Education",
        "source": "CT State Dept of Education",
        "title": "Substance-Related Sanctions Grades 6-12, 2009",
        "footnotes": [
            "Data includes only school districts that do not cross town boundaries.", 
            "Values are a sum of unsuppressed data and include districts with suppressions."
        ],
        "grouping": "",
        "calculate_total": true,
        "name": "Sanctions by Substance",
        "type": "bar"
    }, 

    treatmentByRace: {
        "category": "Behavioral Health",
        "source": "US Census; Calculations by CONNECT project",
        "title": "Number of Children in Need of Treatment: By Age Group and Race, 2010",
        "footnotes": ["Other Race includes American Indian, Pacific Islander, Asian, and Multiracial persons."],
        //"grouping": "Age",
        "calculate_total": false,
        "name": "Treatment Chart",
        "type": "groupedBar"
    }, 
    treatmentByAge: {
        "category": "Behavioral Health",
        "source": "US Census; Calculations by CONNECT project",
        "title": "Children in Need of Treatment by Age",
        "footnotes": "",
        "grouping": "",
        "calculate_total": true,
        "name": "Treatment Age Pie",
        "type": "donut"
    },
    treatmentByRaceDonut: {
            "category": "Behavioral Health",
            "source": "US Census; Calculations by CONNECT project",
            "title": "Children in Need of Treatment by Race",
            "footnotes": ["Other Race includes American Indian, Pacific Islander, Asian, and Multiracial persons."],
            "order": ["Black", "Hispanic", "Other", "White"],
            "grouping": "",
            "calculate_total": true,
            "name": "Treatment Race Pie",
            "type": "donut"
        },
    sanctionsByType: {
        "category": "Education",
        "source": "CT State Dept of Education",
        "title": "School Sanctions by Type, 2012-2013",
        "footnotes": ["Data includes only school districts that do not cross town boundaries.", "Values are a sum of unsuppressed data and include districts with suppressions."],
        "grouping": "",
        "calculate_total": true,
        "name": "Sanctions by Type",
        "type": "bar"
    }, 
    educationNeeds: {
        "category": "Education",
        "source": "CT State Dept of Education",
        "title": "Student Characteristics, 2013-2014",
        "footnotes": ["Data includes only school districts that do not cross town boundaries."],
        "grouping": "",
        "ckan_url": "http://data.ctdata.org/visualization/educational-need",
        "calculate_total": false,
        "name": "Student Characteristics",
        "type": "bar",
        "percentage": true
    }

}); 
})();
       




        