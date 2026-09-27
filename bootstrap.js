import "./engine/src/main.js";
const settings = new window.Settings();
settings.engine.tool = false;
settings.tool.server.enabled = false;
// Only the launch surface lives in HTML. JML Engine owns all demo frames and audio.
document.getElementById("start").onclick = () => {
  document.body.classList.add("playing");
  document.documentElement.requestFullscreen?.().catch(() => {});
  window.startDemo();
};
