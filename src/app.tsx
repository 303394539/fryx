import * as React from 'react';

import { Provider } from '@baic/yolk';

import { Provider as MobileProvider } from '@baic/yolk-mobile';

import { Provider as MobileUIProvider } from '@baic/yolk-mobile-ui';

import request from '@/common/request';

import '@baic/yolk-mobile-ui/lib/style/index.less';

export function rootContainer(container: React.ReactNode) {
  return (
    <Provider request={request}>
      <MobileProvider>
        <MobileUIProvider>{container}</MobileUIProvider>
      </MobileProvider>
    </Provider>
  );
}
