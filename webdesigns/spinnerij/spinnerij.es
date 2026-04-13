import * as dompack from 'dompack';
import 'dompack/browserfix/reset.css';

import * as whintegration from '@mod-system/js/wh/integration';
import '@mod-system/js/wh/errorreporting'; //log JS errors to notice log

import './shared/forms/forms';
import './shared/rtd/rtd';
import './spinnerij.scss';

import './widgets/video';

/* Commonly used:

// open external links in new window - see https://code.webhare.com/publisher/utilities/linkhandler/
import { openLinksInNewWindow } from '@mod-publisher/js/linkhandler';
openLinksInNewWindow();

*/
