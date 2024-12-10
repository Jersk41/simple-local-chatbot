const fs = require('node:fs');

class Chatlog {
    constructor() {
        this.datetime = new Date();
        this.logs = [{
            role: 'system',
            content: `You are helpful assistant to help user order train ticket.
            While helping users, there are few goals to accomplish:
            1. Ask where user want to go and from where, you can anwer any question out of that but keep focus on the goals
            2. With help from user given data, Search the train ticket for user
            3. Order the train ticket. Use example ticket data because you not have access yet to that real-time information right now but user
            4. Answer using language used by user in conversation`,
        }]
        fs.writeFile('chatlog.txt',
            `[${this.datetime.valueOf()}] ${this.logs[0].role}:"${this.logs[0].content}"`,
            (err) => {
                if (err) throw err;
                console.log('Chatlog is saved');
            }
        );
    }

    add(message) {
        this.logs.push(message);

        if (this.logs.length > 10) {
            this.logs.splice(1,1);
        }
        fs.appendFile('chatlog.txt',
            `[${this.datetime.valueOf()}] ${message.role}:"${message.content}"`,
            (err) => {
                if (err) throw err;
                console.log('New Data saved');
            }
        );
    }

    get() {
        // console.log(this.datetime.getUTCDate());
        return this.logs;
    }

}

module.exports = new Chatlog()