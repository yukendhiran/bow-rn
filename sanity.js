import  SanityClient  from "@sanity/client";
import imageUrlBuilder  from "@sanity/image-url";

const client = SanityClient({
  projectId: "r2cbhd5c",
  dataset: "production",
  useCdn: "cdn",
  apiVersion: "2022-02-21",
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);

export default client;
