# Provenance and reconstruction notes

## Source

Public preview supplied by the repository owner:

`https://startup-vault-16.preview.emergentagent.com`

The preview identifies the product as an **ADGM Formation Platform — Entity & Legal Automation** application.

## What could be recovered directly

The preview URL itself establishes the product identity and that it is a browser-based formation/legal automation experience.

## What could not be recovered from the public preview

The execution environment used for this migration could not fetch the client-rendered Emergent application payload. The preview also does not provide public access to its private project workspace. Consequently the following were not available for extraction:

- original React/Next/Vite source tree
- private backend source
- databases or stored user data
- authenticated API responses
- environment variables or secrets
- private assets
- Emergent project configuration
- proprietary prompt/system instructions that are not sent to the public browser

No attempt has been made to claim otherwise.

## What was reconstructed

A clean-room browser implementation has been created in this repository based on the publicly identifiable product purpose and a practical entity-formation workflow. It includes:

1. Formation dashboard
2. Multi-step formation wizard
3. Proposed company and legal-form details
4. Applicant/founder details
5. Share capital and ownership capture
6. Director and signatory information
7. Ultimate beneficial ownership capture
8. Registered-office information
9. Readiness declarations
10. Supporting-document checklist
11. Formation readiness review
12. Corporate records vault structure
13. Post-incorporation compliance calendar
14. Local-browser persistence for demonstration purposes

## Regulatory/legal limitation

This reconstruction is a workflow/product implementation, not legal advice and not an official ADGM filing portal. Regulatory fields, filing rules, required documents, fees, activity eligibility and deadlines should be verified against current official ADGM Registration Authority and, where relevant, FSRA requirements before production use.

## Why this approach was used

The goal was to preserve as much useful product value as possible while avoiding fabrication of inaccessible source code or private data. The repository can now be extended independently, version-controlled in GitHub and connected to a production backend later.
