const downloadFile = require('download-file');
const randomItem = require('random-item');
const boolean = require('boolean');
const tempy = require('tempy');
const urlParse = require('url').parse;
const cp = require('child_process');
const path = require('path');
const fs = require('fs');


// Global variables
const E = process.env;
const LOG = boolean(E['STILLVIDEO_LOG']||'0');
const OUTPUT = {
  audio: boolean(E['STILLVIDEO_OUTPUT_AUDIO']||'0'),
  image: boolean(E['STILLVIDEO_OUTPUT_IMAGE']||'0')
};
const VIDEO = {
  loop: parseFloat(E['STILLVIDEO_VIDEO_LOOP']||'1'),
  framerate: parseFloat(E['STILLVIDEO_VIDEO_FRAMERATE']||'1'),
  vcodec: E['STILLVIDEO_VIDEO_VCODEC']||'libx264',
  crf: E['STILLVIDEO_VIDEO_CRF']||'0',
  preset: E['STILLVIDEO_VIDEO_PRESET']||'veryfast',
  tune: E['STILLVIDEO_VIDEO_TUNE']||'stillimage',
  acodec: E['STILLVIDEO_VIDEO_ACODEC']||'copy'
};
const CP = {
  sync: true,
  stdio: [0, 1, 2]
};
const IMAGE_CONVERT = {
  apiKey: E['FILESTACK_APIKEY']||''
};
const FN_NOP = () => 0;


// Get filename, without extension.
function pathFilename(pth) {
  return pth.substring(0, pth.length-path.extname(pth).length);
};

// Copy file, return promise.
function fsCopyFile(src, dst, flags=0) {
  if(LOG) console.log('fsCopyFile:', src, dst);
  return new Promise((fres, frej) => {
    fs.copyFile(src, dst, flags, (err) => {
      if(err) frej(err);
      else fres(dst);
    });
  });
};

// Execute child process, return promise.
function cpExec(cmd, o) {
  o = Object.assign({}, CP, o);
  if(LOG) console.log('cpExec:', cmd);
  if(o.sync) return Promise.resolve({stdout: cp.execSync(cmd, o)});
  return new Promise((fres, frej) => {
    cp.exec(cmd, o, (err, stdout, stderr) => {
      if(err) frej(err);
      else fres({stdout, stderr});
    });
  });
};

// Download file, return promise.
function fileDownload(out, url) {
  if(LOG) console.log('fileDownload:', out, url);
  var opt = {directory: path.dirname(out), filename: path.basename(out)};
  return new Promise((fres, frej) => downloadFile(url, opt, (err) => {
    if(err) frej(err);
    else fres(out);
  }));
};

// Convert image URL to given format.
function imageConvert(url, fmt, o) {
  o = Object.assign({}, IMAGE_CONVERT, o);
  if(LOG) console.log('imageConvert:', url, fmt);
  var key = randomItem((o.apiKey||'').split(';'));
  var inp = path.extname(urlParse(url).pathname).substring(1).toLowerCase()||'png';
  return [fmt, 'jpg', 'png'].includes(inp)? url:`https://process.filestackapi.com/${key}/output=format:${fmt}/${url}`;
};

// Generate output image file.
function outputImage(out, src, o) {
  var o = o||{};
  if(LOG) console.log('outputImage:', out);
  var dst = pathFilename(out)+path.extname(src);
  if(!src.includes('://')) return fsCopyFile(src, dst);
  var fmt = path.extname(out).substring(1);
  var url = imageConvert(src, fmt, o.convert);
  return fileDownload(out, url);
};

// Generate output video file.
function outputVideo(out, aud, img, o) {
  var o = Object.assign({}, VIDEO, o);
  if(LOG) console.log('outputVideo:', out);
  return cpExec(`ffmpeg -y -err_detect explode -loop ${o.loop} -framerate ${o.framerate} -i "${img}" -i "${aud}" -vcodec ${o.vcodec} -crf ${o.crf} -preset ${o.preset} -tune ${o.tune} -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -acodec ${o.acodec} -shortest "${out}"`, o.cp||{}).then(() => out);
};

// Write Full TTS output to file.
async function stillvideo(out, txt, img, o) {
  var o = o||{};
  var u = Object.assign({}, OUTPUT, o.output);
  if(LOG) console.log('@video:', out);
  var pth = pathFilename(out);
  var imge = img? path.extname(img):'.jpg';
  var imgp = u.image? pth+imge:tempy.file({extension: imge.substring(1)});
  if(img) img = await outputImage(imgp, img, o.image);
  var aud = u.audio? pth+'.mp3':tempy.file({extension: 'mp3'});
  aud = await english(aud, txt, o);
  if(img) await outputVideo(out, aud, img, o.video);
  if(!u.image && img) fs.unlink(img, FN_NOP);
  if(!u.audio) fs.unlink(aud, FN_NOP);
  return out;
};
module.exports = stillvideo;
