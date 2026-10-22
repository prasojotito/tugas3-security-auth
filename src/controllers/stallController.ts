import type { Request, Response } from 'express';
import { StallService } from '../services/stallService.ts';
import type { ListStallsQuery } from '../schemas/stall.schema.ts';

export class StallController {
  private stallService: StallService;

  constructor(stallService: StallService = new StallService()) {
    this.stallService = stallService;
  }

  getStalls = async (req: Request, res: Response): Promise<Response> => {
    // Sudah divalidasi dan di-default oleh middleware validate (page = 1, limit = 10)
    const { search, category, page, limit } = req.query as unknown as ListStallsQuery;

    const { data, total } = await this.stallService.getAllStalls({
      search,
      category,
      page,
      limit,
    });

    return res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
  };

  getStallById = async (req: Request, res: Response): Promise<Response> => {
    const stall = await this.stallService.getStallById(Number(req.params.id));
    return res.status(200).json({ status: 'success', data: stall });
  };

  getStallMenus = async (req: Request, res: Response): Promise<Response> => {
    const menus = await this.stallService.getStallMenus(Number(req.params.id));
    return res.status(200).json({ status: 'success', data: menus });
  };

  createStall = async (req: Request, res: Response): Promise<Response> => {
    const stall = await this.stallService.createStall(req.body);
    return res.status(201).json({ status: 'success', data: stall });
  };

  updateStall = async (req: Request, res: Response): Promise<Response> => {
    const stall = await this.stallService.updateStall(Number(req.params.id), req.body);
    return res.status(200).json({ status: 'success', data: stall });
  };

  deleteStall = async (req: Request, res: Response): Promise<Response> => {
    const stall = await this.stallService.deleteStall(Number(req.params.id));
    return res.status(200).json({ status: 'success', data: stall });
  };
}