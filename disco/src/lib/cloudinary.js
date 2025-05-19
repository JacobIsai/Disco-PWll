import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dsvj7sufo", // Reemplaza con tu cloud name
  },
});

export default cld;