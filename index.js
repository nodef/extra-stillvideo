#!/usr/bin/env node
const boolean = require('boolean');
const tempy = require('tempy');
const Jimp = require('jimp')
const _ = require('lodash');
const cp = require('child_process');
const path = require('path');
const fs = require('fs');


// Global variables
const E = process.env;
const STDIO = [0, 1, 2];
const OPTIONS = {
  stdio: null,
  help: false,
  input: null,
  log: boolean(E['STILLVIDEO_LOG']||'0'),
  output: E['STILLVIDEO_OUTPUT']||'out.mp4',
  audio: E['STILLVIDEO_AUDIO'],
  image: E['STILLVIDEO_IMAGE'],
  loop: parseFloat(E['STILLVIDEO_LOOP']||'1'),
  framerate: parseFloat(E['STILLVIDEO_FRAMERATE']||'1'),
  vcodec: E['STILLVIDEO_VCODEC']||'libx264',
  crf: E['STILLVIDEO_CRF']||'0',
  preset: E['STILLVIDEO_PRESET']||'veryfast',
  tune: E['STILLVIDEO_TUNE']||'stillimage',
  acodec: E['STILLVIDEO_ACODEC']||'copy',
  resizeX: parseInt(E['STILLVIDEO_RESIZEX']||'0', 10),
  resizeY: parseInt(E['STILLVIDEO_RESIZEY']||'0', 10),
  fitX: parseInt(E['STILLVIDEO_FITX']||'0', 10),
  fitY: parseInt(E['STILLVIDEO_FITY']||'0', 10)
};
const FN_NOP = () => 0;


// Execute child process, return promise.
function cpExec(cmd, o) {
  var o = o||{}, stdio = o.log? o.stdio||STDIO:o.stdio||[];
  if(o.log) console.log('-cpExec:', cmd);
  if(o.stdio==null) return Promise.resolve({stdout: cp.execSync(cmd, {stdio})});
  return new Promise((fres, frej) => cp.exec(cmd, {stdio}, (err, stdout, stderr) => {
    return err? frej(err):fres({stdout, stderr});
  }));
};

// Transform image to proper size.
async function imageTransform(pth, o) {
  var fmt = path.extname(pth).substring(1);
  var dst = tempy.file({extension: 'jpg'});
  var img = await Jimp.read(pth);
  var w0 = img.bitmap.width, h0 = img.bitmap.height;
  if(o.resizeX || o.resizeY) img.resize(o.resizeX||Jimp.AUTO, o.resizeY||Jimp.AUTO);
  if(o.fitX && o.fitY && (w0>o.fitX || h0>o.fitY)) img.scaleToFit(o.fitX, o.fitY);
  var w1 = img.bitmap.width, h1 = img.bitmap.height;
  if(o.log) console.log('-imageTransform:', `${fmt} ${w0}x${h0} -> jpg ${w1}x${h1}`);
  await img.writeAsync(dst);
  return dst;
};

/**
 * Generate still video from an audio and image file, through machine (via "ffmpeg").
 * @param {string} out output video file.
 * @param {string} aud input audio file.
 * @param {string} img input image file.
 * @param {object} o options.
 * @returns promise <out> when done.
 */
async function stillvideo(out, aud, img, o) {
  var o = _.merge({}, OPTIONS, o);
  var out = out||o.output, aud = aud||o.audio, img = img||o.image;
  if(o.log) console.log('@stillvideo:', out, aud, img);
  var imgt = await imageTransform(img, o);
  var z = await cpExec(`ffmpeg -y -loop ${o.loop} -framerate ${o.framerate} -i "${imgt}" -i "${aud}" -vcodec ${o.vcodec} -crf ${o.crf} -preset ${o.preset} -tune ${o.tune} -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -acodec ${o.acodec} -shortest "${out}"`, o);
  if(imgt!==img) fs.unlink(imgt, FN_NOP);
  return z;
};

// Get options from arguments.
function options(o, k, a, i) {
  if(k==='--help') o.help = true;
  else if(k==='-l' || k==='--log') o.log = true;
  else if(k==='-o' || k==='--output') o.output = a[++i];
  else if(k==='-a' || k==='--audio') o.audio = a[++i];
  else if(k==='-i' || k==='--image') o.image = a[++i];
  else if(k==='-ol' || k==='--loop') o.loop = parseInt(a[++i], 10);
  else if(k==='-of' || k==='--framerate') o.framerate = parseFloat(a[++i]);
  else if(k==='-ov' || k==='--vcodec') o.vcodec = a[++i];
  else if(k==='-oc' || k==='--crf') o.crf = a[++i];
  else if(k==='-op' || k==='--preset') o.preset = a[++i];
  else if(k==='-ot' || k==='--tune') o.tune = a[++i];
  else if(k==='-oa' || k==='--acodec') o.acodec = a[++i];
  else if(k==='-rx' || k==='--resizex') o.resizeX = parseFloat(a[++i]);
  else if(k==='-ry' || k==='--resizey') o.resizeY = parseFloat(a[++i]);
  else if(k==='-fx' || k==='--fitx') o.fitX = parseFloat(a[++i]);
  else if(k==='-fy' || k==='--fity') o.fitY = parseFloat(a[++i]);
  else o.input = a[i];
  return i+1;
};
stillvideo.options = options;
module.exports = stillvideo;

// Run on shell.
function shell(a) {
  for(var i=0, I=a.length, o={}; i<I; i++)
    i = options(o, a[i], a, i);
  if(o.help) return cp.execSync('less README.md', {cwd: __dirname, stdio: STDIO});
  else if(o.input) return console.error(`@stillvideo: Unexpected input "${a[i]}"`);
  return stillvideo(null, null, null, o);
};
if(require.main===module) shell(process.argv);
