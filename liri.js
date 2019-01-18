// liri.js can take following commands:
// spotify-this-song <any song>
// concert-this <any concert/band>
// movie-this <any movie>
// do-what-it-says (node liri.js <ask anything>)

// Dependencies
require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var request = require("request");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);


// Function for running a Spotify search
var songData = function(songName) {
  if (songName === undefined) {
    songName = " ";
  }

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;
      var artistNames = function(artist) {
        return artist.name;
      };

      for (var i = 0; i < songs.length; i++) {
        console.log("-----------------------------------");  
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(artistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};

// Function for running a Concert Search
var concertInfo = function(artist) {
    var url= "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
    request(url, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
  
        if (!jsonData.length) {
          console.log("No results found for " + artist);
          return;
        }
        console.log("Upcoming concerts for " + artist + ":");

          for (var i = 0; i < jsonData.length; i++) {
          var show = jsonData[i];
        console.log(
            show.venue.city +  "," + (show.venue.region || show.venue.country) + " at " + show.venue.name +  " " + moment(show.datetime).format("MM/DD/YYYY")
          );
        }
      }
    });
  };

// Function for running a Movie Search
var movieInfo = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);
      console.log("-----------------------------------");
      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings.value);
      console.log("-----------------------------------");
    }
  });
};

// command is executed
var excuCmnd = function(caseData, functionData) {
  switch (caseData) {
  case "spotify-this-song":
    songData(functionData);
    break;
  case "concert-this":
    concertInfo(functionData);
    break;
  case "movie-this":
    movieInfo(functionData);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("LIRI doesn't know that");
  }
};

// Function which run command line arguments and executes correct function accordingly
var runLiri = function(argOne, argTwo) {
  excuCmnd(argOne, argTwo);
};

runLiri(process.argv[2], process.argv.slice(3).join(" "));