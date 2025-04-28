module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current', // importante para Jest
                },
            },
        ],
    ],
}
