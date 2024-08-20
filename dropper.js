const dataObject = {
    arrayOfSelectedBits: [],
    arrPlayFunctions: [],
}

// const CP = document.getElementById("soundboard-controlpanel-div");
function controlPanel() {
    const CP_STOP = document.getElementById("sc-stopbutton-div");
    CP_STOP.addEventListener("click", () => {
        Howler.stop();
    })
    const CP_PLAYALL = document.getElementById("sc-playallbutton-div");
    CP_PLAYALL.addEventListener("click", () => {
        console.log(dataObject)
        dataObject.arrPlayFunctions[0]()
        console.log("you hit playall!")
    })
        const CP_TEST = document.getElementById("sc-testbutton-div");
    CP_TEST.addEventListener("click", () => {
        console.log("test complete !");
    })
}
controlPanel();



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
                createSoundBox(fileName, filePath, position)
            }
        }
        return false;
    }
}
dragDropController();

const selectedBits = [];
const allBits = [];

function createSoundBox(name, filePath, position) {

    function exposeId() {
        console.log("id exposed", soundId);
        return soundId;
    } 

    

    const sound = new Howl({ src: [filePath], preload: true });
    let soundId = sound.play();
    dataObject.arrPlayFunctions.push(sound);
    sound.stop();
    const soundBox = document.createElement("div");
    soundBox.className = "sound-box-div";
    soundBox.textContent = name;
    soundBox.style.left = `${position.left}px`;
    soundBox.style.top = `${position.top}px`;

    const soundControlPanel = document.createElement("div");
    soundControlPanel.className = "sound-controlpanel-div"

    soundBox.appendChild(soundControlPanel);

    const playButton = document.createElement("button")
    playButton.textContent = "Play";
    playButton.addEventListener("click", () => {
        sound.play();
    });
    const stopButton = document.createElement("button")
    stopButton.textContent = "Stop"
    stopButton.addEventListener("click", () => {
        sound.stop();
    })
    const repeatButton = document.createElement("button");

    repeatButton.innerHTML = `<img src="./icons/repeat_small.png"></img>`;
    repeatButton.style.backgroundColor = "";
    repeatButton.addEventListener("click", () => { 
        sound.loop(!sound.loop());
        // console.log("sound is:", sound.loop())
        if (sound.loop()) repeatButton.style.backgroundColor = "green";
        else repeatButton.style.backgroundColor = "";
    });

    const volumeSlider = document.createElement("input");
    volumeSlider.className = "volume-slider-input";
    volumeSlider.type = "range";
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.01;
    volumeSlider.value = sound.volume();
    volumeSlider.addEventListener("input", () => {
        sound.volume(volumeSlider.value);
    });

    const durationIndicator = document.createElement("div");
    durationIndicator.textContent = `00:00 ${formatTime( sound.duration() )}`;

    let animationFrameId;
    sound.on('play', () => {    updateDuration();    });
    sound.on('pause', () => {        cancelAnimationFrame(animationFrameId);    });
    sound.on('stop', () => {        cancelAnimationFrame(animationFrameId);
        durationIndicator.textContent = `00:00 ${formatTime( sound.duration() )}`;
    });
    
    function updateDuration() {
        const seek = sound.seek() || 0;
        const total = sound.duration() || 0;
        durationIndicator.textContent = `${formatTime(seek)} ${formatTime(total)}`;
        if (sound.playing()) { animationFrameId = requestAnimationFrame(updateDuration);  }
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

    //groupbox array place 1934
    const groupBox = document.createElement("div");
    groupBox.className = "groupBox-div";
    groupBox.addEventListener("click", () => {
        console.log("you clicked grouper!");
        console.log("this is id of box:", soundId);
        dataObject.arrayOfSelectedBits.push(soundId);
        console.log("array:", dataObject.arrayOfSelectedBits);
        //add to grouper thing
        //mark as grouped
        //allow for selection

    })
    topRightButtonsBox.appendChild(groupBox);
   

    const deleteBox = document.createElement("div");
    deleteBox.className = "deleteBox-div";
    deleteBox.addEventListener("click", () => {
        sound.stop();
        sound.unload();
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