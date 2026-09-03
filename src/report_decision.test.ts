import assert from "node:assert/strict";
import { needsFollowUp, reportMarkdown, type WorkOrder } from "./report_decision.js";
const order: WorkOrder = { id: "WO-17", address: "18 Cedar St", technician: "Mina", status: "in_progress", photos: ["panel.jpg"], followUp: "Return with a replacement fuse" };
assert.equal(needsFollowUp(order), true);
assert.match(reportMarkdown(order), /Dispatch status: in_progress/);
assert.match(reportMarkdown(order), /Return with a replacement fuse/);
console.log("report decision test passed");
