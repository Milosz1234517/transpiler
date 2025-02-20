import {expect} from "chai";
import {ABAP} from "../../packages/runtime/src/";
import {AsyncFunction, runFiles} from "../_utils";

let abap: ABAP;

async function run(contents: string) {
  return runFiles(abap, [{filename: "zfoobar.prog.abap", contents}]);
}

describe("Running Examples - Hex type", () => {

  beforeEach(async () => {
    abap = new ABAP();
  });

  it("Hex, initial value", async () => {
    const code = `
  DATA lv_hex TYPE x LENGTH 1.
  WRITE lv_hex.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("00");
  });

  it("Hex Calculation, MOD has precedence", async () => {
    const code = `
    DATA lv_hex    TYPE x LENGTH 1.
    DATA lv_type   TYPE i.
    DATA lv_length TYPE i.
    lv_type = 2.
    lv_length = 123.
    lv_hex = lv_hex + lv_type + lv_length MOD 16.
    WRITE lv_hex.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("0D"); // 13 in decimal
  });

  it("Hex, constant", async () => {
    const code = `
    CONSTANTS lc_mask TYPE x VALUE 112.
    WRITE lc_mask.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("70");
  });

  it("Hex, compare with integers", async () => {
    const code = `
  DATA hex TYPE x VALUE '30'.
  ASSERT hex = 48.

  CASE hex.
    WHEN 48.
      WRITE 'ok'.
    WHEN OTHERS.
      WRITE 'fail'.
  ENDCASE.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("ok");
  });

  it("Hex, compare with string", async () => {
    const code = `
  DATA hex TYPE x VALUE '30'.
  ASSERT hex = |30|.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("float into hex", async () => {
    const code = `
    DATA float TYPE f.
    DATA hex TYPE x LENGTH 4.
    float = '2.1'.
    hex = float.
    WRITE / hex.
    float = '2.5'.
    hex = float.
    WRITE / hex.
    float = '2.9'.
    hex = float.
    WRITE / hex.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal(`00000002
00000003
00000003`);
  });

  it("Hex, offset", async () => {
    const code = `
    DATA lv_pass TYPE xstring.
    DATA lv_rd2  TYPE x LENGTH 7.
    lv_pass = '5345435245543031'.
    lv_rd2 = lv_pass+7.
    WRITE lv_rd2.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal(`31000000000000`);
  });

  it("Hex, bad values", async () => {
    const code = `
  DATA foo TYPE x LENGTH 2.
  foo = 'QWER'.
  ASSERT foo = '0000'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("Hex, assert initial", async () => {
    const code = `
    DATA foo TYPE x LENGTH 16.
    ASSERT foo IS INITIAL.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("Hex, assert not initial", async () => {
    const code = `
    DATA foo TYPE x LENGTH 16.
    foo = 1.
    ASSERT foo IS NOT INITIAL.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("Hex, to integer, two complement", async () => {
    const code = `
    DATA crc TYPE x LENGTH 4.
    DATA int TYPE i.
    crc = '8F001100'.
    int = crc.
    WRITE int.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal(`-1895821056`);
  });

  it("Hex, to integer, two complement, negative value, 1", async () => {
    const code = `
  DATA hex TYPE x LENGTH 4.
  hex = -1.
  WRITE hex.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal(`FFFFFFFF`);
  });

  it("Hex, to integer, two complement, negative value, 2", async () => {
    const code = `
  DATA hex TYPE x LENGTH 4.
  hex = -2.
  WRITE hex.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal(`FFFFFFFE`);
  });

  it("Hex, DIV1", async () => {
    const code = `
    DATA crc TYPE x LENGTH 4.
    crc = 'FFFFFFFF'.
    crc = crc DIV 256.
    ASSERT crc = 'FFFFFFFF'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it.skip("Hex, DIV2, length = 8 should operate on length 4", async () => {
    const code = `
    DATA crc TYPE x LENGTH 8.
    crc = 'FFFFFFFFFFFFFFFA'.
    crc = crc DIV 256.
    ASSERT crc = '00000000FFFFFFFF'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("Hex, DIV3", async () => {
    const code = `
    DATA crc TYPE x LENGTH 4.
    crc = 'EFFFFFFF'.
    crc = crc DIV 256.
    ASSERT crc = 'FFEFFFFF'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("Hex, DIV4", async () => {
    const code = `
    DATA crc TYPE x LENGTH 4.
    crc = 'FF001100'.
    crc = crc DIV 256.
    ASSERT crc = 'FFFF0011'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("Hex, DIV5", async () => {
    const code = `
    DATA crc TYPE x LENGTH 4.
    crc = '8F001100'.
    crc = crc DIV 256.
    ASSERT crc = 'FF8F0011'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("Hex, DIV6", async () => {
    const code = `
    DATA crc TYPE x LENGTH 4.
    crc = '7F001100'.
    crc = crc DIV 256.
    ASSERT crc = '007F0011'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("Hex, minus one, length 1", async () => {
    const code = `
    DATA crc TYPE x LENGTH 1.
    crc = -1.
    WRITE crc.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal(`FF`);
  });

  it("Hex, compare with empty char", async () => {
    const code = `
    DATA hex TYPE x LENGTH 1.
    DATA char TYPE c LENGTH 1.
    ASSERT hex > char.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });
});