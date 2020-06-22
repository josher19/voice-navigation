function Speaker({
  lang = navigator.language || "en",
  speechSynthesis = window.speechSynthesis,
  pitch = 1.0,
  rate = 1.0,
  volume = 1.0
} = {}) {
  this.lang = lang;
  this.speechSynthesis = speechSynthesis;
  this.pitch = pitch;
  this.rate = rate;
  this.volume = volume;
}

Speaker.prototype = {
  speakRandomVoice: function speakRandomVoice(
    message,
    lang = navigator.language || "en"
  ) {
    var chooseRandom = (list) => list[Math.floor(Math.random() * list.length)];
    var msg = new SpeechSynthesisUtterance(message);
    var voices = window.speechSynthesis.getVoices();
    var yourLang = voices.filter((v) => v.lang.startsWith(lang));
    msg.voice = chooseRandom(yourLang);
    window.speechSynthesis.speak(msg);
  },

  setLanguage: function setLanguage(lang) {
    this.lang = lang;
  },

  getLanguage: function getLanguage() {
    return this.lang;
  },

  setPitch(pitch) {
    this.pitch = pitch;
  },
  setRate(rate) {
    this.rate = rate;
  },
  setVolume(volume) {
    this.volume = volume;
  },

  getAllVoices: function getAllVoices() {
    return this.speechSynthesis.getVoices();
  },

  getNativeVoices: function getNativeVoices(
    lang = this.getLanguage().substring(0, 2)
  ) {
    return this.getAllVoices().filter(
      (v) => v && v.lang && v.lang.substring(0, 2) === lang
    );
  },

  getVoices: function getVoices() {
    const voices = this.getNativeVoices();
    if (!voices.length) return this.getAllVoices();
    return voices;
  },

  getRandomVoiceNumber: function getRandomVoiceNumber() {
    const chooseRandomNumber = (size) => Math.floor(Math.random() * size);
    return chooseRandomNumber(this.getVoices().length);
  },

  getRandomVoice: function getRandomVoice() {
    const chooseRandom = (list) =>
      list[Math.floor(Math.random() * list.length)];
    return chooseRandom(this.getVoices());
  },

  getNextVoice() {
    return this.getRandomVoice();
  },

  getVoice() {
    if (this.savedVoice) return this.savedVoice;
    return (this.voice = this.getNextVoice());
  },

  saveVoice() {
    this.savedVoice = this.voice || this.getVoice();
  },

  warp(msg) {
    msg.volume = this.volume;
    msg.rate = this.rate;
    msg.pitch = this.pitch;
  },

  speak(message) {
    var msg = new SpeechSynthesisUtterance(message);
    msg.voice = this.getVoice();
    this.warp(msg);
    speechSynthesis.speak(msg);
    return msg;
  }
};

function sampleCode() {
  // var msg = new SpeechSynthesisUtterance("hello");
  var sp = new Speaker({ rate: 1.5, pitch: 0.65 });
  // sp.speakRandomVoice("testing 123");
  console.debug(sp.getAllVoices().length);
  var voices = window.speechSynthesis.getVoices();
  console.log(voices.length);

  console.log(sp.getLanguage());

  // console.log(sp.getNextVoice())
  console.dir(sp);

  console.dir(sp.getVoice());

  console.log(sp.speak("testing"));
  sp.getNextVoice();
  sp.setPitch(0.5);
  console.log(sp.speak("123"));
  sp.saveVoice();
  return sp;
}

// const speaker = sampleCode();
// speaker.speak("hello");
// speaker.speak("world");
