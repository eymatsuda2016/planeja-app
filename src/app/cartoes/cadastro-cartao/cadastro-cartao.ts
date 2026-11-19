import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartaoService } from '../cartao-service';
import { DadosCartaoForm, DetalhesCartao } from '../dados-cartao';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CommonModule } from '@angular/common';

interface CadastroCartaoForm {
  nome: FormControl<string>;
  bandeira: FormControl<string>;
}

@Component({
  selector: 'app-cadastro-cartao',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './cadastro-cartao.html',
  styleUrl: './cadastro-cartao.scss',
})
export class CadastroCartao implements OnInit {

  form!: FormGroup<CadastroCartaoForm>;
  rotaAtiva = inject(ActivatedRoute);
  service = inject(CartaoService);
  toastr = inject(ToastrService);
  idCartaoParaEdicao?: string | null;


  ngOnInit(): void { 
    this.form = new FormGroup<CadastroCartaoForm>({
      nome: new FormControl('', { nonNullable: true, validators: Validators.required }),
      bandeira: new FormControl('', { nonNullable: true, validators: Validators.required })
    });

    this.carregarDadosParaEdicao();
  }

  carregarDadosParaEdicao(): void {
    this.idCartaoParaEdicao = this.rotaAtiva.snapshot.queryParamMap.get('id');
    if (!this.idCartaoParaEdicao) {
      return;
    }

    this.service.obterPorId(this.idCartaoParaEdicao).subscribe({
      next: (cartao) => {
        this.form.patchValue({
          nome: cartao.nome,
          bandeira: cartao.bandeira
        });
      },
      error: () => this.toastr.error('Erro ao carregar dados do cartão.')
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

const requisicao: Observable<DetalhesCartao | void> = this.idCartaoParaEdicao ?
       this.service.atualizar(this.idCartaoParaEdicao, dadosCartao) :
       this.service.criar(dadosCartao);

requisicao       
        .subscribe({
          next: (response) => {
            const mensagem = this.idCartaoParaEdicao
              ? 'Cartão atualizado com sucesso!'
              : 'Cartão cadastrado com sucesso!';
            this.toastr.success(mensagem, 'Sucesso');
            this.form.reset();
            this.idCartaoParaEdicao = null;

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
