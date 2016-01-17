/* global angular */
/* global _ */
'use strict';

var apiUrl = "https://tabsontallahassee.com/api/";
var apiKeyParam = "apikey=463fd406-feed-4c0d-9ab7-c928d8c0b125";

var fetch = function($http, requestUrl, success) {
    $http.get(requestUrl)
     .then(
         success, 
         function(error) { 
             console.log("error",error); 
         });
  }
  
  
window.calculateBar = function (num, total) {
    console.log(num, total);
    return num + 'px';
}

angular.module('myApp', [])
  .controller('appController', ['$scope', '$http', appController])
    .controller('voteController', ['$scope', '$http', voteController])
    .controller('voteDetailController', ['$scope', '$http', voteDetailController]);
  

function appController($scope, $http) {
    
    var fieldids = "fields=sources,title,subject"
      
      fetch($http, apiUrl + 'bills/?' + fieldids + '&' + apiKeyParam, function (result) {
          $scope.bills = result.data.data;
          $scope.meta = result.data.meta;
      });
      
      fetch($http, apiUrl + 'organizations/?' + apiKeyParam, function (result) {
          $scope.organizations = result.data.data;
      });
      
      $scope.prev = function () {
          var newpage = $scope.meta.pagination.page - 1;
          fetch($http, apiUrl + 'bills/?page=' + newpage + "&" + fieldids + '&' + apiKeyParam, function (result) {
              $scope.bills = result.data.data;
              $scope.meta = result.data.meta;
          });
      }
      
      $scope.next = function () {
          var newpage = $scope.meta.pagination.page + 1;
          fetch($http, apiUrl + 'bills/?page=' + newpage + "&" + fieldids + '&' + apiKeyParam, function (result) {
              $scope.bills = result.data.data;
              $scope.meta = result.data.meta;
          });
      }
    }
    
function voteController($scope, $http) {
    

        fetch($http, apiUrl + 'votes/?bill=' + $scope.bill.id + '&fields=counts,start_date,organization,motion_text,result&' + apiKeyParam,
            function(result) {
                $scope.votes = result.data.data;
            });
            
    }
    
function voteDetailController($scope, $http) {
        
        var orgId = $scope.vote.relationships.organization.data.id;
        $scope.organization = _.find($scope.organizations, ['id', orgId])

        var total = _.sumBy($scope.vote.attributes.counts, 'value');
        
        $scope.voteTotals = {};
        $scope.votePercentages = {};
        
        angular.forEach($scope.vote.attributes.counts, function (voteSegment) {
            $scope.voteTotals[voteSegment.option] = voteSegment.value;
            $scope.votePercentages[voteSegment.option] = _.round((voteSegment.value / total) * 100) + '%';
        });

    }