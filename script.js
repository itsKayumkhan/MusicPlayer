let url = "https://itunes.apple.com/search?term=Arjit shing";

const add_btn = document.getElementsByClassName("add-btn");
let prv_btn;
let index;
let player = document.getElementsByClassName("player")[0];
let data;
let audio;

let song_list;

const search_song = () => {
  let item = search.value;
  url = `https://itunes.apple.com/search?term=${item}`;

  // console.log(url);

  music(url, 0);
};
// console.log(url);

const music = async (link, index = 0) => {
  try {
    const response = await fetch(link);
    data = await response.json();
  

    const artist = data.results[index].artistName;
    const songName = data.results[index].trackName;
    const audioSrc = data.results[index].previewUrl;
    const img = data.results[index].artworkUrl100;


    player.innerHTML = `
      <div class="player-btn info-song">
        <div class="audio">
          <audio id="audio-play">
            <source id="source" src="${audioSrc}" />
          </audio>
        </div>
      
        <div class="title">
          <h1 class="title-name" id="title_name">${songName}</h1>
        </div>
        <div class="artist">
          <h1 class="artist-name" id="artist_name">${artist}</h1>
        </div>
      </div>
      <div id="ani" class="player-btn img" >
        <img id="logo" src="${img}" alt="" />
      </div>
      <div class="player-btn buttons">
        <div class="bg" id="bg">
        <input type="range" min="0" max="100" value="0" name="control" id="progress">
        </div>
        <div class="p">
          <p id="p">00.00</p>
          <p id="tot">00.00</p>
        </div>
    
        <div class="controals">
          <div class="same-btn btn add-btn" id="add">
            <ion-icon class="add" name="add-outline"></ion-icon>
          </div>
          <div class="btn prv-btn" id="prv">
            <ion-icon
              class="same-btn prv track"
              name="play-skip-back-outline"
            ></ion-icon>
          </div>
          <div class="btn btn-play">
            <ion-icon
              class="same-btn play"
              id="play"
              name="play-outline"
            ></ion-icon>
            <ion-icon
              class="same-btn play pause"
              id="pause"
              name="pause-outline"
            ></ion-icon>
          </div>
          <div class="btn next-btn" id="next">
            <ion-icon
              class="same-btn next track"
              name="play-skip-forward-outline"
            ></ion-icon>
          </div>
          <div class="same-btn btn list-btn" id="my-list">
            <ion-icon name="list-outline"></ion-icon>
          </div>
        </div>
      </div>`;

    audio = document.getElementById("audio-play");
    let play_btn = document.getElementById("play");
    let pause_btn = document.getElementById("pause");
    const next_btn = document.getElementById("next");
    const photo = document.getElementById("ani");
    prv_btn = document.getElementById("prv");
    const add = document.getElementById("add");

  

    const search = document.getElementById("search");

    const plays = () => {
      audio.play();
      play_btn.setAttribute("id", "hide");
      pause_btn.setAttribute("id", "unhide");
      photo.classList.add("rotate");
    };

    play_btn.addEventListener("click", () => {
      plays();
    });

    pause_btn.addEventListener("click", () => {
      audio.pause();
      play_btn.setAttribute("id", "unhide");
      pause_btn.setAttribute("id", "hide");
      photo.classList.remove("rotate");
    });

    if (index >= 0) {
      prv_btn.addEventListener("click", () => {
        if (index == 0) index = 0;
        else index--;
        music(url, index);
        plays();
      });
    }

    if (index <= data.results.length) {
      next_btn.addEventListener("click", () => {
        plays();
        index++;
        music(url, index);
      });
    }

    audio.ontimeupdate = () => {
      p.innerHTML = audio.currentTime.toFixed(2);
      tot.innerHTML = audio.duration.toFixed(2);

      progress.value = `${Math.floor(
        100 * (audio.currentTime / audio.duration)
      )}`;

      bg.onclick = function (e) {
        audio.currentTime = (e.offsetX / bg.offsetWidth) * audio.duration;
      };

      if (audio.currentTime == audio.duration) {
        photo.classList.remove("rotate");
        audio.currentTime = 0;
        index++;
        music(url, index);
      }

      if (audio.currentTime == 0) {
        plays();
      }
    };

    let search_song_list = document.getElementById("search-song-list");

    search_song_list.innerHTML = data.results
      .map((e, key) => {
        return `<div id=${key} class="song-list-item" id="song_list_item">
          <img src="${e.artworkUrl100}" class="comman" alt="img" />
          <div class="side-name">
            <h2 class="side-title">${e.trackName}</h2>
            <h4 class="side-artist artist">${e.artistName}</h4>
          </div>
        </div>`;
      })
      .join("");

    // song_list = document.getElementById("song_list_item");

    let songItems = Array.from(
      document.getElementsByClassName("song-list-item")
    );

    let title_name = document.getElementById("title_name");
    let artist_name = document.getElementById("artist_name");
    let logo = document.getElementById("logo");
    let source = document.getElementById("audio-play");

    songItems.forEach((songItem, i) => {
      songItem.addEventListener("click", () => {
        // console.log(i);
        index = i;
        let selectedSong = data.results[i];
        title_name.textContent = selectedSong.trackName;
        artist_name.textContent = selectedSong.artistName;
        logo.src = selectedSong.artworkUrl100;
        source.src = selectedSong.previewUrl;
        source.play();
        plays();
      });
    });
    //add in my-playlist
    let listItem;
    const mySongList = document.getElementById("songlist");
    add.addEventListener("click", () => {
      const songTouch = data.results[index];
      // console.log(songTouch);
      // music(url,index)

      listItem = document.createElement("div");
      listItem.className = "list-song";

      let c = 0;
      listItem.innerHTML = `
          <div class="playlist-img list-song-item" >
            <img src="${songTouch.artworkUrl100}" class="comman" alt="img" />
          </div>

          <div class="playlist list-song-item">
            <h2 class="playlist-title">${songTouch.trackName}</h2>
            <h4 class="playlist-artist artist">${songTouch.artistName}</h4>
          </div>

          <div class="same-btn list-song-item remove-btn" id="remove" class="remove">
          <ion-icon name="remove-outline"></ion-icon>
          </div>
        `;

      mySongList.appendChild(listItem);
    });

    // debugger

    // let myFavList = Array.from(document.getElementsByClassName("listItem"));

    // myFavList.forEach((mySongListItem, i) => {
    //   mySongListItem.addEventListener("click", () => {
    //     index = i;
    //     let selectedSong = data.results[i];
    //     title_name.textContent = selectedSong.trackName;
    //     artist_name.textContent = selectedSong.artistName;
    //     logo.src = selectedSong.artworkUrl100;
    //     source.src = selectedSong.previewUrl;
    //     source.play();
    //     plays();
    //     player.style.background = "black";
    //   });
    // });

    //remove btn

    // document.getElementsByClassName("remove").addEventListener("click", () => {
    //   document.querySelector(".list-song").remove();
    //   // mySongList.removeChild(listItem);
    //   // mySongList.setAttribute("id","hide");
    // })
 
    
    
    

  } catch (error) {
    console.log("error");
  }
};

music(url);
