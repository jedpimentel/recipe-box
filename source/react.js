/**
* I apologize if my code gives you a headache.
* I'm still learning how to even use React at all as I write this
* some of the stuff is stuck with gum, as refactoring would be impractical
*
*
*/

function RecipeDataItem(name, ingredients, directions) {
	this.name = name;
	this.ingredients = ingredients;
	this.directions = directions;
}


function hardReset() {
	if (confirm("Are you sure you want to undo all edits and return this app to its default information? This is meant for debugging/demo purposes and all edits will be lost.")) {
		localStorage.clear();
		location.reload();
	}
	
	
}

var IngredientList = React.createClass({
	render: function() {
		return (
			<div>
				ingredients
			</div>
		);
	} 
});

var RecipeDescription = React.createClass({
	render: function() {
		return (
		<div>
			<IngredientList />
			This is where the directions go
		</div>
		);
	}
});


// shown/unshown when clicking the recipe name
var RecipeDetails = React.createClass({
	render: function() {
		
		var test = this.props.recipe.directions;
		
		function stringToHTML(txt) {
			return txt.replace(/\n/g, '<br>');
		}
		
		var ingredientList = this.props.recipe.ingredients.map(function(entry, index) {
			return <li key={entry+" ingredient "+index+1}>{entry}</li>
		});
		return(
			<div className="recipe-details">
				<ul className="recipe-ingredients">
					{ingredientList}
				</ul>
				<div className="recipe-directions">
					<div rows='fit' type="text" dangerouslySetInnerHTML={{__html: stringToHTML(this.props.recipe.directions)}} />
				</div>
			</div>
		)  
	}
});

//small version, only shows the title
//is contained inside the RecipeBig version
var RecipeSmall = React.createClass({
	switchDisplaySize: function() {
		//switch between title line, and title line with details under it
		
		var currentDisplayType = this.props.rootElement.state.displayFormat;
		var newDisplayType = (currentDisplayType == 'minimized' )?'maximized' : 'minimized';
		this.props.rootElement.setDisplayType(newDisplayType);
	}, 
	render: function() {
		return (
			<div className="recipe-name" onClick={this.switchDisplaySize}> 
				<h2> {this.props.recipe.name} </h2>
			</div>
		)
	}
});

//big version, shows all the info
var RecipeBig = React.createClass({
	goToEditMode: function() {
		if (this.props.rootElement.props.editState() === false) {
			this.props.rootElement.setDisplayType('edit');
		} else {
			alert('please save or cancel any pending edits before editting another recipe. (the big blue button)');
		}
	},
	deleteRecipe: function() {
		this.props.rootElement.setDisplayType('delete');
	},
	confirmDelete: function() {
		function confirmDelete() {
			if(window.confirm("Are you sure you want to delete " + this.props.recipe.name + "?")) {
				this.deleteRecipe();
			} else {
				;
			}
		}
		setTimeout(confirmDelete.bind(this), 0);
	},
	render: function() {
		var thereIsAnActiveEditBox = this.props.rootElement.props.editState();
		var subduedButton = thereIsAnActiveEditBox? 'subdued-button' : 'button-edit';
		return (
			<div className="recipe" >
				<div className="recipe-name-bar" >
					<RecipeSmall recipe={this.props.recipe} rootElement={this.props.rootElement} />
					<div className="recipe-buttons">
						<button onClick={this.goToEditMode} className={subduedButton}>edit</button>
						<button onClick={this.confirmDelete} className='button-delete'>delete</button>
					</div>
				</div>
				<RecipeDetails recipe={this.props.recipe} />
			</div>
		);
	}
});

