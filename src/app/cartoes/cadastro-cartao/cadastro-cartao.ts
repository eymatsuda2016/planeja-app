import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartaoService } from '../cartao-service';
import { DadosCartaoForm, DetalhesCartao } from '../dados-cartao';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';

interface CadastroCartaoForm {
  nome: FormControl<string>;
  bandeira: FormControl<string>;
}

@Component({
  selector: 'app-cadastro-cartao',
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-cartao.html',
  styleUrl: './cadastro-cartao.scss',
})
export class CadastroCartao implements OnInit {

  form!: FormGroup<CadastroCartaoForm>;
  
  // O ideal no Angular moderno é usar o inject() ou construtor, 
  // mas mantendo a sua estrutura:
  private service = inject(CartaoService); 

  ngOnInit(): void { 
    this.form = new FormGroup<CadastroCartaoForm>({
      nome: new FormControl('', { nonNullable: true, validators: Validators.required }),
      bandeira: new FormControl('', { nonNullable: true, validators: Validators.required })
    });
  }

  handleSubmit() {
    console.log(this.form.value);
    const dadosCartao = this.form.value as DadosCartaoForm;
    this.service
        .criar(dadosCartao)
        .subscribe({
          next: (response: DetalhesCartao) => {
            console.log('Recebendo a resposta:', response);
          },

          error: (error) => this.onApiError(error)
          });
  }

  private aplicarErrosValidacao(erros: ValidationErrorResponse) {
    erros.camposInvalidos.forEach(ci => {
      const control = this.form.get(ci.nome);
      if (control) {
        control.setErrors({ apiError: ci.erro });
        control.markAsTouched(); // Marca o campo como tocado para exibir mensagens de erro
      } 
    })

    }

      private onApiError(response: any) : void{
      if(response.status===422){
        this.aplicarErrosValidacao(response.error);
      }
  }
}
