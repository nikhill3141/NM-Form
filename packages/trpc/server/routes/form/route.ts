import {
  createFormInputModel,
  deleteFormInputModel,
  editFormInputModel,
  getFormByIdInputModel,
} from "@repo/services/form/model";
import { protectedProcedure, router } from "../../trpc";
import { formService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import {
  createFormOutputModel,
  deleteFormOutputModel,
  editFormOutputModel,
  getAllFormsByUserIdInputModel,
  getAllFormsByUserIdOutputModel,
  getFormByIdOutputModel,
  serializeForm,
} from "./model";
import { assertRateLimit } from "../../utils/rate-limit";
import {
  generateFormProposal,
  aiFormProposalSchema,
  generateFormInputModel,
} from "@repo/services/ai";


const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  createForm: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/create-form"),
        tags: TAGS,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      await assertRateLimit({
        key: `form:create:${ctx.user.id}`,
        limit: 12,
        windowMs: 60 * 60 * 1000,
        message:
          "You have created many forms in a short time. Please wait before creating another one.",
      });
      const { createForm } = await formService.createForm(ctx.user.id, input);
      const form = createForm[0];
      if (!form) throw new Error("Failed to create form");
      return serializeForm(form);
    }),

  generateWithAI: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/generate-with-ai"),
        tags: TAGS,
      },
    })
    .input(generateFormInputModel)
    .output(aiFormProposalSchema)
    .mutation(async ({ input, ctx }) => {
      await assertRateLimit({
        key: `form:ai:${ctx.user.id}`,
        limit: 10,
        windowMs: 10 * 60 * 1000,
        message: "You have generated many forms recently. Please wait before trying again.",
      });

      const model = process.env.AI_MODEL;

      if (!model) {
        throw new Error("AI_MODEL is not configured.");
      }

      const proposal = await generateFormProposal({
        prompt: input.prompt,
        mode: input.mode,
        existingFields: input.existingFields,
        provider: "google",
        model,
      });

      return proposal;
    }),

  getFormById: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/by-id"),
        tags: TAGS,
      },
    })
    .input(getFormByIdInputModel)
    .output(getFormByIdOutputModel)
    .query(async ({ input, ctx }) => {
      const { form } = await formService.getFormById(ctx.user.id, input);
      return serializeForm(form);
    }),

  getAllFormsByUserId: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/user-forms"),
        tags: TAGS,
      },
    })
    .input(getAllFormsByUserIdInputModel)
    .output(getAllFormsByUserIdOutputModel)
    .query(async ({ ctx }) => {
      const { forms } = await formService.getAllFormsByUserId(ctx.user.id);
      return forms.map(serializeForm);
    }),

  editForm: protectedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/edit-form"),
        tags: TAGS,
      },
    })
    .input(editFormInputModel)
    .output(editFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { updateForm } = await formService.editForm(ctx.user.id, input);
      const form = updateForm[0];
      if (!form) throw new Error("Failed to update form");
      return serializeForm(form);
    }),

  deleteForm: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/delete-form"),
        tags: TAGS,
      },
    })
    .input(deleteFormInputModel)
    .output(deleteFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { deleteForm } = await formService.deleteForm(ctx.user.id, input);
      const form = deleteForm[0];
      if (!form) throw new Error("Failed to delete form");
      return serializeForm(form);
    }),
});
