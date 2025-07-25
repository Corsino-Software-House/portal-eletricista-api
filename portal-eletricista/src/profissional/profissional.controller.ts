import {
  Controller,
  Post,
  Body,
  Put,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfissionalService } from './profissional.service';

@Controller('profissional')
export class ProfissionalController {
  constructor(private service: ProfissionalService) {}

  @Post('register')
  register(
    @Body()
    data: {
      nome: string;
      email: string;
      senha: string;
      cidade: string;
      bairro: string;
    },
  ) {
    return this.service.register(data);
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
  @Body() body: { id: number; bio: string },
  @UploadedFile() foto: Express.Multer.File,
  @Req() req: Request, // ✅ Aqui com tipo do express
) {
  const fotoUrl = `${req.protocol}://${req.get('host')}/uploads/${foto.filename}`;

  return this.service.completeProfile({
    id: body.id,
    bio: body.bio,
    fotoUrl,
  });
}

@Get('account')
  getAccount(@Query('email') email: string) {
    return this.service.findByEmail(email);
  }
}
