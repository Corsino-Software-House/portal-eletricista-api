import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalService {
   private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseUrl = 'https://api-m.paypal.com';
  private readonly logger = new Logger(PaypalService.name);

    constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.clientId = this.configService.get<string>('PAYPAL_CLIENT_ID') ?? '';
this.clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET') ?? '';

if (!this.clientId || !this.clientSecret) {
  throw new Error('Variáveis PAYPAL_CLIENT_ID e PAYPAL_CLIENT_SECRET são obrigatórias');
  }
}
  private async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const res = await axios.post(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return res.data.access_token;
    } catch (error) {
      this.logger.error('Erro ao obter o token de acesso do PayPal', error.response?.data || error);
      throw new Error('Erro ao obter o token de acesso do PayPal');
    }
  }

  async createOrder(value: string, profissionalId: number, pacote: string): Promise<any> {
    const token = await this.getAccessToken();

    const res = await axios.post(
      `${this.baseUrl}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: 'EUR', value } }],
        application_context: {
          brand_name: 'Portal Eletricista',
          landing_page: 'LOGIN',
          user_action: 'PAY_NOW',
          return_url: 'https://techmanlight.pt/sucesso',
          cancel_url: 'https://techmanlight.pt/cancelado',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const orderId = res.data.id;

    await this.prisma.pedidoPaypal.create({
      data: {
        orderId,
        profissionalId,
        pacote,
      },
    });

    return res.data;
  }

  async captureOrder(orderId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const res = await axios.post(
        `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return res.data;
    } catch (error) {
      this.logger.error('Erro ao capturar pedido no PayPal', error.response?.data || error);
      throw new Error('Erro ao capturar pedido no PayPal');
    }
  }

  async criarAssinaturaPorWebhook(orderId: string) {
    const pedido = await this.prisma.pedidoPaypal.findFirst({ where: { orderId } });

    if (!pedido || pedido.processado) return;

    const plano = {
      'Básico': { preco: 25, creditos: 20, dias: 30 },
      'Poupança': { preco: 60, creditos: 60, dias: 30 },
      'Profissional': { preco: 90, creditos: 100, dias: 30 },
      'Elite': { preco: 120, creditos: 150, dias: 30 },
    }[pedido.pacote];

    if (!plano) {
      this.logger.warn(`Pacote inválido: ${pedido.pacote}`);
      return;
    }

    const dataFim = new Date();
    dataFim.setDate(dataFim.getDate() + plano.dias);

    const nova = await this.prisma.subscription.create({
      data: {
        profissionalId: pedido.profissionalId,
        pacote: pedido.pacote,
        valorPago: plano.preco,
        creditosTotais: plano.creditos,
        creditosRestantes: plano.creditos,
        dataFim: dataFim,
      },
    });

    await this.prisma.profissional.update({
      where: { id: pedido.profissionalId },
      data: { assinaturaAtualId: nova.id },
    });

    await this.prisma.pedidoPaypal.update({
      where: { id: pedido.id },
      data: { processado: true },
    });

    this.logger.log(`✅ Assinatura criada via webhook para profissional ${pedido.profissionalId}`);
  }
}
