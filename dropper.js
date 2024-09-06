function controlPanel() {
    const CP_STOP = document.getElementById("sc-stopbutton-div");
    CP_STOP.addEventListener("click", () => {
        Howler.stop();
        Howler._howls.forEach((e) => {
            //  console.log("this is e",e );
            e.controlFunctions.stopColor(); //this wont work -- there's no way for the howl to know where it is.
        })
    })
    const CP_PLAYALL = document.getElementById("sc-playallbutton-div");
    CP_PLAYALL.addEventListener("click", () => {
        Howler._howls.forEach((e) => {
            if(selectedBitsSet.has(e.name)) {
                e.play();
                
                // console.log("e is in!", e.name); //nu kan jeg afspille nogen!
            } 
            // else console.log("e is not in!", e.name);
        });
    })
    const CP_TEST = document.getElementById("sc-testbutton-div");
    CP_TEST.addEventListener("click", () => {
        console.log("test complete !");

        // console.log("howler111:", Howler);
        // Howler._howls[0].play() //this works, this causes the first howl to play!
        // Howler._howls.forEach((e) => {
            // console.log("this is E:", e) //this gives the individual _howls
            // console.log("e name:", e.name) // this gives the e name
            // e.play() //this causess ALL howls to play

        // })
    })
}
controlPanel();

function makeLongRandomNumber() {
    let array = crypto.getRandomValues(new Uint32Array(2));
    return array[0] + "" + array[1];
}


const SBC = document.getElementById("soundboard-container-div");
function dragDropController() {
    SBC.ondragover = () => { return false; };
    SBC.ondragleave = () => { return false; };
    SBC.ondragend = () => { return false; };
    SBC.ondrop = (e) => {
        e.preventDefault();
        let index = 0;
        for (let f of e.dataTransfer.files) {
            if (f.type.startsWith("audio/")) {
                const fileName = f.name
                const filePath = f.path
                const position = { left: e.clientX, top: (e.clientY + (index * 100)) }
                index++;
                newSoundFactory(fileName, filePath, position)
            }
        }
        return false;
    }
}
dragDropController();

const obj = {};
const selectedBits = {
    
};
const selectedBitsSet = new Set();
const overviewObject = {};
//what if put the howl declaration here 
// const myHowl = new Howl([]);
//i DID learn to make new variables for new functions. THis reduces mess. 

