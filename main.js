var Request = require('request');
var Cheerio = require('cheerio');
var sys = require('sys')

var argv = require('optimist').argv;

function wget(dir, url, filename) {
  var cmd = 'cd ' + dir + ' && wget ' + url;

  require('child_process').exec(cmd, function (error, stdout, stderr) {
    console.log('WGET-ting ' + filename + ' using the Shell :).');
  });
}

Request(argv.url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('Successful request!');
    $ = Cheerio.load(body);

    $('a').each(function(i, item) {
      if (i > 0) {
        var filename = $(this).text().trim();
        var url = (argv.url + $(this).attr('href')).trim();
        
        // We are shell-scripting: calling to Bash is allowed!
        wget(argv.dir, url, filename);
      }
    });
  } else {
    console.log('Request failed');
    console.log('Status Code: ' + response.statusCode.toString());
    if (error) console.log(error);
  }
});
