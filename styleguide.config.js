const path = require('path')
module.exports = {
    styleguideComponents: {
        Wrapper: path.join(__dirname, 'src/styles/Theme.js')
    },
    sections: [
        {
            name: "Thoth Search",
            content: "README.md"
        },
        {
            name: 'Features',
            content: 'src/features/features.md',
            sections: [
                {
                    name: "Advise Feature",
                    content: 'src/features/advise/advise.md',
                    sections: [
                        {
                            name: "Selected Package View Components",
                            components: 'src/features/advise/features/components/**/*.{js,jsx,ts,tsx}',
                            ignore: 'src/features/advise/features/components/**/*{test,utils,index}.js',
                        },
                        {
                            name: "Other Components",
                            components: 'src/features/advise/components/**/*.{js,jsx,ts,tsx}',
                            ignore: 'src/features/advise/components/**/*{test,utils,index}.js',
                        }
                    ]
                },
                {
                    name: "Package Feature",
                    content: 'src/features/package/package.md',
                    components: 'src/features/package/components/**/*.{js,jsx,ts,tsx}',
                    ignore: 'src/features/package/components/**/*{test,utils,index}.js'
                },
                {
                    name: "Home Feature",
                    content: 'src/features/home/home.md',
                    components: 'src/features/home/components/**/*.{js,jsx,ts,tsx}',
                    ignore: 'src/features/home/components/**/*{test,utils,index}.js'
                },
                {
                    name: "Misc Features",
                    content: 'src/features/misc/misc.md',
                }
            ]
        },
        {
            name: "Components",
            content: 'src/components/components.md',
            sections: [
                {
                    name: "Elements",
                    ignore: ['src/components/**/*{test,utils,index}.js', 'src/components/Layout/*'],
                    components: 'src/components/**/*.{js,jsx,ts,tsx}',
                },
                {
                    name: "Layout",
                    ignore: 'src/components/Layout/**/*{test,utils,index}.js',
                    components: 'src/components/Layout/**/*.{js,jsx,ts,tsx}',
                }
            ]

        }
    ]
}