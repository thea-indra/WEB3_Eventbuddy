import { model } from '../model/EventModel.js';

class EventList extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        model.addEventListener('model-change', () => {
            this.dispatchEvent(
                new CustomEvent('request-filter-update', { bubbles: true })
            );
        });
    }

    set events(events) {
        this.render(events);
    }

    render(events) {
        this.innerHTML = `<div class="event-grid"></div>`;
        const grid = this.querySelector('.event-grid');

        if (events.length === 0) {
            grid.innerHTML = `
                <p style="grid-column:1/-1;text-align:center;color:#666;">
                    Keine Events gefunden.
                </p>
            `;
            return;
        }

        events.forEach(evt => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.style.position = 'relative';

            // Klick auf Card → Bearbeiten
            card.addEventListener('click', () => {
                this.dispatchEvent(
                    new CustomEvent('select-event', {
                        detail: evt.id,
                        bubbles: true
                    })
                );
            });

            //Bild
            const imgDiv = document.createElement('div');
            imgDiv.className = 'event-card__img';

            if (evt.image) {
                imgDiv.style.backgroundImage = `url("${evt.image}")`;
            }

            const status = document.createElement('div');
            status.className = `event-card__status status-${evt.status}`;
            status.textContent =
                evt.status === 'planned' ? 'Geplant' : 'Abgeschlossen';

            imgDiv.appendChild(status);

            //Inhalt
            const tagBadges = evt.tags.map(tagId => {
                const tag = model.tags.find(t => t.id === tagId);
                return tag ? `<span class="tag-badge">#${tag.name}</span>` : '';
            }).join('');

            const content = document.createElement('div');
            content.className = 'event-card__content';
            content.innerHTML = `
                <h3 class="event-card__title">${evt.title}</h3>

                <div class="event-card__meta">
                    <span>📅 ${new Date(evt.date).toLocaleDateString('de-DE')}</span>
                    <span>📍 ${evt.location || '–'}</span>
                </div>

                <div class="event-card__meta">
                    <span>👥 ${evt.participants.length} Teilnehmer</span>
                </div>

                <div class="event-card__tags">
                    ${tagBadges}
                </div>
            `;

            //Lösch button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'card-delete-btn';
            deleteBtn.title = 'Event löschen';
            deleteBtn.innerHTML = `
    <img src="assets/images/trash.png" alt="Löschen">
`;

            deleteBtn.addEventListener('click', e => {
                e.stopPropagation(); // ❗ Card-Klick verhindern

                if (confirm('Möchtest du dieses Event wirklich löschen?')) {
                    this.dispatchEvent(
                        new CustomEvent('delete-event', {
                            detail: evt.id,
                            bubbles: true
                        })
                    );
                }
            });

            //Zusammenführen
            card.appendChild(imgDiv);
            card.appendChild(content);
            card.appendChild(deleteBtn);
            grid.appendChild(card);
        });
    }
}

customElements.define('event-list', EventList);
