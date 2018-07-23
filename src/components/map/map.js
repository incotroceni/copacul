// @flow

// init map
require('./init')(process.env.MAPBOX_ACCESS_TOKEN)

// configure map and addons
require('./config')(window.map)

// add current location marker and circle of accuracy
require('./locate')(window.map, 'marker')

// add popup logic for each tree
require('./popup')(window.map)

// add modal tutorial
require('./tutorial')(window.map)