//edit version,
//used to create or edit a recipe, formatted similar to big version
//defaultRecipe 'defaultRecipe' needs to be replaced with a better solution.
//pending changes are saved in state, once changes are saved, the updated data is sent to the parent to be used as props
//props=saved state=notSaved
var RecipeEdit = React.createClass({
	getInitialState: function() {
		var initialStateRecipe = this.props.recipe;
		var initialIngredients = initialStateRecipe.ingredients.slice();
		
		return {
			'recipe': initialStateRecipe,
			'name': initialStateRecipe.name,
			'directions': initialStateRecipe.directions,
			'ingredients': initialIngredients,
		}
	},
	updateRecipeName: function(event) {
		this.setState({name: event.target.value})
	},
	updateRecipeDirections: function(event) {
		this.setState({directions: event.target.value})
	},
	updateIngredientItem: function(index) {
		return function(event) {
			var newIngredientState = this.state.ingredients;
			newIngredientState[index] = event.target.value;
			this.setState({ingredients: newIngredientState})
		}.bind(this)
	},
	removeIngredientItem: function(index) {
		return function() {
			var newIngredients = this.state.ingredients;
			
			newIngredients.splice(index, 1);
			if (newIngredients.length === 0) {
				// all recipes need at least one ingredient
				newIngredients.push('');
			}
			this.setState({ingredients: newIngredients})
		}.bind(this);
		
	},
	addIngredientItem: function() {
		var emptyIngredient = [''];
		this.setState({ingredients: this.state.ingredients.concat(emptyIngredient)})
		
	},
	transformToMaximized: function() {
		
		this.props.rootElement.props.editState(false);
		this.props.rootElement.setDisplayType('maximized');
	},
	cancelEdit: function() {		
		if (this.props.recipe.name !== '') {
			// recipe existed, revert to orinal values
			this.setState({
				// TODO: check these for unnecessary redundancy
				'recipe': this.props.recipe,
				'name': this.props.recipe.name,
				'directions': this.props.recipe.directions,
				'ingredients': this.state.recipe.ingredients,
			})
		} else {
			// recipe was a new "blank" recipe, identified by not having a name
			this.props.rootElement.setDisplayType('delete');
		}
		this.transformToMaximized();
	},
	saveEdit: function() {
		// validate that data exists
		// remove blank ingredient entries
		
		// update root's data
		var newRecipe = new RecipeDataItem(
			this.state.name.trim(),
			this.state.ingredients.slice(0).map(function(el, indx) {
				return el.trim()
			}).filter(function(el) {
				return (el !== '');
			}),
			this.state.directions.trim()
		);
		
		if (newRecipe.name.length === 0 || newRecipe.ingredients.length === 0 || newRecipe.directions.length === 0) {
			// there is blank data, recipe is invalid
			var alertText = "Please be check if you have the whole written down." + 	
				((newRecipe.name.length === 0)       ? "\nThe Recipe has no name." : "") +
				((newRecipe.ingredients.length === 0)? "\nThe recipe needs at least one ingredient." : "") +
				((newRecipe.directions.length === 0) ? "\nThe recipe needs instructions" : "");
			alert(alertText);
			return;
		}
		this.props.rootElement.props.updateRecipeData(newRecipe);
		this.transformToMaximized();
	},
	render: function() {
		// value from 'props' was the saved/original value, value in 'state' is the unsaved value
		var recipeName = this.props.recipe.name;
		var removeIngredientItem = this.removeIngredientItem;
		var updateIngredientItem = this.updateIngredientItem;
		var ingredientChildren = this.state.ingredients.map(function(item, index) {
			var keyName = recipeName + index;
			return (
				<div key={keyName} index={index} >
					<input className={'edit-ingreient'} placeholder="ENTER INGREDIENT" type="text" name={"recipe-ingredient-"+index} value={item} onChange={updateIngredientItem(index)} />
					<button className={'button-ingredient-delete'} type="button" onClick={removeIngredientItem(index)} ingredientIndex={index}>delete</button>
				</div>
			);
		});
		// the return structure shares  a lot fot he same classes that are used to format a mazimized view
		return (
			<form id="edit-form" className="recipe" >
				<h2 className="no-padding no-margin">Edit Recipe!</h2>
				<div className="edit-recipe-title">
					<div className="edit-recipe-title-instructions">RECIPE NAME:</div> 
					<input className="edit-recipe-title-field" placeholder="ENTER RECIPE NAME" type="text" name="recipe-name" value={this.state.name} onChange={this.updateRecipeName} />
				</div>
				<div className="recipe-details">
					<div className="recipe-ingredients">
						<div>RECIPE INGREDIENTS</div>
						<div>
							{ingredientChildren}
							<button className={'button-ingredient-new'} type="button" onClick={this.addIngredientItem}>new ingredient</button> 
						</div>
					</div>{/* .recipe-ingredients end */}
					<div className="recipe-directions">
						<div>RECIPE DIRECTIONS</div>
						<textarea className={"recipe-directions-edit"} placeholder="ENTER PREPERATION INSTRUCTIONS" type={"text"} name={"recipe-directions"} value={this.state.directions} onChange={this.updateRecipeDirections} />
					</div>{/* .recipe-directions end */}
				</div>{/* .recipe-details end */}
				<br />
				<button className="chunky-button button-save" type="button" onClick={this.saveEdit}>save</button>
				<button className="chunky-button button-cancel" type="button" onClick={this.cancelEdit}>cancel</button>
			</form>
		);
	}
})

