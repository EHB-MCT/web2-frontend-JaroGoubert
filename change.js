const searchParam = new URLSearchParams(window.location.search);
const updateData = { bgid: searchParam.get('bgid') };
let allSavedGame = "";
let amountOfUsers;

let loading = true;

async function getData() {
    loading = true;
    const reponse = await fetch('http://localhost:3000/games')
    const data = await reponse.json();
    allSavedGame = data;
    console.log(allSavedGame);
}
getData()
    .then(() => {
        fillForm();
    })
    .finally(() => {
        loading = false;
        eventListeners();
    });

function fillForm() {
    if (searchParam.has('bgid')) {
        const bgid = searchParam.get('bgid');
        console.log(bgid);
        for (let s of allSavedGame) {


            if (s.bgid == bgid) {


                document.getElementById("date").value = s.date;
                document.getElementById("game").value = s.game;
                document.getElementById("atlasID").value = s.atlasID;
                document.getElementById("first").value = s.first;
                document.getElementById("second").value = s.second;
                document.getElementById("third").value = s.third;
                document.getElementById("minUsers").value = s.minUsers;
                document.getElementById("maxUsers").value = s.maxUsers;
                amountOfUsers = s.users.length;
                genrateUsersDiv(s.users);

            }

        }
    } else {
        window.location.href = 'allSavedGames.html';
    }
}

function genrateUsersDiv(users) {
    const usersDiv = document.getElementById('users');
    users.forEach((element, index) => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');
        const html = `
            <h5>Speler ${index + 1}</h5>
            <div class="field"><input value="${element.name}" required type="text" name="name" id="name${index}" placeholder="Naam"></div>
            <div class="field"><input value="${element.firstname}" required type="text" name="firstname" id="firstname${index}" placeholder="Voornaam"></div>
            <div class="field"><input value="${element.email}" required type="email" name="email" id="email${index}" placeholder="Email"></div>
            <div class="field"><input value="${element.points}" required type="points" name="points" id="points${index}" placeholder="Points"></div>`;

        userDiv.innerHTML = html;
        usersDiv.appendChild(userDiv);
    });

}


async function send() {
    const options = {
        method: 'PATCH',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    };
    await fetch("http://localhost:3000/updateGame", options)
    console.log(updateData);

}

console.log(updateData);
function eventListeners() {
    document.getElementById('newGameForm').addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();
        send();
        document.getElementById('message').innerHTML = "uw spel is gewijzigd";

    });
    document.querySelectorAll('#gameData input').forEach(element => {
        element.addEventListener('change', (event) => {
            updateData[event.target.name] = event.target.value;
        });
    })

    document.querySelectorAll('#users input').forEach(element => {
        element.addEventListener('change', (event) => {
            if (!updateData.hasOwnProperty('users')) {
                updateData.users = {};
            }
            const currentEmail = event.target.parentElement.parentElement.querySelector('input[name="email"]').value;
            if (!updateData.users.hasOwnProperty(currentEmail)) {
                updateData.users[currentEmail] = {};
            }
            updateData.users[currentEmail][event.target.name] = event.target.value;
        });
    })
}