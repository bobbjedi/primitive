/* eslint-disable*/
const isDev = process.argv[3] === 'development';
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    entry: {
        app: './client/app.js',
    },
    output: {
        path: __dirname,
        filename: 'assets/build-app.js'
    },
    devtool: isDev && 'eval-source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.(html)$/,
            use: {
                loader: 'html-loader'
            }
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
        }]
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new VueLoaderPlugin()
      ],
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
