Generate still video from an audio and image file, through machine (via ["ffmpeg"]).
> Do you want to:
> - Upload music videos on YouTube?
> - Or, [Upload Wikipedia TTS videos on YouTube]?

Sample: ["Pixelsphere OST (2017)"].
<br>


## setup

1. Install [Node.js], if not installed.
2. Run `npm install -g extra-stillvideo` in [console].
3. To install this as a package use `npm install extra-stillvideo`.
<br>


## console

```bash
stillvideo -a bomberman.m4a -i bomberman.png
# out.mp4 created (yay!)

stillvideo -a speech.mp3 -i photo.jpg -o speech.mp4
# speech.mp4 created from audio speech.mp3, image photo.jpg
```

### reference

```bash
stillvideo [options]
# --help:    show this help
# -l, --log: enable log
# -o, --output: set output video file (out.mp4)
# -a, --audio:  set input audio file
# -i, --image:  set input image file
# -ol, --loop:      set loop (1)
# -of, --framerate: set framerate (1)
# -ov, --vcodec:    set vcodec (libx264)
# -oc, --crf:       set CRF (0)
# -op, --preset:    set preset (veryfast)
# -ot, --tune:      set tune (stillimage)
# -oa, --acodec:    set acodec (copy)

# Environment variables:
$STILLVIDEO_LOG # enable log (0)
$STILLVIDEO_OUTPUT # set output video file (out.mp4)
$STILLVIDEO_AUDIO  # set input audio file
$STILLVIDEO_IMAGE  # set input image file
$STILLVIDEO_LOOP      # set video loop (1)
$STILLVIDEO_FRAMERATE # set video framerate (1)
$STILLVIDEO_VCODEC    # set video vcodec (libx264)
$STILLVIDEO_CRF       # set video CRF (0)
$STILLVIDEO_PRESET    # set video preset (veryfast)
$STILLVIDEO_TUNE      # set video tune (stillimage)
$STILLVIDEO_ACODEC    # set video acodec (copy)
```
<br>


## package

```javascript
const stillvideo = require('extra-stillvideo');

await stillvideo('out.mp4', 'bomberman.m4a', 'bomberman.png');
// out.mp4 created (yay!)

await stillvideo('speech.mp4', 'speech.mp3', 'photo.jpg');
// speech.mp4 created from audio speech.mp3, image photo.jpg
```

```javascript
const stillvideo = require('extra-stillvideo');

stillvideo(output, audio, image, options={})
// output:  output video file
// audio:   input audio file
// image:   input image file
// options: given below
// -> Promise <output>

// Default options
options = {
  stdio: [0, 1, 2],   // set child process stdio
  log: false,         // enable log
  loop: 1,            // set loop
  framerate: 1,       // set framerate
  vcodec: 'libx264',  // set vcodec
  crf: 0,             // set CRF
  preset: 'veryfast', // set preset
  tune: 'stillimage', // set tune
  acodec: 'copy'      // set acodec
}
```
<br>


## similar

Do you need anything similar?
- [extra-googletts] can generate spoken audio from text.
- [extra-youtubeuploader] can upload videos with caption to YouTube.

Suggestions are welcome. Please [create an issue].
<br><br>


[![nodef](https://i.imgur.com/33z4S5l.jpg)](https://nodef.github.io)

["ffmpeg"]: https://ffmpeg.org/
[Upload Wikipedia TTS videos on YouTube]: https://www.youtube.com/results?search_query=wikipedia+audio+article
["Pixelsphere OST (2017)"]: https://www.youtube.com/watch?v=RCryNyHbSDc&list=PLNEveYilIj1AV5-ETDCHufWazEHRcP8o-

[extra-googletts]: https://www.npmjs.com/package/extra-googletts
[extra-youtubeuploader]: https://www.npmjs.com/package/extra-youtubeuploader
[create an issue]: https://github.com/nodef/extra-stillvideo/issues
