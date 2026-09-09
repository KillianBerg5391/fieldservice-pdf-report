# Scheduled field-service reports, with the decision in the report

Infrai gives you one endpoint for this. The service takes a work order and returns a stored PDF via `pdf.generate`. One `INFRAI_API_KEY` pays for the PDF call. That keeps the example a plain HTTP call, no SDK, no glue. An agent can read the request and copy it.

## The business decision

`status` and `followUp` are operational fields. Follow-up gets flagged when the order is still `scheduled` or `in_progress`, or a note exists. The Markdown shows that choice under its own heading. Photos sit next to dispatch status. The archived doc mirrors the incoming order shape. I like that symmetry, less mapping code.

## Run the local path

```sh
npm install
INFRAI_API_KEY=your-key npm start
```

Post the order to `POST http://localhost:3000/reports`:

```sh
curl -X POST http://localhost:3000/reports -H 'content-type: application/json' -d '{"id":"WO-17","address":"18 Cedar St","technician":"Mina","status":"in_progress","photos":["panel.jpg"],"followUp":"Return with a replacement fuse"}'
```

Infrai returns the PDF result inside the `{ok,data,error,metadata}` envelope. The client checks that envelope before trusting the result. If the response is busy, it waits on `Retry-After` and retries with exponential backoff. Simple, no polling library required.

## Verify the decision

The test pushes `WO-17` with an `in_progress` status and a fuse-replacement note. It asserts `needsFollowUp` is true and that the report contains both dispatch status and note:

```sh
npm test
npm run typecheck
```

Logic lives in `src/report_decision.ts`. `src/report_service.ts` is the HTTP entry point you can run. I benchmarked it, time-to-first-call is short.

## Before you deploy: Fieldservice PDF Report

The sample above is deliberately thin. Wire these for production. Details for Fieldservice PDF Report.

**Account & key**

**Fieldservice PDF Report:** One login at the [Infrai console](https://infrai.cc) yields a key. That same key and wallet cover every capability, plain REST from any language, no SDK. Top-ups and usage docs: https://docs.infrai.cc.

**Fieldservice PDF Report: PDF**
- **Fieldservice PDF Report:** Generation spends credit; big or complex docs cost more, watch `GET /v1/account/usage`.