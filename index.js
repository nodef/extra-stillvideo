#!/usr/bin/env node
const boolean = require('boolean');
const _ = require('lodash');
const cp = require('child_process');


// Global variables
const E = process.env;
const OPTIONS = {
  log: boolean(E['STILLVIDEO_LOG']||'0'),
  loop: parseFloat(E['STILLVIDEO_LOOP']||'1'),
  framerate: parseFloat(E['STILLVIDEO_FRAMERATE']||'1'),
  vcodec: E['STILLVIDEO_VCODEC']||'libx264',
  crf: E['STILLVIDEO_CRF']||'0',
  preset: E['STILLVIDEO_PRESET']||'veryfast',
  tune: E['STILLVIDEO_TUNE']||'stillimage',
  acodec: E['STILLVIDEO_ACODEC']||'copy',
  cp: null
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
  var o = _.merge({}, OPTIONS, o), l = o.log;
  var cmd = `ffmpeg -y -loop ${o.loop} -framerate ${o.framerate} -i "${img}" -i "${aud}" -vcodec ${o.vcodec} -crf ${o.crf} -preset ${o.preset} -tune ${o.tune} -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -acodec ${o.acodec} -shortest "${out}"`;
  if(l) { console.log('@video:', out, aud, img); console.log('-cpExec:', cmd); }
  return cpExec(cmd, l? Object.assign({}, o.cp, CP):o.cp).then(() => out);
};
module.exports = stillvideo;

// Run on console.
function shell(A) {
  var out = 'out.mp4', aud = '', img = '', o = {};
  for(var i=2, I=A.length; i<I; i++) {
    if(A[i]==='--help') return cp.execSync('less README.md', {cwd: __dirname, stdio: [0, 1, 2]});
    else if(A[i]==='-o' || A[i]==='--output') out = A[++i];
    else if(A[i]==='-a' || A[i]==='--audio') aud = A[++i];
    else if(A[i]==='-i' || A[i]==='--image') img = A[++i];
    else if(A[i]==='-l' || A[i]==='--log') _.merge(o, {log: true});
    else if(A[i]==='-ol' || A[i]==='--loop') _.merge(o, {loop: parseInt(A[++i], 10)});
    else if(A[i]==='-of' || A[i]==='--framerate') _.merge(o, {framerate: parseFloat(A[++i])});
    else if(A[i]==='-ov' || A[i]==='--vcodec') _.merge(o, {vcodec: A[++i]});
    else if(A[i]==='-oc' || A[i]==='--crf') _.merge(o, {crf: A[++i]});
    else if(A[i]==='-op' || A[i]==='--preset') _.merge(o, {preset: A[++i]});
    else if(A[i]==='-ot' || A[i]==='--tune') _.merge(o, {tune: A[++i]});
    else if(A[i]==='-oa' || A[i]==='--acodec') _.merge(o, {acodec: A[++i]});
    else return console.error(`stillvideo: Unexpected input "${A[i]}"`);
  }
  return stillvideo(out, aud, img, o);
};
if(require.main===module) shell(process.argv);
