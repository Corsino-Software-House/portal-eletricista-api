export class CreateSubscriptionDto {
  profissionalId: number;
  pacote: string;
  valorPago: number;
  creditosTotais: number;
  creditosRestantes: number;
  dataFim: Date;
  status: string;
}