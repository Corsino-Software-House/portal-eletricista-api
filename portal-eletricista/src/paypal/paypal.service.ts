import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaypalService {
  private readonly clientId = process.env.PAYPAL_CLIENT_ID;
  private readonly clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  private readonly baseUrl = 'https://api-m.sandbox.paypal.com';
  private readonly logger = new Logger(PaypalService.name);

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

 async createOrder(value: string): Promise<any> {
  try {
    const token = await this.getAccessToken();

    const res = await axios.post(
      `${this.baseUrl}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: value,
            },
          },
        ],
        application_context: {
          brand_name: "Portal Eletricista",
          landing_page: "LOGIN", // ou "BILLING"
          user_action: "PAY_NOW",
          return_url: "http://localhost:5173/areadoprofissional/menu", // coloque sua URL real de sucesso
          cancel_url: "http://localhost:5173/creditos", // coloque sua URL real de cancelamento
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data;
  } catch (error) {
    this.logger.error('Erro ao criar pedido no PayPal', error.response?.data || error);
    throw new Error('Erro ao criar pedido no PayPal');
  }
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
}
