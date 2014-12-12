'use strict';

angular.module('dreamCatcherApp')
  .directive('categorychart', function () {
	return {

		templateUrl: 'app/directives/categorychart/categorychart.html',

		restrict: 'E',
		
		scope:{},
		
		controller: function($scope, dreamFactory){
			
			var colors = ["#397B31","#482915","#C77846","#4BC73C","#4A4488"];
			var colorIndex = 0;
			
			dreamFactory.getDreams().then(function(dreams){
				var categories = {};
				var names = [];
				for(var index in dreams){
					if(categories[dreams[index].category]){
						categories[dreams[index].category] = categories[dreams[index].category] + 1;
					}
					else{
						names.push(dreams[index].category);
						categories[dreams[index].category] = 1;
					}
				}
				var content = [];
				for(var index in names){
					content.push({
						"label": names[index],
						"value": categories[names[index]],
						"color": colors[colorIndex % colors.length]
					});
					colorIndex++;
				}
				$scope.chart = new d3pie("categorychart", {
					"footer": {
						"color": "#999999",
						"fontSize": 10,
						"font": "open sans",
						"location": "bottom-left"
					},
					"size": {
						"canvasWidth": 500,
						"pieOuterRadius": 140
					},
					"data": {
						"sortOrder": "value-desc",
						"content": content
					},
					"labels": {
						"outer": {
							"format": "label",
							"pieDistance": 10
						},
						"inner": {
							"format": "value",
							"hideWhenLessThanPercentage": 3
						},
						"mainLabel": {
							"color": "#000000",
							"fontSize": 18
						},
						"percentage": {
							"color": "#ffffff",
							"decimalPlaces": 0
						},
						"value": {
							"color": "#ffffff",
							"fontSize": 18
						},
						"lines": {
							"enabled": false
						},
						"truncation": {
							"enabled": true,
							"length": 10
						}
					}/*,
					"effects": {
						"pullOutSegmentOnClick": {
							"effect": "linear",
							"speed": 400,
							"size": 8
						}
					}*/
				});
			});
			
		}

		//link: function (scope, element, attrs) {
		//}
	};
});