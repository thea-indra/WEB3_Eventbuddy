import { model } from '../model/EventModel.js';

class EventDetail extends HTMLElement{
    #currentId = null;
    _autoImage = '';

    set eventData(event) {
        this.render(event);
    }

    render(event) {
        const isNew = !event;
        const data = event || {};
        this.#currentId = data.id ?? null;
        this._autoImage = data.image || '';

        const tagCheckboxes = model.tags.map(tag => {
            const checked = (data.tags || []).includes(tag.id) ? 'checked' : '';
            return `
                <div class="tag-chip">
                    <label class="checkbox-item">
                        <input type="checkbox" name="tags" value="${tag.id}" ${checked}>
                        <span class="tag-name">${tag.name}</span>
                    </label>

                    <button
                        type="button"
                        class="tag-delete-btn"
                        data-tag-id="${tag.id}"
                        title="Tag löschen">
                        ❌
                    </button>
                </div>

            `;
        }).join('');

        const participantCheckboxes = model.participants.map(p =>{
            const checked = (data.participants || []).includes(p.id) ? 'checked' : '';
            return `
                <label class="checkbox-item">
                    <input type="checkbox" name="participants" value="${p.id}" ${checked}>
                    ${p.name}
                </label>
            `;
        }).join('');

        this.innerHTML = `
            <div class="detail-view">
                <h2>${isNew ? 'Neues Event erstellen' : 'Event bearbeiten'}</h2>

                <form id="event-form">
                    <div class="form-group">
                        <label>Titel *</label>
                        <input name="title" required value="${data.title || ''}">
                    </div>

                    <div class="form-group">
                        <label>Datum & Uhrzeit *</label>
                        <input
                            type="datetime-local"
                            name="date"
                            required
                            value="${
            data.date
                ? new Date(data.date).toISOString().slice(0, 16)
                : new Date().toISOString().slice(0, 16)
        }">
                    </div>

                    <div class="form-group">
                        <label>Ort</label>
                        <input name="location" value="${data.location || ''}">
                    </div>

                    <div class="form-group">
                        <label>Status</label>
                        <select name="status">
                            <option value="planned" ${data.status === 'planned' ? 'selected' : ''}>
                                Geplant
                            </option>
                            <option value="finished" ${data.status === 'finished' ? 'selected' : ''}>
                                Abgeschlossen
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Beschreibung</label>
                        <textarea name="description">${data.description || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label>Tags</label>
                        <div class="checkbox-group">
                            ${tagCheckboxes}
                        </div>

                        <div class="tag-create">
                            <input
                                type="text"
                                id="new-tag-name"
                                placeholder="Neuen Tag erstellen">
                            <button
                                type="button"
                                id="btn-add-tag"
                                class="btn btn--secondary">
                                Tag hinzufügen
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Teilnehmer</label>
                        <div class="checkbox-group">
                            ${participantCheckboxes}
                        </div>
                    </div>

                    <div class="actions">
                        <button
                            type="button"
                            class="btn btn--secondary"
                            id="btn-cancel">
                            Abbrechen
                        </button>

                        <button
                            type="submit"
                            class="btn btn--primary">
                            Speichern
                        </button>
                    </div>
                </form>
            </div>
        `;

        //Speichern
        this.querySelector('#event-form')
            .addEventListener('submit', e => this.handleSave(e));

        // Bearbeiten abbrechen
        this.querySelector('#btn-cancel')
            .addEventListener('click', () => {
                this.dispatchEvent(
                    new CustomEvent('cancel-edit', { bubbles: true })
                );
            });

        // Tag hinzufügen
        this.querySelector('#btn-add-tag')
            .addEventListener('click', () => {
                const input = this.querySelector('#new-tag-name');
                const name = input.value.trim();
                if (!name) return;

                const newTag = model.addTag(name);
                if (!newTag) {
                    alert('Tag existiert bereits');
                    return;
                }

                const baseEvent = this.#currentId
                    ? model.getEventById(this.#currentId)
                    : data;

                this.render({
                    ...baseEvent,
                    tags: [...(baseEvent.tags || []), newTag.id]
                });

                input.value = '';
            });

        //Tag löschen
        this.onclick = (e) => {
            const btn = e.target.closest('.tag-delete-btn');
            if (!btn) return;

            const tagId = Number(btn.dataset.tagId);

            if (!confirm('Diesen Tag wirklich löschen?')) return;

            const success = model.deleteTag(tagId);
            if (!success) {
                alert('Tag kann nicht gelöscht werden, da er noch Events zugeordnet ist.');
                return;
            }

            const baseEvent = this.#currentId
                ? model.getEventById(this.#currentId)
                : {};

            this.render(baseEvent);
        };

        this.querySelectorAll('input[name="tags"]').forEach(cb => {
            cb.addEventListener('change', e => {
                if (!e.target.checked) return;

                this.querySelectorAll('input[name="tags"]').forEach(other => {
                    if (other !== e.target) {
                        other.checked = false;
                    }
                });
            });
        });

    }

    handleSave(e) {
        e.preventDefault();
        const fd = new FormData(e.target);

        const tags = [...this.querySelectorAll('input[name="tags"]:checked')]
            .map(cb => Number(cb.value));

        const participants = [...this.querySelectorAll('input[name="participants"]:checked')]
            .map(cb => Number(cb.value));

        this.dispatchEvent(
            new CustomEvent('save-event', {
                detail: {
                    id: this.#currentId,
                    title: fd.get('title'),
                    date: fd.get('date'),
                    location: fd.get('location'),
                    image: this._autoImage,
                    status: fd.get('status'),
                    description: fd.get('description'),
                    tags,
                    participants
                },
                bubbles: true
            })
        );
    }
}

customElements.define('event-detail', EventDetail);
