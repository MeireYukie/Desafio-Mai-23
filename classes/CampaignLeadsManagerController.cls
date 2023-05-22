public with sharing class CampaignLeadsManagerController {
    
    @AuraEnabled(cacheable=true)
    public static List<Lead> getCampaignLeads() {
        // Consulta os Leads relacionados à Campanha atual e retorna os dados relevantes
        List<Lead> leads = [SELECT Name, Company, Status FROM Lead WHERE CampaignId = :Campaign.getCurrentCampaignId()];
        return leads;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Lead> getAvailableLeads() {
        // Consulta os Leads disponíveis que ainda não estão relacionados à Campanha atual
        List<Lead> leads = [SELECT Name, Company, Status FROM Lead WHERE CampaignId = null];
        return leads;
    }
    
    @AuraEnabled
    public static void createCampaignMembers(Id campaignId, List<Id> leadIds) {
        // Cria registros no objeto Membro de Campanha Personalizada com os Leads selecionados e a Campanha atual
        List<CampaignMember> campaignMembers = new List<CampaignMember>();
        
        for (Id leadId : leadIds) {
            CampaignMember campaignMember = new CampaignMember();
            campaignMember.CampaignId = campaignId;
            campaignMember.LeadId = leadId;
            campaignMembers.add(campaignMember);
        }
        
        if (!campaignMembers.isEmpty()) {
            insert campaignMembers;
        }
    }
}
