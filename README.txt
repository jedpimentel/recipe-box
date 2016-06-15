Testing SASS/React
Originally created as part of the freecodecamp.com curriculum.
https://www.freecodecamp.com/challenges/build-a-recipe-box



note to self: 

npm install babel-preset-es2015 babel-preset-react


start /b sass --watch source:public & ^
start /b babel --presets es2015,react --watch source/ --out-dir public/  & ^
start /b http-server ./

todo:
	restrict/handle recipes with same name
	restrict editting mode to only allow one recipe to be editted at a time
	add "are you sure you want to quit before saving?" text
	add "are you sure you want to delete recipe?" text
	keep the hard reset button, but move it to the bottom of the screen and use a confirmation that everything will be deleted
	
	
nice to haves:
	ability to change order of ingredient items, maybe a click and drag
	A better way to minimize/maximize recipes. Clicking the name bars feels weird compared to normal UIs.

stuff to look out for:
	forgot about .bind() for a while, some of the code would be better off with .bind() than it's current state.
	
	
