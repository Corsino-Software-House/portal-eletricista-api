export class LoginDto {
  email: string;
  senha: string;
  tipo: 'cliente' | 'profissional' | 'admin'; // importante definir!
}
