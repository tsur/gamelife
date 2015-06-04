# The Game Of Life

An experimental implementantion for the conway's game of life on ES6. A demo is available [here](http://tsur.github.io/gamelife). You may also download the project in zip format, then extract it and open the index.html file located on dist folder.

# Setting up

To deploy it on your local machine, just follow the steps below:

```bash
git clone https://github.com/Tsur/gamelife.git 
cd gamelife && npm run deploy:local
```
Now go to your browser on localhost:8080 to play the production version. Open your browser on localhost:8080/index-debug.html to start developing. You may now modify the source code and the browser will refresh automatically. Once you're done, build the project. 

** NOTE: You will need LiveReload Plugin from chrome-store to enable live reloading

To deploy it remotely, make sure you commit and/or push all your changes to the develop branch. Once your done, just run either or both of:

```bash
# Heroku app (first time you need to create the heroku app: heroku create)
npm run deploy:heroku
# Github Pages (first time you need to create it: git checkout -b gh-pages develop)
npm run deploy:gh-pages
```

# Building

Once you have ended adding new features, fixing issues or refactoring code, just build the project:

```bash
npm run build
```

If the command above was ok, the bundle.js and bundle.min.js files have been now generated under the dist folder. That's all needed along the index.html file to run the game of life experiment.

# Testing

```bash
npm run test
```
