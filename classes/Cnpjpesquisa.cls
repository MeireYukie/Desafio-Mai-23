public class Cnpjpesquisa {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getCnpjInfo(String cnpj) {
        cnpj = cnpj.replaceAll('[^0-9]', '');
        String url = 'https://www.receitaws.com.br/v1/cnpj/' + cnpj;

        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('GET');

        Http http = new Http();
        HttpResponse res = http.send(req);

        Map<String, Object> cnpjInfo = new Map<String, Object>();

        if (res.getStatusCode() == 200) {
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());

            String razaoSocial = (String) responseMap.get('nome');
            String nomeFantasia = (String) responseMap.get('fantasia');
            String dataAbertura = (String) responseMap.get('abertura');

            if (razaoSocial != null && nomeFantasia != null && dataAbertura != null) {
                cnpjInfo.put('razaoSocial', razaoSocial);
                cnpjInfo.put('nomeFantasia', nomeFantasia);
                cnpjInfo.put('dataAbertura', dataAbertura);
            }
        }

        return cnpjInfo;
    }

    @AuraEnabled
    public static void insertAccount(String cnpj) {
        Map<String, Object> cnpjMap = getCnpjInfo(cnpj);
        
        String razaoSocial = (String) cnpjMap.get('razaoSocial');
        String nomeFantasia = (String) cnpjMap.get('nomeFantasia');
        String dataAbertura = (String) cnpjMap.get('dataAbertura');

        Account newAccount = new Account();
        newAccount.RazaoSocial__c = razaoSocial;
        newAccount.NomeFantasia__c = nomeFantasia;
        newAccount.DatadeAbertura__c = dataAbertura;

        insert newAccount;
    }
}
