import { Router } from 'express';
import { ApiController } from '../controllers/apiController.ts';
import { authenticate } from '../middlewares/authenticate.ts';
import { authorize } from '../middlewares/authorize.ts';

const apiRouter = Router();
const controller = new ApiController();

// ---------- Users (admin) ----------
apiRouter.get('/users', authenticate, authorize('admin'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return controller.getUsers(req, res);
});

// ---------- Menu items ----------
apiRouter.get('/menu-items', (req, res) => controller.getMenuItems(req, res));
apiRouter.get('/menu-items/:id', (req, res) => controller.getMenuItem(req, res));
apiRouter.post('/menu-items', authenticate, authorize('admin'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return controller.createMenuItem(req, res);
});
apiRouter.put('/menu-items/:id', authenticate, authorize('admin'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return controller.updateMenuItem(req, res);
});
apiRouter.delete('/menu-items/:id', authenticate, authorize('admin'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return controller.deleteMenuItem(req, res);
});

// ---------- Reviews (tambah review lewat POST /stalls/:id/reviews) ----------
apiRouter.get('/reviews', (req, res) => controller.getReviews(req, res));
apiRouter.delete('/reviews/:id', authenticate, authorize('admin'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return controller.deleteReview(req, res);
});

// ---------- Likes ----------
apiRouter.post('/likes', authenticate, (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LikeInput' } }
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  return controller.createLike(req, res);
});
apiRouter.delete('/likes/:id', authenticate, authorize('admin'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return controller.deleteLike(req, res);
});

// ---------- Flags (admin) ----------
apiRouter.get('/flags', authenticate, authorize('admin'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return controller.getFlags(req, res);
});
apiRouter.put('/flags/:id', authenticate, authorize('admin'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/FlagStatusInput' } }
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return controller.updateFlagStatus(req, res);
});

// ---------- Audit (admin) ----------
apiRouter.get('/audit', authenticate, authorize('admin'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return controller.getAuditLogs(req, res);
});
apiRouter.post('/audit', authenticate, authorize('admin'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuditLogInput' } }
  // #swagger.responses[401] = { description: 'Belum login atau token tidak valid' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return controller.createAuditLog(req, res);
});

export { apiRouter };