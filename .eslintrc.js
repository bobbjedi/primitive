module.exports = {
    "parserOptions": {
        "ecmaVersion": 9,
        "sourceType": "module"
    },
    "rules": {
        "semi": "warn", // обязательно ;
        "semi-spacing": ["error", {"before": false, "after": true}],
        "indent": ["error", 4],
        "space-infix-ops": "error",// отступы вокруг + - * / = и тд
        "eqeqeq": "error", // обязательно === и !== (нельзя == и !=)
        // "no-eq-null": "error", // обязательно === и !== (нельзя == и !=) но тоько в отношении null
        "curly": "error", // проверка шаблонов `${name}`
        // "space-before-function-paren": [ // отступ до и после function
        //     "error", {
        //         "anonymous": "always",
        //         "named": "always",
        //         "asyncArrow": "ignore"
        //     }
        // ],
        "key-spacing": ["error", { "mode": "strict" }], // оформление обЪекта
        "space-in-parens": ["error", "never"], // запрет отступов ( a,b)
        "computed-property-spacing": ["error", "never"], // запрет лишних отступов в выражениях a[ i]
        "array-bracket-spacing": ["error", "never"],
        "no-multi-spaces": "error", // запрет лишних пробелов var a   = 2
        "no-sparse-arrays": "warn", // предупреждение при дырке в массиве
        "no-mixed-spaces-and-tabs": "error", // нельзя миксовать табы и пробелы
        "keyword-spacing": ["error", { "after": true }],
        "comma-spacing": ["error", { "before": false, "after": true }], // отступ после запятой, а перед нельзя
        "no-undef":"error",
        "array-callback-return": "error", // коллбек методов массива типа arr.map arr.filter должны иметь return в коллбеке
        "no-const-assign":"error",
        "array-callback-return": "error", // коллбек методов массива типа arr.map arr.filter должны иметь return в коллбеке
        "prefer-const": ["error", {
            "destructuring": "all"
        }],
    },
    "env": {
        "browser": true,
        "node": true
    },
    "globals": {
        "Vue": true,
        "AFRAME": true,
        "THREE": true,
        "globalSocket": true,
        "Symbol": true,
        "Promise": true,
        "FileTransfer": true,
        "cordova": true
    },
    "plugins": []
}
