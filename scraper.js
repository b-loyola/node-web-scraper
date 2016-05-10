var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var $;

function scrape(url, callback){
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = cheerio.load(body);
			var rows = $('table').find('tr');

			rows.each(function(i, elem){
				var row = $(this);
				var permissions = row.find('code').first().text();
				var linkUrl = row.find('a').text();
				var extension = row.find('a').text().match(/\.[a-z]+/i);

				if (linkUrl.match(/\.\./)){

				} else if (extension) {
					console.log("File: " + permissions + " " + url + linkUrl + " " + extension);
				} else {
					console.log("Link: " + url + linkUrl);
					scrape(url + linkUrl);
				}
			});
		}
	});
}

scrape('http://substack.net/images/');