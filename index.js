const PORT = 8000;
const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const path = require("path");
var cors = require("cors");

app.use(cors());
app.use(express.static("public"));

/**
 * The rest api for getting the heat map of the fcc progress.
 */
app.get("/api/scrape", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log("The query parameter: ", req.query.name);
    await page.goto("https://www.freecodecamp.org/" + req.query.name);

    await page.waitForSelector(".react-calendar-heatmap").then(async () => {
      console.log("page loaded");
    });

    const heatMap = await page.$(".col-sm-8.col-sm-offset-2.col-xs-12"); // declare a variable with an ElementHandle
    const box = await heatMap.boundingBox(); // this method returns an array of geometric parameters of the element in pixels.
    const x = box["x"]; // coordinate x
    const y = box["y"]; // coordinate y
    const w = box["width"]; // area width
    const h = box["height"]; // area height
    // take screenshot of the required area in puppeteer
    await page.screenshot({
      path: "./public/heatMap.png",
      clip: { x: x, y: y, width: w, height: h },
    });
    await browser.close();
    const options = {
      root: path.join(__dirname, "public"),
    };
    res.sendFile("heatMap.png", options, (err) => {
      if (err) {
        next(err);
      } else {
        console.log("Heat Map Sent");
      }
    });
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

/**
 * The rest api for getting the profile picture of the member.
 */
app.get("/api/profilePic", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log("The query parameter: ", req.query.name);
    await page.goto("https://www.freecodecamp.org/" + req.query.name);

    await page.waitForSelector(".react-calendar-heatmap").then(async () => {
      console.log("page loaded");
    });
    const heatMap = await page.$(".avatar-container.default-border"); // declare a variable with an ElementHandle
    const box = await heatMap.boundingBox(); // this method returns an array of geometric parameters of the element in pixels.
    const x = box["x"]; // coordinate x
    const y = box["y"]; // coordinate y
    const w = box["width"]; // area width
    const h = box["height"]; // area height
    // take screenshot of the required area in puppeteer
    await page.screenshot({
      path: "./public/profilePic.png",
      clip: { x: x, y: y, width: w, height: h },
    });
    await browser.close();
    const options = {
      root: path.join(__dirname, "public"),
    };
    res.sendFile("profilePic.png", options, (err) => {
      if (err) {
        next(err);
      } else {
        console.log("Profile Pic Sent");
      }
    });
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
