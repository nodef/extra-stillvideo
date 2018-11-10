Generate still video from an audio and image file, through machine (via ["ffmpeg"]).
> Do you want to:
> - Upload music videos on YouTube?
> - Or, [Upload Wikipedia TTS videos on YouTube]?

Sample: ["Pixelsphere OST (2017)"].
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
# --help: show this help
# -o, --output: set output video file (out.mp4)
# -a, --audio:  set input audio file
# -i, --image:  set input image file
# -vl, --video_loop:      set video loop (1)
# -vf, --video_framerate: set video framerate (1)
# -vv, --video_vcodec:    set video vcodec (libx264)
# -vc, --video_crf:       set video CRF (0)
# -vp, --video_preset:    set video preset (veryfast)
# -vt, --video_tune:      set video tune (stillimage)
# -va, --video_acodec:    set video acodec (copy)

# Environment variables:
$STILLVIDEO_LOG # enable log (0)
$STILLVIDEO_VIDEO_LOOP      # set video loop (1)
$STILLVIDEO_VIDEO_FRAMERATE # set video framerate (1)
$STILLVIDEO_VIDEO_VCODEC    # set video vcodec (libx264)
$STILLVIDEO_VIDEO_CRF       # set video CRF (0)
$STILLVIDEO_VIDEO_PRESET    # set video preset (veryfast)
$STILLVIDEO_VIDEO_TUNE      # set video tune (stillimage)
$STILLVIDEO_VIDEO_ACODEC    # set video acodec (copy)
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
// options: optional
// -> Promise <output>

// Default options
options = {
  video: {
    loop: 1,            // set video loop
    framerate: 1,       // set video framerate
    vcodec: 'libx264',  // set video vcodec
    crf: 0,             // set video CRF
    preset: 'veryfast', // set video preset
    tune: 'stillimage', // set video tune
    acodec: 'copy'      // set video acodec
    cp: {
      sync: true,       // enable synchronous child process
      stdio: [0, 1, 2]  // set child process stdio
    }
  }
}
```
<br>


## contribute

All your suggestions are welcome. Find out more creative things to do, and if this tool doesn't manage, contribute by [creating an issue].


[!nodef](https://i.imgur.com/33z4S5l.jpg)](https://nodef.github.io)

["ffmpeg"]: https://ffmpeg.org/
[Upload Wikipedia TTS videos on YouTube]: https://www.youtube.com/results?search_query=wikipedia+audio+article
["Pixelsphere OST (2017)"]: https://www.youtube.com/watch?v=RCryNyHbSDc&list=PLNEveYilIj1AV5-ETDCHufWazEHRcP8o-
