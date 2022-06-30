import { useStore } from '@/infra/hooks/use-edu-stores';
import { transI18n } from '@/infra/stores/common/i18n';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Card, Loading } from '~ui-kit';

type Props = {
  children?: React.ReactNode;
};

export const SceneSwitch: FC<Props> = observer(({ children }) => {
  const { groupUIStore } = useStore();

  return (
    <div className="w-full h-full bg-white">
      {/* Loading */}
      {groupUIStore.joiningSubRoom ? <PageLoading /> : children}
    </div>
  );
});

const PageLoading = () => {
  const { layoutUIStore } = useStore();

  return (
    <div className="page-loading">
      <Card className="absolute inline-flex flex-col inset-auto p-4" style={{
        width: 'unset!important',
        height: 'unset!important',
        borderRadius: 12
      }}>
        <Loading></Loading>
        <p className="m-0">
          {layoutUIStore.isInSubRoom
            ? transI18n('fcr_group_joining', {
              reason: layoutUIStore.currentSubRoomName,
            })
            : transI18n('fcr_group_back_main_room')}
        </p>
      </Card>
    </div>
  );
};
