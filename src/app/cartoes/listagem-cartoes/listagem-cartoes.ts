import { Component, inject, OnInit } from '@angular/core';
import { CartaoService } from '../cartao-service';
import { Observable, catchError, finalize, of } from 'rxjs';
import { PageResult } from '../../common/pagination/page-result';
import { DetalhesCartao } from '../dados-cartao';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listagem-cartoes',
  imports: [CommonModule],
  templateUrl: './listagem-cartoes.html',
  styleUrl: './listagem-cartoes.scss',
})
export class ListagemCartoes implements OnInit {

service= inject(CartaoService);
listagem$!: Observable<PageResult<DetalhesCartao> | null>;
paginaAtual = 0
tamanhoPagina = 5;
carregando = false;
erro = false;


  ngOnInit(): void {
    this.listarCartoes();

  }

  listarCartoes(){
    this.carregando = true;
    this.erro = false;

    this.listagem$ = this.service.listar(this.paginaAtual, this.tamanhoPagina).pipe(
      catchError((error) => {
        this.erro = true;
        console.error('Não foi possível carregar os cartões.', error);
        return of(null);
      }),
      finalize(() => this.carregando = false)
    );
  }

  navegarPagina(pagina: number){
    this.paginaAtual = pagina;
    this.listarCartoes();
  }
}
