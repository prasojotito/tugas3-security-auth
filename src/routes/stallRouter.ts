import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { validate } from '../middlewares/validate.ts';
import { authenticate } from '../middlewares/authenticate.ts';
import { authorize } from '../middlewares/authorize.ts';
import {
  stallIdParams,
  listStallsQuery,
  createStallBody,
  updateStallBody,
  createReviewBody,
} from '../schemas/stall.schema.ts';

const stallRouter = Router();
const stallController = new StallController();

// ---------- Publik ----------

stallRouter.get('/', validate({ query: listStallsQuery }), (req, res) => {
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  return stallController.getStalls(req, res);
});

stallRouter.get('/:id', validate({ params: stallIdParams }), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallById(req, res);
});

stallRouter.get('/:id/menus', validate({ params: stallIdParams }), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallMenus(req, res);
});

// ---------- Owner dan admin ----------

stallRouter.post(
  '/',
  authenticate,
  authorize('owner', 'admin'),
  validate({ body: createStallBody }),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
    // #swagger.responses[201] = { description: 'Warung dibuat (pemilik = user dari token)' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
    // #swagger.responses[403] = { description: 'Role tidak memenuhi' }
    return stallController.createStall(req, res);
  },
);

stallRouter.put(
  '/:id',
  authenticate,
  authorize('owner', 'admin'),
  validate({ params: stallIdParams, body: updateStallBody }),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
    // #swagger.responses[200] = { description: 'Warung ter-update' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
    // #swagger.responses[403] = { description: 'Role tidak memenuhi, atau owner bukan pemilik warung' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.updateStall(req, res);
  },
);

// ---------- Admin ----------

stallRouter.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate({ params: stallIdParams }),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Warung terhapus' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
    // #swagger.responses[403] = { description: 'Hanya admin' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.deleteStall(req, res);
  },
);

// ---------- Semua role yang sudah login ----------

stallRouter.post(
  '/:id/reviews',
  authenticate,
  validate({ params: stallIdParams, body: createReviewBody }),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallReviewInput' } }
    // #swagger.responses[201] = { description: 'Review ditambahkan (penulis = user dari token)' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
    // #swagger.responses[404] = { description: 'Warung tidak ditemukan' }
    return stallController.createReview(req, res);
  },
);

export { stallRouter };