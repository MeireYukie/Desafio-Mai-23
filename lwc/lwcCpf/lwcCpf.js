import { LightningElement, track, api } from 'lwc';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class lwcCpf extends LightningElement {
  @track cpf = '';
  @track isCpfValid = false;
  @track errorMessage = '';
  @api cpf;
  @api recordId;
  @api availableActions = [];
  @api 
  ContactRecordId;
  objectApiName = 'Contact';
  fields = ['CPF__c'];

  handleCpfChange(event) {
    this.cpf = event.target.value;
    this.formatCpf();
    this.validateCpf();    
  }
  
  formatCpf() {
    let formattedCpf = this.cpf.replace(/[^\d]+/g, '');

    if (formattedCpf.length > 3 && formattedCpf.length <= 6) {
      formattedCpf = `${formattedCpf.substr(0, 3)}.${formattedCpf.substr(3)}`;
    } else if (formattedCpf.length > 6 && formattedCpf.length <= 9) {
      formattedCpf = `${formattedCpf.substr(0, 3)}.${formattedCpf.substr(3, 3)}.${formattedCpf.substr(6)}`;
    } else if (formattedCpf.length > 9 && formattedCpf.length <= 11) {
      formattedCpf = `${formattedCpf.substr(0, 3)}.${formattedCpf.substr(3, 3)}.${formattedCpf.substr(6, 3)}-${formattedCpf.substr(9)}`;
    }

    this.cpf = formattedCpf;
  }

  validateCpf() {
    const numCpf = this.cpf.replace(/[^\d]+/g, '');

    if (numCpf === '') {
      // CPF está vazio, exiba uma mensagem de erro
      this.errorMessage = 'O CPF está vazio.';
      this.isCpfValid = false;
      return;
    } else if (
      numCpf.length !== 11 ||
      numCpf === '00000000000' ||
      numCpf === '11111111111' ||
      numCpf === '22222222222' ||
      numCpf === '33333333333' ||
      numCpf === '44444444444' ||
      numCpf === '55555555555' ||
      numCpf === '66666666666' ||
      numCpf === '77777777777' ||
      numCpf === '88888888888' ||
      numCpf === '99999999999' ||
      !this.isValidCpf(numCpf)
    ) {
      // CPF inválido, exiba uma mensagem de erro
      this.errorMessage = 'Preencha com um número válido.';
      this.isCpfValid = false;
      return;
    } else {
      // CPF válido
      this.errorMessage = '';
      this.isCpfValid = true;
    }
  }

  isValidCpf(cpf) {
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return false;
    }

    sum = 0;

    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return false;
    }

    return true;
   
  }

  buttonValidaCpf () {
    const numCpf = this.cpf.replace(/[^\d]+/g, '');

    if (numCpf === '') {
      // CPF está vazio, exiba uma mensagem de erro
      this.errorMessage = 'O CPF está vazio.';
      this.isCpfValid = false;
      return;    
    
  } else if (
    numCpf.length !== 11 ||
    numCpf === '00000000000' ||
    numCpf === '11111111111' ||
    numCpf === '22222222222' ||
    numCpf === '33333333333' ||
    numCpf === '44444444444' ||
    numCpf === '55555555555' ||
    numCpf === '66666666666' ||
    numCpf === '77777777777' ||
    numCpf === '88888888888' ||
    numCpf === '99999999999' ||
    !this.isValidCpf(numCpf)
  ) {
    // CPF inválido, exiba uma mensagem de erro
    this.errorMessage = 'Preencha com um número válido.';
    this.isCpfValid = false;
    return;
  }

    this.isCpfValid = true;
    this.successMessage = 'CNPJ válido!'
    this.handleGoNext();  
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
