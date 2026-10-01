import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { formRouter } from "./routes/form/route";
import { formLinkRouter } from "./routes/formLink/route";
import { fieldRouter } from "./routes/field/route";
import { responseRouter } from "./routes/response/route";
import { answerRouter } from "./routes/answer/route";
import { exploreRouter } from "./routes/explore/route";
import { billingRouter } from "./routes/billing/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
  formLink: formLinkRouter,
  field: fieldRouter,
  response: responseRouter,
  answer: answerRouter,
  explore: exploreRouter,
  billing: billingRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
