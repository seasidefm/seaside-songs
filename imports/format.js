const crypto = require("crypto");
const csv = require("csvtojson");
const fs = require("fs");

require("dotenv").config();

const csvFilePath = "./albums.csv";
const createPlayId = (_) => crypto.randomUUID();

console.log("Starting Artist - Album import");
console.log("==============================");

const createAlbum = (title, artist) => {
  return {
    _type: "album",
    title,
    artist,
    // There's no easy way to determin if an album is a single or not
    // so just check if either identifier contains the word 7"
    isSingle: title?.includes('7"') || artist?.includes('7"'),
    playId: createPlayId(title),
  };
};

csv()
  .fromFile(csvFilePath)
  .then(async (jsonObj) => {
    console.log("--------------------------------");
    console.log("Creating record entries...");
    console.log("--------------------------------");
    let records = jsonObj
      .map((row) => row.Records.split("\n"))
      .flatMap((row) => row)
      .filter((record) => record !== "");

    console.log("--------------------------------");
    console.log("Normalizing record entries...");
    console.log("--------------------------------");
    records = records.map((record) => {
      let workingCopy = record;
      if (record.includes("(LP, Album)")) {
        workingCopy = record.replace("(LP, Album)", "");
      }

      if (record.includes("(LP, Comp)")) {
        workingCopy = record.replace("(LP, Comp)", "");
      }

      return workingCopy.trim();
    });

    console.log(`NORMALIZED RECORDS: ${records.length}`);

    console.log("--------------------------------");
    console.log("Creating album entries...");
    console.log("--------------------------------");
    let albums = records.map((record) => {
      const [artist, title] = record.split(" - ");
      return createAlbum(title, artist);
    });

    console.log(`CREATED ALBUMS: ${albums.length}`);

    console.log("--------------------------------");
    console.log("Normalizing album entries...");
    console.log("--------------------------------");
    albums = albums.map((album) => {
      if (album.artist.endsWith(" -")) {
        album.artist = album.artist.replace(" -", "");
      }

      if (album.title === undefined) {
        album.title = album.artist;
      }

      // Album is self titled
      if (album.title === "S/T" || album.title === "s/t") {
        album.title = album.artist;
      }

      // If it doesn't get caught by the generator, add it manually
      if (album.title.includes('7"')) {
        album.isSingle = true;
      }

      return album;
    });

    console.log(`NORMALIZED ALBUMS: ${albums.length}`);

    console.log("--------------------------------");
    console.log("Writing to new-data.ndjson...");
    console.log("--------------------------------");

    const failedUploads = [];
    const uploadAlbums = async () => {
      fs.truncateSync("./new-data.ndjson", 0, () => {
        console.log("Cleared old file");
      });

      const file = fs.createWriteStream("./new-data.ndjson");

      for (const album of albums) {
        console.log(album);
        try {
          file.write(JSON.stringify(album) + "\n");
          console.log(`Wrote album: ${album.artist} - ${album.title}`);
        } catch (error) {
          console.log(error);
          failedUploads.push(album);
        }
      }
      file.close();
    };

    await uploadAlbums();
  })
  .catch((err) => console.error(err));
