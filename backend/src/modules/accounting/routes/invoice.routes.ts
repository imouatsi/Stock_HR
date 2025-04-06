import { Router } from 'express';
import { validateRequest } from '../../../middleware/validateRequest';
import { invoiceAccessTokenSchema } from '../schemas/invoiceAccessToken.schema';
import { 
  requestAccessToken,
  releaseAccessToken,
  cancelAccessToken,
  getActiveAccessToken
} from '../controllers/invoiceAccessToken.controller';
import { protect } from '../../../middleware/auth';

const router = Router();

// Access token routes
router.post(
  '/access-token',
  protect,
  validateRequest(invoiceAccessTokenSchema),
  requestAccessToken
);

router.post(
  '/access-token/:token/release',
  protect,
  releaseAccessToken
);

router.post(
  '/access-token/:token/cancel',
  protect,
  cancelAccessToken
);

router.get(
  '/access-token/:invoice',
  protect,
  getActiveAccessToken
);

// ... existing code ...

export default router; 