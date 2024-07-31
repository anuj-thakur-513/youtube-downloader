const fs = require("fs");
const ytdl = require("@distube/ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const cliProgress = require("cli-progress");

async function downloadVideo(videoUrl, videoTitle) {
  const videoInfo = await ytdl.getInfo(videoUrl);
  /**
   * Qualities/Formats that can be added:
   * 'lowest' | 'highest' | 'highestaudio' | 'lowestaudio' | 'highestvideo' | 'lowestvideo'
   */
  const videoFormat = ytdl.chooseFormat(videoInfo.formats, {
    quality: "highestvideo",
  });
  const audioFormat = ytdl.chooseFormat(videoInfo.formats, {
    quality: "highestaudio",
  });

  const totalSize =
    parseInt(videoFormat.contentLength, 10) +
    parseInt(audioFormat.contentLength, 10);
  let downloadedSize = 0;
  /**
   * Qualities/Formats that can be added:
   * 'lowest' | 'highest' | 'highestaudio' | 'lowestaudio' | 'highestvideo' | 'lowestvideo'
   */
  const videoStream = ytdl(videoUrl, { quality: "highestvideo" });
  const audioStream = ytdl(videoUrl, { quality: "highestaudio" });

  // Create a new progress bar for downloading
  const downloadProgressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  downloadProgressBar.start(totalSize, 0);

  videoStream.on("data", (chunk) => {
    downloadedSize += chunk.length;
    downloadProgressBar.update(downloadedSize);
  });

  audioStream.on("data", (chunk) => {
    downloadedSize += chunk.length;
    downloadProgressBar.update(downloadedSize);
  });

  const videoPath = path.resolve(
    __dirname,
    "..",
    "downloads",
    `${videoTitle}_video.mp4`
  );
  const audioPath = path.resolve(
    __dirname,
    "..",
    "downloads",
    `${videoTitle}_audio.mp4`
  );
  const outputPath = path.resolve(
    __dirname,
    "..",
    "downloads",
    `${videoTitle}.mp4`
  );

  const videoWriteStream = fs.createWriteStream(videoPath);
  const audioWriteStream = fs.createWriteStream(audioPath);

  videoStream.pipe(videoWriteStream);
  audioStream.pipe(audioWriteStream);

  await Promise.all([
    new Promise((resolve, reject) => {
      videoWriteStream.on("finish", resolve);
      videoWriteStream.on("error", reject);
    }),
    new Promise((resolve, reject) => {
      audioWriteStream.on("finish", resolve);
      audioWriteStream.on("error", reject);
    }),
  ]);
  downloadProgressBar.stop();

  console.log("\nMerging audio and video");
  // Create a new progress bar for merging
  const mergeProgressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  mergeProgressBar.start(100, 0);
  // Merge video and audio using ffmpeg with progress
  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions("-c:v copy")
      .outputOptions("-c:a aac")
      .save(outputPath)
      .on("progress", (progress) => {
        mergeProgressBar.update(progress.percent);
      })
      .on("end", () => {
        mergeProgressBar.stop();
        console.log(
          `${videoTitle} has been downloaded and merged successfully.\n`
        );
        fs.unlinkSync(videoPath); // Remove video file
        fs.unlinkSync(audioPath); // Remove audio file
        resolve();
      })
      .on("error", (err) => {
        mergeProgressBar.stop();
        console.error(`Error merging ${videoTitle}:`, err);
        reject(err);
      });
  });
}

async function downloadPlaylist(data) {
  let curr = 0;

  while (curr < data.videos.items.length) {
    const videoData = data.videos.items[curr];
    const videoId = videoData.id;
    const videoTitle = `${curr + 1}. ${videoData.title}`;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log("downloading:", videoTitle);
    await downloadVideo(videoUrl, videoTitle);
    curr++;
  }
}

module.exports = { downloadPlaylist, downloadVideo };
