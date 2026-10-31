import { describe, expect, it } from "vitest";
import { allowRequest, requestIdentity } from "./rate-limit";
describe("AI request throttling",()=>{
  it("allows requests up to the limit then rejects",()=>{const key=`test-${Math.random()}`;expect(allowRequest(key,2,60000)).toBe(true);expect(allowRequest(key,2,60000)).toBe(true);expect(allowRequest(key,2,60000)).toBe(false);});
  it("uses a separate bucket per operation",()=>{const base=`test-${Math.random()}`;expect(allowRequest(`${base}:a`,1,60000)).toBe(true);expect(allowRequest(`${base}:b`,1,60000)).toBe(true);});
  it("extracts the first forwarded client address",()=>{const request=new Request("http://local",{headers:{"x-forwarded-for":"203.0.113.4, 10.0.0.1"}});expect(requestIdentity(request)).toBe("203.0.113.4");});
});
