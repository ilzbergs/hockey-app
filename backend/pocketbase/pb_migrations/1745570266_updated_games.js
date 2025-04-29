/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_879072730")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool332336950",
    "name": "isUpdated",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_879072730")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool332336950",
    "name": "scoreUpdated",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
