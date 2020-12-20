import * as blazeface from '@tensorflow-models/blazeface';

let model, ctx, videoWidth, videoHeight, video, canvas;
var x , y;

async function setupCamera() {
    video = document.getElementById('video');

    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': { facingMode: 'user' },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

const renderPrediction = async () => {

    const returnTensors = false;
    const flipHorizontal = true;
    const annotateBoxes = true;
    const predictions = await model.estimateFaces(
        video, returnTensors, flipHorizontal, annotateBoxes);
    // console.log(predictions);
    // console.log(predictions.length);

    if (predictions.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < predictions.length; i++) {
          if (returnTensors) {
              predictions[i].topLeft = predictions[i].topLeft.arraySync();
              predictions[i].bottomRight = predictions[i].bottomRight.arraySync();
              if (annotateBoxes) {
                  predictions[i].landmarks = predictions[i].landmarks.arraySync();
            }
        }

        if (annotateBoxes) {
            const landmarks = predictions[i].landmarks;
            // console.log(landmarks);

            ctx.fillStyle = "rgba(255, 0, 0)";
            for (let j = 0; j < 2; j++) {
                x = landmarks[1][0];
                y = landmarks[1][1];
                testing123(x, y);
                // ctx.fillRect(x, y, 5, 5);
            }
        }
      }
  }

  requestAnimationFrame(renderPrediction);
//   console.log(x,y)
  return x , y;
};


const setupPage = async () => {
    await setupCamera();
    video.play();

    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    canvas = document.getElementById('output');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";

    model = await blazeface.load();
    console.log("Model Loaded............");

    renderPrediction();
};

setupPage();
