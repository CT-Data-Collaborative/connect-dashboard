angular.module('app')
    .service('dataConfig', ['$http', 'lodash', function ($http, lodash) {
        var config = [{
            "category": "Behavioral Health",
            "config": {
                "header": 'Race',
                "width": 12,
                "title": "Potential Treatment Needs by Age and Race",
                "header_offset": true,
                "height": 3,
                "source": "US Census; Calculations by CONNECT project",
                "footnotes": ["Pop - Population: Number of children in CT according to 2010 Decennial Census.", "Tx - Estimated number of individuals needing treatment for a serious emotional disturbance (7.1% of population).", "Life - Estimated number who have experienced a mental health disorder in their lifetime (20% of population).", "Other Race includes American Indian, Pacific Islander, Asian, and Multiracial persons."]
            },
            "type": "verticaltable",
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
                "grouping": "Age",
                "calculate_total": false
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
                "grouping": "",
                "calculate_total": true
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
                "order": ["Black", "Hispanic", "Other", "White"],
                "grouping": "",
                "calculate_total": true
            },
            "name": "Treatment Race Pie",
            "type": "pie"
        }, {
            "category": "Education",
            "config": {
                "source": "CT State Dept of Education",
                "color": "#1EACF1",
                "title": "Student Characteristics, 2013-2014",
                "height": 4,
                "width": 6,
                "footnotes": ["Data includes only school districts that do not cross town boundaries."],
                "grouping": "",
                "ckan_url": "http://data.ctdata.org/visualization/educational-need",
                "calculate_total": false
            },
            "name": "Student Characteristics",
            "type": "bar"
        }, {
            "category": "Education",
            "config": {
                "source": "CT State Dept of Education",
                "color": "#1EACF1",
                "title": "Substance-Related Sanctions Grades 6-12, 2009",
                "height": 4,
                "width": 6,
                "footnotes": ["Data includes only school districts that do not cross town boundaries.", "Values are a sum of unsuppressed data and include districts with suppressions."],
                "grouping": "",
                "calculate_total": true
            },
            "name": "Sanctions by Substance",
            "type": "bar"
        }, {
            "category": "Education",
            "config": {
                "source": "CT State Dept of Education",
                "color": "#1EACF1",
                "title": "School Sanctions by Type, 2012-2013",
                "height": 4,
                "width": 6,
                "footnotes": ["Data includes only school districts that do not cross town boundaries.", "Values are a sum of unsuppressed data and include districts with suppressions."],
                "grouping": "",
                "calculate_total": true
            },
            "name": "Sanctions by Type",
            "type": "bar"
        }, {
            "category": "Education",
            "config": {
                "source": "CT State Dept of Education",
                "color": "#1EACF1",
                "title": "Involvement in Incidents by Race, 2012-2013",
                "height": 3,
                "width": 6,
                "footnotes": ["Data includes only school districts that do not cross town boundaries.", "Other Race includes American Indian, Pacific Islander, Asian, and Multiracial persons."],
                "grouping": "",
                "order": ["Black", "Hispanic", "Other", "White"],
                "ckan_url": "http://data.ctdata.org/visualization/suspension-rate-by-race",
                "calculate_total": false
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
                "grouping": "",
                "calculate_total": true
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
                "ckan_url": "http://data.ctdata.org/visualization/birth-to-three-birth-cohort-data",
                "calculate_total": true
            },
            "name": "B23 Number",
            "type": "bar"
        }, {
            "category": "Early Childhood",
            "config": {
                "source": "CT Office of Early Childhood",
                "color": "",
                "title": "Birth to Three Services, % of Birth Cohort, 2012",
                "height": 5,
                "width": 6,
                "footnotes": ["IFSP - Individualized Family Service Plan", "ECSE - Early Childhood Special Education", "Values represent the number of families receiving Birth to Three Services out of the total number of births."],
                "grouping": "",
                "ckan_url": "http://data.ctdata.org/visualization/birth-to-three-birth-cohort-data",
                "calculate_total": false
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
                "ckan_url": "http://data.ctdata.org/visualization/children-in-placement-by-age",
                "calculate_total": false
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
                "ckan_url": "http://data.ctdata.org/visualization/children-in-placement-by-age",
                "calculate_total": true
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
                "ckan_url": "http://data.ctdata.org/visualization/children-in-placement-by-gender",
                "calculate_total": false
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
                "ckan_url": "http://data.ctdata.org/visualization/children-in-placement-by-race-and-ethnicity",
                "calculate_total": false
            },
            "name": "In State Placement by Race",
            "type": "stackedbar"
        }, {
            "category": "Health",
            "config": {
                "source": "CT Dept of Public Health",
                "color": "#1EACF1",
                "title": "Fetal Mortality Rate, 2007-2011",
                "height": 5,
                "width": 6,
                "ckan_url": "http://data.ctdata.org/visualization/fetal-and-infant-mortality---5-year-aggregations-by-town",
                "footnotes": [
                        "Rate per 1000 live births",
                        "Fetal mortality occurs after 20 weeks of gestation and before labor.",
                        "Data is suppressed when number of deaths is less than or equal to 5. Five-year totals are used to minimize suppression."],
                "grouping": "",
                "calculate_total": false
            },
            "name": "Fetal Mortality",
            "type": "bar"
        }, {
            "category": "Health",
            "config": {
                "source": "CT Dept of Public Health",
                "color": "#1EACF1",
                "title": "Infant Mortality Rate, 2007-2011",
                "height": 5,
                "width": 6,
                "ckan_url": "http://data.ctdata.org/visualization/fetal-and-infant-mortality---5-year-aggregations-by-town",
                "footnotes": [
                    "Rate per 1000 live births",
                    "Infant mortality occurs before the first year of age and is a sum of Neonatal (the first 28 days after birth) and Postneonatal (from 28 days up to 1 year) mortality.",
                    "Data is suppressed when number of deaths is less than or equal to 5. Five-year totals are used to minimize suppression."],
                "grouping": "",
                "calculate_total": false
            },
            "name": "Infant Mortality",
            "type": "bar"
        },{
            "category": "Demographics",
            "config": {
                "title": "Popluation by Age",
                "color": "",
                "height": 5,
                "source": "US Census; 2010 Decennial Census table PCT3",
                "width": 6,
                "footnotes": "",
                "order": [
                    "0 to 9 years",
                    "10 to 19 years",
                    "20 to 29 years",
                    "30 to 44 years",
                    "45 to 64 years",
                    "65+ years"
                ],
                "grouping": ""
            },
            "name": "Population Age Pie",
            "type": "pie"
        },{
            "category": "Demographics",
            "config": {
                "width": 6,
                "color": "",
                "ckan_url": "",
                "title": "Population by Race",
                "height": 5,
                "source": "US Census, 2010 Decennial Census Table PCT3",
                "footnotes": [
                    "Black, White, and Other races are specifically those Not of Hispanic Origin",
                    "Other race includes Asian, American Indian, Pacific Islander, and Multiracial persons."
                ],
                "order": [
                    "White",
                    "Black",
                    "Hispanic",
                    "Other"
                ],
                "grouping": ""
            },
            "name": "Population Race Bar",
            "type": "bar"
        },{
            "category": "Demographics",
            "config": {
                "width": 12,
                "title": "Population by Age and Race",
                "header_offset": false,
                "height": 5,
                "source": "US Census, 2010 Decennial Census Table PCT3",
                "footnotes": [
                    "Black, White, and Other races are specifically those Not of Hispanic Origin",
                    "Other race includes Asian, American Indian, Pacific Islander, and Multiracial persons."
                ]
            },
            "type": "simpletable",
            "name": "Population Age Race Table",
        },{
            "category": "Juvenile Justice",
            "config": {
                "title": "Juvenile Arrests by Age, Rate per 100,000 Persons",
                "color": "",
                "height": 5,
                "source": "Connecticut Uniform Crime Report; US Census",
                "width": 6,
                "footnotes": [
                    "Rates calculated using 2010-2014 ACS 5-Year population data, table B01001."
                ],
                "order": [
                    "0 to 9 years",
                    "10 to 14 years",
                    "15 to 17 years"
                ],
                "grouping": ""
            },
            "name": "Juvenile Arrest Rate",
            "type": "bar"
        },{
            "category": "Juvenile Justice",
            "config": {
                "title": "Juvenile Arrests by Age, selected Crimes",
                "color": "",
                "ckan_url": "http://data.ctdata.org/visualization/juvenile-arrests",
                "height": 5,
                "source": "Connecticut Uniform Crime Report",
                "footnotes": "",
                "width": 6,
                "grouping": "Crime"
            },
            "name": "Juvenile Arrests",
            "type": "stackedbar"
        }];
        return config;
    }]);