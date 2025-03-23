const config = {
    mode: "production",
    // mode: "development",
    entry: {
        index: "./src/js/main.js",
        // contacts: './src/js/contacts.js',
        // about: './src/js/about.js',
    },
    output: {
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    // для dev-mode
    // devtool: "inline-source-map",
    // для production-mode
    devtool: "source-map",
};

module.exports = config;
