import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import{ CartaoService } from '../cartao-service';
import { DadosCartaoForm, DetalhesCartao } from '../dados-cartao';


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
export class CadastroCartao {

  form!: FormGroup<CadastroCartaoForm>;
  service = new CartaoService();

  ngOnInit(): void { 
    this.form = new FormGroup<CadastroCartaoForm>({
      nome: new FormControl('', { nonNullable: true, validators:Validators.required }),
      bandeira: new FormControl('', { nonNullable: true, validators:Validators.required })
    });
  }

  handleSubmit() {
    console.log(this.form.value);
    const dadosCartao = this.form.value as DadosCartaoForm;
    this.service
        .criar(dadosCartao)
        .subscribe({
          next: (response: DetalhesCartao) => {
            console.log('Cartão criado com sucesso:', response);
          },
          error: (error: any) => console.log('Erro ao criar cartão:', error)
        });
  }
}

