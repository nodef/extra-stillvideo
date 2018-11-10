Generate still video from an audio and image file, through machine (via "ffmpeg").


## setup

1. Follow setup at [@wikipedia-tts/english].
2. Create [filestack] account, and set `FILESTACK_APIKEY` environment variable.


## usage

```javascript
const video = require('@wikipedia-tts/video');
// video(<output>, <text>, <image>, [options])
// -> Promise <output>

/* More options: @wikipedia-tts/english */
// [options]: {
//   output: {
//     audio: $WIKIPEDIATTS_OUTPUT_AUDIO||false,
//     image: $WIKIPEDIATTS_OUTPUT_IMAGE||false
//   },
//   video: {
//     loop: $WIKIPEDIATTS_VIDEO_LOOP||1,
//     framerate: $WIKIPEDIATTS_VIDEO_FRAMERATE||1,
//     vcodec: $WIKIPEDIATTS_VIDEO_VCODEC||'libx264',
//     crf: $WIKIPEDIATTS_VIDEO_CRF||0,
//     preset: $WIKIPEDIATTS_VIDEO_PRESET||'veryfast',
//     tune: $WIKIPEDIATTS_VIDEO_TUNE||'stillimage',
//     acodec: $WIKIPEDIATTS_VIDEO_ACODEC||'copy'
//     cp: {
//       sync: true,
//       stdio: [0, 1, 2]
//     }
//   },
//   image: {
//     convert: {
//       apiKey: $FILESTACK_APIKEY
//     }
//   }
// }


var img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tanglanglapass.jpg/800px-Tanglanglapass.jpg';
await video('output.mp4', 'Ladakh is the land of high passes.', img);
// output.mp4 created
```


[![wikipedia-tts](https://i.imgur.com/Uu0KJ1U.jpg)](https://www.npmjs.com/package/wikipedia-tts)
> References: [filestack convert].

[@wikipedia-tts/english]: https://www.npmjs.com/package/@wikipedia-tts/english
[filestack]: https://www.filestack.com/
[filestack convert]: https://blog.filestack.com/api/an-api-to-convert-png-to-jpg-and-vice-versa/