function newSoundFactory(fileName, filePath, position) {  
    // let name = makeLongRandomNumber();
    // obj[name] = new Howl({  //changed from const sound = new howl
    let name = makeLongRandomNumber();
    const obj = new Object();
    obj[name] = new Howl({  //changed from const sound = new howl
    // myHowl({
        src: [filePath], 
        preload: true,
        onload: () => {
        },
    });
    obj[name].name = name;
    // console.log("name?", obj[name].name);
    // console.log("name?", obj[name]);
    // overviewObject[obj.name] = Object(obj);

    // overviewObject[obj] = Object(obj); //i dont think overviewObject is necessary any longer
    // console.log("the thing", overviewObject);

    // let soundId = sound.play();
    // let soundId = obj[name].play();
    // obj[name].stop(); //sound.play()

// like a punk brae & joey valencio good song 2709 2024
    const soundBox = document.createElement("div");
    soundBox.className = "sound-box-div";
    soundBox.textContent = fileName;
    //here i can go soundbox eventlistener to listen for clicks, so i can have it play on click. that would be sweet. but then it should also have a css on-hover color, in order to let it know.
    soundBox.style.left = `${position.left}px`;
    soundBox.style.top = `${position.top}px`;

    const soundControlPanel = document.createElement("div");
    soundControlPanel.className = "sound-controlpanel-div";

    soundBox.appendChild(soundControlPanel);

    const playButton = document.createElement("button")
    playButton.textContent = "Play";
    playButton.addEventListener("click", () => {
        // sound.play();
        soundBox.style.backgroundColor = "#88ee88";
//have a function that toggles the play state, so the CSS can see it.
//forgive yourself -- and then, forgive everyone who ever slighted you. That's all past. Forgive them and forget it. 
        obj[name].play();

    });

    const stopButton = document.createElement("button")
    stopButton.textContent = "Stop"
    stopButton.addEventListener("click", () => {
        // sound.stop();
        soundBox.style.backgroundColor = "#009688";
        obj[name].stop();
    });
    
    // obj[name].controlFunctions = function backgroundColorStopper() {
    // obj[name].controlFunctions.colorStopper = function backgroundColorStopper() {
    // obj[name][`controlFunctions`][`colorStopper`] = "aaa";
    obj[name].htmlDomRef = soundBox;
    obj[name].controlFunctions = {};
    obj[name].controlFunctions.stopColor = () => { 
        // console.log("hello from controlfunc stopcolor")
        soundBox.style.backgroundColor = "#009688";
    };
    
    // obj[name].controlFunctions = {};

    //den kan jo ikke gøre noget, der ikke findes for den. html-modellen.... hmm...
    // {
        // soundBox.style.backgroundColor = "#009688"
        // console.log("hitting backgroundstopper nside obje name conftolfuntion")
    // }
    
    const repeatButton = document.createElement("button");

    repeatButton.innerHTML = `<img src="./icons/repeat_small.png"></img>`;
    repeatButton.style.backgroundColor = "";
    repeatButton.addEventListener("click", () => { 
        // sound.loop(!sound.loop());
        obj[name].loop(!obj[name].loop());
        // console.log("sound is:", sound.loop())
        // if (sound.loop()) repeatButton.style.backgroundColor = "green";
        if (obj[name].loop()) repeatButton.style.backgroundColor = "green";
        else repeatButton.style.backgroundColor = "";
    });

    const volumeSlider = document.createElement("input");
    volumeSlider.className = "volume-slider-input";
    volumeSlider.type = "range";
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.01;
    // volumeSlider.value = sound.volume();
    volumeSlider.value = obj[name].volume();
    volumeSlider.addEventListener("input", () => {
        // sound.volume(volumeSlider.value);
        obj[name].volume(volumeSlider.value);
    });

    const durationIndicator = document.createElement("div");
    durationIndicator.textContent = `00:00 ${formatTime( obj[name].duration() )}`;

    let animationFrameId;
    // sound.on('play', () => {    updateDuration();    });
    // sound.on('pause', () => {        cancelAnimationFrame(animationFrameId);    });
    // sound.on('stop', () => {        cancelAnimationFrame(animationFrameId);
    obj[name].on('play', () => {    updateDuration();    });
    obj[name].on('pause', () => {        cancelAnimationFrame(animationFrameId);    });
    obj[name].on('stop', () => {        cancelAnimationFrame(animationFrameId);
        durationIndicator.textContent = `00:00 ${formatTime( obj[name].duration() )}`;
    });
    
    function updateDuration() {
        // const seek = s1ound.seek() || 0;
        // const total = sound.duration() || 0;
        const seek = obj[name].seek() || 0;
        const total = obj[name].duration() || 0;
        durationIndicator.textContent = `${formatTime(seek)} ${formatTime(total)}`;
        // if (sound.playing()) { animationFrameId = requestAnimationFrame(updateDuration);  }
        if (obj[name].playing()) { animationFrameId = requestAnimationFrame(updateDuration);  }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    const topRightButtonsBox = document.createElement("div");
    topRightButtonsBox.className = "topRightButtonsBox-div"
    soundBox.appendChild(topRightButtonsBox);

    const dragBox = document.createElement("div")
    dragBox.className = "dragBox-div";
    dragBox.draggable = true;
    topRightButtonsBox.appendChild(dragBox)
 
     dragBox.addEventListener('dragstart', (event) => {
         soundBox.classList.add('dragging');
       });
   
       dragBox.addEventListener('dragend', (event) => {
         const newPosition = { left: event.clientX, top: event.clientY };
         soundBox.style.left = `${newPosition.left - 105}px`;
         soundBox.style.top = `${newPosition.top}px`;
         soundBox.classList.remove('dragging');
        //  saveSound(name, filePath, newPosition);
       });

    const groupBox = document.createElement("div");
    groupBox.className = "groupBox-div";
    groupBox.addEventListener("click", () => {
        if (!soundBox.classList.contains("selected")) {
            soundBox.classList.add("selected");
            selectedBitsSet.add(name);
            // selectedBits.bits = name, ...selectedBits.bits;
            // console.log("now it is:", selectedBitsSet)
            return;
        } else if (soundBox.classList.contains("selected")) {
            soundBox.classList.remove("selected");
            selectedBitsSet.delete(name);
            // console.log("now it is:", selectedBitsSet)
            return;
        }

    })
    topRightButtonsBox.appendChild(groupBox);

    const deleteBox = document.createElement("div");
    deleteBox.className = "deleteBox-div";
    deleteBox.addEventListener("click", () => {
        obj[name].stop();
        obj[name].unload();
        SBC.removeChild(soundBox); 
    });
    topRightButtonsBox.appendChild(deleteBox);
    
    //appending buttons (the order here determines appearance order in the view)
    soundControlPanel.appendChild(volumeSlider);
    soundControlPanel.appendChild(playButton);
    soundControlPanel.appendChild(stopButton);
    soundControlPanel.appendChild(repeatButton);        
    soundControlPanel.appendChild(durationIndicator);

    SBC.appendChild(soundBox);

}