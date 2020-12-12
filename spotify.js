let artistSection = document.getElementById("topArtists");
let songSection = document.getElementById("topSongs");
let genreSection = document.getElementById("topGenres");
let myAccountSection = document.getElementById("myAccount");

let show = (...elements) => {
    elements.forEach(element => element.style.display = "block");
}
let hide = (...elements) => {
    elements.forEach(element => element.style.display = "none");
}

let afterHash = location.hash.substring(1); //get hash value
if(!afterHash.includes("access_token")){//if there is not an access token in hash then redirect to login page
    window.location.href = "https://accounts.spotify.com/authorize?client_id=b48ae6f543f941a5be1084b45ed74b13&redirect_uri=https://mzamora1.github.io/spotify.html&scope=user-top-read&response_type=token";
}
let hashes = afterHash.split("&").map((hash) => hash.split("="))//split hash string into key, value pairs
let access_token = hashes[0][1];

let canvas = document.getElementById("canvas")


//let colors = ["rgba(255,0,0,0.5)", "rgba(255, 247, 0, 0.5)", "rgba(51, 255, 0, 0.5)", "rgba(0, 195, 255, 0.5)", "rgba(144, 0, 255, 0.5)"]
window.onload = () => {
    hide(artistSection, genreSection, myAccountSection);
}
document.getElementById("topArtistsBtn").onclick = () => {
    show(artistSection);
    hide(songSection, genreSection, myAccountSection);
}
document.getElementById("topSongsBtn").onclick = () => {
    show(songSection);
    hide(artistSection, genreSection, myAccountSection);
}
document.getElementById("topGenresBtn").onclick = () => {
    show(genreSection);
    hide(songSection, artistSection , myAccountSection);
}
document.getElementById("myAccountBtn").onclick = () => {
    show(myAccountSection);
    hide(songSection, artistSection , genreSection);
}




Chart.defaults.global.defaultFontFamily = "Bebas Neue";

async function PopularityChart(what, canvasContext){
    let {popularityData, artistNames, colors} = await getTop(what);
    let chart = new Chart(canvasContext, {
        type: "horizontalBar",
        data: {
            datasets: [{
                data: popularityData,//artist popularity
                backgroundColor: colors,
            }],
            labels: artistNames, //artist names
        },
        options: {
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100,
                        fontSize: 32,
                        fontColor: "#000",
                    
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 20
                    }
                }]
            },
            title: {
                display: false,
                text: "Your Top Songs by Current Popularity",
                fontSize: 50 
            },
            tooltips: {
                titleFontSize: 20
            }
        }
    })
}
let ctx = canvas.getContext("2d");
PopularityChart("tracks",ctx);
let artistCtx = document.getElementById("topArtistcanvas").getContext("2d");
PopularityChart("artists", artistCtx);



async function getTop(what){//what == "artists" or "tracks"
    let response = await fetch(`https://api.spotify.com/v1/me/top/${what}?time_range=short_term`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + access_token,
        }
    })
    let data = await response.json();
    let artists = data["items"];
    let popularityData = [];
    let artistNames = [];
    let colors = [];
    artists.sort((a, b) => {
        if(a.popularity < b.popularity) return -1;
        else if(a.popularity > b.popularity) return 1;
        return 0;
    }).reverse();
    artists.forEach(artist => {
        popularityData.push(artist.popularity);
        artistNames.push(artist.name);
        colors.push(`rgba(${Math.random()*256}, ${Math.random()*256}, ${Math.random()*256}, 0.7)`)
    });
    console.log(artists);
    return {popularityData, artistNames, colors}
}








































//let response = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term", {


class Genre{
    constructor(genre, count){
        this.genre = genre;
        this.count = count;
    }
    increase(){
        console.log("increase!")
        this.count++;
    }
}

//for each artist, search genres 
async function getTopGenres(){
    let response = await fetch(`https://api.spotify.com/v1/me/top/artists`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + access_token,
        }
    })
    let data = await response.json();
    let artists = data["items"];
    let genres = [];
    artists.forEach(artist => {
        artist.genres.forEach(genre => {
           //console.log(typeof genre)
            genres.push(genre);
        })
    })
    console.log(find(genres[3].genre, genres, 0))
    console.log(genres)
    
}
getTopGenres();


function find(string, array, count){
    
    let specialElt = array.find(element => element.genre == string);
    //count++;
    //console.log(count)
    if(specialElt != undefined){
        array = array.filter(elt => elt != specialElt);
        console.log(specialElt + " ****** " + string);

        return find(string, array, count+=1);
    }else {
        console.log(count);
        return count;
    }
}
