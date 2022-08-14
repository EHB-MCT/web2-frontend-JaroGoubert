import Game, { User } from "./game.js";
let amountOfUsers = 0;
const searchParam = new URLSearchParams(window.location.search);
let boardgame;
let loading = true;


if (searchParam.has('atlasId')) {
    const atlasId = searchParam.get('atlasId');
    getBoardgameByAtlasId(atlasId).then(() => {
        document.getElementById("game").value = boardgame.name;
        document.getElementById("atlasID").value = boardgame.id;
        document.getElementById("minUsers").value = boardgame.min_players;
        document.getElementById("maxUsers").value = boardgame.max_players;
    })
        .finally(() => {
            loading = false;
        });

} else {
    window.location.href = 'allgames.html';
}

async function getBoardgameByAtlasId(id) {
    loading = true;
    const reponse = await fetch(`https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&pretty=true&client_id=JLBr5npPhV&ids=${id}`)
    const data = await reponse.json();
    if (data.count !== 1) {
        //error
    } else {
        boardgame = data.games[0];
    }
}

addUsersDiv();


function send() {

    let date = document.getElementById('date').value;
    let game = document.getElementById('game').value;
    let atlasId = document.getElementById('atlasID').value;
    let first = document.getElementById('first').value;
    let second = document.getElementById('second').value;
    let third = document.getElementById('third').value;
    let minUsers = document.getElementById('minUsers').value;
    let maxUsers = document.getElementById('maxUsers').value;
    let currentGame = new Game(date, game, atlasId, first, second, third, minUsers, maxUsers, []);

    const users = document.getElementsByClassName('user');
    for (const user of users) {
        const name = user.querySelector('input[name="name"]').value;
        const firstname = user.querySelector('input[name="firstname"]').value;
        const email = user.querySelector('input[name="email"]').value;
        const points = user.querySelector('input[name="points"]').value;
        const newUser = new User(name, firstname, email, points);
        currentGame.addUser(newUser);
    }
    currentGame.insertCurrentGame().then(data => {
        console.log(data)
    });
}
document.getElementById('newGameForm').addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();
    send();
    window.location.href = 'allgames.html';

});
document.getElementById('addUser').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (amountOfUsers < document.getElementById('maxUsers').value) {
        addUsersDiv();
    } else {
        document.getElementById("addUser").disabled = true;
        document.getElementById('maxUsersAlert').innerHTML = "maximum aantal gebruikers bereikt";

    }

})
// Adds the user input fields to div of users

function addUsersDiv() {
    amountOfUsers++;
    const userDiv = document.createElement('div');
    userDiv.classList.add('user');
    const html = `
        <h5>Speler ${amountOfUsers}</h5>
        <div class="field"><input required type="text" name="name" placeholder="Naam"></div>
        <div class="field"><input required type="text" name="firstname" placeholder="Voornaam"></div>
        <div class="field"><input required type="email" name="email" placeholder="Email"></div>
        <div class="field"><input required type="points" name="points" placeholder="Points"></div>`;

    userDiv.innerHTML = html;
    document.getElementById('users').appendChild(userDiv);

}
