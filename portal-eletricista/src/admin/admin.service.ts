import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService){}

    async register(data: { nome: string; email: string; senha: string }) {
        const hashed = await bcrypt.hash(data.senha, 10);
        return this.prisma.admin.create({
            data: { ...data, senha: hashed },
        });
    }

    async changePasswordByEmail(data: { email: string;  novaSenha: string }) {
      const admin = await this.prisma.admin.findUnique({ where: { email: data.email} });
    
      if (!admin) {
        throw new Error('admin não encontrado');
      }
    
      const novaSenhaHash = await bcrypt.hash(data.novaSenha, 10);
    
      return this.prisma.admin.update({
        where: { email: data.email },
        data: { senha: novaSenhaHash },
      });
    }

    async findByEmail(email: string) {
    return this.prisma.admin.findUnique({ where: { email } });
  }
}
