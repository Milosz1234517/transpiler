import {expect} from "chai";
import {ABAP} from "../../packages/runtime/src";
import {AsyncFunction, runFiles} from "../_utils";

let abap: ABAP;

async function run(contents: string) {
  return runFiles(abap, [{filename: "zfoobar.prog.abap", contents}]);
}

describe("Builtin functions - replace", () => {

  beforeEach(async () => {
    abap = new ABAP();
  });

  it("replace 01", async () => {
    const code = `
    DATA result TYPE string.
    result = replace( val = 'hello' sub = 'l' with = 'o' ).
    WRITE result.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("heolo");
  });

  it("replace 02", async () => {
    const code = `
    DATA result TYPE string.
    result = replace( val = 'hello' sub = 'l' with = 'o' occ = 0).
    WRITE result.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("heooo");
  });

  it("replace 03", async () => {
    const code = "DATA lv_exp TYPE string VALUE 'bar [ [ foo'.\n" +
      "lv_exp = replace( val = lv_exp sub = `[ ` with = '[' occ = 0 ).\n" +
      "WRITE lv_exp.";
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("bar [[foo");
  });

  it("replace 04", async () => {
    const code = `DATA rv_escaped TYPE string VALUE 'foo\\bar'.
    rv_escaped = replace( val = rv_escaped sub = '\\' with = '\\\\' occ = 0 ).
    WRITE rv_escaped.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("foo\\\\bar");
  });

  it("replace with regex", async () => {
    const code = `data text type string.
text = replace( val   = to_lower( 'O M G' )
                regex = \`[ .,]\`
                with  = \`\`
                occ   = 0 ).
write text.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("omg");
  });

  it("replace with offset, 1", async () => {
    const code = `DATA str TYPE string.
    str = 'abcdefg'.
    str = replace(
      val = str
      off = 2
      len = 1
      with = \`\` ).
    WRITE str.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("abdefg");
  });

  it("replace with offset, 2", async () => {
    const code = `DATA str TYPE string.
    str = 'abcdefg'.
    str = replace(
      val = str
      off = 2
      len = 1
      with = \`qqqq\` ).
    WRITE str.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("abqqqqdefg");
  });

  it("replace(), regex character class 'punct'", async () => {
    const code = `
DATA plain_text TYPE string.
DATA result TYPE string.
plain_text = |H-\\{\\}[...]ello, Wo:,rld!?.();'|.
result = replace( val = plain_text regex = '[[:punct:]]' with = ' ' occ = 0 ).
WRITE result.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("Hello World");
  });

  it("newlines", async () => {
    const code = `
  DATA foo TYPE string.
  DATA newl TYPE c LENGTH 2.
  newl = |\\n|.
  foo = 'abc\\ndef\\nbar'.
  WRITE / strlen( foo ).
  foo = replace(
    val = foo
    sub = '\\n'
    with = newl
    occ = 0 ).
  WRITE / strlen( foo ).`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("13\n11");
  });

  it("more punct", async () => {
    const code = `
    DATA str TYPE string.
    str = '@1%!'.
    str = replace( val   = str
                   regex = '[[:punct:]]'
                   with  = ' '
                   occ   = 0 ).
    WRITE str.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
    expect(abap.console.get()).to.equal("1");
  });

  it("replace quotes", async () => {
    const code = `
    DATA rv_escaped TYPE string.

    rv_escaped = '"'.

    rv_escaped = replace(
      val = rv_escaped
      sub = '"'
      with = '\\"'
      occ = 0 ).

    ASSERT rv_escaped = '\\"'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("replace newline", async () => {
    const code = `
    DATA rv_escaped TYPE string.

    rv_escaped = |\\n|.

    rv_escaped = replace(
      val = rv_escaped
      sub = |\\n|
      with = '\\n'
      occ = 0 ).

    ASSERT rv_escaped = '\\n'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("replace slash", async () => {
    const code = `
    DATA rv_escaped TYPE string.

    rv_escaped = '\\'.

    rv_escaped = replace(
      val = rv_escaped
      sub = '\\'
      with = '\\\\'
      occ = 0 ).

    ASSERT rv_escaped = '\\\\'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("replace CR", async () => {
    const code = `
    DATA rv_escaped TYPE string.

    rv_escaped = |\\r|.

    rv_escaped = replace(
      val = rv_escaped
      sub = |\\r|
      with = '\\r'
      occ = 0 ).

    ASSERT rv_escaped = '\\r'.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

  it("replace slash in CR", async () => {
    const code = `
    DATA rv_escaped TYPE string.

    rv_escaped = |\\r|.

    rv_escaped = replace(
      val = rv_escaped
      sub = |\\\\|
      with = '\\'
      occ = 0 ).

    ASSERT rv_escaped = |\\r|.`;
    const js = await run(code);
    const f = new AsyncFunction("abap", js);
    await f(abap);
  });

});
