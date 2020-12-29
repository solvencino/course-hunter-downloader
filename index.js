const fs = require("fs");
const request = require("request");
const progress = require("request-progress");
const links = require("./links.json");
const coursename = "typescript-prod";
const cliProgress = require("cli-progress");

try {
  fs.mkdirSync(`${coursename}`);
} catch (e) {
  console.log("already created folder!");
}

console.log(`Total Lessons : ${links.length}`);

function load(i) {
  if (i === links.length) {
    console.log("Course Downloaded!!");
    return;
  }

  const bar = new cliProgress.SingleBar(
    {
      format:
        "lesson : " +
        (i + 1) +
        "|" +
        "{bar}" +
        " | {percentage}%" +
        " | Speed: {speed}" +
        " | ETA: {time}",
    },
    cliProgress.Presets.shades_classic
  );
  bar.start(100, 0);

  progress(request(links[i]), { throttle: 2000, delay: 1000 })
    .on("progress", ({ percent, speed, time }) => {
      bar.update(parseInt(percent * 100), {
        speed: parseInt(speed / 1000) + " KB/s",
        time: parseInt(time.remaining) + " Sec ",
      });
    })
    .on("end", () => {
      bar.update(100);
      bar.stop();
      console.log(" ");
      load(i + 1);
    })
    .pipe(fs.createWriteStream(`./${coursename}/lesson${i + 1}.mp4`));
}

load(21);
