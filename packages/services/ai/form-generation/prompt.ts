import type { AIFormField } from "./schema";

export function buildFormGenerationPrompt(
  prompt: string,
  existingFields: AIFormField[] = [],
): string {
  const existingFieldsText =
    existingFields.length > 0 ? JSON.stringify(existingFields, null, 2) : "No existing fields.";

  return `
Create a form proposal for Forest Forms based on the user's request.

USER REQUEST:
${prompt}

EXISTING FIELDS:
${existingFieldsText}

FORM RULES:

1. Understand the user's intent before generating fields.

2. Create a practical form that captures the information
actually needed for the user's goal.

3. Keep the form concise.

4. Generate a clear title.

5. Generate a useful short description.

6. Avoid unnecessary questions.

7. Avoid duplicate questions.

8. Use clear and natural question labels.

9. Mark fields required only when the information is
genuinely important.

10. Never generate database IDs.

11. Never generate form IDs.

12. Never generate user IDs.

13. Never generate authentication settings.

14. Never generate password settings.

15. Never generate publishing settings.

16. Never generate visibility settings.

17. Never generate expiry settings.

18. Never generate response limits.

19. Never modify or persist anything.

20. The user will review the proposal before applying it.

SUPPORTED FIELD TYPES:

- short_text
- long_text
- email
- number
- single_select
- multi_select
- phone
- date
- rating
- yes_no
- url
- time

FIELD TYPE RULES:

Use "short_text" for short written answers.

Use "long_text" for detailed written answers.

Use "email" for email addresses.

Use "number" for numeric values.

Use "phone" for phone numbers.

Use "date" for dates.

Use "time" for times.

Use "url" for URLs.

Use "rating" for ratings or scores.

Use "yes_no" for natural Yes/No questions.

Use "single_select" when the user must choose exactly one
option from a known set.

Use "multi_select" when the user can choose multiple options
from a known set.

OPTIONS RULES:

Every field MUST contain an "options" array.

Never omit "options".

Never return null for "options".

For fields that do not need options, return:

"options": []

For "single_select":

- options MUST contain at least 2 meaningful choices.
- Never return an empty array.
- Never return null.
- Never omit options.

For "multi_select":

- options MUST contain at least 2 meaningful choices.
- Never return an empty array.
- Never return null.
- Never omit options.

For "yes_no":

- Use type "yes_no".
- Return "options": [].
- Forest Forms automatically provides Yes and No choices.

For all other field types:

- Return "options": [].

EXAMPLES:

Legally Authorized to Work:

{
  "label": "Legally Authorized to Work",
  "description": null,
  "type": "single_select",
  "placeholder": null,
  "required": true,
  "options": ["Yes", "No"]
}

Employment Type:

{
  "label": "Employment Type",
  "description": null,
  "type": "single_select",
  "placeholder": null,
  "required": true,
  "options": [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship"
  ]
}

Preferred Work Arrangement:

{
  "label": "Preferred Work Arrangement",
  "description": null,
  "type": "single_select",
  "placeholder": null,
  "required": false,
  "options": [
    "Remote",
    "Hybrid",
    "On-site"
  ]
}

Preferred Work Locations:

{
  "label": "Preferred Work Locations",
  "description": null,
  "type": "multi_select",
  "placeholder": null,
  "required": false,
  "options": [
    "Remote",
    "On-site",
    "Hybrid"
  ]
}

Email Address:

{
  "label": "Email Address",
  "description": null,
  "type": "email",
  "placeholder": "you@example.com",
  "required": true,
  "options": []
}

Previous Work Experience:

{
  "label": "Previous Work Experience",
  "description": null,
  "type": "yes_no",
  "placeholder": null,
  "required": true,
  "options": []
}

DESCRIPTION RULES:

Every field MUST contain "description".

Use null when no description is needed.

PLACEHOLDER RULES:

Every field MUST contain "placeholder".

Use null when no placeholder is needed.

REQUIRED RULES:

Every field MUST contain "required".

Use true only when the answer is genuinely important.

Use false when the question is optional.

OUTPUT RULES:

Every field MUST contain:

- label
- description
- type
- placeholder
- required
- options

Remember:

options is ALWAYS an array.

single_select MUST have at least 2 options.

multi_select MUST have at least 2 options.

All other field types MUST have an empty options array.

Return only the structured form proposal.
`;
}
