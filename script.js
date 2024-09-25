// const path=require("path")
// const dpath=path.join(__dirname)
let currentSong = new Audio()
play = document.querySelector(".playbar .play")
let songmap = {}
let currfolder;
let address = "http://127.0.0.1:3000"
function titlecase(str){
        return str
            .toLowerCase()  // Convert the whole string to lowercase
            .split(' ')     // Split the string into an array of words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize the first letter of each word
            .join(' ');     // Join the words back into a single string
    }
async function getsongs(folder) {
    let songs = []
    currfolder = folder
    

    let a = await fetch(`${address}/${currfolder}/`)
  


    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response


    let as = div.getElementsByTagName("a")

    


    for (let i = 0; i < as.length; i++) {
        

        if (as[i].href.endsWith("mp3")) {
           

            let originalfile = as[i].href.split(`/${currfolder}/`)[1];
            

            let filename = originalfile.replace(".mp3", "");
             filename=filename.replaceAll("|","  ")

            filename = filename.replace(/_/g, " ");

            filename = filename.replace(/\(.*\)/g, "-");
            filename = filename.replace(/\[.*\]/g, "-");
            filename = filename.replace(/%20-%20Copy/g, "");
            filename = filename.replace(/%20/g, " ");
            filename = filename.replace(/Official Video/gi, "")
                .replace(/Offical Video/gi, "")
                .replace(/Official Audio/gi, "")
                .replace(/full video/gi, "")
                .replace(/Official/g,"")
                .replace(/Home Session/gi, "")
                .replace(/Music Video/gi, "")
                .replace(/Latest/gi, "")
                .replace(/New Song/gi, "")
                .replace(/New EP/gi, "");
            filename=titlecase(filename)
            if (filename.includes("Punjabi")) {
                filename = filename.split("Punjabi")[0].trim()
            }
            let parts = filename.split(" - ");
        //    filename = filename.toLowerCase()
            if (parts.length >= 2) {
                let singer = parts[0].trim();
                let songName = parts[1].split(" Ft")[0].trim();
               

                songName = songName.replace("-", "")

                let cleanedname = `${songName} - ${singer}`
                songmap[cleanedname] = originalfile
                songs.push(cleanedname);
            }
            else if (filename.includes("Wala")) {
                filename=filename.toLowerCase()
                filename = filename.split("wala")[0].trim() + " wala"
                aftersplit = filename.split("sidhu")
                filename = aftersplit[0].replace("-", "") + "- " + "sidhu" + aftersplit[1].replaceAll("-", "")

                songs.push(filename)
                songmap[filename] = originalfile
            }
            else {
                songs.push(filename)
                songmap[filename] = originalfile
            }
        }

    }
    return songs;
}


const playsong = (track, pause = false) => {
    currentSong.src = `${address}/${currfolder}/` + songmap[track]
    if (!pause) {
        currentSong.play()
        play.src = "/iimages/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = `${track}`
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
};

function convertTime(seconds) {
    // Handle invalid input by returning '00:00'
    if (isNaN(seconds) || seconds < 0) {
        return '00:00';
    }

    // Round down to the nearest whole second
    const roundedSeconds = Math.floor(seconds);

    // Convert seconds to minutes
    const minutes = Math.floor(roundedSeconds / 60);

    // Get remaining seconds
    const remainingSeconds = roundedSeconds % 60;

    // Pad with leading zeros if necessary and return the formatted string
    return String(minutes).padStart(2, '0') + ':' + String(remainingSeconds).padStart(2, '0');
}

function animateul(ul){
let li=l.getElementsByTagName("li")
gsap.from(li,{
    // height:0,
    // padding:0,
    opacity:0,
    duration:1,
    y:"-20%",
    stagger:0.5

})
}
function addsongs(songs) {
    let ul = document.querySelector(".songs ul")
    ul.innerHTML = ""
    let lis = ul.getElementsByTagName("li")
    for (const song of songs) {
        ul.innerHTML = ul.innerHTML + `<li> <img src="iimages/music.svg" alt="">
                        <div class="song">
                            <div class="songname">
                                ${song} 
                            </div>
                                
                        </div>
                        <div class="playnow">
                            <span class="play">
                                Playnow
                            </span>
                            <img src="iimages/play.svg" alt="">
                        </div></li>`

        Array.from(lis).forEach(e => {
            e.addEventListener("click", () => {
                playsong(e.querySelector(".songname").innerHTML.trim())
            })
        })
    }
}
async function main() {
    let songs = await getsongs("songs/cs")
    document.querySelector(".songinfo").innerHTML = `${songs[0]}`

    addsongs(songs)
    playsong(songs[0], true)


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/iimages/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "/iimages/play.svg"
        }

    }
    )
    currentSong.addEventListener("timeupdate", () => {
        

        document.querySelector(".songtime").innerHTML = `${convertTime(currentSong.currentTime)}/${convertTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%"
        document.querySelector(".progress").style.width = currentSong.currentTime / currentSong.duration * 100 + "%"

    }
    )
    document.querySelector(".seekbar").addEventListener("click", e => {
        clickpositionpercent = e.offsetX / e.target.getBoundingClientRect().width * 100;
        document.querySelector(".circle").style.left = clickpositionpercent
        currentSong.currentTime = (clickpositionpercent / 100) * currentSong.duration

    })

    document.querySelector(".ham").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
        document.querySelector(".left").style.position = "fixed"
    }
    )

    document.querySelector(".close").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "-100vw"

    }
    )

    let previous = document.querySelector(".previous")
    let next = document.querySelector(".next")

    previous.addEventListener("click", () => {
        let songsrc = currentSong.src.split(`/${currfolder}/`)[1]
        let songkey = Object.keys(songmap).find(function (key) {
            return songmap[key] == songsrc
        })
        let index = songs.indexOf(songkey)

        if (index == 0) {
            playsong(songs[index])
        }
        else {
            playsong(songs[index - 1])
        }

    })
    next.addEventListener("click", () => {
        let songsrc = currentSong.src.split(`/${currfolder}/`)[1]
       

        let songkey = Object.keys(songmap).find(function (key) {
            return songmap[key] == songsrc
        })
        let index = songs.lastIndexOf(songkey)
        previndex = index
        if (index == songs.length - 1) {
            playsong(songs[0])
        }
        else {
            playsong(songs[index + 1])
        }
    }
    )
    document.querySelector(".volume").querySelector("input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100



    }
    )
    volumeicon = document.querySelector(".volume img")
    volumeicon.addEventListener("click", () => {
        if (currentSong.volume > 0) {
            previousVolume = currentSong.volume;
            previousValue = document.querySelector(".volume").querySelector("input").value
            currentSong.volume = 0;
            volumeicon.src = "/iimages/volumestop.svg"
            document.querySelector(".volume").querySelector("input").value = 0
        } else {
            document.querySelector(".volume").querySelector("input").value = previousValue
            currentSong.volume = previousVolume;
            volumeicon.src = "/iimages/volume.svg"
        }
    })
    async function changelib(foldername) {
        let newsongs = await getsongs(`/songs/${foldername}`)
        songs.splice(0)
        for (const element of newsongs) {
            songs.push(element)
        }
       

        addsongs(songs)
        playsong(songs[0])
    }
    let cards = document.querySelectorAll(".card")
    Array.from(cards).forEach(item => {
        item.addEventListener("click", (e) => {
            let foldername = e.currentTarget.dataset.folder;
            changelib(foldername)
            if (document.querySelector(".left").style.left = "-100vw") {
                document.querySelector(".left").style.left = "0"
            }
        })
    }
    )

}



main()

