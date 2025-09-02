import { Controller,Post,Body,Put} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private service: AdminService) {}
    
    @Post('register')
    register(@Body() data: { nome: string; email: string; senha: string }) {
        return this.service.register(data);
    }
    @Put('recovery-password')
async changePasswordByEmail(@Body() body: { email: string; novaSenha: string }) {
    return this.service.changePasswordByEmail(body);
}
}
