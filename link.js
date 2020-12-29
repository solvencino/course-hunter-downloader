const cheerio = require("cheerio");
const url = "https://coursehunter.net/course/professionalnyy-sql";
const puppeteer = require("puppeteer");
const request = require("request");
const fs = require("fs");
const arr = [];
(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { height: 1080, width: 1920 },
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url);

  const $ = cheerio.load(await page.content());
  const length = $("#player_playlist > pjsdiv").children().length;

  await page.click(
    "#oframeplayer > pjsdiv:nth-child(15) > pjsdiv:nth-child(1) > pjsdiv"
  );

  page.waitForTimeout(500);

  await page.waitForSelector(
    "#player_playlist > pjsdiv > pjsdiv:nth-child(1)",
    { timeout: 1000 }
  );

  const tag = cheerio.load(await page.content())(
    "#oframeplayer > pjsdiv:nth-child(3) > video"
  );
  const link = tag.get("0").attribs.src;
  await browser.close();

  for (let i = 1; i <= length; i++) {
    arr.push(link.replace("lesson1", `lesson${i}`));
  }
  fs.writeFileSync("links.json", JSON.stringify(arr));
})();
