import * as React from 'react';

import { useRequest, useTitle } from '@baic/yolk';

import { usePreload } from '@baic/yolk-mobile';

import style from './index.less';

interface Item {
  title: string;
  thumb: string;
  videourl: string;
  videourl_hd: string;
}

interface Data {
  lists: Item[];
}

interface Response {
  data: Data;
}

export default () => {
  useTitle('凡人有喜');
  const [request] = useRequest();
  const [list, setList] = React.useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<Item>();
  const pageRef = React.useRef(0);
  const loadingRef = React.useRef(false);
  const getOnClickHandler = React.useCallback(
    (item: Item) => () => {
      setSelectedItem(item);
    },
    [],
  );
  const nextHandler = React.useCallback(async () => {
    loadingRef.current = true;
    pageRef.current += 1;
    const res: Response = await request.get(
      `https://rmtapi.cbg.cn/list/4908/${pageRef.current}.html`,
      {
        pagesize: 10,
      },
    );
    setList(list?.concat(res.data.lists));
    loadingRef.current = false;
    return res.data.lists;
  }, [request, list]);
  const onScrollHandler = React.useCallback(
    ({ target: { scrollHeight, scrollTop } }) => {
      if (!loadingRef.current && scrollHeight - scrollTop < 1000) {
        nextHandler();
      }
    },
    [nextHandler],
  );
  const [wrap] = usePreload(async () => {
    const nextList: Item[] = await nextHandler();
    setSelectedItem(nextList[0]);
  });
  return wrap(
    <div className={style.page}>
      <video
        className={style.video}
        src={selectedItem?.videourl_hd || selectedItem?.videourl}
        controls
        controlsList="nodownload"
        autoPlay
        muted={process.env.NODE_ENV !== 'production'}
      />
      <div className={style.list} onScroll={onScrollHandler}>
        {list?.map((item) => {
          const { thumb, title } = item;
          return (
            <div
              key={thumb}
              className={style.item}
              onClick={getOnClickHandler(item)}
            >
              <img className={style.thumb} src={thumb} alt="" />
              <div className={style.content}>
                <div className={style.title}>{title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>,
  );
};
