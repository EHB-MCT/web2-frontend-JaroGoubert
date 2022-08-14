export default class Game {
    constructor(date, game, atlasId, first, second, third, minUsers, maxUsers, users) {
        this.date = date;
        this.game = game;
        this.atlasID = atlasId;
        this.first = first;
        this.second = second;
        this.third = third;
        this.minUsers = minUsers;
        this.maxUsers = maxUsers;
        this.users = users;
    }

    updateUser(userId) {
        this.users[userId].updateOneUser()
    }

    async insertCurrentGame() {
        console.log(this);
        console.log(JSON.stringify(this));
        const options = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this)
        };
        const response = await fetch('http://localhost:3000/saveGame', options)
        return response.json();
    }
    addUser(user) {
        if (user.constructor.name !== 'User') {
            throw Error('Mag niet');
            
        }
        this.users.push(user);
    }

}

export class User {
    constructor(name, firstname, email, points) {
        this.name = name;
        this.firstname = firstname;
        this.email = email;
        this.points = points;
    }
    updateOneUser() {

    }
}