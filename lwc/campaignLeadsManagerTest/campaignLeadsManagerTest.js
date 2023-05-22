import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCampaignLeads from '@salesforce/apex/CampaignLeadsManagerController.getCampaignLeads';
import getAvailableLeads from '@salesforce/apex/CampaignLeadsManagerController.getAvailableLeads';
import createCampaignMembers from '@salesforce/apex/CampaignLeadsManagerController.createCampaignMembers';

const columns = [
    { label: 'Nome', fieldName: 'Name', type: 'text' },
    { label: 'Empresa', fieldName: 'Company', type: 'text' },
    { label: 'Status', fieldName: 'Status', type: 'text' }
];

export default class CampaignLeadsManager extends LightningElement {
    @track campaignLeads = [];
    @track availableLeads = [];
    @track selectedLeads = [];
    @track showModal = false;
    columns = columns;

    @wire(getCampaignLeads)
    wiredCampaignLeads({ error, data }) {
        if (data) {
            this.campaignLeads = data;
        } else if (error) {
            this.showToast('Erro', 'Erro ao obter os Leads da Campanha', 'error');
        }
    }

    openModal() {
        this.showModal = true;
        this.loadAvailableLeads();
    }

    closeModal() {
        this.showModal = false;
        this.selectedLeads = [];
    }

    loadAvailableLeads() {
        getAvailableLeads()
            .then(result => {
                this.availableLeads = result;
            })
            .catch(error => {
                this.showToast('Erro', 'Erro ao obter os Leads disponíveis', 'error');
            });
    }

    handleLeadSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedLeads = selectedRows.map(row => row.Id);
    }

    saveLeadsToCampaign() {
        if (this.selectedLeads.length > 0) {
            createCampaignMembers({ campaignId: this.campaignId, leadIds: this.selectedLeads })
                .then(() => {
                    this.showToast('Sucesso', 'Leads adicionados à Campanha com sucesso', 'success');
                    this.closeModal();
                })
                .catch(error => {
                    this.showToast('Erro', 'Erro ao adicionar os Leads à Campanha', 'error');
                });
        } else {
            this.showToast('Aviso', 'Selecione pelo menos um Lead', 'warning');
        }
    }

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }
}
