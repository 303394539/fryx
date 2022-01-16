import * as React from 'react';

// import { Toast } from 'antd-mobile';

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
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const pageRef = React.useRef(0);
  const loadingRef = React.useRef(false);
  const getOnClickHandler = React.useCallback(
    (index: number) => () => {
      setSelectedIndex(index);
    },
    [],
  );
  const nextHandler = React.useCallback(async () => {
    loadingRef.current = true;
    pageRef.current += 1;
    const res: Response = await request.get(
      `https://rmtapi.cbg.cn/list/4908/${pageRef.current}.html`,
      {
        pagesize: 100,
      },
    );
    // setList(list?.concat(res.data.lists));
    setList(res.data.lists);
    loadingRef.current = false;
    return res.data.lists;
  }, [request]);
  const onScrollHandler = React.useCallback(
    ({ target: { scrollHeight, scrollTop } }) => {
      if (!loadingRef.current && scrollHeight - scrollTop < 1000) {
        nextHandler();
      }
    },
    [nextHandler],
  );
  const selectItemMemo = React.useMemo(
    () => list[selectedIndex] || {},
    [list, selectedIndex],
  );
  const [wrap] = usePreload(async () => {
    await nextHandler();
  });
  return wrap(
    <div className={style.page}>
      <video
        className={style.video}
        src={selectItemMemo?.videourl_hd || selectItemMemo?.videourl}
        controls
        controlsList="nodownload"
        autoPlay
        muted={process.env.NODE_ENV !== 'production'}
        // onEnded={onEndedHandler}
      />
      <div className={style.list} onScroll={onScrollHandler}>
        {list?.map((item, i) => {
          const { thumb, title } = item;
          return (
            <div
              key={thumb}
              className={style.item}
              onClick={getOnClickHandler(i)}
            >
              <img className={style.thumb} src={thumb} alt="" />
              <div className={style.content}>
                <div className={style.title}>{title}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={style.nextBtn} onClick={nextHandler}>
        下一批
      </div>
    </div>,
  );
};
