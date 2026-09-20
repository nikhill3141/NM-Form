"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Eye,
  ExternalLink,
  GripVertical,
  Link2,
  Loader2,
  Lock,
  Plus,
  Save,
  Send,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { trpc } from "~/trpc/client";
import {
  clearBuilderDraft,
  loadBuilderDraft,
  saveBuilderDraft,
  type BuilderDraftField,
  type FieldVisibilityRule,
} from "./builder-draft";
import { templates } from "./data";
import {
  fieldBlocks,
  getDefaultOptionsForFieldType,
  getInputTypeForFieldType,
  isOptionField,
  type FieldType,
} from "./field-types";
import {
  formThemes,
  getFormTheme,
  type FormThemeValue,
} from "./themes";
import { GlassPanel } from "./ui-blocks";

import {
  AIFormField,
  AIGenerationWrapper,
  type AIFormProposal,
} from "./ai/AIGenerationWrapper";

type LocalField = BuilderDraftField;

const previewUrl = "/form/forest-feedback?previewDraft=1";

function toDatetimeLocalValue(date: Date) {
  const offsetDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return offsetDate.toISOString().slice(0, 16);
}

function defaultExpiryValue() {
  return toDatetimeLocalValue(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  );
}

function isoToDatetimeLocalValue(value?: string | null) {
  if (!value) return defaultExpiryValue();

  return toDatetimeLocalValue(new Date(value));
}

function parseVisibilityRule(
  value: unknown,
): FieldVisibilityRule | undefined {
  if (!value || typeof value !== "object") return undefined;

  const showWhen = (value as FieldVisibilityRule).showWhen;

  if (!showWhen?.fieldId || !showWhen.equals) {
    return undefined;
  }

  return { showWhen };
}

