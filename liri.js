require("dotenv").config();

var request = require("request");
var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var fs = require("fs")
console.log(keys)
// Variable being used for terminal input
var liriArg = process.argv[2];
//terminal commands
if (liriArg === "spotify-this-song") {
    song();
} else if (liriArg === "movie-this") {
    movie();
} else if (liriArg === "do-what-it-says") {
    userSearch();
} else {
    console.log("Please enter one of the following commands: spotify-this-song, movie-this, do-what-it-says.");
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
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&yplot=short&r=json&tomatoes=true"; 

    request(queryUrl, function (error, response, body){
        if (!error && response.statusCode === 200) {
            console.log("----------------");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " +JSON.parse(body).Country);
            console.log("Language: " +JSON.parse(body).Language);
            console.log("Plot: " +JSON.parse(body).Plot);
            console.log("Actors: " +JSON.parse(body).Actors);
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
    console.log(songName);

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

//Random FS Function

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