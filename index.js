const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();
const url = "https://people.com/";

async function scraping() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    const articles = [];
    $(".fc-item__title", data).each(function () {
      //const title = $(this).text();
      const innerUrl = $(this).find("a").attr("href");
      articles.push(innerUrl);
    });
    return articles;
  } catch (err) {
    console.error(err);
  }
}

app.get("/api/scrape", async (req, res) => {
  try {
    const scraped = await scraping();
    return res.status(200).json(scraped);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
