import { beforeAll, describe, expect, it } from "vitest";
import { createSessionToken, hashPassword, verifyPassword, verifySessionToken } from "./auth";
const session = { userId: "user-aisha", organisationId: "org-meridian", role: "Programme manager" as const, expiresAt: Date.now() + 60000 };
beforeAll(() => { process.env.AUTH_SECRET = "test-secret-that-is-long-enough-for-hmac-0123456789"; });
describe("signed sessions",()=>{
  it("round-trips a valid signed session",()=>{expect(verifySessionToken(createSessionToken(session))?.userId).toBe("user-aisha");});
  it("rejects a tampered payload",()=>{const token=createSessionToken(session);const [payload,signature]=token.split(".");const forged=Buffer.from(JSON.stringify({...session,role:"Corporate"})).toString("base64url");expect(verifySessionToken(`${forged}.${signature}`)).toBeNull();expect(payload).toBeTruthy();});
  it("rejects expired sessions",()=>{expect(verifySessionToken(createSessionToken({...session,expiresAt:Date.now()-1000}))).toBeNull();});
  it("rejects malformed tokens",()=>{expect(verifySessionToken("nonsense")).toBeNull();});
});
describe("password verification",()=>{
  it("accepts the correct password",()=>{const {salt,hash}=hashPassword("correct horse battery");expect(verifyPassword("correct horse battery",salt,hash)).toBe(true);});
  it("rejects the wrong password",()=>{const {salt,hash}=hashPassword("correct horse battery");expect(verifyPassword("wrong password",salt,hash)).toBe(false);});
});
