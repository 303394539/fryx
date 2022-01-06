import * as React from 'react';
import { Result, Icon } from 'antd-mobile';

export default () => (
  <Result
    img={
      <Icon type="cross-circle-o" className="spe" style={{ fill: '#F13642' }} />
    }
    title="404"
    message="对不起，您访问的页面不存在。"
  />
);