//contains all possible states of a single recipe
// DISPLAY FORMAT LEGEND: 
// 'minimized' : only entry name is shown
// 'maximized' : entre is shown completely
// 'edit' : can edit or delete the entry
var RecipeItem = React.createClass({
	getInitialState: function() {
		//console.log('rendering container', this.props.recipe); 
		var displayFormat;
		if (this.props.recipe === undefined) {
			displayFormat = 'edit';
		} else {
			displayFormat = 'minimized';
		}
		
		return {
			// the `delete` display format isn't a real view, instead it's used as part of the rube goldberg machine that deletes recipes
			validDisplayFormats: ['minimized', 'maximized', 'edit', 'delete'],
			displayFormat: displayFormat,
			// recipe: recipeData,
		}
	},
	setDisplayType: function(type) {
		if (this.state.validDisplayFormats.indexOf(type) === -1) {
			console.log(type, 'is not a valid display format, must be one of', this.sate.validdisplayFormats);
			return;
		}
		if (type === 'delete') {
			this.props.updateRecipeData('delete');
			return;
		}
		this.setState({displayFormat: type});
		if (type === 'edit') {
			this.props.editState(true);
		}
	},
	render: function() {
		// I has used 'state' instead of 'prop' when sending values to the recepies, this caused a huge bug where the ingredient list sizes wheren't updated when a list item was added or removed, even though text changes had no issue. Then I couldn't add new recipies until I reverted <RecipeEdit> to use state. But then starting a second edit in a same version reverted the first edit's changes, apparently since it was keeping the previous state. ended up moving them all to use props, moving the blank recipe here instead of inside the RecipeEdit
		var blankRecipe = new RecipeDataItem('', ['', '', ''], '');
		var recipe = (this.props.recipe !== undefined)? this.props.recipe : blankRecipe;
		var formatType = this.state.displayFormat;
		if (formatType === 'minimized') {
			return <RecipeSmall recipe={recipe} rootElement={this} />
		}
		if (formatType === 'maximized') {
			return <RecipeBig recipe={recipe} rootElement={this} />
		}
		if (formatType === 'edit') {
			return <RecipeEdit recipe={recipe} rootElement={this} updateRecipeData={this.props.updateRecipeData} />
		} 
		
		console.log("unrecognized displayState, please check possible RecipeItem state names");
		return (
			<RecipeBig recipe={recipe} />
		);
	}
});

