import { EventEnt, Participant, Tag } from './entities.js';

export class EventModel extends EventTarget {
    #events = [];
    #participants = [];
    #tags = [];

    constructor() {
        super();
        this.#initDummyData();
    }

    get events() { return [...this.#events]; }
    get participants() { return [...this.#participants]; }
    get tags() { return [...this.#tags]; }

    getEventById(id) {
        return this.#events.find(e => e.id == id);
    }

    addEvent(data) {
        this.#events.push(new EventEnt(data));
        this.#notify();
    }

    updateEvent(id, data) {
        const i = this.#events.findIndex(e => e.id == id);
        if (i !== -1) {
            this.#events[i] = new EventEnt({ ...this.#events[i], ...data });
            this.#notify();
        }
    }

    deleteEvent(id) {
        this.#events = this.#events.filter(e => e.id != id);
        this.#notify();
    }

    filterEvents(criteria) {
        return this.#events.filter(e => {
            if (criteria.status !== 'all' && e.status !== criteria.status) {
                return false;
            }

            if (criteria.tagId !== 'all' &&
                !e.tags.includes(Number(criteria.tagId))) {
                return false;
            }

            if (criteria.participantId !== 'all' &&
                !e.participants.includes(Number(criteria.participantId))) {
                return false;
            }

            return true;
        });
    }


    #notify() {
        this.dispatchEvent(new CustomEvent('model-change'));
    }

    #initDummyData() {
        this.#tags = [
            new Tag({ id: 1, name: 'Party' }),
            new Tag({ id: 2, name: 'Workshop' }),
            new Tag({ id: 3, name: 'Outdoor' }),
            new Tag({ id: 4, name: 'Kultur' })
        ];

        this.#participants = [
            new Participant({ id: 101, name: 'Laura Dolzer', email: 'laura@demo.at' }),
            new Participant({ id: 102, name: 'Mona Hopfinger', email: 'mona@demo.at' }),
            new Participant({ id: 103, name: 'Eva Hauer', email: 'eva@demo.at' }),
            new Participant({ id: 104, name: 'Sina Neubauer', email: 'sina@demo.at' })
        ];

        this.#events = [
            new EventEnt({
                id: 2001,
                title: 'Outdoor Yoga Session',
                date: '2026-04-10T09:00',
                location: 'Donaupark',
                description: 'Gemeinsame Yoga-Einheit im Grünen. Für alle Levels geeignet.',
                status: 'planned',
                tags: [3], // Outdoor
                participants: [101, 103],
                image: 'assets/images/outdoor.jpg'
            }),

            new EventEnt({
                id: 2002,
                title: 'Kreativer Schreibworkshop',
                date: '2026-02-18T17:30',
                location: 'Raum B204',
                description: 'Ein Workshop für alle, die gerne schreiben oder es ausprobieren wollen.',
                status: 'planned',
                tags: [2], // Workshop
                participants: [102, 104],
                image: 'assets/images/workshop.jpg'
            }),

            new EventEnt({
                id: 2003,
                title: 'Kultureller Filmabend',
                date: '2026-01-30T19:00',
                location: 'Aula',
                description: 'Gemeinsamer Filmabend mit anschließender Diskussion.',
                status: 'finished',
                tags: [4], // Kultur
                participants: [101, 102, 103, 104],
                image: 'assets/images/kultur.jpg'
            }),

            new EventEnt({
                id: 2004,
                title: 'After-Study Party',
                date: '2026-03-22T21:00',
                location: 'Club Basement',
                description: 'Feiern nach der Prüfungsphase – Musik, Drinks & gute Stimmung.',
                status: 'planned',
                tags: [1], // Party
                participants: [101, 104],
                image: 'assets/images/party.jpg'
            })
        ];
    }
    addTag(name) {
        // Duplikate verhindern
        const exists = this.#tags.find(
            t => t.name.toLowerCase() === name.toLowerCase()
        );
        if (exists) return null;

        const tag = new Tag({
            id: Date.now(),
            name
        });

        this.#tags.push(tag);
        this.#notify();
        return tag;
    }

    deleteTag(tagId) {
        // Prüfen ob Tag noch verwendet wird
        const used = this.#events.some(evt =>
            evt.tags.includes(tagId)
        );
        if (used) return false;

        this.#tags = this.#tags.filter(t => t.id !== tagId);
        this.#notify();
        return true;
    }

}

export const model = new EventModel();
