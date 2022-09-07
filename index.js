
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
  const real      = new Float32Array([ 0, 0, 0, 0, 0]);
  const imaginary = new Float32Array([ 0, 9, 9, 9, 9]);
  const w9999 = audio.createPeriodicWave(real, imaginary);
  
  // Make a 440Hz (the default frequency) oscillator with the w9999 periodic wave
  const oscillator = new OscillatorNode(audio, { periodicWave: w9999 });
  
  oscillator
    .connect(new GainNode(audio, { gain: 0.3 }))
    .connect(audio.destination);

  oscillator.start(audio.currentTime);
  oscillator.stop(audio.currentTime + 1);
}

/// This is just playing a short white noise clip
async function play_n0(frequency) {
  const audio = await get_audio();

  // Create an audio buffer to put noise in
  const num_seconds = 0.5;
  const num_samples = audio.sampleRate * num_seconds;
  const num_samples_int = num_samples | 0;
  const noise_buffer = audio.createBuffer(1, num_samples_int, audio.sampleRate);
  
  const noise_samples = noise_buffer .getChannelData(0);
  for (let i = 0; i < num_samples_int; i += 1) {
    noise_samples[i] = Math.random() * 2.0 - 1.0;
  }
  
  // Create the node to play back the noise
  const node = new AudioBufferSourceNode(audio, {
    buffer: noise_buffer,
    loop: true,
  });

  // Change the playback rate so we can get different "frequencies" of noise.
  // We make middle C (440Hz) equal 1.0 playbackRate.
  if (frequency) {
    node.playbackRate = frequency / 440;
  }
  
  node
    .connect(new GainNode(audio, { gain: 0.3 }))
    .connect(audio.destination);

  node.start(audio.currentTime);
  node.stop(audio.currentTime + 1);
}


