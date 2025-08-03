import {
  Controller,
  Post,
  Body,
  Put,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClienteService } from './cliente.service';

@Controller('cliente')
export class ClienteController {
  constructor(private service: ClienteService) {}
  
@Get('total')
async countClientes() {
  return this.service.contarClientes();
}

  @Post('register')
  register(@Body() data: { nome: string; email: string; senha: string }) {
    return this.service.register(data);
  }
 @Get('account/:email')
 getAccount(@Param('email') email: string) {
   return this.service.findByEmail(email);
 }

  @Put('complete-profile')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async completeProfile(
    @Body() body: { id: number,telefone: string},
    @UploadedFile() foto: Express.Multer.File,
    @Req() req: Request, // ✅ Aqui com tipo do express
  ) {
    const fotoUrl = `${req.protocol}://${req.get('host')}/uploads/${foto.filename}`;
  
    return this.service.completeProfile({
      id: body.id,
      fotoUrl,
      telefone: body.telefone,
    });
  }

@Put('edit-profile')
@UseInterceptors(
  FileInterceptor('foto', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async editProfile(
  @Body() body: { id: number; nome?: string; email:string, telefone?: string },
  @Req() req: Request,
  @UploadedFile() foto?: Express.Multer.File,
) {
  const fotoUrl = foto
    ? `${req.protocol}://${req.get('host')}/uploads/${foto.filename}`
    : undefined;

  return this.service.updateProfile({
    id: body.id,
    nome: body.nome,
    email: body.email,
    telefone: body.telefone,
    fotoUrl,
  });
}

@Put('change-password')
async changePassword(@Body() body: { id: number; senhaAtual: string; novaSenha: string }) {
  return this.service.changePassword(body);
}

}