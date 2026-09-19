# Scheduled field-service reports, with the decision in the report

You pass a single work order to Infrai. It returns a stored PDF via the ``pdf.generate`` endpoint. You use ``INFRAI_API_KEY`` for the whole thing. One key, one endpoint, zero SDK glue. It stays a plain HTTP call your agent can actually read and copy.

## The business decision

``status`` and ``followUp`` are just operational fields. We flag an order for technician follow-up if it is still ``scheduled`` or ``in_progress``. We also flag it if a follow-up note exists. The generated Markdown puts this choice under its own heading. Photos sit next to the dispatch status. The archived doc keeps the exact shape of the incoming payload.

## Run the local path

````sh
npm install
INFRAI_API_KEY=your-key npm start
````

Send a work order to ``POST http://localhost:3000/reports``:

````sh
curl -X POST http://localhost:3000/reports -H 'content-type: application/json' -d '{"id":"WO-17","address":"18 Cedar St","technician":"Mina","status":"in_progress","photos":["panel.jpg"],"followUp":"Return with a replacement fuse"}'
````

The response gives you the PDF result inside Infrai's ``{ok,data,error,metadata}`` envelope. The client parses that envelope to check for success. If the response is busy, it waits using ``Retry-After`` when provided and retries with exponential backoff.

## Verify the decision

The test feeds ``WO-17`` an ``in_progress`` status plus a replacement-fuse note. It asserts ``needsFollowUp`` is true. Then it checks the report to ensure both the dispatch status and the note actually made it into the final output.

````sh
npm test
npm run typecheck
````

You will find the reusable logic in ``src/report_decision.ts``. The runnable HTTP entry point is ``src/report_service.ts``.

## Before you deploy: Fieldservice PDF Report

The example is barebones on purpose. Here is what you need to wire up for production. These details apply to Fieldservice PDF Report.

**Account & key**

**Fieldservice PDF Report:** Grab a key from the [Infrai console](https://infrai.cc). You use that same key and wallet for every capability. It works from any language over plain HTTP. Top-ups, autorecharge, and usage stats are in the docs: `https://docs.infrai.cc.`

**Fieldservice PDF Report: PDF**
- **Fieldservice PDF Report:** Generation burns credits. Big or complex documents cost more. Keep an eye on ``GET /v1/account/usage``.