require("dotenv").config();
const express = require("express");
const {
  checkIfImageExists,
  writeImage,
  downloadImage,
  getHash,
} = require("./utils");
const fs = require("fs");

const app = express();

app.get("/p", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing url query parameter");
  }

  if (checkIfImageExists(url)) {
    const hash = getHash(url);
    return res.sendFile(`${hash}.jpg`, { root: "./images" });
  }

  try {
    const image = await downloadImage(url);

    if (!image) {
      return res.status(500).send("Failed to download image");
    }

    const hash = await writeImage(url, image);
    res.sendFile(`${hash}.jpg`, { root: "./images" });
  } catch (error) {
    console.error(error);

    return res.status(500).send("Failed to download image");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);

  // check if folder images exists
  if (!fs.existsSync("./images")) {
    fs.mkdirSync("./images");
  }
});
