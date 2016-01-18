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
                console.log("error", error);
            });
}

angular.module('myApp', [])
    .controller('appController', ['$scope', '$http', appController])
    .controller('voteController', ['$scope', '$http', voteController])
    .controller('voteDetailController', ['$scope', '$http', voteDetailController]);


function appController($scope, $http) {

    var fieldids = "fields=sources,title,subject,actions"

    var fetchBills = function(page) {
        fetch($http, apiUrl + 'bills/?page=' + page + "&" + fieldids + '&' + apiKeyParam, function(result) {
            $scope.bills = result.data.data;
            $scope.meta = result.data.meta;
        });
    }

    fetchBills(1);

    fetch($http, apiUrl + 'organizations/?' + apiKeyParam, function(result) {
        $scope.organizations = result.data.data;
    });

    $scope.prev = function() {
        fetchBills($scope.meta.pagination.page - 1);
    }

    $scope.next = function() {
        fetchBills($scope.meta.pagination.page + 1);
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

    angular.forEach($scope.vote.attributes.counts, function(voteSegment) {
        $scope.voteTotals[voteSegment.option] = voteSegment.value;
        $scope.votePercentages[voteSegment.option] = _.round((voteSegment.value / total) * 100) + '%';
    });

}