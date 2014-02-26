var fs 			= require('fs');
var http		= require('http');
var path		= require('path');
var handlebars	= require('handlebars');

if (process.argv.length < 4) {
	console.log("usage:    node " + path.basename(__filename) + " your.json yourBaseTemplate.hbs");
	console.log("");
	console.log("               your.json                Any json file.");
	console.log("               yourBaseTemplate.hbs     This is your base handlebars template that");
	console.log("                                        creates the base structure of your result");
	console.log("                                        file.");
	console.log("");
	console.log("          The " + path.basename(__filename) + " is prepared to handle recursions and has a ");
	console.log("          helper called 'recursive' that takes a handlebars template filename as");
	console.log("          parameter.")
	console.log("          Several templates can be used to handle different recursive strategies.");
	process.exit(1);
}

var jsonDir = path.resolve(path.dirname(process.argv[2])) + "/";
var jsonFile = process.argv[2].indexOf('://')==-1 ? "file://" + path.resolve(process.argv[2]) : process.argv[2];
var templateDir = path.resolve(path.dirname(process.argv[3])) + "/";
var templateFile = path.resolve(process.argv[3]);

var templates = {};

var getJsonFile = function(filename, callback) {
	if (filename.indexOf('file://')==0) {
		var json = JSON.parse(fs.readFileSync(filename.substring(7), 'utf8'));
		callback(json);
	} else {
		http.get(filename, function(res) {
			res.setEncoding('utf8');
			var json = '';
			res.on('data', function(chunk) {
				json += chunk;
			});
			res.on('end', function() {
				callback(JSON.parse(json));
			});
		}).on('error', function(e) {
			console.log(e.message);
		});
	}
}

var getTemplate = function(templateFile) {
	if (templates[templateFile] == undefined) {
		var templateFile = fs.readFileSync(templateFile, "utf8");
		var template = handlebars.compile(templateFile.toString());
		templates[templateFile] = template;
	}
	return templates[templateFile];
}

getJsonFile(jsonFile, function(json) {
	if (json.length !== undefined) {
		var tmp = {objects: json};
		json = tmp;
	}
	fs.readFile(templateFile, function(error, templateMarkup) {
		if (templateMarkup) {
			handlebars.registerHelper('recursive', function(templateFile) {
				var template = getTemplate(templateDir + templateFile);
				return template(this);
			});

			var pageBuilder = handlebars.compile(templateMarkup.toString());

			console.log(pageBuilder(json));
		}
	});
});

