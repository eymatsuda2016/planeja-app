import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


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
  ngOnInit(): void { 
    this.form = new FormGroup<CadastroCartaoForm>({
      nome: new FormControl('', { nonNullable: true, validators:Validators.required }),
      bandeira: new FormControl('', { nonNullable: true, validators:Validators.required })
    });
  }

  handleSubmit() {
    console.log(this.form.value);
  }
}
