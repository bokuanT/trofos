import { Action } from '@prisma/client';
import express from 'express';
import backlog from '../controllers/backlog';
import { isAuthorizedRequest } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/newBacklog', isAuthorizedRequest(Action.update_project, null), backlog.newBacklog);
router.get('/listBacklogs/:projectId', isAuthorizedRequest(Action.read_project, null), backlog.listBacklogs);
router.get('/listUnassignedBacklogs/:projectId', isAuthorizedRequest(Action.read_project, null), backlog.listBacklogs);
router.get('/getBacklog/:projectId/:backlogId', isAuthorizedRequest(Action.read_project, null), backlog.getBacklog);
router.put('/updateBacklog', isAuthorizedRequest(Action.update_project, null), backlog.updateBacklog);
router.delete(
  '/deleteBacklog/:projectId/:backlogId',
  isAuthorizedRequest(Action.update_project, null),
  backlog.deleteBacklog,
);

export default router;
