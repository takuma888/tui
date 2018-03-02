<?php

namespace
{

    use Tachigo\Module\UI\TachigoUIModule;
    use TCG\Module\Web\TCGWebModule;
    use TCG\Module\Base\TCGBaseModule;

    use Composer\Autoload\ClassLoader;
    use Symfony\Component\Debug\Debug;
    use TCG\Component\Kernel\AppKernel;

    Debug::enable();

    class UIKernel extends AppKernel
    {

        public function __construct(ClassLoader $autoLoader)
        {
            parent::__construct($autoLoader, [
                'root' => ROOT,
                'app_root' => APP_ROOT,
                'log_root' => LOG_ROOT,
                'src_root' => SRC_ROOT,
                'cache_root' => CACHE_ROOT,
            ], 'UI');
            parent::setCurrentKernelNamespace($this->getNamespace());

            $this->addModules([
                new TCGBaseModule(),
                new TCGWebModule(),
                new TachigoUIModule(),
            ]);
        }
    }
}