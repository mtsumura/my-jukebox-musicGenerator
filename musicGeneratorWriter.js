//find . -type f -name '._*' -delete

// fs.writeFile ("songs.json", JSON.stringify(songList), function(err) {
//     if (err) throw err;
//     console.log('complete');
//     }
// );
var SONG_LIST_NAME = "<SONG_LIST_NAME>";
var USER_ID_MIKE = 1;
var hasAlbumNameDir;

var mysql = require("mysql");
var DB_HOST = "localhost";
var DB_USER = "<USER>";
var DB_PASSWORD = "<PASSWORD>";
var DB_NAME = "test_music";

var artistList = [],
	albumList = [],
	songList = [];
var con = null;
var songListName = null
var songListGraphicUrl = null

var insertAlbums = function (artistList) {
	var artistMap = {};
	var count = artistList.length;
	const promise = new Promise((resolve, reject) => {
		console.log("insertAlbums");
		artistList.forEach((artist, index) => {
			var title = albumList[index];
			var sql =
				'INSERT INTO albums (artist, title) VALUES ("' +
				artist +
				'","' +
				title +
				'")';

			con.query(sql, function (err, result) {
				if (err) throw err;
				console.log(
					"1 album record inserted " + artist + " title:" + title + " " + result.insertId
				);
				artistMap[artist] = result.insertId;
				count--;
				if (count == 0) {
					resolve({
						artistMap: artistMap,
						songList: songList,
					});
				}
			});
		});
	});

	return promise;
};

var insertSongs = function (albumsResult) {
	var songList = albumsResult.songList;
	var artistMap = albumsResult.artistMap;
	var count = songList.length;
	var insertedSongIds = [];

	return new Promise((resolve, reject) => {
		console.log("insert songs")
		songList.forEach((song) => {
			var sql =
				'INSERT INTO songs (name, album_id, filename) VALUES ("' +
				song.songTitle +
				'", ' +
				artistMap[song.artist] +
				', "' +
				song.url +
				'")';
			con.query(sql, function (err, result) {
				if (err) throw err;
				console.log(
					"1 song record inserted " +
						song.songTitle +
						" " +
						result.insertId
				);
				insertedSongIds.push(result.insertId);

				count--;
				if (count == 0) {
					console.log(
						"song records inserted " + insertedSongIds.length
					);
					resolve(insertedSongIds);
				}
			});
		});
	});
};

var insertSongLists = function (songIds) {
	console.log("insertSongLists " + songIds.length);

	return new Promise((resolve, reject) => {
		var sql =
			'INSERT INTO song_lists (name, user_id, song_list_url) VALUES ("' +
			songListName +
			'", ' +
			USER_ID_MIKE +
			', "' +
			songListGraphicUrl +
			'")';
		con.query(sql, function (err, result) {
			if (err) throw err;
			// console.log("1 song list record inserted " + result.insertId);

			resolve({
				songListId: result.insertId,
				songIds: songIds,
			});
		});
	});
};

var insertSongListSongs = function (result) {
	let songIds = result.songIds;
	let songListId = result.songListId;
	return new Promise((resolve, reject) => {
		let count = songIds.length;
		songIds.forEach((songId) => {
			var sql =
				'INSERT INTO song_list_songs (song_list_id, song_id) VALUES ("' +
				songListId +
				'", ' +
				songId +
				")";
			con.query(sql, function (err, result) {
				if (err) throw err;
				// console.log("1 song id record inserted " + result.insertId);

				count--;
				if (count == 0) {
					// console.log("songList records inserted");
					resolve(songListId);
				}
			});
		});
	});

	console.log("song List done");
};

var insertRecords = function (err) {
	if (err) {
		console.error("Connection error:" + err.stack);
		throw err;
	}
	console.log("Connected to database!");

	insertAlbums(artistList)
		.then(insertSongs)
		.then(insertSongLists)
		.then(insertSongListSongs)
		.then((result) => {
			console.log("complete!");
		})
		.catch((reason) => {
			console.log("catch:" + reason);
		})
		.finally((info) => {
			console.log("close connection");
			con.end();
		});
};

module.exports = {
	writeToDb: function (artists, albums, songs, _songListName, _songListGraphicUrl) {
		artistList = artists;
		albumList = albums;
		songList = songs;
		songListName = _songListName
		songListGraphicUrl = _songListGraphicUrl

		con = mysql.createConnection({
			host: DB_HOST,
			user: DB_USER,
			password: DB_PASSWORD,
			database: DB_NAME,
		});

		con.connect(insertRecords);
	},
};
