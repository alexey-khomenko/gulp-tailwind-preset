module.exports = {
    purge: {
        content: ['src/pug/**/*.pug', 'src/scripts/**/*.js'],
        options: {
            whitelist: ['is-active', 'hidden'],
        },
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            'xl': {'max': '1535px'},
            'lg': {'max': '1279px'},
            'md': {'max': '1023px'},
            'sm': {'max': '767px'},
            'xs': {'max': '479px'}, // 639
        },
        extend: {},
    },
    variants: {
        container: false,
        extend: {},
    },
    plugins: []
}
