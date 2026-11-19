import { Component, inject, OnInit } from '@angular/core';
import { CartaoService } from '../cartao-service';
import { Observable, catchError, finalize, of } from 'rxjs';
import { PageResult } from '../../common/pagination/page-result';
import { DetalhesCartao } from '../dados-cartao';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listagem-cartoes',
  imports: [CommonModule, RouterLink],
  templateUrl: './listagem-cartoes.html',
  styleUrl: './listagem-cartoes.scss',
})
export class ListagemCartoes implements OnInit {

  service = inject(CartaoService);
  router = inject(Router);
  toastr = inject(ToastrService);
  listagem$!: Observable<PageResult<DetalhesCartao> | null>;
  paginaAtual = 0
  tamanhoPagina = 10;
  carregando = false;
  erro = false;


  ngOnInit(): void {
    this.listarCartoes();

  }

  listarCartoes() {
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

  navegar(pagina: number) {
    this.paginaAtual = pagina;
    this.listarCartoes();
  }
  navegarProximo(listagem: PageResult<DetalhesCartao>) {
    if (!listagem.last) {
      this.navegar(listagem.number + 1);
    }
  }
  navegarAnterior(listagem: PageResult<DetalhesCartao>) {
    if (!listagem.first) {
      this.navegar(listagem.number - 1);
    }
  }

  paginas(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (valor, index) => index);
  }

  registroInicial(listagem: PageResult<DetalhesCartao>) {
    if (listagem.totalElements === 0) {
      return 0;
    }
    return (listagem.number * listagem.size) + 1;
  }

  registroFinal(listagem: PageResult<DetalhesCartao>) {
    if (listagem.totalElements === 0) {
      return 0;
    }
    return Math.min((listagem.number + 1) * listagem.size, listagem.totalElements);
  }

  prepararEdicao(idCartao: string) {
    this.router.navigate(['/paginas/cadastro-cartoes'], {
      queryParams: {
        id: idCartao
      }
    });
  }

  mudarStatus(idCartao: string) {
    this.service.mudarStatus(idCartao)
    .subscribe({
      next: () => {
        this.toastr.success('Status do cartão alterado com sucesso.');
        this.listarCartoes();
      },
      error: () => {
        this.toastr.error('Erro ao alterar status do cartão.');
      }
    });
  }
}
