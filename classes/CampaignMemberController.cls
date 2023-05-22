public with sharing class CampaignMemberController {
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeadsNotInCampaign(String campaignName) {
       
        Campaign campaignRecord = [SELECT Id FROM Campaign WHERE Name = :campaignName LIMIT 1];
        Id campaignId = campaignRecord != null ? campaignRecord.Id : null;

        if (campaignId != null) {
           
            Set<Id> campaignLeadIds = new Set<Id>();
            for (Custom_Campaign_Member__c campaignMember : [SELECT Lead__c FROM Custom_Campaign_Member__c WHERE Campaign__c = :campaignId]) {
                campaignLeadIds.add(campaignMember.Lead__c);
            }

            
            return [SELECT Id, Name, Phone, Email FROM Lead WHERE Id NOT IN :campaignLeadIds];
        }

        return new List<Lead>();
    }

    @AuraEnabled
    public static void insertCustomCampaignMember(String leadId, String campaignName, String leadName, String leadPhone, String leadStatus) {
        
        Campaign campaignRecord = [SELECT Id FROM Campaign WHERE Name = :campaignName LIMIT 1];
        Id campaignId = campaignRecord != null ? campaignRecord.Id : null;

        if (campaignId != null) {
           
            Lead leadRecord = [SELECT Email, Company FROM Lead WHERE Id = :leadId LIMIT 1];

            if (leadRecord != null) {
                
                Custom_Campaign_Member__c campaignMember = new Custom_Campaign_Member__c(
                    Campaign__c = campaignId,
                    Lead__c = leadId,
                    Name = leadName,
                    Telefone__c = leadPhone,
                    //Status__c = leadStatus,
                    Email__c = leadRecord.Email,
                    Company__c = leadRecord.Company
                );
                insert campaignMember;
            }
        }
    }
}