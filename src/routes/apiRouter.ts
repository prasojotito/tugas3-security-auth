import { Router } from 'express';
import { ApiController } from '../controllers/apiController.ts';

const apiRouter = Router();
const controller = new ApiController();

apiRouter.get('/users', (req, res) => controller.getUsers(req, res));
apiRouter.post('/users', (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UserInput' } }
	return controller.createUser(req, res);
});
apiRouter.get('/menu-items', (req, res) => controller.getMenuItems(req, res));
apiRouter.get('/menu-items/:id', (req, res) => controller.getMenuItem(req, res));
apiRouter.post('/menu-items', (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
	return controller.createMenuItem(req, res);
});
apiRouter.put('/menu-items/:id', (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
	return controller.updateMenuItem(req, res);
});
apiRouter.delete('/menu-items/:id', (req, res) => controller.deleteMenuItem(req, res));
apiRouter.get('/reviews', (req, res) => controller.getReviews(req, res));
apiRouter.post('/reviews', (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewInput' } }
	return controller.createReview(req, res);
});
apiRouter.delete('/reviews/:id', (req, res) => controller.deleteReview(req, res));
apiRouter.post('/likes', (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LikeInput' } }
	return controller.createLike(req, res);
});
apiRouter.delete('/likes/:id', (req, res) => controller.deleteLike(req, res));
apiRouter.get('/flags', (req, res) => controller.getFlags(req, res));
apiRouter.put('/flags/:id', (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/FlagStatusInput' } }
	return controller.updateFlagStatus(req, res);
});
apiRouter.get('/audit', (req, res) => controller.getAuditLogs(req, res));
apiRouter.post('/audit', (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuditLogInput' } }
	return controller.createAuditLog(req, res);
});

export { apiRouter };