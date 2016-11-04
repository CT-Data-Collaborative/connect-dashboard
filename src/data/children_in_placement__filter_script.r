require('plyr')

data <- read.csv('children_in_placement.csv', na.strings='*')

colnames(data) <- c("dcf_region", "year", "age_group", "location_of_placement", "placement", "measure_type", "variable", "value")

filtered_data <- data[(data$year == "SFY 2013-2014" & data$location_of_placement == "In State"), c("dcf_region", "age_group", "placement", "measure_type", "variable", "value")]

filtered_data$dcf_region <- revalue(filtered_data$dcf_region, c("Region 1: Southwest"="Southwest", 
                                                                "Region 2: South Central"="South Central", 
                                                                "Region 3: Eastern"="East", 
                                                                "Region 4: North Central"="North Central", 
                                                                "Region 5: Western"="West", 
                                                                "Region 6: Central"="Central"))

write.csv(filtered_data, "children_in_placement__filtered.csv", row.names=FALSE)

