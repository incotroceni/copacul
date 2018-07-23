# Copacul InCotroceni

O aplicatie civica pentru raportarea starii arborilor stradali din cartierul Cotroceni.

Aplicatia a putut fi accesata la [copacul.incotroceni.ro](https://copacul.incotroceni.ro) de pe toate dispozitivele dotate cu un [browser care suporta WebGL](http://caniuse.com/#feat=webgl)

## Tech stack

- Google Firebase
- Vue.js 2
- Bulma CSS
- official Vue webpack boilerplate template ([docs](http://vuejs-templates.github.io/webpack/))
- Mapbox GL JS
- various Vue components
- custom Mapbox GL control components


## Developer Setup

Make sure you add your Firebase and Mapbox credentials to `config/dev.env.js` and `config/prod.env.js` before continuing.


``` bash
# install dependencies
npm install
# optionally, use yarn instead of npm here

# serve locally with hot reload at localhost:8080 (using staging database)
npm run dev

# build for staging with minification
npm run stage

# deploy to staging server (copacul-incotroceni-dev)
firebase use staging
firebase deploy

# switch to production
firebase use production

# build for production
npm run build

# deploy to production
firebase deploy
```

For detailed explanation on how things work, checkout the [vue webpack guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
