//nur Lesen
export function renderEventDetailView(evt, tags, participants) {
    return `
        <div class="detail-view">
            <h2 class="detail-view__title">${evt.title}</h2>

            <div class="detail-view__meta">
                <span>📅 ${new Date(evt.date).toLocaleString('de-DE')}</span>
                <span>📍 ${evt.location || '-'}</span>
            </div>

            <p class="detail-view__description">
                ${evt.description || '<em>Keine Beschreibung</em>'}
            </p>

            <div class="detail-view__tags">
                ${tags.map(tag =>
        `<span class="tag-badge">#${tag}</span>`
    ).join('')}
            </div>

            <p class="detail-view__participants">
                👥 ${participants.length
        ? participants.join(', ')
        : 'Keine Teilnehmer'}
            </p>

            <div class="detail-view__actions">
                <button class="btn btn--secondary" id="btn-back">
                    Zurück
                </button>
                <button class="btn btn--primary" id="btn-edit">
                    Bearbeiten
                </button>
            </div>
        </div>
    `;
}

//Bearbeiten
export function renderEventDetailEdit(evt, tags, participants, isNew) {
    const dateValue = evt.date
        ? new Date(evt.date).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16);

    return `
        <div class="detail-view">
            <h2 class="detail-view__title">
                ${isNew ? 'Neues Event erstellen' : 'Event bearbeiten'}
            </h2>

            <form id="event-form" class="detail-view__form">

                <div class="form-group">
                    <label for="title">Titel *</label>
                    <input id="title" name="title" value="${evt.title ?? ''}" required>
                </div>

                <div class="form-group">
                    <label for="date">Datum & Uhrzeit *</label>
                    <input
                        id="date"
                        type="datetime-local"
                        name="date"
                        value="${dateValue}"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="location">Ort</label>
                    <input id="location" name="location" value="${evt.location ?? ''}">
                </div>

                <div class="form-group">
                    <label for="image">Bild URL</label>
                    <input id="image" name="image" value="${evt.image ?? ''}">
                </div>

                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status" name="status">
                        <option value="planned" ${evt.status === 'planned' ? 'selected' : ''}>
                            Geplant
                        </option>
                        <option value="finished" ${evt.status === 'finished' ? 'selected' : ''}>
                            Abgeschlossen
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="description">Beschreibung</label>
                    <textarea id="description" name="description">
${evt.description ?? ''}
                    </textarea>
                </div>

                <div class="form-group">
                    <label>Tags</label>
                    <div class="checkbox-group">
                        ${tags.map(tag => `
                            <label class="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="tags"
                                    value="${tag.id}"
                                    ${evt.tags?.includes(tag.id) ? 'checked' : ''}
                                >
                                ${tag.name}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label>Teilnehmer</label>
                    <div class="checkbox-group">
                        ${participants.map(p => `
                            <label class="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="participants"
                                    value="${p.id}"
                                    ${evt.participants?.includes(p.id) ? 'checked' : ''}
                                >
                                ${p.name}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="detail-view__actions">
                    <button type="button" class="btn btn--secondary" id="btn-cancel">
                        Abbrechen
                    </button>

                    ${!isNew ? `
                        <button type="button" class="btn btn--danger" id="btn-delete">
                            Löschen
                        </button>
                    ` : ''}

                    <button type="submit" class="btn btn--primary">
                        Speichern
                    </button>
                </div>

            </form>
        </div>
    `;
}
