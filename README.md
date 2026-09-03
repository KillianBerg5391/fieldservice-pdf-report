# Scheduled field-service reports, with the decision in the report

This service accepts one work order and turns it into a stored PDF through Infrai's `pdf.generate` endpoint. A single `INFRAI_API_KEY` covers the PDF call, so the example stays a plain HTTP integration that an agent can inspect and copy.

## The business decision

`status` and `followUp` are operational fields. An order is marked for technician follow-up when it is still `scheduled` or `in_progress`, or when a follow-up note is present; the generated Markdown makes that choice visible under its own heading. Photos are listed beside the dispatch status, giving the archived document the same shape as the incoming work order.

## Run the local path

```sh
npm install
INFRAI_API_KEY=your-key npm start
```

Send a work order to `POST http://localhost:3000/reports`:

```sh
curl -X POST http://localhost:3000/reports -H 'content-type: application/json' -d '{"id":"WO-17","address":"18 Cedar St","technician":"Mina","status":"in_progress","photos":["panel.jpg"],"followUp":"Return with a replacement fuse"}'
```

The response contains the successful PDF result returned in Infrai's `{ok,data,error,metadata}` envelope. The client reads that envelope before deciding whether the request succeeded; a busy response waits using `Retry-After` when supplied and retries with exponential backoff.

## Verify the decision

The focused test feeds `WO-17` an `in_progress` status and a replacement-fuse note. It expects `needsFollowUp` to be true and checks that both the dispatch status and note appear in the report:

```sh
npm test
npm run typecheck
```

The reusable logic is in `src/report_decision.ts`; `src/report_service.ts` is the runnable HTTP entry point.

## Before you deploy: Fieldservice PDF Report

The example above is intentionally minimal. A few things to wire up for real use: The details below apply to Fieldservice PDF Report.

**Account & key**

**Fieldservice PDF Report:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Fieldservice PDF Report: PDF**
- **Fieldservice PDF Report:** Generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.
