{
  "targets": [
    {
      "target_name": "keyboard-addon",
      "sources": [ "keyboard-addon.cpp" ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
			"cflags": ["-DNDEBUG"],
			"ldflags": ["-DEBUG:FULL"],
      "defines": [ "NAN_DISABLED_EXCEPTIONS" ],
			'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")", "<!(node -e \"require('nan')\")"],
  		'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
    }
  ]
}