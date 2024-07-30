const { Client } = require("youtubei");
const readline = require("readline");

const { getPlaylistId, getVideoId, isPlaylist } = require("./utils/youtube");
const {
  downloadPlaylist,
  downloadVideo,
} = require("./utils/youtubeDownloader");

const youtube = new Client();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let DEFAULT_VIDEOS_COUNT = 100;

async function main() {
  rl.question(
    "Please enter the YouTube playlist/video URL: ",
    async (youtubeUrl) => {
      try {
        if (isPlaylist(youtubeUrl)) {
          const PLAYLIST_ID = getPlaylistId(youtubeUrl);
          const playlist = await youtube.getPlaylist(PLAYLIST_ID);

          while (playlist.videos.items.length === DEFAULT_VIDEOS_COUNT) {
            await playlist.videos.next();
            DEFAULT_VIDEOS_COUNT += 100;
          }

          console.log(
            "Total number of videos downloading:",
            playlist.videos.items.length
          );

          await downloadPlaylist(playlist);
        } else {
          const VIDEO_ID = getVideoId(youtubeUrl);
          const video = await youtube.getVideo(VIDEO_ID);
          console.log("Downloading", video.title);
          await downloadVideo(youtubeUrl, video.title);
        }
        rl.close();
      } catch (error) {
        console.error("An error occurred:", error);
        rl.close();
      }
    }
  );
}

main().catch(console.error);
