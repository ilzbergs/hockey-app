/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2121703314")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number2934727798",
    "max": null,
    "min": null,
    "name": "gameRef",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2121703314")

  // remove field
  collection.fields.removeById("number2934727798")

  return app.save(collection)
})
