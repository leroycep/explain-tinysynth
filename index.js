
let _audio_global = null;

async function get_audio() {
  if (_audio_global === null) {
    _audio_global = new AudioContext();
  }
  return _audio_global;
}

async function play_w9999() {
  const audio = await get_audio();

  // Create PeriodicWave of w9999
  const len = 5;
  const imaginary = new Float32Array(len);
  const real = new Float32Array(len);
  
  for (let i = 1; i < len; i += 1) {
    imaginary[i] = '9';
    console.log(imaginary[i]);
  }
  
  const w9999 = audio.createPeriodicWave(real, imaginary);
  
  // Make a 440Hz (the default frequency) oscillator with the w9999 periodic wave
  const oscillator = new OscillatorNode(audio, { periodicWave: w9999 });
  
  oscillator
    .connect(new GainNode(audio, { gain: 0.3 }))
    .connect(audio.destination);

  oscillator.start(audio.currentTime);
  oscillator.stop(audio.currentTime + 1);
}
