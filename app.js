const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

let getTopJoke = function (req, res) {
    var json = { score: "", title: "Sorry! Something went wrong :(", description: "" };
    topPostsURL = 'https://old.reddit.com/r/Jokes/top/';

    request(topPostsURL, function (error, response, html) {
        if (!error) {
            let $ = cheerio.load(html);
            let topPostUrl = 'https://old.reddit.com' + $('.top-matter').first().children().first().children().first().attr('href');

            request(topPostUrl, function (error, response, html) {
                if (!error) {
                    let $ = cheerio.load(html);

                    json.score = $('.sitetable').first()
                        .find('.score').eq(1).text();

                    json.title = $('.top-matter').first()
                        .children().first()
                        .children().first().text();

                    json.description = $('.expando').first()
                        .children().first()
                        .children().eq(1)
                        .children().first().map(
                            (index, domElement) => $(domElement).text()
                        ).get().join('\n');

                    res.json(json);
                }
            });
        }
    });
}

app.get('/', getTopJoke);
app.listen('8080');



