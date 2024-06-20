const mainVideo = document.getElementById('mainVideo');
const webcamVideo = document.getElementById('webcamVideo');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const constantVideo = 'videos/constant-video.mp4';
const gestureVideo = 'videos/gesture-video.mp4'; // Video to play on gesture detection

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
                const gesture = predictions[0].label;
                if (gesture === 'open') {
                    playVideo(gestureVideo);
                } else {
                    playVideo(constantVideo);
                }
            } else {
                playVideo(constantVideo);
            }
            requestAnimationFrame(runDetection);
        });
    }
}

function playVideo(src) {
    if (mainVideo.src !== src) {
        mainVideo.src = src;
        mainVideo.play();
    }
}

// Initial video setup
mainVideo.src = constantVideo;
mainVideo.play();
