'use strict';

angular.module('dreamCatcherApp')
  .directive('categorychart', function () {
	return {

		templateUrl: 'app/directives/categorychart/categorychart.html',

		restrict: 'E',
		
		scope:{},
		
		controller: function($scope, dreamFactory){
			//CURRENTLY HARD CODED WITH A FEW CATEGORIES
			//See sample code at the bottom of the page
			//As soon as I can get this on the page, I'll work on getting dynamic categories.
			var colors = ["#57b813","#a1650a","#248838"];
			var colorIndex = 0;
			$scope.content = [];
			
			console.log(dreamFactory);
			dreamFactory.getUserCategories().then(function(categoryList){
				console.log('CATEGORY DATA:');
				console.log(categoryList);
				for(var categoryIndex in categoryList){
					$scope.content.push({
						"label": categoryList[categoryIndex],
						"value": 1,
						"color": colors[colorIndex % 3]
					});
					colorIndex++;
				}
				console.log($scope.content);
				$scope.chart = new d3pie("categorychart", {
					/*
					"header": {
						"title": {
							"text": "Categories",
							"fontSize": 24,
							"font": "open sans"
						}//,
						//"subtitle": {
							//"color": "#999999",
							//"fontSize": 12,
							//"font": "open sans"
						//},
						//"titleSubtitlePadding": 9
					},*/
					"footer": {
						"color": "#999999",
						"fontSize": 10,
						"font": "open sans",
						"location": "bottom-left"
					},
					"size": {
						"canvasWidth": 400
					},
					"data": {
						"sortOrder": "value-desc",
						"content": $scope.content
						/*[
							{
								"label": "Financial",
								"value": 4,
								"color": "#57b813"
							},
							{
								"label": "Spiritual",
								"value": 2,
								"color": "#a1650a"
							},
							{
								"label": "Health",
								"value": 5,
								"color": "#248838"
							}
						]*/
					},
					"labels": {
						"outer": {
							"format": "label",
							"pieDistance": 0
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
						}
					},
					"effects": {
						"pullOutSegmentOnClick": {
							"effect": "linear",
							"speed": 400,
							"size": 8
						}
					}
				});
			});
			//NOTE: getCategories only gets the names, not how many dreams have that category.
			
		}

		//link: function (scope, element, attrs) {
		//}
	};
});

/*
//SAMPLE CHART CODE
<div id="pieChart"></div>

<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.4/d3.min.js"></script>
<script src="d3pie.min.js"></script>
<script>
var pie = new d3pie("pieChart", {
	"header": {
		"title": {
			"text": "Categories",
			"fontSize": 24,
			"font": "open sans"
		},
		"subtitle": {
			"color": "#999999",
			"fontSize": 12,
			"font": "open sans"
		},
		"titleSubtitlePadding": 9
	},
	"footer": {
		"color": "#999999",
		"fontSize": 10,
		"font": "open sans",
		"location": "bottom-left"
	},
	"size": {
		"canvasWidth": 590
	},
	"data": {
		"sortOrder": "value-desc",
		"content": [
			{
				"label": "Financial:",
				"value": 4,
				"color": "#57b813"
			},
			{
				"label": "Spiritual:",
				"value": 2,
				"color": "#a1650a"
			},
			{
				"label": "Health:",
				"value": 5,
				"color": "#248838"
			}
		]
	},
	"labels": {
		"outer": {
			"format": "none",
			"pieDistance": 0
		},
		"inner": {
			"format": "label-value1",
			"hideWhenLessThanPercentage": 3
		},
		"mainLabel": {
			"color": "#ffffff",
			"fontSize": 18
		},
		"percentage": {
			"color": "#ffffff",
			"decimalPlaces": 0
		},
		"value": {
			"color": "#e9bfbf",
			"fontSize": 18
		},
		"lines": {
			"enabled": true
		}
	},
	"effects": {
		"pullOutSegmentOnClick": {
			"effect": "linear",
			"speed": 400,
			"size": 8
		}
	}
});
</script>

*/