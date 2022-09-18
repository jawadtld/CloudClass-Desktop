import { FC, useCallback, useState, useEffect, useMemo } from 'react';
import { BaseWaveArmProps, UserWaveArmInfo } from './types';
import classnames from 'classnames';
import { Card, Popover, SvgImg } from '~components';
import { throttle } from 'lodash';
import { useInterval } from '@/infra/hooks/utilites';
import handImg from './assets/image/Group (5).png';

export interface WaveArmManagerProps extends BaseWaveArmProps {
  hasWaveArmUser: boolean;
  waveArmCount: number;
}

export const WaveArmManager: FC<WaveArmManagerProps> = ({
  width = 40,
  height = 40,
  borderRadius = 40,
  className,
  hasWaveArmUser = false,
  waveArmCount = 0,
  ...restProps
}) => {
  const cls = classnames({
    [`hands-up hands-up-manager`]: 1,
    [`${className}`]: !!className,
  });
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [twinkleFlag, setTwinkleFlag] = useState(false);

  useInterval(
    (timer: ReturnType<typeof setInterval>) => {
      if (hasWaveArmUser) {
        setTwinkleFlag(!twinkleFlag);
      } else {
        setTwinkleFlag(false);
        timer && clearInterval(timer);
      }
      return () => {
        timer && clearInterval(timer);
      };
    },
    500,
    hasWaveArmUser,
  );

  const content = useCallback(() => {
    return restProps.children;
  }, []);

  return (
    <div className={cls} {...restProps}>
      <Popover
        visible={popoverVisible}
        onVisibleChange={(visible) => {
          setPopoverVisible(visible);
        }}
        overlayClassName="customize-dialog-popover"
        trigger="hover"
        content={content}
        placement="leftTop">
        <Card
          width={width}
          height={height}
          borderRadius={borderRadius}
          className={twinkleFlag ? 'card-hands-up-active' : ''}>
          <div className="hands-box-line">
            {twinkleFlag ? <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.0038 17.7999V8.79995C25.0038 7.80636 24.0989 6.99996 22.9144 6.99996C22.1803 6.99996 20.7685 7.35996 20.7685 8.79995V5.19997M20.7685 5.19997C20.7685 4.20638 19.8635 3.39999 18.6791 3.39999C17.9633 3.39999 16.5332 3.75998 16.5332 5.19997M20.7685 5.19997V11.7999M16.5332 5.19997V2.79999C16.5332 1.80639 15.6282 1 14.4437 1C13.2578 1 12.2978 1.80639 12.2978 2.79999V5.19997M16.5332 5.19997V11.7999M12.2978 5.19997C12.2978 3.75998 10.8959 3.39999 10.1802 3.39999C8.99427 3.39999 8.0625 4.22918 8.0625 5.22397V15.3999M12.2978 5.19997V11.7999" stroke="#FDFDFD" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25 17.7999C25 22.5999 20.5755 24.9999 15.1176 24.9999C9.65963 24.9999 7.78196 23.7999 3.54663 17.7999L1.32873 14.6739C0.572018 13.6323 1.17767 12.2811 2.57251 11.8971C3.0286 11.7705 3.51948 11.7661 3.9786 11.8846C4.43772 12.0031 4.84287 12.2387 5.13912 12.5595L8.05867 15.4395" stroke="#FDFDFD" strokeLinecap="round" strokeLinejoin="round" />
            </svg> : <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.0038 17.7999V8.79995C25.0038 7.80636 24.0989 6.99996 22.9144 6.99996C22.1803 6.99996 20.7685 7.35996 20.7685 8.79995V5.19997M20.7685 5.19997C20.7685 4.20638 19.8635 3.39999 18.6791 3.39999C17.9633 3.39999 16.5332 3.75998 16.5332 5.19997M20.7685 5.19997V11.7999M16.5332 5.19997V2.79999C16.5332 1.80639 15.6282 1 14.4437 1C13.2578 1 12.2978 1.80639 12.2978 2.79999V5.19997M16.5332 5.19997V11.7999M12.2978 5.19997C12.2978 3.75998 10.8959 3.39999 10.1802 3.39999C8.99427 3.39999 8.0625 4.22918 8.0625 5.22397V15.3999M12.2978 5.19997V11.7999" stroke="#FDFDFD" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25 17.7999C25 22.5999 20.5755 24.9999 15.1176 24.9999C9.65963 24.9999 7.78196 23.7999 3.54663 17.7999L1.32873 14.6739C0.572018 13.6323 1.17767 12.2811 2.57251 11.8971C3.0286 11.7705 3.51948 11.7661 3.9786 11.8846C4.43772 12.0031 4.84287 12.2387 5.13912 12.5595L8.05867 15.4395" stroke="#FDFDFD" strokeLinecap="round" strokeLinejoin="round" />
            </svg>}
          </div>
          {waveArmCount ? (
            <span className="hands-up-count">{waveArmCount > 99 ? '99+' : waveArmCount}</span>
          ) : null}
        </Card>
      </Popover>
    </div>
  );
};

