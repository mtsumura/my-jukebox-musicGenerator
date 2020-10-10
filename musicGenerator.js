const fs = require("fs");
console.log("Script Started");
// var TARGET_DIR = "/Volumes/LACIE_SHARE/examples/musicserver/public/source2";
// var hasAlbumNameDir = true;

// var reader = require("./musicDirectoryReader");
// var readerResults = reader.readFromSource(TARGET_DIR, hasAlbumNameDir);
//readerResults.songList.forEach(song => console.log(song.id + ":" + song.artist + "-" + song.songTitle + "-" + song.url));
// var readerResults = {};

// readerResults.artistList = ['Michael Tsumura'];
// readerResults.albumList = ['Juke Box List Test'];
// readerResults.songList = [
// 	{
//     	"id": 1111,
//        	"artist": 'Michael Tsumura',
//        	"songTitle": 'cleanedFileName',
//        	"url": 'songFileName.mp3'
// 	}
// ];

console.log(process.argv)

var myArgs = process.argv.slice(2);
console.log("MyArgs:" + myArgs);

console.log(myArgs[0]);
var jsonFile = myArgs[0];
console.log(jsonFile);
try {
	var data = fs.readFileSync(jsonFile, 'utf8');
	console.log("data:" + data);
	jsonObj = JSON.parse(data);
	console.log("jsonObj:" + jsonObj.songList[0].url)
} catch(e) {
	console.error(jsonFile);
}

var songListName = myArgs[1];
var albumGraphicFile = myArgs[2];
//console.log("songListName:" + songListName);
//console.log("albumGraphicFile:" + albumGraphicFile);

// var albumGraphicFile = 'who.jpg';
// var songListName = 'Oct 2020';
var writer = require("./musicGeneratorWriter");
writer.writeToDb(jsonObj.artistList, jsonObj.albumList, jsonObj.songList, songListName, albumGraphicFile);