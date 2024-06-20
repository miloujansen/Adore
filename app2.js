const mainVideo = document.getElementById('mainVideo');
const mainImage = document.getElementById('mainImage');
const webcamVideo = document.getElementById('webcamVideo');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const thumbnails = document.querySelectorAll('.thumbnails img');

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
                    playMedia('video', gestureVideo);
                } else {
                    playMedia('video', constantVideo);
                }
            } else {
                playMedia('video', constantVideo);
            }
            requestAnimationFrame(runDetection);
        });
    }
}

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        const type = thumbnail.getAttribute('data-type');
        const src = thumbnail.getAttribute('data-src');
        playMedia(type, src);
    });
});

function playMedia(type, src) {
    if (type === 'video') {
        mainImage.style.display = 'none';
        mainVideo.style.display = 'block';
        if (mainVideo.src !== src) {
            mainVideo.src = src;
            mainVideo.play();
        }
    } else if (type === 'image') {
        mainVideo.style.display = 'none';
        mainImage.style.display = 'block';
        mainImage.src = src;
    }
}

// Initial video setup
playMedia('video', constantVideo);
