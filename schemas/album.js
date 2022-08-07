export default {
  name: "album",
  type: "document",
  title: "Album",
  fields: [
    {
      name: "albumArt",
      type: "image",
      title: "Album Art",
    },
    {
      name: "artist",
      type: "string",
      title: "Artist Name",
    },
    {
      name: "title",
      type: "string",
      title: "Album Title",
    },
  ],
};
