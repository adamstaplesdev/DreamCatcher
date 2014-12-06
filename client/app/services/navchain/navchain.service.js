'use strict';

angular.module('dreamCatcherApp')
  .factory('navchain', ['dreamFactory', 'goalFactory' ,function (dreamFactory, goalFactory) {
	// Service logic
	// ...
	
	var chain = {
		top:{
			type: null,
			data: null,
			parent: null
		}
	}
	
	//HOW DO I INITIALIZE THE DATA FROM THE SERVER?
	//HOW DO I BIND TO THE selectedItem IN MY SIDENAV DIRECTIVE?
		//Breadcrumbs also needs to bind to the whole chain.
	
	// Public API here
	return {
		forward: function (id) {
			if(chain.top.type === 'user'){
				//TODO: Add this here once users have been defined
			}
			else if(chain.top.type === 'dream'){
				var dream = top.data;
				for(var goal in dream.subgoals){
					if(goal._id === id){
						goalFactory.getGoal(id).then(function(goal){
							var newTop = {
								type:'goal',
								data: goal,
								parent: chain.top
							}
							chain.top = newTop;
							//TODO: MAKE SURE TO DO ROUTING
						});
					}
				}
			}
			else if(chain.top.type === 'goal'){
				var goal = top.data;
				for(var goal in goal.subgoals){
					if(goal._id === id){
						goalFactory.getGoal(id).then(function(goal){
							var newTop = {
								type:'goal',
								data: goal,
								parent: chain.top
							}
							chain.top = newTop;
							//TODO: MAKE SURE TO DO ROUTING
						});
					}
				}
			}
			else{
				console.log('Forward: Type not recognized');
			}
			//Use this method to go deeper in the chain
			//Ensure that the id is actually one of the children
			//of the last item in the chain
			//Get the item with the specified ID from the server
			//Append the item to the end of the chain
			//Set selected Item and Type to the last element in the chain
			
			//WOULD MOVING FROM HOME INTO A DREAM REQUIRE PAGE ROUTING?
		},
		
		back: function(){
			if(chain.top.parent != null){
				chain.top = chain.top.parent;
				//TODO: MAKE SURE TO DO ROUTING
			}
			else{
				console.log('Already at the top of the chain');
			}
			//Use this method to go back a level in the chain
			//Remove last element from the chain
			//Set selected Item and Type to the last element in the chain
		},
		
		jump: function(numSteps){
			for(var i = 0; i < numSteps; i++){
				if(chain.top.parent != null){
					chain.top = chain.top.parent;
					//TODO: MAKE SURE TO DO ROUTING
				}
			}
			//Use this method to go back multiple steps
			//0 steps: stay put
			//1 or more steps: go back that many steps
			//if numSteps > chain.length, go to level of user home page
			
			//Simply remove the specified number of items from the chain.
			//Reset selected Item and Type to the end of the chain.
		}
		/*//May not be needed
		getSelectedChildren: function(){
			//RETURNS AN ARRAY OF SUBGOALS
			//Do we want to return the actual subGoals,
			//or just the names and id's (which are already stored in selectedItem)
			//Getting actual children would be helpful for Timeline
		}
		*/
	};
}]);
