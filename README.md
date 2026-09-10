# ADGM Formation Platform

A reconstructed, GitHub-hosted implementation inspired by the publicly visible Emergent preview at:

`https://startup-vault-16.preview.emergentagent.com`

## Important provenance note

The Emergent preview is a client-rendered application and its underlying source repository, private API responses, database, environment variables, secrets, and backend implementation are not publicly exposed through the preview URL. This repository therefore contains a clean reconstruction of the publicly identifiable product concept and workflow rather than a claim of having recovered private source code.

The publicly identifiable product is an **ADGM Formation Platform — Entity & Legal Automation** experience.

## Reconstructed product scope

The app is structured around the typical lifecycle of forming and managing an ADGM entity:

- Formation dashboard
- Entity setup wizard
- Applicant / founder information
- Proposed company details
- Business activity selection
- Share capital and ownership
- Directors and authorised signatories
- Registered office details
- Beneficial ownership / UBO information
- Document checklist
- Formation readiness review
- Submission tracker
- Corporate records vault
- Compliance calendar
- Post-incorporation actions

## Design goals

- Clear step-by-step workflow
- No misleading claim that the tool is an ADGM government service
- Strong separation between user-entered data and regulatory guidance
- Local-first demo data so the reconstructed interface can run without private backend credentials
- Easily replaceable data/service layer for a future production API
- GitHub Pages friendly static build

## Run locally

No build step is required.

Open `index.html` directly or run any static web server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Repository structure

```text
index.html              Main application shell
styles.css              Responsive UI styling
app.js                  Application state and interactions
data/adgm.json          Reconstructed workflow/reference data
PROVENANCE.md            Extraction/reconstruction notes
```

## Production next steps

For a real deployment, replace the local demo storage with authenticated server-side storage, add role-based access controls, implement audit logging, connect official ADGM guidance/resources, add secure document storage and malware scanning, and obtain legal/regulatory review before relying on the application for filings or compliance decisions.