export interface StudentsWaveArmListProps extends BaseWaveArmProps {
  userWaveArmList: UserWaveArmInfo[];
  onClick: (userUuid: string) => Promise<void> | void;
}
export const StudentsWaveArmList: FC<StudentsWaveArmListProps> = ({
  userWaveArmList,
  width = 210,
  borderRadius = 12,
  className,
  onClick,
  ...restProps
}) => {
  const cls = classnames({
    [`students-hands-up`]: 1,
    [`${className}`]: !!className,
  });

  const [pagesList, setPagesList] = useState<Array<Array<UserWaveArmInfo>>>([[]]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize] = useState<number>(7);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(0);
  const [showWaveArmList, setShowWaveArmList] = useState<UserWaveArmInfo[]>([]);

  const handlerScroll = useMemo(
    () =>
      throttle((event: Event) => {
        const targetDom: Element = event.target as Element;
        const scrollTop = targetDom.scrollTop;
        const scrollHeight = targetDom.scrollHeight;
        const clientHeight = targetDom.clientHeight;
        if (scrollTop + clientHeight === scrollHeight) {
          if (pageIndex < totalPagesCount) {
            setPageIndex(pageIndex + 1);
          }
        }
      }, 100),
    [pageIndex, totalPagesCount],
  );

  useEffect(() => {
    const pagesListTemp: Array<Array<UserWaveArmInfo>> = [[]];
    setTotalPagesCount(Math.floor(userWaveArmList.length / pageSize));
    userWaveArmList.forEach((it, index) => {
      const pageIndex = Math.floor(index / pageSize);
      if (!pagesListTemp[pageIndex]) {
        pagesListTemp[pageIndex] = [];
      }
      pagesListTemp[pageIndex].push(it);
    });
    setPagesList(pagesListTemp);
  }, [userWaveArmList]);

  useEffect(() => {
    let showWaveArmListTemp: UserWaveArmInfo[] = [];
    for (let i = 0; i <= pageIndex; i++) {
      if (pagesList[i]) {
        showWaveArmListTemp = showWaveArmListTemp.concat(pagesList[i]);
      }
    }
    setShowWaveArmList(showWaveArmListTemp);
  }, [pageIndex, pagesList]);

  console.log(showWaveArmList);

  return showWaveArmList.length ? (
    <div className={cls} {...restProps}>
      <Card className={'hands-up-card'} borderRadius={borderRadius} onScroll={handlerScroll}>
        {showWaveArmList.map((item) => (
          <div className="student-item" key={item.userUuid}>
            <span className="student-name">{item?.userName}</span>
            <span className="operation-icon-wrap">
              {item.onPodium ? (
                <SvgImg type="invite-on-podium" color="#357bf6" />
              ) : (
                <SvgImg
                  type="invite-to-podium"
                  color="#7b89a0"
                  onClick={() => onClick(item.userUuid)}
                  canHover
                />
              )}
            </span>
          </div>
        ))}
      </Card>
    </div>
  ) : null;
};
