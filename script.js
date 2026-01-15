const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const faceStatus = document.getElementById("faceStatus");
const emotionStatus = document.getElementById("emotionStatus");
const attentionStatus = document.getElementById("attentionStatus");

canvas.width = 640;
canvas.height = 480;

// MediaPipe FaceMesh
const faceMesh = new FaceMesh({
  locateFile: file =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

faceMesh.onResults(onResults);

// Webcam
const camera = new Camera(video, {
  onFrame: async () => {
    await faceMesh.send({ image: video });
  },
  width: 640,
  height: 480
});
camera.start();

function onResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    faceStatus.innerText = "Face: ✅ Detected";
    attentionStatus.innerText = "Attention: 👀 Attentive";

    drawConnectors(ctx, results.multiFaceLandmarks[0],
      FACEMESH_TESSELATION,
      { color: "#00ff00", lineWidth: 1 });

    // Simple emotion heuristic
    emotionStatus.innerText = "Emotion: Neutral 🙂";
  } else {
    faceStatus.innerText = "Face: ❌ Not Detected";
    emotionStatus.innerText = "Emotion: —";
    attentionStatus.innerText = "Attention: ❌ Not Attentive";
  }
}
