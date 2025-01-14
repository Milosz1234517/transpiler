import {expect} from "chai";
import {ABAP} from "../../packages/runtime/src";
import {AsyncFunction, runFiles} from "../_utils";

let abap: ABAP;

async function run(contents: string) {
  return runFiles(abap, [{filename: "zfoobar.prog.abap", contents}]);
}

describe("Builtin functions - substring_before", () => {

  beforeEach(async () => {
    abap = new ABAP();
  });

  it("substring_before 01", async () => {
    const code = `
    DATA result TYPE string.
    result = substring_before( val = 'abc=CP' regex = '=*CP$' ).
    ASSERT result = 'abc'.
    result = substring_before( val = 'abc' regex = '=*CP$' ).
    ASSERT result = ''.
    result = substring_before( val = 'sdf===CP' regex = '(=+CP)?$' ).
    ASSERT result = 'sdf'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("substring_before 02", async () => {
    const code = `
    DATA res TYPE string.
    DATA input TYPE string.
    input = 'foo=bar'.
    res = substring_before( val = input sub = '=' ).
    ASSERT res = 'foo'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("substring_before 03", async () => {
    const code = `
  DATA res TYPE string.
  res = substring_before( val   = 'ZSOME_PROG_ENDING_WITH_CP'
                          regex = '(=+CP)?$' ).
  WRITE res.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal( `ZSOME_PROG_ENDING_WITH_CP` );
  });

});
