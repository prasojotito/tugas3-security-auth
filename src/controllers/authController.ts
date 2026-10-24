import type { Request, Response } from 'express';
import { AuthService } from '../services/authService.ts';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.authService.register(req.body);
    return res.status(201).json({ status: 'success', data: user });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.authService.login(req.body);
    return res.status(200).json({ status: 'success', data: result });
  };

  // Identitas diambil dari token (req.user), bukan dari request.
  me = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.authService.getProfile(req.user!.id);
    return res.status(200).json({ status: 'success', data: user });
  };
}