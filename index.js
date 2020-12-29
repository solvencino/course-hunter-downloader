const fs = require("fs");
const request = require("request");
const progress = require("request-progress");
const links = require("./links.json");
const coursename = "something";

function load(i) {
  if (i === links.length) {
    return;
  }
  progress(request(links[i]), { throttle: 2000, delay: 1000 })
    .on("progress", ({ percent, time }) =>
      console.log(parseInt(percent * 100).toString(), "%", time)
    )
    .on("end", () => {
      console.log(`${i + 1} file downloaded`);
      load(i + 1);
    })
    .pipe(fs.createWriteStream(`./${coursename}/lesson${i + 1}.mp4`));
}

load(0);
