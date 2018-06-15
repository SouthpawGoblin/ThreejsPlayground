"use strict";

var app = angular.module('app', []);

app.service('DemoService', [function() {

    this.demos = [
        {name: 'Basic', class: window.DEMOS.Basic, desc: '基本几何体展示'},
        {name: 'OrbitControls', class: window.DEMOS.OrbitControls, desc: '鼠标视野控制。左键拖拽：旋转；滚轮：调整远近；右键拖拽：平移'},
        {name: 'LightAndMaterial', class: window.DEMOS.LightAndMaterial, desc: '光源及材质效果展示'},
        {name: 'Particles', class: window.DEMOS.Particles, desc: '粒子系统展示'},
        {name: 'HoverAndSelect', class: window.DEMOS.HoverAndSelect, desc: '鼠标交互功能：悬浮及点击'},
        {name: 'TweenAnimation', class: window.DEMOS.TweenAnimation, desc: '简易动画演示'},
        {name: 'Physics', class: window.DEMOS.Physics, desc: '物理引擎演示'}
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
        template: '<span style="display: inline-block;padding: 3px;position: absolute;right: 0;bottom: 0;background-color: #ffffff;color: #000000;">{{demo.desc}}</span>',
        link: function (scope, element, attrs) {

            scope.demo = null;
            scope.demoInstance = null;

            scope.$on('demoChanged', function(event, demo) {

                scope.demo = demo;

                scope.demoInstance && scope.demoInstance.dispose();

                scope.demoInstance = new demo.class();
                scope.demoInstance.init(element[0]);
                scope.demoInstance.showGUI();
                scope.demoInstance.render();
            })
        }
    };
});