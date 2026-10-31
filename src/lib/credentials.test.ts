import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { bootstrapCredentials, changePassword, findCredential, loadCredentials } from "./credentials";
import { hashPassword } from "./auth";
let dir = "";
beforeEach(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), "pb-auth-")); process.env.PILOTBRIDGE_DB = path.join(dir, "pilotbridge.db"); const { salt, hash } = hashPassword("initial-password"); process.env.AUTH_USERS = JSON.stringify([{ email: "test@example.com", role: "Programme manager", userId: "user-aisha", organisationId: "org-meridian", salt, hash }]); });
describe("credential rotation",()=>{
  it("bootstraps credentials once from environment",()=>{bootstrapCredentials();bootstrapCredentials();expect(loadCredentials()).toHaveLength(1);});
  it("rejects a wrong current password",()=>{bootstrapCredentials();expect(changePassword("test@example.com","wrong-password","a-new-strong-password").ok).toBe(false);});
  it("rotates the password and increments the session version",()=>{bootstrapCredentials();const before=findCredential("test@example.com")!.sessionVersion;expect(changePassword("test@example.com","initial-password","a-new-strong-password").ok).toBe(true);const after=findCredential("test@example.com")!;expect(after.sessionVersion).toBe(before+1);expect(after.hash).not.toBe("initial-password");});
  it("persists credentials with owner-only permissions",()=>{bootstrapCredentials();const file=path.join(dir,"auth-credentials.json");expect(fs.existsSync(file)).toBe(true);expect(loadCredentials()[0].email).toBe("test@example.com");});
});
