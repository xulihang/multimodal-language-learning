var synth = window.speechSynthesis;

var startBtn = document.querySelector('#play');
var stopBtn = document.querySelector('#stop');
var sourceVoiceSelect = document.querySelector('.source-voice-select');
var targetVoiceSelect = document.querySelector('.target-voice-select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var voices = [];
var currentIndex = 0;
var isSource = true;
var playing = true;

function loadVoices(){
  var allVoices = synth.getVoices();
  for(i = 0; i < allVoices.length ; i++) {
    voices.push(allVoices[i]);
  }
}

function populateVoiceList(targetSelect) {
  var selectedIndex = targetSelect.selectedIndex < 0 ? 0 : targetSelect.selectedIndex;
  targetSelect.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    targetSelect.appendChild(option);
  }
  targetSelect.selectedIndex = selectedIndex;
}

function populateBothVoiceList(){
  console.log("populateBothVoiceList");
  loadVoices();
  populateVoiceList(sourceVoiceSelect);
  populateVoiceList(targetVoiceSelect);    
}


if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateBothVoiceList;
}

function speak(text, voice){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (text !== '') {
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
        if (playing == true) {
          readNext();
        }
        
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    if (voice) {
        utterThis.voice = voice;
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

startBtn.onclick = function(event) {
  console.log("start");
  currentIndex = 0;
  playing = true;
  isSource = true;
  readNext();
}

stopBtn.onclick = function(event) {
  console.log("stop");
  playing = false;
  synth.pause();
  synth.cancel();
}

function readNext() {
    var readsource = document.getElementById("readsource").checked;
    var readtarget = document.getElementById("readtarget").checked;
    var sourceVoice;
    var targetVoice;
    
    var selectedOption = sourceVoiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        sourceVoice = voices[i];
        break;
      }
    }
    
    var selectedOption = targetVoiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        targetVoice = voices[i];
        break;
      }
    }
    
    var ol = document.querySelector('.text-list');
    if (ol) {
      var items = ol.getElementsByClassName("text-box-item");
      if (currentIndex>items.length-1) {
        return;
      }
      var ul = items[currentIndex];
      console.log(ul);
      if (ul.style.display == "none") {
          currentIndex = currentIndex + 1;
          readNext();
          return;
      }
      var innerItems = ul.getElementsByTagName("li");
      var li;
      if (isSource) {
        li = innerItems[0];
        isSource = false;
        if (readtarget == false) {
          currentIndex = currentIndex + 1;
        }
        if (readsource == true) {
          speak(li.innerText,sourceVoice);
        } else{
          readNext();   
        }
      } else{
        li = innerItems[1];
        isSource = true;
        if (readtarget == true) {
          currentIndex = currentIndex + 1;
        }
        if (readtarget == true){
          speak(li.innerText,targetVoice);
        } else{
          readNext();   
        }
      }
      
    }
}

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
  rateValue.textContent = rate.value;
}
