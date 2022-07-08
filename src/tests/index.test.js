
import {hello} from "../lib/hello"

test("returns hello world",() => {
        expect(hello("Hello, World!")).toBe("Hello, World!")
    }
)