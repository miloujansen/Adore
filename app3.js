const mainVideo = document.getElementById('mainVideo');
const webcamVideo = document.getElementById('webcamVideo');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const constantVideo = 'Adore Demo.mp4';
let model;
let isVideo = false;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video
    maxNumBoxes: 1,         // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
};

// Load the Handtrack.js model
handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
    startVideo();
});

function startVideo() {
    handTrack.startVideo(webcamVideo).then(status => {
        if (status) {
            isVideo = true;
            runDetection();
        } else {
            console.log("Please enable video");
        }
    });
}

function runDetection() {
    if (isVideo) {
        model.detect(webcamVideo).then(predictions => {
            model.renderPredictions(predictions, canvas, context, webcamVideo);
            if (predictions.length > 0) {
                mainVideo.pause();
            } else {
                if (mainVideo.paused) {
                    mainVideo.play();
                }
            }
            requestAnimationFrame(runDetection);
        });
    }
}

mainVideo.addEventListener('ended', () => {
    holdFrameAndReverse(mainVideo);
});

// Initial video setup
mainVideo.src = constantVideo;
mainVideo.play();

