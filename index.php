<?php
require __DIR__ . '/../config.php';
/**
 * @var \Composer\Autoload\ClassLoader $autoLoader
 */
$autoLoader = require VENDOR_ROOT . '/autoload.php';
$autoLoader->add('Tachigo', SRC_ROOT);

require __DIR__ . '/UIKernel.php';

(new UIKernel($autoLoader))
    ->addConfigFiles([
        realpath(__DIR__ . '/../config.yml'),
    ])
    ->boot()
    ->startup();

