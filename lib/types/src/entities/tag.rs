use derive_builder::Builder;
use derive_variants::EnumVariants;
use mungos::{
    derive::{MungosIndexed, StringObjectId},
    mongodb::bson::{doc, serde_helpers::hex_string_as_object_id},
};
use partial_derive2::Partial;
use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};
use typeshare::typeshare;

use crate::MongoId;

use super::update::ResourceTargetVariant;

#[typeshare(serialized_as = "ResourceTarget["type"]")]
type _ResourceTargetVariant = ResourceTargetVariant;

#[typeshare]
#[derive(Serialize, Deserialize, Debug, Clone, EnumVariants)]
#[variant_derive(Serialize, Deserialize, Debug, Clone, Copy, Display, EnumString)]
#[serde(tag = "type", content = "params")]
pub enum Tag {
    ResourceType { resource: _ResourceTargetVariant }, // filter by resource type
    Server { server_id: String }, // filter by server, eg deployments, builds, repos
    Custom { tag_id: String },    // filter by presence of custom tag on resource
}

#[typeshare]
#[derive(Serialize, Deserialize, Debug, Clone, Builder, MungosIndexed, StringObjectId, Partial)]
#[partial_derive(Serialize, Deserialize, Debug, Clone, Default)]
#[unique_doc_index(doc! { "name": 1, "category": 1 })]
pub struct CustomTag {
    #[serde(
        default,
        rename = "_id",
        skip_serializing_if = "String::is_empty",
        with = "hex_string_as_object_id"
    )]
    #[builder(setter(skip))]
    pub id: MongoId,

    #[index]
    pub name: String,

    #[serde(default)]
    #[builder(default)]
    #[index]
    pub owner: String,

    #[serde(default)]
    #[builder(default)]
    #[index]
    pub category: String,

    #[serde(default)]
    #[builder(default)]
    pub color: TagColor,
}

#[typeshare]
#[derive(
    Serialize, Deserialize, Debug, Clone, Copy, Display, EnumString, MungosIndexed, Default,
)]
pub enum TagColor {
    #[default]
    Red,
    Green,
    Blue,
    Yellow,
    Purple,
    Magenta,
    Cyan,
}
