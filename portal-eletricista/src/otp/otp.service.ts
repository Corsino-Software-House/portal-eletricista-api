import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService, private configService: ConfigService
  ) {
    // Verifica se as variáveis de ambiente necessárias estão definidas
   if (!this.configService.get<string>('SMTP2GO_USER') || !this.configService.get<string>('SMTP2GO_PASS')) {
  throw new Error('Variáveis SMTP2GO_USER e SMTP2GO_PASS são obrigatórias');
}
  }

  // Gera OTP aleatório de 4 dígitos
  private generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Verifica se o e-mail existe em Cliente, Admin ou Profissional
  private async emailExists(email: string): Promise<boolean> {
    const [cliente, admin, profissional] = await Promise.all([
      this.prisma.cliente.findUnique({ where: { email } }),
      this.prisma.admin.findUnique({ where: { email } }),
      this.prisma.profissional.findUnique({ where: { email } }),
    ]);

    return !!(cliente || admin || profissional);
  }

  // Envia OTP para o e-mail
  async sendOtp(email: string) {
    const exists = await this.emailExists(email);
    if (!exists) {
      throw new NotFoundException('E-mail não encontrado no sistema');
    }

    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expira em 5 min

    // Salva no banco
    await this.prisma.otpCode.create({
      data: { email, code, expiresAt },
    });

    // Configuração SMTP2GO usando API key
    const transporter = nodemailer.createTransport({
      host: 'mail.smtp2go.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP2GO_USER'), // seu usuário SMTP
    pass: this.configService.get<string>('SMTP2GO_PASS'), // sua senha SMTP
      },
    });

    // Envia o e-mail
    await transporter.sendMail({
     from: 'Portal Eletricista <no-reply@techmanlight.pt>',
      to: email,
      subject: 'Seu código OTP',
      text: `Seu código OTP é: ${code}. Ele expira em 5 minutos.`,
    });

    return { message: 'OTP enviado com sucesso' };
  }

  // Valida o OTP
  async validateOtp(email: string, code: string) {
  const otpRecord = await this.prisma.otpCode.findFirst({
    where: { email, code },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    throw new BadRequestException('Código inválido');
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new BadRequestException('Código expirado');
  }

  // Atualiza o campo validado = true
  await this.prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { validado: true },
  });
  return { message: true};
}

}
