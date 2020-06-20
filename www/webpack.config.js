/* eslint-disable*/
const isDev = process.argv[3] === 'development';
module.exports = {
    entry: {
        app: './client/app.js',
    },
    output: {
        path: __dirname,
        filename: 'build-app.js'
    },
    devtool: isDev && 'eval-source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }, {
            test: /\.(html)$/,
            use: {
                loader: 'html-loader'
            }
        }]
    },
    resolve: {
        alias: {
            // Env: path.resolve(__dirname, "env/"),
            // Src: path.resolve(__dirname, "src/"),
        }
    },
    plugins: [],
    watchOptions: {
        ignored: ['node_modules']
    }
};



// REBUIL TPLs
const fs = require('fs');
const watch = require('node-watch');
const dirName = './tpls/';

const tplDir = dirName + 'tpl/';
const outDir = '../www/';

watch(dirName, { recursive: true }, function (evt, name) {
  console.log('%s changed.', name);
    rebuild();
});

const rebuild = () => {
    let components = {};
    fs.readdirSync(dirName + 'components').forEach(f => {
        const content = fs.readFileSync(dirName + 'components/' + f, 'utf8');
        components[f.replace('.html', '')] = content;
    });
    fs.readdirSync(tplDir).forEach(f => {
        if (f.endsWith('.html')) {
            let content = fs.readFileSync(tplDir + f, 'utf8');
            Object.keys(components).forEach(name => {
                content = content.replace(`<!-- {{${name}}} -->`, `
                <!-- ${name} -->
                ${components[name]}`);
            });
            fs.writeFileSync(outDir + f, content);
        }
    });
    console.log('Rebuild');
};

rebuild();