export function FunctionalBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const utils = trpc.useUtils();

  const editFormId = searchParams.get("formId") ?? "";
  const templateSlug = searchParams.get("template") ?? "";
  const newFormRequested = searchParams.get("new") === "1";

  const selectedTemplate = templates.find(
    (item) => item.slug === templateSlug,
  );

  const [title, setTitle] = useState("Forest launch survey");

  const [description, setDescription] = useState(
    "A cinematic feedback journey for a product launch.",
  );

  const [theme, setTheme] =
    useState<FormThemeValue>("forest_cinematic");

  const [visibility, setVisibility] =
    useState<"public" | "unlisted">("unlisted");

  const [activeFormId, setActiveFormId] = useState("");
  const [activeSlug, setActiveSlug] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState(defaultExpiryValue);

  const [previewMode, setPreviewMode] =
    useState<"desktop" | "mobile">("desktop");

  const [statusMessage, setStatusMessage] = useState("");
  const [fields, setFields] = useState<LocalField[]>([]);

  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [formPassword, setFormPassword] = useState("");

  const [draftLoaded, setDraftLoaded] = useState(false);
  const [loadedRemoteFormId, setLoadedRemoteFormId] = useState("");
  const [loadedTemplateSlug, setLoadedTemplateSlug] = useState("");

  const [draggedFieldId, setDraggedFieldId] = useState("");
  const [dragOverFieldId, setDragOverFieldId] = useState("");

  const [showPublishSuccess, setShowPublishSuccess] =
    useState(false);

  const [publishedDestination, setPublishedDestination] =
    useState("");

  const [showAIGenerator, setShowAIGenerator] =
    useState(false);

  const formQuery = trpc.form.getFormById.useQuery(
    { id: editFormId },
    {
      enabled: Boolean(editFormId),
      retry: false,
    },
  );

  const ownerFieldsQuery =
    trpc.field.getFieldsByFormIdForOwner.useQuery(
      { formId: editFormId },
      {
        enabled: Boolean(editFormId),
        retry: false,
      },
    );

  const createForm = trpc.form.createForm.useMutation();
  const editForm = trpc.form.editForm.useMutation();
  const createField = trpc.field.createField.useMutation();
  const updateFieldMutation =
    trpc.field.updateField.useMutation();
  const deleteFieldMutation =
    trpc.field.deleteField.useMutation();
  const createLink =
    trpc.formLink.createFormLink.useMutation();

  const persistedFields = useMemo(
    () => fields.filter((field) => field.persistedId),
    [fields],
  );

  const isBusy =
    createForm.isPending ||
    editForm.isPending ||
    createField.isPending ||
    updateFieldMutation.isPending ||
    deleteFieldMutation.isPending ||
    createLink.isPending;

  const selectedTheme = getFormTheme(theme);

  useEffect(() => {
    if (newFormRequested) {
      clearBuilderDraft();

      setTitle("");
      setDescription("");
      setTheme("forest_cinematic");
      setVisibility("unlisted");
      setActiveFormId("");
      setActiveSlug("");
      setShareUrl("");
      setExpiresAt(defaultExpiryValue());
      setAllowAnonymous(true);
      setPasswordEnabled(false);
      setFormPassword("");
      setFields([]);
      setDraftLoaded(true);

      router.replace("/builder");

      return;
    }

    if (editFormId || selectedTemplate) {
      setDraftLoaded(true);
      return;
    }

    const draft = loadBuilderDraft();

    if (draft) {
      setTitle(draft.title);
      setDescription(draft.description ?? "");
      setTheme(draft.theme);
      setVisibility(draft.visibility);
      setActiveFormId(draft.activeFormId);
      setActiveSlug(draft.activeSlug);
      setShareUrl(draft.shareUrl);
      setExpiresAt(
        draft.expiresAt ?? defaultExpiryValue(),
      );
      setAllowAnonymous(draft.allowAnonymous);
      setPasswordEnabled(
        draft.passwordEnabled ?? false,
      );
      setFormPassword("");
      setFields(draft.fields);
    }

    setDraftLoaded(true);
  }, [
    editFormId,
    newFormRequested,
    router,
    selectedTemplate,
  ]);

  useEffect(() => {
    if (
      !selectedTemplate ||
      loadedTemplateSlug === selectedTemplate.slug ||
      editFormId
    ) {
      return;
    }

    setTitle(selectedTemplate.title);
    setDescription(selectedTemplate.description);
    setTheme(
      selectedTemplate.themeValue as FormThemeValue,
    );
    setVisibility("public");
    setActiveFormId("");
    setActiveSlug("");
    setShareUrl("");
    setExpiresAt(defaultExpiryValue());
    setAllowAnonymous(true);
    setPasswordEnabled(false);
    setFormPassword("");

    setFields(
      selectedTemplate.questions.map((question, index) => ({
        id: `template-${selectedTemplate.slug}-${index}`,
        label: question.label,
        type: question.type as FieldType,
        required: question.required,
        options:
          question.options ??
          getDefaultOptionsForFieldType(
            question.type as FieldType,
          ),
        validationRules: undefined,
      })),
    );

    setLoadedTemplateSlug(selectedTemplate.slug);
  }, [
    editFormId,
    loadedTemplateSlug,
    selectedTemplate,
  ]);

  useEffect(() => {
    if (
      !editFormId ||
      !formQuery.data ||
      ownerFieldsQuery.isLoading ||
      loadedRemoteFormId === editFormId
    ) {
      return;
    }

    setTitle(formQuery.data.title);

    setDescription(
      formQuery.data.description ?? "",
    );

    setTheme(formQuery.data.theme);
    setVisibility(formQuery.data.visibility);
    setActiveFormId(formQuery.data.id);
    setActiveSlug(formQuery.data.slug);

    setShareUrl(
      buildShareUrl(formQuery.data.slug),
    );

    setExpiresAt(
      isoToDatetimeLocalValue(
        formQuery.data.expiresAt,
      ),
    );

    setAllowAnonymous(
      formQuery.data.allowAnonymous,
    );

    setPasswordEnabled(
      formQuery.data.isPasswordProtected,
    );

    setFormPassword("");

    setFields(
      (ownerFieldsQuery.data ?? []).map((field) => ({
        id: field.id,
        persistedId: field.id,
        label: field.label,
        type: field.type as FieldType,
        required: field.required,
        options: Array.isArray(field.options)
          ? field.options.filter(
              (
                option,
              ): option is string =>
                typeof option === "string",
            )
          : getDefaultOptionsForFieldType(
              field.type as FieldType,
            ),
        validationRules:
          parseVisibilityRule(
            field.validationRules,
          ),
      })),
    );

    setLoadedRemoteFormId(editFormId);
  }, [
    editFormId,
    formQuery.data,
    loadedRemoteFormId,
    ownerFieldsQuery.data,
    ownerFieldsQuery.isLoading,
  ]);

  useEffect(() => {
    if (
      !draftLoaded ||
      editFormId ||
      selectedTemplate
    ) {
      return;
    }

    saveBuilderDraft({
      title,
      description,
      theme,
      visibility,
      activeFormId,
      activeSlug,
      shareUrl,
      expiresAt,
      allowAnonymous,
      passwordEnabled,
      formPassword: "",
      fields,
    });
  }, [
    activeFormId,
    activeSlug,
    allowAnonymous,
    description,
    draftLoaded,
    editFormId,
    expiresAt,
    fields,
    formPassword,
    passwordEnabled,
    selectedTemplate,
    shareUrl,
    theme,
    title,
    visibility,
  ]);

  function buildShareUrl(slug: string) {
    if (typeof window === "undefined") {
      return `/form/${slug}`;
    }

    return `${window.location.origin}/form/${slug}`;
  }

  async function copyShareUrl() {
    if (!shareUrl) return;

    await navigator.clipboard.writeText(shareUrl);

    toast.success(
      "Link copied under the canopy.",
      {
        className: "nm-toast",
        description:
          "Share it with anyone who should answer this form.",
      },
    );

    setStatusMessage("Share link copied.");
  }

  function getFieldOptions(field: LocalField) {
    return (
      field.options ??
      getDefaultOptionsForFieldType(field.type) ??
      []
    );
  }

  function getConditionalSourceFields(
    fieldId: string,
  ) {
    const fieldIndex = fields.findIndex(
      (field) => field.id === fieldId,
    );

    if (fieldIndex <= 0) return [];

    return fields
      .slice(0, fieldIndex)
      .filter((field) =>
        isOptionField(field.type),
      );
  }

  function translateVisibilityRule(
    rule: FieldVisibilityRule | undefined,
    idByLocalId: Map<string, string>,
  ) {
    if (!rule?.showWhen) {
      return undefined;
    }

    const fieldId =
      idByLocalId.get(
        rule.showWhen.fieldId,
      ) ?? rule.showWhen.fieldId;

    return {
      showWhen: {
        fieldId,
        equals: rule.showWhen.equals,
      },
    };
  }

  async function syncForm({
    publish = false,
  }: {
    publish?: boolean;
  } = {}) {
    setStatusMessage("");

    const expiresAtIso = new Date(
      expiresAt,
    ).toISOString();

    const nextPassword = passwordEnabled
      ? formPassword.trim()
      : "";

    const existingPasswordProtected =
      Boolean(
        formQuery.data?.isPasswordProtected,
      );

    if (
      passwordEnabled &&
      !existingPasswordProtected &&
      nextPassword.length < 4
    ) {
      setStatusMessage(
        "Set a password with at least 4 characters before creating a protected form.",
      );

      return;
    }

    try {
      let formId = activeFormId;
      let formSlug = activeSlug;

      if (!formId) {
        const form =
          await createForm.mutateAsync({
            title,
            description,
            visibility,
            status: publish
              ? "published"
              : "draft",
            theme,
            allowAnonymous,
            expiresAt: expiresAtIso,
            formPassword:
              nextPassword || undefined,
          });

        formId = form.id;
        formSlug = form.slug;

        setActiveFormId(formId);
        setActiveSlug(formSlug);
      } else {
        const form =
          await editForm.mutateAsync({
            id: formId,
            title,
            description,
            visibility,
            status: publish
              ? "published"
              : formQuery.data?.status,
            theme,
            isPublished: publish
              ? true
              : formQuery.data?.isPublished,
            allowAnonymous,
            expiresAt: expiresAtIso,
            formPassword:
              nextPassword || undefined,
            clearPassword: !passwordEnabled,
          });

        formSlug = form.slug;

        setActiveSlug(formSlug);
      }

      const nextFields = [...fields];

      const idByLocalId =
        new Map<string, string>();

      const persistedFieldIds = nextFields
        .map(
          (field) => field.persistedId,
        )
        .filter(
          (id): id is string =>
            Boolean(id),
        );

      nextFields.forEach((field) => {
        if (field.persistedId) {
          idByLocalId.set(
            field.id,
            field.persistedId,
          );
        }
      });

      for (const [
        index,
        id,
      ] of persistedFieldIds.entries()) {
        await updateFieldMutation.mutateAsync(
          {
            id,
            order: 10000 + index,
          },
        );
      }

      for (const [
        order,
        field,
      ] of nextFields.entries()) {
        const placeholder =
          fieldBlocks.find(
            (block) =>
              block.type === field.type,
          )?.placeholder ??
          "Type your answer...";

        const options = isOptionField(
          field.type,
        )
          ? getFieldOptions(field)
          : [];

        const validationRules =
          translateVisibilityRule(
            field.validationRules,
            idByLocalId,
          );

        if (field.persistedId) {
          await updateFieldMutation.mutateAsync(
            {
              id: field.persistedId,
              label: field.label,
              type: field.type,
              required: field.required,
              order,
              placeholder,
              options,
              validationRules,
            },
          );

          nextFields[order] = {
            ...field,
            options,
            validationRules,
          };

          continue;
        }

        const created =
          await createField.mutateAsync({
            formId,
            label: field.label,
            type: field.type,
            required: field.required,
            order,
            placeholder,
            options,
            validationRules,
          });

        idByLocalId.set(
          field.id,
          created.id,
        );

        nextFields[order] = {
          ...field,
          persistedId: created.id,
          options,
          validationRules,
        };
      }

      setFields(nextFields);

      if (
        publish &&
        visibility === "unlisted"
      ) {
        await createLink.mutateAsync({
          formId,
        });

        const nextShareUrl =
          buildShareUrl(formSlug);

        setActiveSlug(formSlug);
        setShareUrl(nextShareUrl);
      } else {
        setActiveSlug(formSlug);
        setShareUrl(
          buildShareUrl(formSlug),
        );
      }

      await utils.form
        .getAllFormsByUserId
        .invalidate();

      await utils.explore
        .explorePublicForms
        .invalidate();

      toast.success(
        publish
          ? "Published. The forest path is open."
          : "Draft saved. Your canopy is still intact.",
        {
          className: "nm-toast",
          description: publish
            ? visibility === "public"
              ? "Your public form is listed in Explore."
              : "Your share link is ready below."
            : "Preview keeps this draft even when you come back.",
        },
      );

      setStatusMessage(
        publish
          ? "Published through tRPC. Your share link is ready below."
          : "Draft synced through tRPC.",
      );

      if (publish) {
        const destination =
          visibility === "public"
            ? `/explore?formId=${formId}`
            : buildShareUrl(formSlug);

        setPublishedDestination(
          destination,
        );

        setShowPublishSuccess(true);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Could not sync with backend.";

      toast.error(
        "The trail got blocked.",
        {
          className: "nm-toast",
          description: errorMessage,
        },
      );

      setStatusMessage(
        errorMessage,
      );
    }
  }

  async function unpublishForm() {
    if (!activeFormId) return;

    try {
      await editForm.mutateAsync({
        id: activeFormId,
        status: "draft",
        isPublished: false,
      });

      await utils.form
        .getAllFormsByUserId
        .invalidate();

      await utils.explore
        .explorePublicForms
        .invalidate();

      setStatusMessage(
        "Form unpublished. Existing links now show as unavailable until you publish again.",
      );

      toast.success(
        "Form unpublished.",
        {
          className: "nm-toast",
          description:
            "You can keep editing and publish it again when ready.",
        },
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Could not unpublish form.";

      setStatusMessage(
        errorMessage,
      );

      toast.error(
        "Could not unpublish form.",
        {
          className: "nm-toast",
          description: errorMessage,
        },
      );
    }
  }

  function addField(type: FieldType) {
    const block = fieldBlocks.find(
      (item) => item.type === type,
    );

    setFields((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        label:
          block?.label ??
          "New question",
        type,
        required: false,
        options:
          getDefaultOptionsForFieldType(
            type,
          ),
        validationRules: undefined,
      },
    ]);
  }

  function updateField(
    id: string,
    patch: Partial<
      Pick<
        LocalField,
        | "label"
        | "required"
        | "options"
        | "validationRules"
      >
    >,
  ) {
    setFields((current) =>
      current.map((field) =>
        field.id === id
          ? {
              ...field,
              ...patch,
            }
          : field,
      ),
    );
  }

  function moveField(
    sourceId: string,
    targetId: string,
  ) {
    if (
      !sourceId ||
      !targetId ||
      sourceId === targetId
    ) {
      return;
    }

    setFields((current) => {
      const sourceIndex =
        current.findIndex(
          (field) =>
            field.id === sourceId,
        );

      const targetIndex =
        current.findIndex(
          (field) =>
            field.id === targetId,
        );

      if (
        sourceIndex < 0 ||
        targetIndex < 0
      ) {
        return current;
      }

      const next = [...current];

      const [moved] = next.splice(
        sourceIndex,
        1,
      );

      if (!moved) {
        return current;
      }

      next.splice(
        targetIndex,
        0,
        moved,
      );

      return next;
    });
  }

  function finishFieldDrag() {
    if (
      draggedFieldId &&
      dragOverFieldId &&
      draggedFieldId !==
        dragOverFieldId
    ) {
      moveField(
        draggedFieldId,
        dragOverFieldId,
      );

      setStatusMessage(
        "Field order updated. Save or publish to sync the new order.",
      );
    }

    setDraggedFieldId("");
    setDragOverFieldId("");
  }

  async function removeField(
    field: LocalField,
  ) {
    if (field.persistedId) {
      await deleteFieldMutation.mutateAsync(
        {
          id: field.persistedId,
        },
      );
    }

    setFields((current) =>
      current.filter(
        (item) => item.id !== field.id,
      ),
    );
  }

  function renderFieldPreview(
    field: LocalField,
  ) {
    if (field.type === "long_text") {
      return (
        <textarea
          className="nm-input min-h-24"
          disabled
          placeholder="Disabled in builder preview"
        />
      );
    }

    if (isOptionField(field.type)) {
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {getFieldOptions(field).map(
            (option) => (
              <label
                className="flex items-center gap-2 rounded-lg border border-emerald-900/10 bg-white/55 px-3 py-2.5 text-sm text-emerald-900/70 dark:border-white/10 dark:bg-white/[0.04] dark:text-emerald-50/65"
                key={option}
              >
                <input
                  className="size-3.5 accent-emerald-400"
                  disabled
                  type={
                    field.type ===
                    "multi_select"
                      ? "checkbox"
                      : "radio"
                  }
                />
                {option}
              </label>
            ),
          )}
        </div>
      );
    }

    if (field.type === "rating") {
      return (
        <div className="flex gap-1.5">
          {Array.from(
            { length: 5 },
            (_, index) => (
              <span
                className="flex size-9 items-center justify-center rounded-lg border border-emerald-900/10 bg-white/55 text-emerald-400/70 dark:border-white/10 dark:bg-white/[0.04]"
                key={index}
              >
                <Star className="size-4" />
              </span>
            ),
          )}
        </div>
      );
    }

    if (field.type === "date") {
      return (
        <input
          className="nm-input"
          disabled
          type="date"
        />
      );
    }

    if (field.type === "time") {
      return (
        <input
          className="nm-input"
          disabled
          type="time"
        />
      );
    }

    if ((field.type as string) === "yes_no") {
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {["Yes", "No"].map(
            (option) => (
              <label
                className="flex items-center gap-2 rounded-lg border border-emerald-900/10 bg-white/55 px-3 py-2.5 text-sm text-emerald-900/70 dark:border-white/10 dark:bg-white/[0.04] dark:text-emerald-50/65"
                key={option}
              >
                <input
                  className="size-3.5 accent-emerald-400"
                  disabled
                  type="radio"
                />
                {option}
              </label>
            ),
          )}
        </div>
      );
    }

    return (
      <input
        className="nm-input"
        disabled
        placeholder={
          fieldBlocks.find(
            (block) =>
              block.type === field.type,
          )?.placeholder ??
          "Type your answer..."
        }
        type={getInputTypeForFieldType(
          field.type,
        )}
      />
    );
  }

  const handleApplyAIProposal = (
    proposal: AIFormProposal,
    mode: "create" | "add",
  ) => {
    const generatedFields =
      proposal.fields.map(
        (field, index) => ({
          id: `ai-${Date.now()}-${index}`,
          label: field.label,
          type: field.type as FieldType,
          required: field.required,
          options:
            field.options ?? [],
          validationRules:
            undefined,
        }),
      );

    if (mode === "create") {
      setTitle(proposal.title);
      setDescription(
        proposal.description ?? "",
      );
      setFields(generatedFields);
      return;
    }

    setFields((currentFields) => [
      ...currentFields,
      ...generatedFields.map(
        (field, index) => ({
          ...field,
          id: `ai-${Date.now()}-${index}`,
        }),
      ),
    ]);
  };

  return (
    <div className="h-[100dvh] min-h-0 overflow-hidden p-2 sm:p-3">
      <GlassPanel className="h-full overflow-hidden">
        <div className="grid h-full min-h-0 lg:grid-cols-[220px_minmax(0,1fr)_270px] lg:items-stretch">
          <aside className="min-h-0 border-b border-emerald-900/10 bg-white/25 p-3 dark:border-white/10 dark:bg-black/5 sm:p-4 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:overflow-y-auto lg:overscroll-contain lg:border-b-0 lg:border-r lg:p-3">
            <div className="lg:flex lg:min-h-full lg:flex-col">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700/60 dark:text-emerald-200/55">
                    Add question
                  </p>

                  <p className="mt-1 text-xs text-emerald-900/50 dark:text-emerald-50/45">
                    Choose a field type
                  </p>
                </div>

                <div className="flex size-8 items-center justify-center rounded-lg border border-emerald-900/10 bg-white/70 dark:border-white/10 dark:bg-white/[0.05]">
                  <Plus className="size-4 text-emerald-600 dark:text-emerald-200" />
                </div>
              </div>

              <Select
                onValueChange={(value) =>
                  addField(
                    value as FieldType,
                  )
                }
              >
                <SelectTrigger className="nm-input h-11 w-full bg-white/80 px-3 text-left shadow-sm dark:bg-black/25">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>

                <SelectContent className="border-emerald-900/10 bg-white text-emerald-950 dark:border-white/10 dark:bg-[#07140d] dark:text-emerald-50">
                  {fieldBlocks.map(
                    (block) => (
                      <SelectItem
                        key={block.type}
                        value={block.type}
                        className="py-2.5"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="size-3.5 text-emerald-500 dark:text-emerald-200" />
                          <span>
                            {block.label}
                          </span>
                        </span>
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              <p className="mt-2 text-[11px] leading-5 text-emerald-900/45 dark:text-emerald-50/40">
                Add a question, then edit its label and required state directly on the canvas.
              </p>

              <div className="mt-4 hidden flex-1 rounded-xl border border-emerald-900/10 bg-white/35 p-3 dark:border-white/10 dark:bg-white/[0.025] lg:flex lg:flex-col">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700/60 dark:text-emerald-200/55">
                    Form flow
                  </p>

                  <span className="rounded-full border border-emerald-900/10 bg-white/60 px-2 py-0.5 text-[10px] font-medium text-emerald-900/55 dark:border-white/10 dark:bg-white/[0.05] dark:text-emerald-50/50">
                    {fields.length}{" "}
                    {fields.length === 1
                      ? "question"
                      : "questions"}
                  </span>
                </div>

                <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto pr-1">
                  {fields.length === 0 ? (
                    <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-emerald-900/10 px-3 text-center text-[11px] leading-5 text-emerald-900/40 dark:border-white/10 dark:text-emerald-50/35">
                      Your questions will appear here as you build the form.
                    </div>
                  ) : (
                    fields.map(
                      (field, index) => (
                        <button
                          key={field.id}
                          className="group flex w-full items-center gap-2 rounded-lg border border-transparent bg-white/35 px-2.5 py-2 text-left transition hover:border-emerald-500/20 hover:bg-white/65 dark:bg-white/[0.025] dark:hover:border-emerald-300/15 dark:hover:bg-white/[0.05]"
                          onClick={() => {
                            document
                              .getElementById(
                                `builder-field-${field.id}`,
                              )
                              ?.scrollIntoView(
                                {
                                  behavior:
                                    "smooth",
                                  block:
                                    "center",
                                },
                              );
                          }}
                          type="button"
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-emerald-300/20 text-[10px] font-semibold text-emerald-800 dark:text-emerald-100">
                            {index + 1}
                          </span>

                          <span className="min-w-0 flex-1 truncate text-[11px] text-emerald-900/65 dark:text-emerald-50/60">
                            {field.label ||
                              "Untitled question"}
                          </span>

                          {field.required && (
                            <span className="text-[9px] font-medium text-emerald-700/55 dark:text-emerald-200/50">
                              req.
                            </span>
                          )}
                        </button>
                      ),
                    )
                  )}
                </div>

                <div className="mt-3 border-t border-emerald-900/10 pt-3 text-[10px] leading-4 text-emerald-900/40 dark:border-white/10 dark:text-emerald-50/35">
                  Drag questions in the canvas to change their order.
                </div>
              </div>
            </div>
          </aside>

          <section className="min-h-0 h-full overflow-y-auto overscroll-contain bg-emerald-50/72 p-3 dark:bg-black/18 sm:p-4 md:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-700/70 dark:text-emerald-200/65">
                  Live canvas
                </p>

                <h2 className="mt-1 max-w-xl truncate text-xl font-semibold text-emerald-950 dark:text-white sm:text-2xl">
                  {title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  className="nm-button-glass"
                  onClick={() =>
                    router.push(
                      "/dashboard",
                    )
                  }
                  variant="outline"
                >
                  <ArrowLeft className="size-4" />
                  <span className="hidden sm:inline">
                    Dashboard
                  </span>
                </Button>

                <Button
                  className="nm-button-glass"
                  onClick={() =>
                    setPreviewMode(
                      previewMode ===
                        "desktop"
                        ? "mobile"
                        : "desktop",
                    )
                  }
                  variant="outline"
                >
                  <Smartphone className="size-4" />

                  <span className="hidden sm:inline">
                    {previewMode}
                  </span>
                </Button>

                <Button
                  className="bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
                  disabled={isBusy}
                  onClick={() =>
                    syncForm()
                  }
                >
                  {isBusy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}

                  Save draft
                </Button>

                <button
                  type="button"
                  onClick={() =>
                    setShowAIGenerator(
                      true,
                    )
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-900/10 bg-white/70 px-3 text-sm font-medium text-emerald-950 transition hover:border-emerald-500/30 hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-emerald-50 dark:hover:bg-white/[0.08]"
                >
                  <Sparkles className="h-4 w-4" />

                  <span className="hidden sm:inline">
                    Generate with AI
                  </span>
                </button>
              </div>
            </div>

            <div
              className={
                previewMode === "mobile"
                  ? "mx-auto max-w-sm"
                  : "mx-auto max-w-2xl"
              }
            >
              <div className="rounded-2xl border border-emerald-900/10 bg-white/84 p-4 shadow-lg shadow-emerald-950/8 dark:border-white/10 dark:bg-[#0c1f16]/82 dark:shadow-black/20 sm:p-5">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-emerald-700/70 dark:text-emerald-200/65">
                  {selectedTheme.label}
                </p>

                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-emerald-900/64 dark:text-emerald-50/64">
                  {description}
                </p>

                {fields.length > 1 && (
                  <div className="mt-5 rounded-lg border border-emerald-900/10 bg-emerald-50/70 p-3 text-xs text-emerald-900/62 dark:border-white/10 dark:bg-white/[0.05] dark:text-emerald-50/62">
                    Drag the handle on any field to change question order.
                  </div>
                )}

                <div className="mt-5 space-y-3">
                  {fields.map(
                    (field, index) => (
                      <div
                        id={`builder-field-${field.id}`}
                        className={`rounded-xl border p-3 transition sm:p-4 ${
                          dragOverFieldId ===
                            field.id &&
                          draggedFieldId !==
                            field.id
                            ? "border-emerald-500/60 bg-emerald-300/18 dark:border-emerald-300/60 dark:bg-emerald-300/12"
                            : "border-emerald-900/10 bg-emerald-50/70 dark:border-white/10 dark:bg-white/[0.06]"
                        } ${
                          draggedFieldId ===
                          field.id
                            ? "opacity-60"
                            : ""
                        }`}
                        key={field.id}
                        onDragEnter={(
                          event,
                        ) => {
                          event.preventDefault();
                          setDragOverFieldId(
                            field.id,
                          );
                        }}
                        onDragOver={(
                          event,
                        ) => {
                          event.preventDefault();
                          setDragOverFieldId(
                            field.id,
                          );
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          finishFieldDrag();
                        }}
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <button
                            aria-label={`Drag ${
                              field.label ||
                              "field"
                            } to reorder`}
                            className="mt-0.5 flex size-8 shrink-0 cursor-grab items-center justify-center rounded-lg border border-emerald-900/10 bg-white/72 text-emerald-900/45 transition hover:border-emerald-500/35 hover:text-emerald-700 active:cursor-grabbing dark:border-white/10 dark:bg-black/20 dark:text-emerald-50/45 dark:hover:border-emerald-300/35 dark:hover:text-emerald-100"
                            draggable
                            onDragEnd={
                              finishFieldDrag
                            }
                            onDragStart={(
                              event,
                            ) => {
                              setDraggedFieldId(
                                field.id,
                              );
                              setDragOverFieldId(
                                field.id,
                              );
                              event.dataTransfer.effectAllowed =
                                "move";
                              event.dataTransfer.setData(
                                "text/plain",
                                field.id,
                              );
                            }}
                            type="button"
                          >
                            <GripVertical className="size-4" />
                          </button>

                          <div className="min-w-0 flex-1 space-y-2">
                            <input
                              className="nm-input h-10 text-sm font-medium"
                              onChange={(
                                event,
                              ) =>
                                updateField(
                                  field.id,
                                  {
                                    label:
                                      event
                                        .target
                                        .value,
                                  },
                                )
                              }
                              placeholder="Question label"
                              value={
                                field.label
                              }
                            />

                            <label className="flex cursor-pointer items-center gap-2 text-xs text-emerald-900/70 dark:text-emerald-50/70">
                              <input
                                checked={
                                  field.required
                                }
                                className="size-3.5 rounded border-white/20 accent-emerald-400"
                                onChange={(
                                  event,
                                ) =>
                                  updateField(
                                    field.id,
                                    {
                                      required:
                                        event
                                          .target
                                          .checked,
                                    },
                                  )
                                }
                                type="checkbox"
                              />

                              Required
                            </label>
                          </div>

                          <button
                            className="shrink-0 text-emerald-900/50 hover:text-red-700 dark:text-emerald-50/50 dark:hover:text-red-100"
                            disabled={
                              deleteFieldMutation.isPending
                            }
                            onClick={() =>
                              void removeField(
                                field,
                              )
                            }
                            type="button"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>

                        <p className="mb-2 text-[11px] text-emerald-900/45 dark:text-emerald-50/40">
                          {index + 1}.
                          {" "}
                          Preview
                          {field.required
                            ? " - required"
                            : ""}
                        </p>

                        {isOptionField(
                          field.type,
                        ) &&
                          field.type !==
                            "yes_no" && (
                            <div className="mb-3 grid gap-2">
                              {(
                                field.options ??
                                []
                              ).map(
                                (
                                  option,
                                  optionIndex,
                                ) => (
                                  <input
                                    className="nm-input min-h-9 text-sm"
                                    key={`${field.id}-${optionIndex}`}
                                    onChange={(
                                      event,
                                    ) => {
                                      const nextOptions =
                                        [
                                          ...(field.options ??
                                            []),
                                        ];

                                      nextOptions[
                                        optionIndex
                                      ] =
                                        event
                                          .target
                                          .value;

                                      updateField(
                                        field.id,
                                        {
                                          options:
                                            nextOptions,
                                        },
                                      );
                                    }}
                                    value={
                                      option
                                    }
                                  />
                                ),
                              )}
                            </div>
                          )}

                        {getConditionalSourceFields(
                          field.id,
                        ).length >
                          0 && (
                          <div className="mb-3 rounded-lg border border-emerald-900/10 bg-white/64 p-3 dark:border-white/10 dark:bg-black/20">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700/70 dark:text-emerald-200/70">
                              Conditional logic
                            </p>

                            <div className="grid gap-2 md:grid-cols-2">
                              <Select
                                onValueChange={(
                                  value,
                                ) => {
                                  if (
                                    value ===
                                    "__always"
                                  ) {
                                    updateField(
                                      field.id,
                                      {
                                        validationRules:
                                          undefined,
                                      },
                                    );

                                    return;
                                  }

                                  const sourceField =
                                    fields.find(
                                      (
                                        item,
                                      ) =>
                                        item.id ===
                                        value,
                                    );

                                  const firstOption =
                                    sourceField
                                      ? getFieldOptions(
                                          sourceField,
                                        )?.[0]
                                      : undefined;

                                  updateField(
                                    field.id,
                                    {
                                      validationRules:
                                        firstOption
                                          ? {
                                              showWhen:
                                                {
                                                  fieldId:
                                                    value,
                                                  equals:
                                                    firstOption,
                                                },
                                            }
                                          : undefined,
                                    },
                                  );
                                }}
                                value={
                                  field
                                    .validationRules
                                    ?.showWhen
                                    ?.fieldId ??
                                  "__always"
                                }
                              >
                                <SelectTrigger className="nm-input h-11 w-full bg-white/78 px-3 text-left dark:bg-black/28">
                                  <SelectValue placeholder="Always show" />
                                </SelectTrigger>

                                <SelectContent className="border-emerald-900/10 bg-white text-emerald-950 dark:border-white/10 dark:bg-[#07140d] dark:text-emerald-50">
                                  <SelectItem value="__always">
                                    Always show
                                  </SelectItem>

                                  {getConditionalSourceFields(
                                    field.id,
                                  ).map(
                                    (
                                      sourceField,
                                    ) => (
                                      <SelectItem
                                        key={
                                          sourceField.id
                                        }
                                        value={
                                          sourceField.id
                                        }
                                      >
                                        Show after:{" "}
                                        {sourceField.label ||
                                          "Untitled question"}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>

                              {field
                                .validationRules
                                ?.showWhen && (
                                <Select
                                  onValueChange={(
                                    value,
                                  ) =>
                                    updateField(
                                      field.id,
                                      {
                                        validationRules:
                                          {
                                            showWhen:
                                              {
                                                fieldId:
                                                  field
                                                    .validationRules
                                                    ?.showWhen
                                                    ?.fieldId ??
                                                  "",
                                                equals:
                                                  value,
                                              },
                                          },
                                      },
                                    )
                                  }
                                  value={
                                    field
                                      .validationRules
                                      .showWhen
                                      .equals
                                  }
                                >
                                  <SelectTrigger className="nm-input h-11 w-full bg-white/78 px-3 text-left dark:bg-black/28">
                                    <SelectValue placeholder="Choose answer" />
                                  </SelectTrigger>

                                  <SelectContent className="border-emerald-900/10 bg-white text-emerald-950 dark:border-white/10 dark:bg-[#07140d] dark:text-emerald-50">
                                    {(
                                      getFieldOptions(
                                        fields.find(
                                          (
                                            item,
                                          ) =>
                                            item.id ===
                                            field
                                              .validationRules
                                              ?.showWhen
                                              ?.fieldId,
                                        ) ??
                                          field,
                                      ) ?? []
                                    ).map(
                                      (
                                        option,
                                      ) => (
                                        <SelectItem
                                          key={
                                            option
                                          }
                                          value={
                                            option
                                          }
                                        >
                                          Answer is:{" "}
                                          {
                                            option
                                          }
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>

                            <p className="mt-1.5 text-[11px] leading-5 text-emerald-900/56 dark:text-emerald-50/52">
                              Show this question only when a previous choice matches the selected answer.
                            </p>
                          </div>
                        )}

                        {renderFieldPreview(
                          field,
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>

          <aside className="min-h-0 border-t border-emerald-900/10 bg-white/20 p-3 dark:border-white/10 dark:bg-black/5 sm:p-4 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:border-l lg:border-t-0">
            <div className="space-y-3 lg:min-h-full">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700/70 dark:text-emerald-200/65">
                Form properties
              </p>

              <div>
                <label className="mb-2 block text-sm text-emerald-950 dark:text-emerald-50">
                  Title
                </label>

                <input
                  className="nm-input"
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                  value={title}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-emerald-950 dark:text-emerald-50">
                  Description
                </label>

                <textarea
                  className="nm-input min-h-20"
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  value={description}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-emerald-950 dark:text-emerald-50">
                  Theme
                </label>

                <Select
                  onValueChange={(value) =>
                    setTheme(
                      value as FormThemeValue,
                    )
                  }
                  value={theme}
                >
                  <SelectTrigger className="nm-input h-12 w-full bg-white/78 px-3 text-left dark:bg-black/28">
                    <SelectValue placeholder="Choose a theme" />
                  </SelectTrigger>

                  <SelectContent className="border-emerald-900/10 bg-white text-emerald-950 dark:border-white/10 dark:bg-[#07140d] dark:text-emerald-50">
                    {formThemes.map(
                      (item) => {
                        const Icon =
                          item.icon;

                        return (
                          <SelectItem
                            className="py-3"
                            key={item.value}
                            value={item.value}
                          >
                            <span className="flex items-center gap-2">
                              <Icon className="size-4" />
                              <span>
                                {item.label}
                              </span>
                            </span>
                          </SelectItem>
                        );
                      },
                    )}
                  </SelectContent>
                </Select>

                <p className="mt-1.5 text-[11px] leading-5 text-emerald-900/56 dark:text-emerald-50/52">
                  {selectedTheme.description}
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-emerald-900/80 dark:text-emerald-50/80">
                <input
                  checked={
                    allowAnonymous
                  }
                  className="size-4 rounded border-white/20 accent-emerald-400"
                  onChange={(event) =>
                    setAllowAnonymous(
                      event.target.checked,
                    )
                  }
                  type="checkbox"
                />

                Allow anonymous responses
              </label>

              <div className="rounded-xl border border-emerald-900/10 bg-white/64 p-3 dark:border-white/10 dark:bg-white/[0.06]">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-emerald-900/85 dark:text-emerald-50/85">
                  <input
                    checked={
                      passwordEnabled
                    }
                    className="size-4 rounded border-white/20 accent-emerald-400"
                    onChange={(event) =>
                      setPasswordEnabled(
                        event.target.checked,
                      )
                    }
                    type="checkbox"
                  />

                  <Lock className="size-4 text-emerald-600 dark:text-emerald-200" />

                  Protect form with password
                </label>

                {passwordEnabled && (
                  <div className="mt-3">
                    <input
                      className="nm-input"
                      minLength={4}
                      onChange={(event) =>
                        setFormPassword(
                          event.target.value,
                        )
                      }
                      placeholder={
                        formQuery.data
                          ?.isPasswordProtected
                          ? "Leave blank to keep current password"
                          : "Set form password"
                      }
                      type="password"
                      value={
                        formPassword
                      }
                    />

                    <p className="mt-1.5 text-[11px] leading-5 text-emerald-900/56 dark:text-emerald-50/52">
                      Respondents must enter this password before questions and submissions unlock.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label
                  className="mb-2 block text-sm text-emerald-950 dark:text-emerald-50"
                  htmlFor="form-expiry"
                >
                  Form expiry
                </label>

                <input
                  className="nm-input"
                  id="form-expiry"
                  min={toDatetimeLocalValue(
                    new Date(),
                  )}
                  onChange={(event) =>
                    setExpiresAt(
                      event.target.value,
                    )
                  }
                  type="datetime-local"
                  value={expiresAt}
                />

                <p className="mt-1.5 text-[11px] leading-5 text-emerald-900/56 dark:text-emerald-50/52">
                  Respondents can fill this form until this date and time.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    "public",
                    "unlisted",
                  ] as const
                ).map((item) => (
                  <button
                    className={`rounded-lg border px-3 py-3 text-sm ${
                      visibility ===
                      item
                        ? "border-emerald-500/50 bg-emerald-300/24 text-emerald-950 dark:border-emerald-300/50 dark:bg-emerald-300/14 dark:text-emerald-50"
                        : "border-emerald-900/10 bg-white/64 text-emerald-900/62 dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-50/62"
                    }`}
                    key={item}
                    onClick={() =>
                      setVisibility(
                        item,
                      )
                    }
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <Button
                className="h-11 w-full bg-emerald-300 text-emerald-950 shadow-sm hover:bg-emerald-200"
                disabled={isBusy}
                onClick={() =>
                  syncForm({
                    publish: true,
                  })
                }
              >
                {isBusy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}

                {formQuery.data
                  ?.isPublished
                  ? "Update published form"
                  : "Publish form"}
              </Button>

              {formQuery.data
                ?.isPublished && (
                <Button
                  className="nm-button-glass w-full"
                  disabled={isBusy}
                  onClick={
                    unpublishForm
                  }
                  variant="outline"
                >
                  <Lock className="size-4" />
                  Unpublish form
                </Button>
              )}

              <Button
                className="nm-button-glass w-full"
                asChild
                variant="outline"
              >
                <a href={previewUrl}>
                  <Eye className="size-4" />
                  Preview current draft
                </a>
              </Button>

              {shareUrl &&
                visibility ===
                  "unlisted" && (
                  <div className="rounded-xl border border-emerald-900/10 bg-white/64 p-3 dark:border-white/10 dark:bg-white/[0.06]">
                    <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Link2 className="size-4 text-emerald-500 dark:text-emerald-200" />
                      Share link
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        className="nm-input h-10 min-h-10 flex-1 text-sm"
                        readOnly
                        value={
                          shareUrl
                        }
                      />

                      <Button
                        className="nm-button-glass"
                        onClick={
                          copyShareUrl
                        }
                        size="icon"
                        type="button"
                        variant="outline"
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}

              <p className="text-xs leading-5 text-emerald-900/56 dark:text-emerald-50/52">
                {persistedFields.length}{" "}
                of {fields.length} fields synced to backend.
              </p>

              {statusMessage && (
                <p className="rounded-lg border border-emerald-900/10 bg-white/64 p-3 text-sm text-emerald-900/70 dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-50/70">
                  {statusMessage}
                </p>
              )}
            </div>
          </aside>
        </div>
      </GlassPanel>

      {showPublishSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#0b1b13] sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-300/25 text-emerald-600 dark:text-emerald-200">
                <CheckCircle2 className="size-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-emerald-950 dark:text-white">
                  {visibility ===
                  "unlisted"
                    ? "Your form is live"
                    : "Your form is published"}
                </h3>

                <p className="mt-1 text-sm leading-5 text-emerald-900/60 dark:text-emerald-50/55">
                  {visibility ===
                  "unlisted"
                    ? "Share this private link with the people you want to reach."
                    : "Your form is now available in Explore."}
                </p>
              </div>
            </div>

            {visibility ===
            "unlisted" ? (
              <div className="mt-5 rounded-xl border border-emerald-900/10 bg-emerald-50/60 p-3 dark:border-white/10 dark:bg-white/[0.05]">
                <div className="flex items-center gap-2">
                  <input
                    className="nm-input h-10 min-h-10 flex-1 text-sm"
                    readOnly
                    value={shareUrl}
                  />

                  <Button
                    className="nm-button-glass shrink-0"
                    onClick={
                      copyShareUrl
                    }
                    size="icon"
                    type="button"
                    variant="outline"
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-emerald-900/10 bg-emerald-50/60 p-3 text-sm text-emerald-900/65 dark:border-white/10 dark:bg-white/[0.05] dark:text-emerald-50/60">
                Open Explore to see your published form among the public forms.
              </div>
            )}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                className="nm-button-glass"
                onClick={() =>
                  setShowPublishSuccess(
                    false,
                  )
                }
                variant="outline"
              >
                Continue editing
              </Button>

              <Button
                className="bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
                onClick={() => {
                  if (
                    visibility ===
                    "public"
                  ) {
                    router.push(
                      publishedDestination,
                    );

                    return;
                  }

                  window.open(
                    shareUrl,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                <ExternalLink className="size-4" />

                {visibility ===
                "public"
                  ? "Open Explore"
                  : "Open form"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AIGenerationWrapper
        open={showAIGenerator}
        onClose={() =>
          setShowAIGenerator(
            false,
          )
        }
        onApply={
          handleApplyAIProposal
        }
        existingFields={fields.map(
          (field) => ({
            label: field.label,
            description: null,
            type: field.type as AIFormField["type"],
            placeholder: null,
            required: field.required,
            options:
              field.options ?? [],
          }),
        )}
        defaultMode={
          fields.length > 0
            ? "add"
            : "create"
        }
      />
    </div>
  );
}