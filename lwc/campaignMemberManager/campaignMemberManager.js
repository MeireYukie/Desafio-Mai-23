import { LightningElement, track, wire, api } from 'lwc';
import getLeadsNotInCampaign from '@salesforce/apex/CampaignMemberController.getLeadsNotInCampaign';
import insertCustomCampaignMember from '@salesforce/apex/CampaignMemberController.insertCustomCampaignMember';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

const columns = [
    { label: 'Nome', fieldName: 'Name', type: 'text' },
    { label: 'Ação', type: 'button', initialWidth: 110, typeAttributes: { label: 'Adicionar', name: 'adicionar' } }
];

export default class LeadList extends LightningElement {
    @track mostrarListaLeads = false;
    @track lead = [];
    @track campaignName = '';
    @track leadLimit = 5; // limit
    @api leads;
    @api recordId;
    @api availableActions = [];
    @api 
    LeadRecordId;
    objectApiName = 'Lead';
        
    @wire(getLeadsNotInCampaign, { campaignName: '$campaignName' })
    wiredLeads({ error, data }) {
        if (data) {
            this.leads = data.slice(0, this.leadLimit);
        } else if (error) {
            
        }
    }// limit
        
    abrirListaLeads() {
        this.mostrarListaLeads = !this.mostrarListaLeads; // Alternar a visibilidade da lista
    
        if (this.mostrarListaLeads) {
            this.campaignName = 'Desafio'; // Substitua 'Desafio' pelo nome real da campanha
            this.template.querySelector('lightning-button').label = 'Ocultar Lista'; // Atualizar o rótulo do botão
        } else {
            this.campaignName = ''; // Resetar o nome da campanha
            this.template.querySelector('lightning-button').label = 'Abrir Lista'; // Atualizar o rótulo do botão
        }
    }
   
    fecharListaLeads() {
        this.mostrarListaLeads = false;
        this.campaignName = '';
        this.template.querySelector('lightning-button').label = 'Abrir Lista'; // Atualizar o rótulo do botão
    }

    atualizarListaLeads() {
        getLeadsNotInCampaign({ campaignName: this.campaignName })
            .then(data => {
                this.leads = data.slice(0, this.leadLimit);
            })
            .catch(error => {
                // Lógica para tratamento de erro
            });
    } // limit

    adicionarLead(event) {
        const selectedLead = event.detail.row;
        const leadId = selectedLead.Id;
        const leadName = selectedLead.Name;
        const leadPhone = selectedLead.Phone;
        
    
        insertCustomCampaignMember({ leadId: leadId, campaignName: this.campaignName, leadName: leadName, leadPhone: leadPhone })
            .then(() => {
                // Lógica para a adição bem-sucedida do lead ao objeto Custom_Campaign_Member__c
                
                this.atualizarListaLeads();
                location.reload();
                
                
            })
            .catch(error => {
                // Lógica para tratamento de erro
            });
    }
    
    get columns() {
        return columns;
    }

    handleGoNext() {
    // check if NEXT is allowed on this screen
    if (this.availableActions.find((action) => action === 'NEXT')) {
        // navigate to the next screen
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
    }
  }
}