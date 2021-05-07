function mwPlayTrack(titelnummertrack) {
  mwplayer.play(titelnummertrack);
}
function mwStop() {
  mwplayer.pause();
}

(function (mwplayer, mwplayerInstance, container) {
  var mediaPlayer;
  container.value = 0;
  container.play = false;
  container.songId = null;
  container.total = 300;
  container.delta = 100;
  container.customTimer = () => {
    setTimeout(() => {
      container.value--;
      const [titelnummer, tracknumber] = container.songId.split('-');
      if (container.mwProgress) container.mwProgress(titelnummer, tracknumber, (container.total - container.value) / container.total * 100);
      if (container.value > 0 && container.play) container.customTimer();
      else if (container.mwPlayerStop) {
        container.play = false;
        container.mwPlayerStop();
      }
    },container.delta);
  };
  var createInstance = () => {
    var playerdiv = document.getElementById('mwplayer') || document.body.appendChild(document.createElement("div"));
    playerdiv.innerHTML +=  '<div id="mwplayer_div"></div>';
    mediaPlayer = 'exists';
  };
  container[mwplayer] = {
    play: (newId) => {
      if (!mediaPlayer) createInstance();
      if (container.value < 0 || container.songId !== newId) container.value = container.total;
      container.songId = newId;
      container.play = true;
      if (container.mwPlayerStart) container.mwPlayerStart();
      container.customTimer();
    },
    pause: () => {
      container.play = false;
    }
  };
})('mwplayer', 'mwplayerinstance', this);
