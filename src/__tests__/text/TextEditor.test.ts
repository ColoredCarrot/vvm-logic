import {TextEditor} from "../../model/text/TextEditor";

test("TextEditor: insert one line into empty", () => {
    const result = TextEditor.create().insert("foo bar");
    expect(result.lines).toStrictEqual(["foo bar"]);
    expect(result.carets).toStrictEqual([{row: 0, col: "foo bar".length}]);
});

test("TextEditor: inserting removes illegal characters", () => {
    const result = TextEditor.create().insert("foo  /bar\tx$^$");
    expect(result.lines).toStrictEqual(["foo  /bar  x"]);
    expect(result.carets).toStrictEqual([{row: 0, col: "foo  /bar  x".length}]);
});

test("TextEditor: insert many lines into empty", () => {
    const result = TextEditor.create().insert("foo\nbar\nbaz");
    expect(result.lines).toStrictEqual(["foo", "bar", "baz"]);
    expect(result.carets).toStrictEqual([{row: 2, col: 3}]);
});

test("TextEditor: insert one line", () => {
    const result = TextEditor.create()
        .insert("foo\nbar\nbaz")
        .setCaret({row: 1, col: 2})
        .insert("1234");
    expect(result.lines).toStrictEqual(["foo", "ba1234r", "baz"]);
    expect(result.carets).toStrictEqual([{row: 1, col: 6}]);
});

test("TextEditor: insert many lines", () => {
    const result = TextEditor.create()
        .insert("foo\nbar\nbaz")
        .setCaret({row: 1, col: 2})
        .insert("123\n4\n56");
    expect(result.lines).toStrictEqual(["foo", "ba123", "4", "56r", "baz"]);
    expect(result.carets).toStrictEqual([{row: 3, col: 2}]);
});

test("TextEditor: insert one line at many carets on same line", () => {
    const result = TextEditor.create()
        .insert("foo\nbarbar\nbaz")
        .setCaret({row: 1, col: 2}, {row: 1, col: 4})
        .insert("123");
    expect(result.lines).toStrictEqual(["foo", "ba123rb123ar", "baz"]);
    expect(result.carets).toStrictEqual([{row: 1, col: 10}, {row: 1, col: 5}]);
});

test("TextEditor: insert one line at many carets on different lines", () => {
    const result = TextEditor.create()
        .insert("foo\nbar\nbaz")
        .setCaret({row: 0, col: 2}, {row: 1, col: 0})
        .insert("12");
    expect(result.lines).toStrictEqual(["fo12o", "12bar", "baz"]);
    expect(result.carets).toStrictEqual([{row: 1, col: 2}, {row: 0, col: 4}]);
});


test("TextEditor: backspace at many carets", () => {
    const result = TextEditor.create()
        .insert("foo\nbar\nbaz")
        .setCaret({row: 1, col: 2}, {row: 2, col: 0})
        .backspace();
    expect(result.lines).toStrictEqual(["foo", "brbaz"]);
    expect(result.carets).toStrictEqual([{row: 1, col: 2}, {row: 1, col: 1}]);
});

test("TextEditor: backspace at many carets collapses duplicate carets", () => {
    const result = TextEditor.create()
        .insert("foo")
        .setCaret({row: 0, col: 3}, {row: 0, col: 2})
        .backspace();
    expect(result.lines).toStrictEqual(["f"]);
    expect(result.carets).toStrictEqual([{row: 0, col: 1}]);
});
