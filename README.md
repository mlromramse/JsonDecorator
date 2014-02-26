# JsonDecorator

The Json Decorator is a small node js application that uses HandleBars templates to decorate Json data.

Uniformed Json can be decorated using the build in recursive feature.

## Decorate recursive json structure recursively

This project was first made to be able to navigate through a hierarcy of similar json objects. For me it was necessary to quickly get an overview of the views in an android application which created it's views dynamically. To make some sense of this I have made a json that describes a company's division hierarchy.

    {
    	"name": "division name"
    	"divisions": [
    	   ...array of similar objects...
    	]
    }

In this projects resources/division folder there is a sample json called data.json that has this structure.

The benefits of the recursive strategy become clear when you can populate a large ul structure with this small HandleBars code:

	{{name}}
	<ul>
	{{#divisions}}
		<li>{{{recursive "toHtml.hbs"}}}</li>
	{{/divisions}}
	</ul>

This file is called toHtml.hbs and uses itself to recursively drill down in the json data file.


### Running the above sample

You can transform the json to an hierarchy of unordered lists by executing this command.

	node app/recursiveJsonDecorator.js resources/division/data.json resources/division/toHtml.hbs > target/result.html

