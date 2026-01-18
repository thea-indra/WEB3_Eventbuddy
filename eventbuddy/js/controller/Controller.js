import { model } from '../model/EventModel.js';

export class Controller {
    constructor() {
        this.viewList = document.getElementById('view-list');
        this.viewDetail = document.getElementById('view-detail');

        this.eventList = document.querySelector('#view-list event-list');
        this.eventDetail = document.querySelector('event-detail');

        this.btnCreate = document.getElementById('btn-create-event');
        this.filterStatus = document.getElementById('filter-status');
        this.filterTag = document.getElementById('filter-tag');
        this.filterParticipant = document.getElementById('filter-participant');
    }


    init() {
        this.initFilters();
        this.bindUIEvents();
        this.bindComponentEvents();

            this.eventList.events = model.events;
    }

    bindUIEvents() {
        this.btnCreate.addEventListener('click', () => {
            this.eventDetail.eventData = null;
            this.switchView('detail');
        });

        this.filterStatus.addEventListener('change', () => this.applyFilter());
        this.filterTag.addEventListener('change', () => this.applyFilter());

        this.filterParticipant.addEventListener('change', () => this.applyFilter());

    }

    bindComponentEvents() {
        document.addEventListener('select-event', e => {
            const evt = model.getEventById(e.detail);
            this.eventDetail.eventData = evt;
            this.switchView('detail');
        });

        document.addEventListener('save-event', e => {
            const data = e.detail;
            data.id ? model.updateEvent(data.id, data) : model.addEvent(data);
            this.switchView('list');
        });

        document.addEventListener('delete-event', e => {
            model.deleteEvent(e.detail);
            this.switchView('list');
        });

        document.addEventListener('cancel-edit', () => {
            this.switchView('list');
        });

        document.addEventListener('request-filter-update', () => {
            this.applyFilter();
        });
    }

    initFilters() {
        model.tags.forEach(tag => {
            const opt = document.createElement('option');
            opt.value = tag.id;
            opt.textContent = tag.name;
            this.filterTag.appendChild(opt);
        });

        model.participants.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.name;
            this.filterParticipant.appendChild(opt);
        });
    }

    applyFilter() {
        if (!this.eventList) return;

        const criteria = {
            status: this.filterStatus.value || 'all',
            tagId: this.filterTag.value || 'all',
            participantId: this.filterParticipant.value || 'all'

        };

        this.eventList.events = model.filterEvents(criteria);
    }

    switchView(view) {
        if (view === 'detail') {
            this.viewList.classList.add('hidden');
            this.viewDetail.classList.remove('hidden');
            this.btnCreate.style.display = 'none';
        } else {
            this.viewList.classList.remove('hidden');
            this.viewDetail.classList.add('hidden');
            this.btnCreate.style.display = 'inline-block';
            this.applyFilter();
        }
    }
}
