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
    window.onresize();
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

function map(value, a, b, c, d){
    value = (value - a) / (b - a); // first map value from (a..b) to (0..1)
    return Math.round(c + value * (d - c)); // then map it from (0..1) to (c..d) and return it
}

//document.getElementById("canvas").height = window.innerHeight

Chart.defaults.global.defaultFontFamily = "Bebas Neue";
let defaultFontSize = () => map(window.innerWidth, 0, 375, 0, 7);
Chart.defaults.global.defaultFontSize = defaultFontSize();
window.onresize = () => {
    Chart.defaults.global.defaultFontSize = defaultFontSize();
    console.log(defaultFontSize())
}
console.log(defaultFontSize())
console.log(window.innerWidth)

async function PopularityChart(what, canvasContext){
    let {popularityData, artistNames, colors} = await getTop(what);
    let chart = new Chart(canvasContext, {
        type: "horizontalBar",
        data: {
            datasets: [{
                data: popularityData,//artist popularity
                backgroundColor: colors,
                barThickness: "flex"
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
                        //fontSize: 7,
                        fontColor: "#000",
                        padding: 15
                    
                    }
                }],
                xAxes: [{
                    ticks: {
                        //fontSize: 20
                    }
                }]
            },
            title: {
                display: false,
                text: "Your Top Songs by Current Popularity",
                fontSize: 50 
            },
            tooltips: {
                //titleFontSize: 20
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
    //console.log(artists);
    return {popularityData, artistNames, colors}
}
