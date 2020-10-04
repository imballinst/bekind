module.exports = {
  mount: {
    public: '/',
    src: '/_dist_'
  },
  plugins: [
    '@snowpack/plugin-vue',
    '@snowpack/plugin-dotenv',
    [
      '@snowpack/plugin-build-script',
      { cmd: 'postcss', input: ['.css'], output: ['.css'] }
    ],
    [
      'snowpack-plugin-imagemin',
      {
        /* see "Plugin Options" below */
        include: ['**/*.jpg', '**/*.png'],
        plugins: [
          require('imagemin-mozjpeg')({ quality: 90, progressive: true }),
          require('imagemin-optipng')({ optimizationLevel: 7 })
        ]
      }
    ],
    ['@snowpack/plugin-webpack']
  ],
  proxy: {}
};
