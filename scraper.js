var fs = require('fs');
var path = require('path');
var url = require('url');

var request = require('request');
var cheerio = require('cheerio');

var $;

if (process.argv.length !== 4) {
	console.log("Usage: node scraper <target url> <csv file>");
	return;
}

var target = process.argv[2];
var file = process.argv[3];

var parsedTarget = url.parse(target);
var root = parsedTarget.protocol + "//" + parsedTarget.host;

function scrape(targetUrl, callback){
	request(targetUrl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = cheerio.load(body);
			var rows = $('table').find('tr');

			rows.each(function(){
				var row = $(this);
				var permissions = row.find('code').first().text();
				var linkUrl = row.find('a').prop('href');
				var extension = path.extname(row.find('a').text());

				if (linkUrl.match(/\.\./)) return;

				if (extension) {
					var csvRow = [permissions, root + linkUrl, extension].join(",");
					fs.appendFileSync(file, csvRow + "\n");
				} else {
					scrape(root + linkUrl);
				}
			});
		}
	});
}

console.log("Searching for all files in " + target);
scrape(target);
console.log("Done!\nFile information saved in " + file);