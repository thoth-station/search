const path = require('path')
module.exports = {
    styleguideComponents: {
        Wrapper: path.join(__dirname, 'src/styles/Provider.js')
    },
    sections: [
        {
            name: 'Adviser Details Page',
            components: 'src/**/*.{js,jsx,ts,tsx}',
            ignore: 'src/**/{index,utils}.js',
        }
    ]
}