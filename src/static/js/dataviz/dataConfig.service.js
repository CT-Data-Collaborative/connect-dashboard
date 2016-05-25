angular.module('app')
    .service('dataConfig', ['$http', 'lodash', function ($http, lodash) {
        var config = [{
            "category": "Behavioral Health",
            "config": {
                "width": 12,
                "title": "Potential Treatment Needs by Age and Race",
                "header_offset": true,
                "height": 3,
                "source": "US Census; Calculations by CONNECT project",
                "footnotes": ["Pop - 2010 Decennial Census Population.", "Tx - Estimated number of individuals needing treatment for a serious emotional disturbance.", "Life - Estimated number who have experienced a mental health disorder in their lifetime.", "Other Race includes American Indian, Pacific Islander, Asian, and Multiracial persons."]
            },
            "type": "simpletable",
            "name": "Treatment Table"
        }, {
            "category": "Behavioral Health",
            "config": {
                "source": "US Census; Calculations by CONNECT project",
                "color": "",
                "title": "Number of Children in Need of Treatment: By Age Group and Race, 2010",
                "height": 3,
                "width": 12,
                "footnotes": ["Other Race includes American Indian, Pacific Islander, Asian, and Multiracial persons."],
                "grouping": "Age"
            },
            "name": "Treatment Chart",
            "type": "groupedbar"
        }, {
            "category": "Behavioral Health",
            "config": {
                "source": "US Census; Calculations by CONNECT project",
                "color": "",
                "title": "Children in Need of Treatment by Age",
                "height": 5,
                "width": 6,
                "footnotes": "",
                "order": ["0 - 5", "6 - 9", "10 - 15", "16 - 19", "20 - 21"],
                "grouping": ""
            },
            "name": "Treatment Age Pie",
            "type": "pie"
        }, {
            "category": "Behavioral Health",
            "config": {
                "source": "US Census; Calculations by CONNECT project",
                "color": "",
                "title": "Children in Need of Treatment by Race",
                "height": 5,
                "width": 6,
                "footnotes": ["Other Race includes American Indian, Pacific Islander, Asian, and Multiracial persons."],
                "order": ["White", "Black", "Hispanic", "Other"],
                "grouping": ""
            },
            "name": "Treatment Race Pie",
            "type": "pie"
        }, {
            "category": "Education",
            "config": {
                "source": "CT State Dept of Education",
                "color": "#5B771C",
                "title": "Student Characteristics, 2013-2014",
                "height": 4,
                "width": 6,
                "footnotes": ["Data includes only school districts that do not cross town boundaries."],
                "grouping": "",
                "ckan_url": "http://data.ctdata.org/visualization/educational-need"
            },
            "name": "Student Characteristics",
            "type": "bar"
        }, {
            "category": "Education",
            "config": {
                "source": "CT State Dept of Education",
                "color": "#F67C92",
                "title": "Substance-Related Sanctions Grades 6-12, 2009",
                "height": 4,
                "width": 6,
                "footnotes": ["Data includes only school districts that do not cross town boundaries.", "Values are a sum of unsuppressed data and include districts with suppressions."],
                "grouping": ""
            },
            "name": "Sanctions by Substance",
            "type": "bar"
        }, {
            "category": "Education",
            "config": {
                "source": "CT State Dept of Education",
                "color": "#A05D56",
                "title": "School Sanctions by Type, 2012-2013",
                "height": 4,
                "width": 6,
                "footnotes": ["Data includes only school districts that do not cross town boundaries.", "Values are a sum of unsuppressed data and include districts with suppressions."],
                "grouping": ""
            },
            "name": "Sanctions by Type",
            "type": "bar"
        }, {
            "category": "Education",
            "config": {
                "source": "CT State Dept of Education",
                "color": "#7B6888",
                "title": "Student Involvment in Incidents by Race, 2012-2013",
                "height": 3,
                "width": 6,
                "footnotes": ["Data includes only school districts that do not cross town boundaries.", "Other Race includes American Indian, Pacific Islander, Asian, and Multiracial persons."],
                "grouping": "",
                "ckan_url": "http://data.ctdata.org/visualization/suspension-rate-by-race"
            },
            "name": "Percent Incidents by Race",
            "type": "bar"
        }, {
            "category": "Education",
            "config": {
                "source": "CT State Dept of Education",
                "color": "",
                "title": "School Incidents by Type",
                "height": 6,
                "width": 8,
                "footnotes": ["Other includes: Drug Use; Violent Crime; Theft; Property Damage; Weapons; and Sexual Behavior.", "Data includes only school districts that do not cross town boundaries.", "Values are a sum of unsuppressed data and include districts with suppressions."],
                "order": ["School Policy Violations", "Personally Threatening Behavior", "Physical and Verbal Confrontation", "Fighting and Battery", "Other"],
                "grouping": ""
            },
            "name": "School Incidents Pie",
            "type": "pie"
        }, {
            "category": "Early Childhood",
            "config": {
                "source": "CT Office of Early Childhood",
                "color": "",
                "title": "Birth to Three Services, 2012 Cohort",
                "height": 5,
                "width": 6,
                "footnotes": ["IFSP - Individualized Family Service Plan", "ECSE - Early Childhood Special Education"],
                "grouping": "",
                "ckan_url": "http://data.ctdata.org/visualization/birth-to-three-birth-cohort-data"
            },
            "name": "B23 Number",
            "type": "bar"
        }, {
            "category": "Early Childhood",
            "config": {
                "source": "CT Office of Early Childhood",
                "color": "",
                "title": "Birth to Three Services, Percent of Birth Cohort, 2012",
                "height": 5,
                "width": 6,
                "footnotes": ["IFSP - Individualized Family Service Plan", "ECSE - Early Childhood Special Education", "Values represent the number of families receiving Birth to Three Services out of the total number of births."],
                "grouping": "",
                "ckan_url": "http://data.ctdata.org/visualization/birth-to-three-birth-cohort-data"
            },
            "name": "B23 Percent",
            "type": "bar"
        }, {
            "category": "Child Welfare",
            "config": {
                "height": 6,
                "width": 10,
                "title": "Children in Placement, In State by Age SFY 2014",
                "header_offset": false,
                "source": "CT Dept of Children and Families",
                "footnotes": "",
                "ckan_url": "http://data.ctdata.org/visualization/children-in-placement-by-age"
            },
            "type": "simpletable",
            "name": "CIP In State Age Table"
        }, {
            "category": "Child Welfare",
            "config": {
                "source": "CT Dept of Children and Families",
                "color": "",
                "title": "Children in Placement, Out of State, SFY 2014",
                "height": 5,
                "width": 8,
                "footnotes": "",
                "grouping": "",
                "ckan_url": "http://data.ctdata.org/visualization/children-in-placement-by-age"
            },
            "name": "CIP Out of State Pie",
            "type": "pie"
        }, {
            "category": "Child Welfare",
            "config": {
                "source": "CT Dept of Children and Families",
                "color": "",
                "title": "Children in Placement by Gender, In-State SFY 2014",
                "height": 5,
                "width": 12,
                "colors": ["#1f77b4", "#ff7f0e"],
                "footnotes": "",
                "grouping": "Type of Placement",
                "ckan_url": "http://data.ctdata.org/visualization/children-in-placement-by-gender"
            },
            "name": "In State Placement by Gender",
            "type": "stackedbar"
        }, {
            "category": "Child Welfare",
            "config": {
                "source": "CT Dept of Children and Families",
                "color": "",
                "title": "Children in Placement by Race, In-State SFY 2014",
                "height": 5,
                "width": 12,
                "footnotes": "",
                "grouping": "Type of Placement",
                "ckan_url": "http://data.ctdata.org/visualization/children-in-placement-by-race-and-ethnicity"
            },
            "name": "In State Placement by Race",
            "type": "stackedbar"
        }, {
            "category": "Health",
            "config": {
                "source": "CT Dept of Public Health",
                "color": "#F67C92",
                "title": "Fetal Mortality Rate, 5-Year Aggregation 2007-2011",
                "height": 5,
                "width": 6,
                "ckan_url": "http://data.ctdata.org/visualization/fetal-and-infant-mortality---5-year-aggregations-by-town",
                "footnotes": ["Rate per 1000 live births", "Fetal mortality occurs after 20 weeks of gestation and before labor.", "Data is suppressed when number of deaths is less than or equal to 5."],
                "grouping": ""
            },
            "name": "Fetal Mortality",
            "type": "bar"
        }, {
            "category": "Health",
            "config": {
                "source": "CT Dept of Public Health",
                "color": "#F67C92",
                "title": "Infant Mortality Rate, 5-Year Aggregation 2007-2011",
                "height": 5,
                "width": 6,
                "ckan_url": "http://data.ctdata.org/visualization/fetal-and-infant-mortality---5-year-aggregations-by-town",
                "footnotes": ["Rate per 1000 live births", "Infant mortality occurs before the first year of age and is a sum of Neonatal (the first 28 days after birth) and Postneonatal (from 28 days up to 1 year) mortality.", "Data is suppressed when number of deaths is less than or equal to 5."],
                "grouping": ""
            },
            "name": "Infant Mortality",
            "type": "bar"
        }];
        return config;
    }]);