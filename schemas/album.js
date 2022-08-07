export const createPlayId = (_) => crypto.randomUUID();

export default {
  name: "album",
  type: "document",
  title: "Album",
  fields: [
    {
      name: "albumArt",
      type: "image",
      title: "Album Art",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "artist",
      type: "string",
      title: "Artist Name",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "title",
      type: "string",
      title: "Album Title",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "isSingle",
      type: "boolean",
      title: "Is Single",
      initialValue: false,
    },
    {
      name: "playId",
      type: "slug",
      title: "Play ID",
      description: "Unique identifier for this album, DO NOT CHANGE :)",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        slugify: createPlayId,
      },
    },
  ],
};
