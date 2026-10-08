import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCartao } from './cadastro-cartao';

describe('CadastroCartao', () => {
  let component: CadastroCartao;
  let fixture: ComponentFixture<CadastroCartao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCartao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroCartao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
