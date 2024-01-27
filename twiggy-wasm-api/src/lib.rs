// #![cfg(target_arch = "wasm32")]
#![cfg(feature = "emit_json")]

use serde::{Deserialize, Serialize};
use twiggy_analyze as analyze;
use twiggy_ir as ir;
use twiggy_opt as opt;
use twiggy_parser as parser;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Items {
    items: ir::Items,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
struct Item {
    id: u64,
    name: String,
    shallowSize: u32,
    retainSize: u32,
    children: Vec<u64>,
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "ItemWasm")]
    pub type IItems;
}

#[wasm_bindgen]
impl Items {
    pub fn parse(data: &[u8]) -> Items {
        let items = parser::parse(data).unwrap();
        Items { items }
    }

    pub fn top(&mut self, options: &opt::Top) -> String {
        let top = analyze::top(&mut self.items, options).unwrap();
        let mut buf = Vec::new();
        top.emit_json(&self.items, &mut buf).unwrap();
        String::from_utf8(buf).unwrap()
    }

    pub fn items(&mut self) -> IItems {
        let mut option: opt::Top = Default::default();
        option.set_retained(true);
        let _ = analyze::top(&mut self.items, &option).unwrap();
        let mut items: Vec<Item> = Vec::new();
        for item in self.items.iter() {
            let retain = self.items.retained_size(item.id());
            let children = self.items.dominator_tree().get(&item.id()).unwrap();
            items.push(Item {
                id: item.id().serializable(),
                name: item.name().to_owned(),
                shallowSize: item.size(),
                retainSize: retain,
                children: children.iter().map(|x| x.serializable()).collect(),
            })
        }

        let v: JsValue = serde_wasm_bindgen::to_value(&items).unwrap_throw();
        v.into()
    }

    pub fn dominators(&mut self, options: &opt::Dominators) -> String {
        let dominators = analyze::dominators(&mut self.items, options).unwrap();
        let mut buf = Vec::new();
        dominators.emit_json(&self.items, &mut buf).unwrap();
        String::from_utf8(buf).unwrap()
    }

    pub fn paths(&mut self, options: &opt::Paths) -> String {
        let paths = analyze::paths(&mut self.items, options).unwrap();
        let mut buf = Vec::new();
        paths.emit_json(&self.items, &mut buf).unwrap();
        String::from_utf8(buf).unwrap()
    }

    pub fn monos(&mut self, options: &opt::Monos) -> String {
        let monos = analyze::monos(&mut self.items, options).unwrap();
        let mut buf = Vec::new();
        monos.emit_json(&self.items, &mut buf).unwrap();
        String::from_utf8(buf).unwrap()
    }

    pub fn diff(&mut self, new_items: &mut Items, options: &opt::Diff) -> String {
        let diff = analyze::diff(&mut self.items, &mut new_items.items, options).unwrap();
        let mut buf = Vec::new();
        diff.emit_json(&self.items, &mut buf).unwrap();
        String::from_utf8(buf).unwrap()
    }
}

#[wasm_bindgen(typescript_custom_section)]
const TS_APPEND_CONTENT: &'static str = r#"
export interface ItemWasm {
  id: bigint;
  name: string;
  children: bigint[];
  shallowSize: number;
  retainSize: number;
}
"#;
