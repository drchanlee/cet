import { Sample } from '../types';

const SAMPLE_BASE_URL = `${import.meta.env.BASE_URL}samples/`;

export const SAMPLES: Sample[] = [
  {
    id: "drums_loop",
    url: `${SAMPLE_BASE_URL}DrumLoops.wav`,
    tags: ["drums"],
  },
  {
    id: "piano_melody",
    url: `${SAMPLE_BASE_URL}piano.wav`,
    tags: ["piano", "instrument"],
  },
  {
    id: "guitar_riff",
    url: `${SAMPLE_BASE_URL}GuitarE.wav`,
    tags: ["guitar", "instrument"],
  },
  {
    id: "vocal_phrase",
    url: `${SAMPLE_BASE_URL}VOCAL.wav`,
    tags: ["vocal"],
  },
  {
    id: "bass_1",
    url: `${SAMPLE_BASE_URL}bass1.wav`,
    tags: ["bass", "instrument"],
  },
  {
    id: "drums_1",
    url: `${SAMPLE_BASE_URL}drums1.wav`,
    tags: ["drums"],
  },
  {
    id: "drums_2",
    url: `${SAMPLE_BASE_URL}drums2.wav`,
    tags: ["drums"],
  },
  {
    id: "guitar_1",
    url: `${SAMPLE_BASE_URL}gtr1.wav`,
    tags: ["guitar", "instrument"],
  },
  {
    id: "mix_melody_1",
    url: `${SAMPLE_BASE_URL}mixmelody1.wav`,
    tags: ["mix", "melody", "instrument"],
  },
  {
    id: "piano_1",
    url: `${SAMPLE_BASE_URL}piano1.wav`,
    tags: ["piano", "instrument"],
  },
  {
    id: "synth_1",
    url: `${SAMPLE_BASE_URL}synt1.wav`,
    tags: ["synth", "instrument"],
  },
];
