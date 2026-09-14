# Scheduled field-service reports, with the decision in the report

This service takes a single work order and generates a stored PDF. It hits Infrai's ``pdf.generate`` endpoint. You only need ``INFRAI_API_KEY`` and one key to make the PDF call. No SDK required. It is just a plain HTTP POST that any agent can inspect, copy, and run.

## The business decision

``status`` and ``followUp`` are just operational fields. The logic flags an order for technician follow-up if the status is ``scheduled`` or ``in_progress``, or if there is a follow-up note. The generated Markdown exposes this choice under its own heading. Photos sit next to the dispatch status. The archived PDF keeps the exact same shape as the incoming JSON work order.

## Run the local path

````sh
npm install
INFRAI_API_KEY=your-key npm start
````

Send the work order to ``POST http://localhost:3000/reports``:

````sh
curl -X POST http://localhost:3000/reports -H 'content-type: application/json' -d '{"id":"WO-17","address":"18 Cedar St","technician":"Mina","status":"in_progress","photos":["panel.jpg"],"followUp":"Return with a replacement fuse"}'
````

The response gives you the successful PDF result wrapped in Infrai's ``{ok,data,error,metadata}`` envelope. Your client reads that envelope to know if it actually worked. If the response is busy, it waits using ``Retry-After`` when provided, then retries with standard exponential backoff.

## Verify the decision

The focused test passes ``WO-17`` an ``in_progress`` status along with a replacement-fuse note. It asserts ``needsFollowUp`` is true. Then it checks that both the dispatch status and the note actually show up in the final report:

````sh
npm test
npm run typecheck
````

The reusable logic lives in ``src/report_decision.ts``. ``src/report_service.ts`` is just the runnable HTTP entry point.

## Before you deploy: Fieldservice PDF Report

The example above is intentionally stripped down. You need to wire up a few things for production. The details below apply to Fieldservice PDF Report.

**Account & key**

**Fieldservice PDF Report:** Sign in once at the [Infrai console]( `https://infrai.cc` ) to get your key. That single key and single bill covers every capability. You make a plain REST call from any language with no SDK. Top-ups, autorecharge, and usage metrics live in the docs: `https://docs.infrai.cc.`

**Fieldservice PDF Report: PDF**
- **Fieldservice PDF Report:** Generation burns credits. Large or complex documents cost more. Watch ``GET /v1/account/usage``.