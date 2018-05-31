"use strict";

var app = angular.module('app', []);

app.service('DemoService', [function() {

    this.demos = [
        {name: 'Basic', class: window.DEMOS.Basic},
        {name: 'OrbitControls', class: window.DEMOS.OrbitControls},
        {name: 'SpotLight', class: window.DEMOS.SpotLight}
    ];

}]);

app.controller('MainCtrl', ['$scope', '$timeout', 'DemoService', function($scope, $timeout, DemoService) {

    $scope.availableDemos = DemoService.demos;
    $scope.selectedDemo = $scope.availableDemos[0];

    $scope.selectDemo = function(demo) {
        $('#demo-list').find('a').removeClass('active');
        $('#demo-' + demo.name).addClass('active');

        $scope.selectedDemo = demo;
        $scope.$broadcast('demoChanged', $scope.selectedDemo);
    };

    $timeout(function() {
        $scope.selectDemo($scope.availableDemos[0]);
    });

}]);

app.directive('demo', function() {
    return {
        restrict: "A",
        scope: {},
        link: function (scope, element, attrs) {

            scope.demo = null;

            scope.$on('demoChanged', function(event, demo) {

                scope.demo && scope.demo.dispose();

                scope.demo = new demo.class();
                scope.demo.init(element[0]);
                scope.demo.render();
            })
        }
    };
});