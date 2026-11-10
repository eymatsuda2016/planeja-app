import { Routes } from '@angular/router';
import { Template } from './template/template';
import { CadastroCartao } from './cartoes/cadastro-cartao/cadastro-cartao';


export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'paginas/cadastro-cartoes'
    },
    {
        path: 'paginas',
        component: Template,
        children: [
            {
                path: 'cadastro-cartoes',
                component: CadastroCartao
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'paginas/cadastro-cartoes'
    }
];
