import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { validate } from '../middlewares/validate.ts';
import {
  stallIdParams,
  listStallsQuery,
  createStallBody,
  updateStallBody,
} from '../schemas/stall.schema.ts';

const stallRouter = Router();
const stallController = new StallController();

stallRouter.get('/', validate({ query: listStallsQuery }), (req, res) => {
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  return stallController.getStalls(req, res);
});

stallRouter.post('/', validate({ body: createStallBody }), (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[201] = { description: 'Warung dibuat' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  return stallController.createStall(req, res);
});

stallRouter.get('/:id', validate({ params: stallIdParams }), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallById(req, res);
});

stallRouter.put('/:id', validate({ params: stallIdParams, body: updateStallBody }), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[200] = { description: 'Warung ter-update' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.updateStall(req, res);
});

stallRouter.delete('/:id', validate({ params: stallIdParams }), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Warung terhapus' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.deleteStall(req, res);
});

stallRouter.get('/:id/menus', validate({ params: stallIdParams }), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallMenus(req, res);
});

export { stallRouter };