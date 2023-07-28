const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");

const getHash = (url) => {
  return crypto.createHash("md5").update(url).digest("hex");
};

const checkIfImageExists = (url) => {
  const hash = getHash(url);
  return fs.existsSync(`./images/${hash}.jpg`);
};

const writeImage = async (url, image) => {
  const hash = getHash(url);
  await fs.writeFileSync(`./images/${hash}.jpg`, image);
  return hash;
};

const downloadImage = async (url) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(
      `Failed to download image, status code: ${response.status}`
    );
  }

  return Buffer.from(response.data, "binary");
};

module.exports = {
  checkIfImageExists,
  writeImage,
  downloadImage,
  getHash,
};