var RecipeContainer = React.createClass({
	getInitialState: function() {
		
		var recipeData = [];
		if(localStorage.getItem('recipe data') !== null){
			// local storage exists
			recipeData = JSON.parse(localStorage.getItem('recipe data'));
		} else {
			// load the default recipes
			recipeData.push(new RecipeDataItem(
				'Creamy Tomato Spaghetti', 
				[
					'Back bacon' , 
					'Zucchini', 
					'Mushrooms',
					'Spaghetti',
					'Olives',
					'Parsley'
				], 
				"1. Slice the bacon into 1-2cm squares and fry them. Set aside.\n\n2. Boil the spaghetti until al dente.\n\n3. Using the remaining fat from the bacon, add some oil if necessary to fry the mushrooms and zucchini. You know it's done when the mushroom turns colour. Add olives  and 2 T of spaghetti water. \n\n4. Mix the sour cream and tomato sauce in a small bowl and pour the mixture into the pan. Mix it in.\n\n5. When the pasta is done, drain it well and add to the pan. Mix well.\n\n6. Serve and top with the bacon and some parsley."
			));
			recipeData.push(new RecipeDataItem(
				'Fried Plaintains', 
				[
					'1 quart oil', 
					'2 ripe plantiains'
				], 
				'Preheat oil in in a skillet or frying pan.\n\nPeel the plantains and cut them in half. Slice the halves lengthwise into thin pieces.\n\nFry the pieces until browned and tender. Drain excell oil.'
			));
			recipeData.push(new RecipeDataItem(
				'White Rice', 
				[
					'1 cup long-grain white rice', 
					'1/2 teaspoon salt'
				], 
				'1.Bring 1 1/2 cups water to a boil in a medium saucepan. Stir in rice and salt and return to a boil over medium-high heat.\n\n2.Reduce heat to a simmer, cover, and cook until rice is tender and has absorbed all the liquid, 16 to 18 minutes (check only toward the end of cooking time). The rice should be studded with craters, or steam holes, when it is ready.\n\n3.Remove from heat and let steam, covered, for 10 minutes. Then fluff with a fork and serve.'
			));
			
			localStorage.setItem('recipe data', JSON.stringify(recipeData));
		}
		
		return {
			recipeData: recipeData,
			editState: false,
		} 
	},
	editState: function(bool) {
		//set or check if any recipe is currently being editted
		//only one recipe should be editted at a time, since the current save button would write every recipe string into local storage
		if (arguments.length === 0) {
			return this.state.editState;
		} else {
			this.setState({editState: bool})
		}
	},
	updateRecipeData: function(index) {
		return function(recipe) {
			var newData = this.state.recipeData.slice(0);
			if (recipe === 'delete') {
				// replacing the recipe data with a 'delete' string means use clicked the 'delete' button
				newData = newData.filter(function(el, indx, arr) {return indx !== index});
			} else {
				newData[index] = recipe;
			}
			this.setState({recipeData: newData})
			localStorage.setItem('recipe data', JSON.stringify(newData));
		}.bind(this)
	},
	newBlankRecipe: function() {
		var newRecipeState = this.state.recipeData.slice(0);
		var blankRecipe = undefined;
		newRecipeState.push(blankRecipe);
		this.editState(true);
		this.setState({recipeData: newRecipeState}); 
	},
	render: function() {
		var editState = this.editState;
		var updateFunction = this.updateRecipeData;
		var recipeEntries = this.state.recipeData.map(function(entry, index) {
			var keyValue = (entry === undefined)? "newRecipe" : entry.name; 
			//console.log('rendering', entry);
			return (
				<RecipeItem recipe={entry} key={keyValue} updateRecipeData={updateFunction(index)} editState={editState} />
			);
		});
		var newRecipeButton;
		if (this.editState() === false) {
			newRecipeButton = <button onClick={this.newBlankRecipe} id={"button-add-new"} >ADD NEW</button>
		}
		return (
			<div>
				{recipeEntries}
				{newRecipeButton}
				<button onClick={hardReset} id={'button-reset-app'} >Reset App</button>
			</div>
			
		);
	}
}); 

var RecipeApp = React.createClass({
	render: function() {
		return (
			<div>
				<h1>Recipes!</h1>
				<RecipeContainer />
			</div>
		);
	}
	
})

ReactDOM.render(
	<RecipeApp />,
	document.getElementById('main')
);


function goBoopBeep() {
	console.log(['boop', 'beep'][Math.floor(Math.random() * 2 )]);
}