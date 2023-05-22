import { LightningElement, api, wire, track } from 'lwc';
import insertAccount from '@salesforce/apex/Cnpjpesquisa.insertAccount';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class LwcCnpj extends LightningElement {
  @api cnpj;
  @api recordId;
  @api availableActions = [];
  @api AccountRecordId;
  objectApiName = 'Account';
  fields = ['CNPJ__c'];
  @track isCnpjValid = false;
  @track insiraCnpj = true;
  @track errorMessage = '';

  handleCnpjChange(event) {
    this.cnpj = event.target.value;
    this.formatCnpj();
    this.validarCNPJ();
  }

  formatCnpj() {
    let formattedCnpj = this.cnpj.replace(/[^\d]+/g, '');

    if (formattedCnpj.length > 2 && formattedCnpj.length <= 5) {
      formattedCnpj = `${formattedCnpj.substr(0, 2)}.${formattedCnpj.substr(2)}`;
    } else if (formattedCnpj.length > 5 && formattedCnpj.length <= 8) {
      formattedCnpj = `${formattedCnpj.substr(0, 2)}.${formattedCnpj.substr(2, 3)}.${formattedCnpj.substr(5)}`;
    } else if (formattedCnpj.length > 8 && formattedCnpj.length <= 12) {
      formattedCnpj = `${formattedCnpj.substr(0, 2)}.${formattedCnpj.substr(2, 3)}.${formattedCnpj.substr(5, 3)}/${formattedCnpj.substr(8)}`;
    } else if (formattedCnpj.length > 12 && formattedCnpj.length <= 14) {
      formattedCnpj = `${formattedCnpj.substr(0, 2)}.${formattedCnpj.substr(2, 3)}.${formattedCnpj.substr(5, 3)}/${formattedCnpj.substr(8, 4)}-${formattedCnpj.substr(12)}`;
    }
    this.cnpj = formattedCnpj;
  }

  validarCNPJ() {
    let validaCnpj = this.cnpj.replace(/[^\d]+/g, '');

    if (validaCnpj.length !== 14) {
      this.isCnpjValid = false;
      this.errorMessage = 'Digite um número válido';
      return;
    }
    if (
      validaCnpj === '00000000000000' ||
      validaCnpj === '11111111111111' ||
      validaCnpj === '22222222222222' ||
      validaCnpj === '33333333333333' ||
      validaCnpj === '44444444444444' ||
      validaCnpj === '55555555555555' ||
      validaCnpj === '66666666666666' ||
      validaCnpj === '77777777777777' ||
      validaCnpj === '88888888888888' ||
      validaCnpj === '99999999999999'
    ) {
      this.isCnpjValid = false;
      this.errorMessage = 'Digite um CNPJ válido';
      return;
    }
// Valida DVs
let tamanho = validaCnpj.length - 2;
let numeros = validaCnpj.substring(0, tamanho);
let digitos = validaCnpj.substring(tamanho);
let soma = 0;
let pos = tamanho - 7;
for (let i = tamanho; i >= 1; i--) {
  soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
  if (pos < 2) {
    pos = 9;
  }
}

let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
if (resultado != parseInt(digitos.charAt(0))) {
  this.isCnpjValid = false;
  this.errorMessage = 'Digite um número válido';
  return;
}

tamanho = tamanho + 1;
numeros = validaCnpj.substring(0, tamanho);
soma = 0;
pos = tamanho - 7;
for (let i = tamanho; i >= 1; i--) {
  soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
  if (pos < 2) {
    pos = 9;
  }
}

resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
if (resultado != parseInt(digitos.charAt(1))) {
  this.isCnpjValid = false;
  this.errorMessage = 'Digite um número válido';
  return;
} else {
  this.isCnpjValid = true;
  this.errorMessage = 'CNPJ válido';
}
  }

  handleClick() {
    let vazioCnpj = this.cnpj.replace(/[^\d]+/g, '');

    if (vazioCnpj === '') {
      this.isCnpjValid = false;
      this.errorMessage = 'Insira um número de CNPJ';
      return;
    }
    if (vazioCnpj.length !== 14) {
      this.isCnpjValid = false;
      this.errorMessage = 'Digite um número válido';
      return;
    }
    if (
      vazioCnpj === '00000000000000' ||
      vazioCnpj === '11111111111111' ||
      vazioCnpj === '22222222222222' ||
      vazioCnpj === '33333333333333' ||
      vazioCnpj === '44444444444444' ||
      vazioCnpj === '55555555555555' ||
      vazioCnpj === '66666666666666' ||
      vazioCnpj === '77777777777777' ||
      vazioCnpj === '88888888888888' ||
      vazioCnpj === '99999999999999'
    ) {
      this.isCnpjValid = false;
      this.errorMessage = 'Digite um CNPJ válido';
      return;
    }

    const cnpjSemMascara = this.cnpj.replace(/[^0-9]/g, '');

    //getCnpjInfo({ cnpj: cnpjSemMascara })
    insertAccount({ cnpj: cnpjSemMascara })
    this.handleGoNext();
        /*.then((result) => {
            console.log('Razão Social: ' + result.razaoSocial);
            console.log('Nome Fantasia: ' + result.nomeFantasia);
            console.log('Data de Abertura: ' + result.dataAbertura);    
            
            this.isCnpjValid = true;
            this.successMessage = 'CNPJ válido!'
            this.handleGoNext();
        })
        .catch((error) => {
            console.error(error);
            this.isCnpjValid = false;
            this.errorMessage = 'Erro ao obter informações do CNPJ';
            return;            
        }); */       
  }

  handleGoNext() {
    if (this.availableActions.find((action) => action === 'NEXT')) {
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    }
  }
}
