#!/usr/bin/env node
const boolean = require('boolean');
const _ = require('lodash');
const cp = require('child_process');
const path = require('path');
const fs = require('fs');


// Global variables
const E = process.env;
const OPTIONS = {
  log: boolean(E['STILLVIDEO_LOG']||'0'),
  video: {
    loop: parseFloat(E['STILLVIDEO_VIDEO_LOOP']||'1'),
    framerate: parseFloat(E['STILLVIDEO_VIDEO_FRAMERATE']||'1'),
    vcodec: E['STILLVIDEO_VIDEO_VCODEC']||'libx264',
    crf: E['STILLVIDEO_VIDEO_CRF']||'0',
    preset: E['STILLVIDEO_VIDEO_PRESET']||'veryfast',
    tune: E['STILLVIDEO_VIDEO_TUNE']||'stillimage',
    acodec: E['STILLVIDEO_VIDEO_ACODEC']||'copy',
    cp: null
  }
};
const CP = {
  sync: true,
  stdio: [0, 1, 2]
};


// Execute child process, return promise.
function cpExec(cmd, o) {
  if(o && o.sync) return Promise.resolve({stdout: cp.execSync(cmd, o)});
  return new Promise((fres, frej) => {
    cp.exec(cmd, o, (err, stdout, stderr) => {
      if(err) frej(err);
      else fres({stdout, stderr});
    });
  });
};

/**
 * Generate still video from an audio and image file, through machine (via "ffmpeg").
 * @param {string} out output video file.
 * @param {string} aud input audio file.
 * @param {string} img input image file.
 * @param {object} o options.
 * @returns promise <out> when done.
 */
function stillvideo(out, aud, img, o) {
  var o = _.merge({}, OPTIONS, o);
  var l = o.log, v = o.video;
  var cmd = `ffmpeg -y -loop ${v.loop} -framerate ${v.framerate} -i "${img}" -i "${aud}" -vcodec ${v.vcodec} -crf ${v.crf} -preset ${v.preset} -tune ${v.tune} -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -acodec ${v.acodec} -shortest "${out}"`;
  if(l) { console.log('@video:', out, aud, img); console.log('-cpExec:', cmd); }
  return cpExec(cmd, l? Object.assign({}, a.cp, CP):a.cp).then(() => out);
};
module.exports = stillvideo;

// Run on console.
async function console(A) {
  var out = 'out.mp4', aud = '', img = '', o = {};
  for(var i=2, I=A.length; i<I; i++) {
    if(A[i]==='--help') return cp.execSync('less README.md', {cwd: __dirname, stdio: [0, 1, 2]});
    else if(A[i]==='-o' || A[i]==='--output') out = A[++i];
    else if(A[i]==='-a' || A[i]==='--audio') aud = A[++i];
    else if(A[i]==='-i' || A[i]==='--image') img = A[++i];
    else if(A[i]==='-vl' || A[i]==='--video_loop') Object.assign(o, {video: {loop: parseInt(A[++i], 10)}});
    else if(A[i]==='-vf' || A[i]==='--video_framerate') Object.assign(o, {video: {framerate: parseFloat(A[++i])}});
    else if(A[i]==='-vv' || A[i]==='--video_vcodec') Object.assign(o, {video: {vcodec: A[++i]}});
    else if(A[i]==='-vc' || A[i]==='--video_crf') Object.assign(o, {video: {crf: A[++i]}});
    else if(A[i]==='-vp' || A[i]==='--video_preset') Object.assign(o, {video: {preset: A[++i]}});
    else if(A[i]==='-vt' || A[i]==='--video_tune') Object.assign(o, {video: {tune: A[++i]}});
    else if(A[i]==='-va' || A[i]==='--video_acodec') Object.assign(o, {video: {acodec: A[++i]}});
    else return console.error(`stillvideo: Unexpected input "${A[i]}"`);
  }
  await stillvideo(out, aud, img, o);
};
if(require.main===module) console(process.argv);
