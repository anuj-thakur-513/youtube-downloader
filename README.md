# YouTube Downloader

This is a youtube downloader where you can either paste a video or a playlist link to download the videos in one go.

## Run Locally
Make sure you have ffmpeg installed locally

Here are the steps to install ffmpeg on different operating systems:

### macOS
If you have Homebrew installed, you can install ffmpeg using:
```bash
brew install ffmpeg
```

### Linux
For Ubuntu or Debian-based distributions:
```bash
sudo apt update
sudo apt install ffmpeg
```

For CentOS or RHEL-based distributions:
```bash
sudo yum install epel-release
sudo yum install ffmpeg
```

### Windows
1. Download `ffmpeg` from the official website: [FFmpeg Downloads](https://ffmpeg.org/download.html)
2. Extract the downloaded archive and add the bin directory to your system's PATH environment variable.


### Start the project
Install the dependencies:
```bash
npm install
```
Start the downloader
```bash
npm start
```