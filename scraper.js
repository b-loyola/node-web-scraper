var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');

var $;

var target = 'http://substack.net/images/';
var file = 'test.csv';

var root = path.dirname(target);

function scrape(url, callback){
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = cheerio.load(body);
			var rows = $('table').find('tr');

			rows.each(function(i, elem){
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

console.log("Searching for all files in " + root);
scrape(target);
console.log("Done! File information saved in " + file);