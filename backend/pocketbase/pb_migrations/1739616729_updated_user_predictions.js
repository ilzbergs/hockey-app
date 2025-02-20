/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_972278774")

  // update collection data
  unmarshal({
    "name": "predictions"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_972278774")

  // update collection data
  unmarshal({
    "name": "user_predictions"
  }, collection)

  return app.save(collection)
})
