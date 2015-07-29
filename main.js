      var sdk = new CitySDK();
      var censusModule = sdk.modules.census;
      censusModule.enable("c1b2930d3ce73910373c35fe2a4bddae76fd3492");
      var propertyScores = [];
      var finishedCount = 0;
      var totalFilters = 8;
      var properties;
      var olat;
      var olong;
      var competitors;
      var providers;

      function callMapFunction() {

      }

      function generateRecommended(lat, lng, filters)
      {
           // get all open real estate.
           olat = lat;
           olong = lng;
            getOpenRealEstate(olat, olong, 2, function(list){
                properties = list;
                
                for(var i=0;i<properties.length;i++)
                {
                    // init property score object.
                    propertyScores[i] = {propertyInfo: properties[i], score: 0, maxScore: 0, rank: 0};
                    // eval property
                    evaluteRealEstate(properties[i],filters, i);
                }
            });
      }

 // once all property scores have finished evaluating.
        function onDataComplete() {

           // calculate percentage matches.
            for(var i=0;i<propertyScores.length;i++)
            {
                propertyScores[i].rank = 100 * (propertyScores[i].score / propertyScores[i].maxScore);
            }

            propertyScores = propertyScores.sort(function(a,b){
                return b.rank - a.rank;
            });
            fillTable(propertyScores);
            addRealEstateToMap(propertyScores);
            addCompetitorsToMap(competitors);
            addProvidersToMap(providers);

            console.log(propertyScores);
        }

        function checkAllFinished(count)
        {

            if(count === totalFilters)
            {
                finishedCount++;
                if(finishedCount === properties.length)
                {
                    finishedCount=0;
                    onDataComplete();
                }
            }
        }

        function evaluteRealEstate(realEstate, filters, index){
            var count = 0;
            var address = realEstate.address;
            var zipcode = parseInt(address.substring(address.lastIndexOf(" ") + 1));
            // non competitor scoring.
            getWalkScore(realEstate.address, filters['walkscore'].priority, function(resultScore, maxScore){
                if(Number.isFinite(resultScore) && Number.isFinite(maxScore)) {
                    propertyScores[index].score += resultScore;
                    propertyScores[index].maxScore += maxScore;
                }
                count++;
                    checkAllFinished(count);

            });

            getOriginDistanceScore(properties[index].lat, properties[index].lng, olat, olong, filters['distance'].val, filters['distance'].priority, function (resultScore, maxScore) {
                if(Number.isFinite(resultScore) && Number.isFinite(maxScore)) {
                    propertyScores[index].score += resultScore;
                    propertyScores[index].maxScore += maxScore;

                }
                count++;
                checkAllFinished(count);
            });

            
            getPriceScore(filters['price'].val[1], filters['price'].val[0], realEstate.price, filters['price'].priority, function (resultScore, maxScore) {
                if(Number.isFinite(resultScore) && Number.isFinite(maxScore)) {
                    propertyScores[index].score += resultScore;
                    propertyScores[index].maxScore += maxScore;

                }
                    count++;
                    checkAllFinished(count);
            });

            // get competitors and async update score.
            $.ajax({
              url: 'http://10.22.253.245/places?'+'query='+'restaurants near ' + realEstate.address,
              dataType: 'json',
              success: function(data){
                // results are competitors.
                  var results = data.results;
                  competitors = results;
                 // calculate scores based on competitors now.
                  getCompetitorScore(results, olat, olong, filters['competitors'].priority, function (resultScore, maxScore) {

                      if(Number.isFinite(resultScore) && Number.isFinite(maxScore)) {
                          propertyScores[index].score += resultScore;
                          propertyScores[index].maxScore += maxScore;

                      }
                    count++;
                    checkAllFinished(count);

                  });


              }
            });


            $.ajax({
                url: 'http://10.22.253.245/places?'+'query='+'restaurant suppliers near ' + realEstate.address,
                dataType: 'json',
                success: function(data){
                    // results are competitors.
                    var results = data.results;
                    providers = results;

                    // calculate scores based on competitors now.
                    getCompetitorScore(results, olat, olong, filters['providers'].priority, function (resultScore, maxScore) {

                        if(Number.isFinite(resultScore) && Number.isFinite(maxScore)) {
                            propertyScores[index].score += resultScore;
                            propertyScores[index].maxScore += maxScore;

                        }
                        count++;
                        checkAllFinished(count);

                    });


                }
            });

            /*

             getRestaurantProviderScore(results, olat, olong, filters['providers'].priority, function (resultScore, maxScore) {
             if(Number.isFinite(resultScore) && Number.isFinite(maxScore)) {
             propertyScores[index].score += resultScore;
             propertyScores[index].maxScore += maxScore;

             }
             count++;
             checkAllFinished(count);
             });
             */



            gatherCensusData(zipcode, function(data) {
                rankIncome(filters['wealth'].val, filters['wealth'].priority, data, function (resultScore, maxScore) {
                    if(Number.isFinite(resultScore) && Number.isFinite(maxScore)) {
                        propertyScores[index].score += resultScore;
                        propertyScores[index].maxScore += maxScore;

                    }
                    count++;
                    checkAllFinished(count);
                });
                rankPopulation(filters['population'].val, filters['population'].priority, data, function (resultScore, maxScore) {
                    if(Number.isFinite(resultScore) && Number.isFinite(maxScore)) {
                        propertyScores[index].score += resultScore;
                        propertyScores[index].maxScore += maxScore;
                        count++;
                    }
                    count++;
                    checkAllFinished(count);
                });
                rankAgeRange(filters['age'].val, filters['age'].priority, data, function (resultScore, maxScore) {
                    if(Number.isFinite(resultScore) && Number.isFinite(maxScore)) {
                        propertyScores[index].score += resultScore;
                        propertyScores[index].maxScore += maxScore;

                    }
                    count++;
                    checkAllFinished(count);
                });
            });


        }

        function getOpenRealEstate(latitude, longitude, miles, callback) {
            var results = [];
            var radius = miles * 1600;
            var url = 'http://10.22.253.245/catylist?latitude=' + latitude + "&longitude=" + longitude + '&radius=' + radius;
            $.ajax({
                url: url,
                dataType: 'text',
                success: function (data) {
                    var str = data.substring(data.indexOf('CDATA') + 6);
                    str = str.substring(0, str.indexOf(']]>'));
                    var json = JSON.parse(str);

                    $.each(json, function(key, item) {
                        if (item.price != "") {
                            var size = getRealEstateSize(item.size);
                            var store = {
                                address: item.address,
                                price: getRealEstatePrice(item.price, size),
                                lat: item.latitude,
                                lng: item.longitude,
                                overview: item.overview,
                                size: size
                            }
                            results.push(store);

                        }
                    });

                    callback(results);
                }
            });
        }

        function getRealEstateSize(size) {
            if (size.indexOf('-') > -1) {
                size = size.substring(size.indexOf('-') + 2);
            }
            if (size.indexOf('SF') > 0) {
                size = size.substring(0, size.indexOf('SF') - 1);
                return parseInt(size.replace(/,/g, ''), 10);
            }
            if (size.indexOf('Acres')) {
                size = size.substring(0, size.indexOf('Acres'));
                return Math.round(parseFloat(size) * 43560);
            }
        }

        function getRealEstatePrice(price, size) {
            price = price.substr(1);
            if (price.indexOf('PSF') > -1) {
                price = price.substring(0, price.indexOf('PSF') - 1);
                var cost = parseFloat(price.replace(/,/g, ''), 10) * size / 12;
                return parseInt(cost);
            }
            var P = parseInt(price.replace(/,/g, ''), 10);
            var i = 0.00333333333;
            var n = 240;
            return Math.round(P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n - 1)));
        }

        function getDistance(lat1, lon1, lat2, lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1);  // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var ktm = .621371; // km to miles
            var d = R * c; // Distance in km
            return d * ktm;
        }

        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }

        function getCompetitorScore(competitors, originLat, originLon, userRank, callback) {
            var closeCompetitors = 0;
            var result = 0;
            for (var i = 0; i < competitors.length; i++) {
                var comp = competitors[i];

                if (getDistance(comp.geometry.location.lat, comp.geometry.location.lng, originLat, originLon) <= 5) {
                    closeCompetitors++;
                }
                if (closeCompetitors > 10) {
                    callback(0, 0);
                }
            }
            if (closeCompetitors > 10) {
                result =  0;
            } else if (closeCompetitors >= 8) {
                result =  1 * userRank;
            } else if (closeCompetitors >= 5) {
                result =  2 * userRank;
            } else if (closeCompetitors >= 2) {
                result =  3 * userRank;
            } else {
                result = 4 * userRank;
            }
            callback(result, 4 * userRank);
        }

        function getOriginDistanceScore(latitude, longitude, originLat, originLong, radius, userRank, callback) {
            var dist = getDistance(latitude, longitude, originLat, originLong);
            var num = 4 - Math.floor(Math.round(dist / radius * 100) / 20);
            callback(num * userRank, 4 * userRank);
        }

        function getRestaurantProviderScore(competitors, originLat, originLon, userRank, callback) {
            var minDistance = 0;
            var result = 0;
            for (var i = 0; i < competitors.length; i++) {
                var comp = competitors[i];

                if (getDistance(comp.geometry.location.lat, comp.geometry.location.lng, originLat, originLon) < minDistance) {
                    minDistance = getDistance(comp.geometry.location.lat, comp.geometry.location.lng, originLat, originLon);
                }
            }
            if (minDistance > 20) {
                result = 0;
            } else if (minDistance >= 15) {
                result =  1 * userRank;
            } else if (minDistance >= 9) {
                result =  2 * userRank;
            } else if (minDistance >= 3) { 
                result =  3 * userRank;
            } else {
                result =  4 * userRank;
            }
            callback(result, 4 * userRank);
        }

        function getWalkScore(address, userRank, callback) {
            var url = 'http://10.22.253.245/walkscore?address=' + address;
            var result = 0;
            var walkscore = 0;
            $.ajax({
                url: url,
                dataType: 'json',
                success: function (data) {
                    walkscore = data.walkscore;
                    if (walkscore > 80) {
                        result =  4 * userRank;
                    } else if (walkscore > 60) {
                        result = 3 * userRank;
                    } else if (walkscore > 40) {
                        result = 2 * userRank;
                    } else if (walkscore > 20) {
                        result = 1 * userRank;
                    } else {
                        result =  0;
                    }
                    callback(result, 4* userRank);
                }
            });
        }
   
        function getPriceScore(maxPrice, minPrice, curPrice, userRank, callback) {
            var rank = 0;
            if (curPrice >= minPrice && curPrice <= maxPrice) {
                rank = 4;
            }
            return callback(rank * userRank, 4 * userRank);
        }


        function gatherCensusData(zipCode, callback) {
            var request = {
                "level": "tract",
                "zip": zipCode,
                "variables": [
                    "population",
                    "population_white_alone",
                    "population_black_alone",
                    "population_asian_alone",
                    "population_hispanic_origin",
                    "income_per_capita",
                    "age"
                ]}

                censusModule.APIRequest(request, function (response) {
                        callback(response.data[0]);
                    });
        }

        function rankIncome(userRankingPreference, importance, data, callback) {
            var trueIncome = data.income_per_capita;
            var rank;

            if (trueIncome <=  12000) {
                rank = 0;
            }
            else if (trueIncome <= 30000 && trueIncome > 12000) {
                rank = 1;
            }
            else if (trueIncome <= 55000 && trueIncome > 30000) {
                rank = 2;
            }
            else if (trueIncome <= 80000 && trueIncome > 55000) {
                rank = 3;
            }
            else {
                rank = 4;
            }

            var finalRank = Math.abs(4 - Math.abs(rank - userRankingPreference));
            callback(finalRank * importance, 4* userRankingPreference);
        }

        function rankPopulation(userRankingPreference, importance, data, callback) {
            var truePopulation = data.population;
            var rank;

            if (truePopulation <=  2000) {
                rank = 0;
            }
            else if (truePopulation <= 3000 && truePopulation > 2000) {
                rank = 1;
            }
            else if (truePopulation <= 4500 && truePopulation > 3000) {
                rank = 2;
            }
            else if (truePopulation < 5500 && truePopulation > 4500) {
                rank = 3;
            }
            else {
                rank = 4;
            }

            var finalRank = Math.abs(4 - Math.abs(rank - userRankingPreference));
            callback(finalRank * importance, 4*userRankingPreference);
        }

        function rankAgeRange(userRankingPreference, importance, data, callback) {
            var trueAgeRange = data.age;
            var rank;

            if (trueAgeRange <=  25) {
                rank = 0;
            }
            else if (trueAgeRange < 33 && trueAgeRange > 25) {
                rank = 1;
            }
            else if (trueAgeRange < 43 && trueAgeRange >= 33) {
                rank = 2;
            }
            else if (trueAgeRange <= 43 && trueAgeRange >= 55) {
                rank = 3;
            }
            else {
                rank = 4;
            }

            var finalRank = Math.abs(4 - Math.abs(rank - userRankingPreference));
            callback(finalRank * importance, 4*userRankingPreference);
        }

