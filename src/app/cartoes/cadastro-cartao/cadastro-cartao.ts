import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartaoService } from '../cartao-service';
import { DadosCartaoForm, DetalhesCartao } from '../dados-cartao';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';
import { ToastrService } from 'ngx-toastr';

interface CadastroCartaoForm {
  nome: FormControl<string>;
  bandeira: FormControl<string>;
}

@Component({
  selector: 'app-cadastro-cartao',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-cartao.html',
  styleUrl: './cadastro-cartao.scss',
})
export class CadastroCartao implements OnInit {

  form!: FormGroup<CadastroCartaoForm>;
  service = inject(CartaoService);
  toastr = inject(ToastrService);
  


  ngOnInit(): void { 
    this.form = new FormGroup<CadastroCartaoForm>({
      nome: new FormControl('', { nonNullable: true, validators: Validators.required }),
      bandeira: new FormControl('', { nonNullable: true, validators: Validators.required })
    });
  }

  isFormInvalid(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('Existem campos inválidos no formulário.', 'Erro de validação');
      return true;
    }
    return false;
  }

  handleSubmit() {
    if (this.isFormInvalid()) {
      return;
    }
    
    const dadosCartao = this.form.value as DadosCartaoForm;
    this.service
        .criar(dadosCartao)
        .subscribe({
          next: (response: DetalhesCartao) => {
            console.log('Recebendo a resposta:', response);
            this.toastr.success('Cartão cadastrado/atualizado com sucesso!', 'Sucesso');

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
        this.toastr.error('Existem campos inválidos no formulário.', 'Erro de validação');

        return;
      }
      this.toastr.error('Ocorreu um erro ao processar a solicitação.', 'Erro');
      console.error(response.error);

  }
}
