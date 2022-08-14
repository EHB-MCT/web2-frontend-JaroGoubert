let allSavedGame;
let loading = true;
let select = document.querySelector('select');
let names = [];
let points = [];

async function getData() {

    loading = true;
    const reponse = await fetch('http://localhost:3000/games')
    const data = await reponse.json();
    allSavedGame = data;

}
getData()
    .then(() => {
        buildGameList();
    })
    .finally(() => {
        loading = false;
        eventListeners();
    });


function buildGameList() {
    let html = '<div class="selectOption"><option style="background:black; color:white;" value="kies">kies een spel</option></div>';
    for (let s of allSavedGame) {
        html += `<div class="selectOption"><option style="background:black; color:white;" value="${s._id}">${s.game} + ${s.date}</option></div>`
        document.getElementById('chooseMenu').innerHTML = html;
    }
}
function eventListeners() {
    select.addEventListener('change', () => {

        let selected = select.value;
        generateBars();
        for (let s of allSavedGame) {
            if (s._id === selected) {   
                let html = `<div><h3>Naam</h3>
                <p>${s.game}</p></div>
                <div><h3>Datum</h3>
                <p>${s.date}</p></div>
                <div><h3>Spel ID</h3>
                <p>${s.atlasID}</p></div>
                <div><h3>Eerste</h3>
                <p>${s.first}</p></div>
                <div><h3>Tweede</h3>
                <p>${s.second}</p></div>
                <div><h3>Derde</h3>
                <p>${s.third}</p></div>
                <div><h3>Min aantal spelers</h3>
                <p>${s.minUsers}</p></div>
                <div><h3>Max aantal spelers</h3>
                <p>${s.maxUsers}</p></div><div>`
                let buttons = `
                <a href="change.html?bgid=${s.bgid}" id="${s.bgid}"class="btn">wijzig</a>
                <button href="#" id="${s.bgid}" class="btn btn-outline delete">Verwijder</button></div>
                `
                document.getElementById('allgames').innerHTML = html;
                document.getElementById('buttons').innerHTML = buttons;
                genrateUsersDiv(s.users);       
            }


        }
        
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', event => {
                console.log(event.target.id);
                const options = {
                    method: 'DELETE',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                if (window.confirm('uw spel is verwijderd')) {
                    fetch('http://localhost:3000/deleteGame?id=' + event.target.id, options)


                    window.location.reload();
                }

            });
        })
    })
}
function genrateUsersDiv(users) {
    
    names = [];
    points = [];
    document.getElementById('allusers').innerHTML = "";
    const usersDiv = document.getElementById('allusers');
    users.forEach((element, index) => {
        names.push(element.name);
        points.push(Number(element.points));
        console.log(names);
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');
        const html = `
        <div><h3>speler${index +1 }</h3></div>
        <div><h4>Naam</h4>
        <p>${element.firstname} ${element.name}</p></div>
        <div><h4>Naam</h4>
        <p>${element.email}</p></div>
        <div><h4>Naam</h4>
        <p>${element.points}</p></div>`;

        userDiv.innerHTML = html;
        usersDiv.appendChild(userDiv);
    });

}

function generateBars() {
    var options = {
        series: [{
            name: 'Inflation',
            data: points
        }],
        chart: {
            height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + "%";
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#fff"]
            }
        },

        xaxis: {
            categories: names,
            position: 'top',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val) {
                    return val + "%";
                }
            }

        },
        title: {
            text: 'puntenverdeling',
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
                color: '#fff'
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}






