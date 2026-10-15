export interface ValidationErrorResponse {
    timestamp: Date;
    status: number;
    error: string;
    camposInvalidos: CampoInvalido[];
}

export interface CampoInvalido {
    campo(campo: any): unknown;
    erro: any;
    nome: string;
    mensagem: string;
}