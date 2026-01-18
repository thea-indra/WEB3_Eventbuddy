export class EventEnt {
    constructor({ id, title, date, location, description, image, status, tags = [], participants = [] }) {
        this.id = id || Date.now();
        this.title = title;
        this.date = date;
        this.location = location;
        this.description = description;
        this.image = image || '';
        this.status = status || 'planned';
        this.tags = tags;
        this.participants = participants;
    }
}

export class Participant {
    constructor({ id, name }) {
        this.id = id;
        this.name = name;
    }
}

export class Tag {
    constructor({ id, name }) {
        this.id = id;
        this.name = name;
    }
}
