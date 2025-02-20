/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2121703314")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2405161345",
    "max": null,
    "min": null,
    "name": "homeScore",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2121703314")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2405161345",
    "max": null,
    "min": null,
    "name": "homeScore",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
