import $ from 'jquery';
import Util from './util';

const Select = (($) => {
    const NAME                = 'select';
    const VERSION             = '4.0.0';
    const DATA_KEY            = 'tui.select';
    const EVENT_KEY           = `.${DATA_KEY}`;
    const DATA_API_KEY        = '.data-api';
    const JQUERY_NO_CONFLICT  = $.fn[NAME];
})($);

export default Select;