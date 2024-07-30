function isPlaylist(url) {
  const urlObj = new URL(url);
  return urlObj.searchParams.has("list");
}

function getPlaylistId(url) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get("list");
}

function getVideoId(url) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get("v");
}

module.exports = {
  isPlaylist,
  getPlaylistId,
  getVideoId,
};
