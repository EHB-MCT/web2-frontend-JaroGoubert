let boardgame = [];
let loading = true;


async function getData() {
    loading = true;
    const reponse = await fetch('https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&pretty=true&client_id=JLBr5npPhV')
    const data = await reponse.json();
    boardgame = data.games;
}

getData()
    .then(() => {
        buildList();
    })
    .finally(() => {
        loading = false;
    });

function buildList() {
    let html = '';
    for (let b of boardgame) {
        html += `<div class="card-grid">
        <div class="card">
            <div class="card-header card-image">
                <img class="" src="${b.image_url}" alt="Card image cap">
            </div>
            
            <div class="card-body">
            <h2 class="card-title">${b.name}</h2>
                <p>aantal spelers: ${b.min_players} - ${b.max_players}</p>
                <p>prijs: ${b.price_text}</p>
            </div>
            <div class="card-footer">
                <a href="newGame.html?atlasId=${b.id}" id="${b.id}"class="btn">toevoegen</a>
                <button href="#" id="${b.id}" class="btn btn-outline open">meer info</button>
            </div>
    </div>
    </div>`
        document.getElementById('list').innerHTML = html;
    }


    // make popup
    let popup = document.getElementById("popup");

    console.log(popup);

    function openPopup() {
        popup.classList.add("open-popup");
    }

    function closePopup() {
        popup.classList.remove("open-popup");
    }

    function moreInfo(gameId) {
        console.log("Dit is het game Id" + gameId);
        let html = '';

        for (let b of boardgame) {
            if (gameId == b.id) {
                html += `
                <div class="popup-grid">
                    <div class="popup-image">
                        <img class="" src="${b.image_url}" alt="game">
                    </div>
                    
                    <div class="content">
                    <h2>${b.name}</h2>
                        <p>aantal spelers: ${b.min_players} - ${b.max_players}</p>
                        <p>prijs: ${b.price_text}</p>
                        <p>Speeltijd: ${b.min_playtime} - ${b.max_playtime}</p>
                        <p>beschrijving: ${b.description_preview}</p>
                        <p>spelregels:<a href="${b.rules_url}"> ${b.rules_url}</a></p>
                    </div>
                    </div>
                    
           `
                document.getElementById("close").addEventListener("click", closePopup);
                document.getElementById('popupContent').innerHTML = html;
            }

        }
    }

    //add event listeners
    document.querySelectorAll('.open').forEach(button => {
        button.addEventListener('click', event => {
            console.log(event.target.id);
            openPopup();
            moreInfo(event.target.id);

        });
    })
}
