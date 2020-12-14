Chart.defaults.global.defaultFontFamily = "Bebas Neue";
let artistSection = document.getElementById("topArtists");
let songSection = document.getElementById("topSongs");
let genreSection = document.getElementById("topGenres");
let myAccountSection = document.getElementById("myAccount");
let allCanvas = Array.from(document.querySelectorAll("canvas"));
let ctx = document.getElementById("canvas").getContext("2d");
let artistCtx = document.getElementById("topArtistcanvas").getContext("2d");

let afterHash = window.location.hash.substring(1); //get hash value
if(!afterHash.includes("access_token")){//if there is not an access token in hash then redirect to login page
    window.location.href = "https://accounts.spotify.com/authorize?client_id=b48ae6f543f941a5be1084b45ed74b13&redirect_uri=https://mzamora1.github.io/spotify.html&scope=user-top-read&response_type=token";
    //window.location.href = "https://accounts.spotify.com/authorize?client_id=b48ae6f543f941a5be1084b45ed74b13&redirect_uri=http://127.0.0.1:5500/spotify.html&scope=user-top-read&response_type=token";
}
let hashes = afterHash.split("&").map(hash => hash.split("="))//split hash string into property, value pairs
let access_token = hashes[0][1];

let show = (...elements) => {
    elements.forEach(element => element.style.display = "block");
}
let hide = (...elements) => {
    elements.forEach(element => element.style.display = "none");
}



//event handlers
window.onload = () => {
    window.onresize();
    hide(artistSection, genreSection, myAccountSection);
    PopularityChart("tracks",ctx);//top songs will show by default
}
window.onresize = () => {
    let defaultFontSize = () => {
        function map(value, a, b, c, d){
            value = (value - a) / (b - a); // first map value from (a..b) to (0..1)
            return Math.round(c + value * (d - c)); // then map it from (0..1) to (c..d) and return it
        }
        return map(window.innerWidth, 0, 2279, 10, 30); //smallest font is 10 largest is 30
    }
    Chart.defaults.global.defaultFontSize = defaultFontSize();
    allCanvas.forEach(canvas => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })
    console.log(defaultFontSize())
}

for(let btn of Array.from(document.querySelectorAll("nav ul li a"))){ //nav links will close menu and rotate back when clicked 
    btn.addEventListener("click", () => {
        document.querySelector("header nav ul").classList.toggle("open");
        document.getElementById("rotateRight").classList.toggle("rotateRight");
        document.getElementById("rotateLeft").classList.toggle("rotateLeft");
        document.getElementById("remove").classList.toggle("remove");
    })
}
document.getElementById("hamburger").onclick = () => { // open/close menu when hamburger is clicked 
    document.querySelector("header nav ul").classList.toggle("open");
    document.getElementById("rotateRight").classList.toggle("rotateRight");
    document.getElementById("rotateLeft").classList.toggle("rotateLeft");
    document.getElementById("remove").classList.toggle("remove");
}

document.getElementById("topArtistsBtn").onclick = () => {
    show(artistSection);
    hide(songSection, genreSection, myAccountSection);
    setTimeout(()=> PopularityChart("artists", artistCtx), 660);
    listTop()
    
}
document.getElementById("topSongsBtn").onclick = () => {
    show(songSection);
    hide(artistSection, genreSection, myAccountSection);
    setTimeout(()=> PopularityChart("tracks", ctx), 660);

}
document.getElementById("topGenresBtn").onclick = () => {
    show(genreSection);
    hide(songSection, artistSection , myAccountSection);
}
document.getElementById("myAccountBtn").onclick = () => {
    show(myAccountSection);
    hide(songSection, artistSection , genreSection);
}

//get data from spotify api
async function getTop(what){//what == "artists" or "tracks"
    let response = await fetch(`https://api.spotify.com/v1/me/top/${what}?time_range=medium_term`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + access_token,
        }
    })
    let data = await response.json();
    return data["items"];
}


//display data in a chart
async function PopularityChart(what, canvasContext){
    let artists = await getTop(what);
    artists.sort((a, b) => { //sort by popularity
        if(a.popularity > b.popularity) return -1;
        else if(a.popularity < b.popularity) return 1;
        return 0;
    });
    let popularityData = [];
    let artistNames = [];
    let colors = [];
    //let lightness = 55;
    //let hue = 0;
    let hue = 143;
    let lightness = 73;
    artists.forEach(artist => { 
        popularityData.push(artist.popularity);
        artistNames.push(artist.name);
        //colors.push(`hsl(${hue += 15}, 75%, ${lightness -= 0}%)`);
        colors.push(`hsl(${hue += 0}, 75%, ${lightness -= 3}%)`);
        //colors.push(`rgba(${Math.random()*256}, ${Math.random()*256}, ${Math.random()*256}, 0.7)`)
    });
    
    return new Chart(canvasContext, {
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
    });
}

async function listTop(what){
    let artistsOrSongs = await getTop(what);
    let items = []
    artistsOrSongs.forEach(artist => {
        let item = document.createElement("li");
        item.textContent = artist.name;
        items.push(item);
    })
    console.log(artistsOrSongs);
    return items;
}
(async ()=>{

    let topSongs = await listTop("tracks");
    topSongs.forEach(song => document.getElementsByClassName("list")[0].appendChild(song));
    
    let topArtists = await listTop("artists");
    topArtists.forEach(artist => document.getElementsByClassName("list")[1].appendChild(artist));


})()

//listTop("artists", )

//on load get data from spotify
//then draw chart
//then list items



