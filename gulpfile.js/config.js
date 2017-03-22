var config = {
  actions: [
    'copy',
    'sass',
    'webpack'
  ],
  tasks: {
  	copy: {
  		src: [
  			'./src/**/*.+(html)'
  		],
  	},
    browserSync: {
      option: {
        server: {
          baseDir: "public",
          index  : "index.html"
        },
    		notify: false
      }
  	},
  	sass: {
  		src         : ['./src/assets/sass/**/*.sass'],
  		base        : './src/assets/sass/',
  		dest        : './public/assets/css/',
  		option      : {outputStyle: 'expanded'},
  		autoprefixer: {
  			browsers: [
          'last 3 versions',
          'ie >= 9',
          'iOS >= 8',
          'Android >= 4'
        ],
  			cascade: true
  		}
  	},
    webpack: {
      src       : ['./src/assets/js/**/*.js'],
      dest      : './public/assets/js/',
      configPath: '../../webpack.config.js'
    }
  },
  root: {
		src : './src/',
		dest: './public/'
	}
};

module.exports = config;
