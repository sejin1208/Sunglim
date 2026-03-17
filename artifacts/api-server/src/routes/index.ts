import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import deliveryCasesRouter from "./deliveryCases";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(deliveryCasesRouter);

export default router;
