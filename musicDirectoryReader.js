const fs = require("fs");

var cleanName = function (fileName) {
	let cleanedSongName = fileName.slice(0, -4);
	cleanedSongName = cleanedSongName.replace(/[0-9]|-/g, "").trim();
	return cleanedSongName;
};

var isDirectory = function (path) {
	return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
};

var getSongs = function (songDir, dirName, id, songList) {
	console.log("dirName:" + songDir);
	if (isDirectory(songDir)) {
		var files = fs.readdirSync(songDir);
		files.forEach((fileName) => {
			let cleanedSongName = cleanName(fileName);
			let song = {
				id: id++,
				artist: dirName,
				songTitle: cleanedSongName,
				url: fileName,
			};
			songList.push(song);
		});
	}
};

module.exports = {
	readFromSource: function (targetDir, hasAlbumNameDir) {
		var songList = [];
		var artistList = [];
		var albumList = [];
		var sourceDir = fs.readdirSync(targetDir);

		var id = 0;
		sourceDir.forEach((dirName) => {
			console.log("ARTIST dir:" + dirName);
			artistList.push(dirName);

			var songDir = targetDir + "/" + dirName;
			if (hasAlbumNameDir) {
				console.log("albumNameDir:" + songDir);
				if (!dirName.startsWith(".")) {
					var albums = fs.readdirSync(songDir);
					albums.forEach((albumName) => {
						if (!albumName.startsWith(".")) {
							console.log("albumName:" + albumName);
							albumList.push(albumName);
							getSongs(songDir + "/" + albumName, dirName, id, songList);
						}
					});
				}
			} else {
				getSongs(songDir, dirName, id, songList);
			}
		});

		return {
			songList: songList,
			artistList: artistList,
			albumList: albumList,
		};
	},
};
