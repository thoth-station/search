const path = require('path')
module.exports = {
    styleguideComponents: {
        Wrapper: path.join(__dirname, 'src/styles/Provider.js')
    },
    sections: [
        {
            name: 'Adviser Details Page',
            content: 'src/components/dashboard/AdviseTab/AdviseLayout.md',
            ignore: 'src/components/**/{index,utils,hooks}.js',
            sections: [
                {
                    name: "Advise Header",
                    components: 'src/components/dashboard/AdviseHeader/**/*.{js,jsx,ts,tsx}',
                    ignore: 'src/components/**/{index,utils,hooks}.js',
                },
                {
                    name: "Table View",
                    components: 'src/components/dashboard/AdviseTab/AdviseTableView/**/*.{js,jsx,ts,tsx}',
                    ignore: 'src/components/**/{index,utils,hooks}.js',
                },
                {
                    name: "Selected Package View",
                    components: 'src/components/dashboard/AdviseTab/SelectedPackage/**/*.{js,jsx,ts,tsx}',
                    content: 'src/components/dashboard/AdviseTab/SelectedPackage/SelectedPackage.md',
                    ignore: 'src/components/**/{index,utils,hooks,SelectedPackage}.js',
                },
                {
                    name: "Pipenv.lock View",
                    components: 'src/components/dashboard/AdviseTab/LockfileView/**/*.{js,jsx,ts,tsx}',
                    ignore: 'src/components/**/{index,utils,hooks}.js',
                },
            ]
        },
        {
            name: 'Summary Page',
            components: 'src/components/dashboard/SummaryTab/**/*.{js,jsx,ts,tsx}',
            content: 'src/components/dashboard/SummaryTab/SummaryTab.md',
            ignore: 'src/components/**/{index,utils,hooks,SummaryTab}.js'
        },
        {
            name: 'Package Details Page',
            components: 'src/components/package/**/*.{js,jsx,ts,tsx}',
            ignore: 'src/components/**/{index,utils,hooks}.js'
        },
        {
            name: 'Reusable Components',
            components: 'src/components/Elements/**/*.{js,jsx,ts,tsx}',
            ignore: 'src/components/**/{index,utils,hooks}.js'
        },
        {
            name: 'Package Details Page',
            components: 'src/components/package/**/*.{js,jsx,ts,tsx}',
            ignore: 'src/components/**/{index,utils,hooks}.js'
        },
        {
            name: 'Routing and Page Details',
            components: 'src/{pages,navigation}/**/*.{js,jsx,ts,tsx}',
            ignore: 'src/**/{index,utils,hooks}.js'
        },
        {
            name: 'API Handling',
            components: 'src/services/**/*.{js,jsx,ts,tsx}',
            ignore: 'src/**/{index,utils,hooks}.js'
        },
    ]
}