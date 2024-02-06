const gridContainer = document.getElementById("gridContainer");
const soundFileInput = document.getElementById("soundFileInput");
const audioPlayer = document.getElementById("audioPlayer");
var gridItems = [];
var audioContext;
var analyser;

initializeGrid();

function initializeGrid() {
    let arr = [];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            const gridItem = document.createElement("div");
            gridItem.setAttribute("id", `grid-item-${i}-${j}`);
            gridItem.classList.add("grid-item");
            arr.push(gridItem);
            gridContainer.appendChild(gridItem);
        }
        gridItems.push(arr);
        arr = [];
    }
}

soundFileInput.addEventListener("change", (event) => {
    const objUrl = URL.createObjectURL(event.target.files[0]);
    audioPlayer.src = objUrl;

    //audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    var source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
});

audioPlayer.addEventListener("play", function () {
    updateGrid();
});

function updateGrid() {
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    gridItems = gridItems.reverse();
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            var frequencyIndex = Math.floor(((6 * j + i) / 36) * bufferLength);
            var colorValue = dataArray[frequencyIndex];

            if (colorValue == 0) colorValue = 255;
            else colorValue = 34;

            gridItems[i][j].style.backgroundColor =
                "rgb(" + colorValue + ", 255, 255)";
        }
    }

    requestAnimationFrame(updateGrid);
}
