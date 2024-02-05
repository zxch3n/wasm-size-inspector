use twiggy_parser as parser;
const moon: &'static [u8] = include_bytes!("../../src/assets/moon.wasm");

#[test]
fn test() {
    let items = parser::parse(moon).unwrap();
    print!("{}", items.size());
}
