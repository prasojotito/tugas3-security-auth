import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { validate } from '../middlewares/validate.ts';
import { authenticate } from '../middlewares/authenticate.ts';
import { registerBody, loginBody } from '../schemas/auth.schema.ts';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', validate({ body: registerBody }), (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/RegisterInput' } }
  // #swagger.responses[201] = { description: 'Akun dibuat (role customer)' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[409] = { description: 'Email sudah terdaftar' }
  return authController.register(req, res);
});

authRouter.post('/login', validate({ body: loginBody }), (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LoginInput' } }
  // #swagger.responses[200] = { description: 'Login berhasil, mengembalikan token JWT' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[401] = { description: 'Email atau password salah' }
  return authController.login(req, res);
});

authRouter.get('/me', authenticate, (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[200] = { description: 'Data user dari token' }
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  return authController.me(req, res);
});

export { authRouter };