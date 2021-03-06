require("dotenv").config();

var request = require("request");
var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var fs = require("fs");
var axios = require("axios");


// Variable being used for terminal input
var liriArg = process.argv[2];
//terminal commands
if (liriArg === "spotify-this-song") {
    song();
} else if (liriArg === "movie-this") {
    movie();
} else if (liriArg === "do-what-it-says") {
    userSearch();
} else if (liriArg === "concert-this") {
    concertSearch();
} else {
    console.log("Please enter one of the following commands: spotify-this-song, movie-this, do-what-it-says. concert-this");
}

//Function to show movie data
function movie() {

    var argm = process.argv;

    var movieName = "";

    for (i = 3; i < argm.length; i++) {
        if(i > 3 && i < argm.length) {
            movieName = movieName + "+" + argm[i];
        } else {
            movieName = argm[i];
        }
    };


    //Run a request to OMDB API
    var queryUrl = "https://www.omdbapi.com/?apikey=trilogy&t=" + movieName + "&plot=short&r=json"; 

    request(queryUrl, function (error, response){

        if (!error, response, queryUrl) {
            console.log("---------------");
            console.log(JSON.parse(response.body).Title);
            console.log(JSON.parse(response.body).Year);
            console.log(JSON.parse(response.body).Actors);
            console.log(JSON.parse(response.body).Country);
            console.log(JSON.parse(response.body).Language);
            console.log(JSON.parse(response.body).imdbRating);
            console.log(JSON.parse(response.body).Plot);
            console.log("---------------");
        } else {
            console.log("you messed up!");
        }
    });
};

//Function to show Spotify data
function song() {

    var nSpotify = new spotify(keys.spotify);
    var argmt = process.argv;
    var songName = "";

    for(i = 3; i < argmt.length; i++) {
        if (i > 3 && i < argmt.length) {
            songName = songName + " " + argmt[i];
        } else {
            songName = argmt[i];
        }
    };
    console.log(songName);

    if(argmt.length < 4) {
        songName = "The Zephyr Song"
        process.argmt[3] = songName;
    }
    // console.log(songName);

    nSpotify.search({
        type: "track",
        query: songName,
        limit: 1
    }, function (err, data) {
        if (err) {
            console.log("you messed up: " + err);
            return;
        }
        console.log("---------------");
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Preview link: " +data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("---------------");
    });
};

// Random FS Function

function userSearch() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var data = data.split(',');
        if (data[0] === "spotify-this-song") {
            process.argv[3] = data[1];
            song();
        }
    })
};

// Concert-this function

function concertSearch(artistName) {
    fs.appendFile("log.txt", "concert-this " + artistName + `\n`, err => {});
    artistName = artistName;

    axios({
        method: "get",
        url: `https://rest.bandsintown.com/artists/${artistName}/events?app_id=codingbootcamp`,
        responseType: "json"
    }).then(response => {
        //console.log(response.data);
        var i = 0;

        for (let event of response.data) {
            console.log("---------------");
            fs.appendFile(
                "log.txt",
                `---------------` + `\n`,
                err => {}
            )
            try {
                console.log(`Venue Name: ${event.venue.name}`);
                fs.appendFile(
                    "log.txt",
                    `Venue Name: ${event.venue.name}` + `\n`,
                    err => {}

                );
            }catch{
                console.log("Cannot find upcoming concerts");
                break;
            }

            console.log(`Venue location: ${event.venue.city}`);
            fs.appendFile(
                "log.txt",
                `Venue location: ${event.venue.city}` + `\n`,
                err => {}
            );

            console.log(`Date: ${event.datetime}`);
            fs.appendFile(
                "log.txt",
                `Date: ${event.datetime}` + `\n`,
                err => {}
            )

            console.log("---------------");
            fs.appendFile(
                "log.txt",
                `---------------` + `\n`,
                err => {}
            );

            i++;
            if (i > 9) break;
        }

    })
};