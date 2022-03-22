import { AgoraRteEventType, AgoraRteScene, bound } from 'agora-rte-sdk';
import { startsWith } from 'lodash';
import get from 'lodash/get';
import { action, computed, observable } from 'mobx';
import { EduClassroomConfig } from '../../../../configs';
import { EduEventCenter } from '../../../../event-center';
import { AgoraEduClassroomEvent } from '../../../../type';
import { EduStoreBase } from '../base';
import { GroupDetail, GroupUser, PatchGroup } from './type';
import { GroupDetails, GroupState } from './type';

enum OperationType {
  // 加入分组
  Join,
  // 离开分组
  Leave,
  //
  Move,
}

type OperationQueue = {
  type: OperationType;
  fromGroupUuid?: string;
  toGroupUuid?: string;
}[];

/**
 * 负责功能：
 *  1.获取子房间
 *  2.获取子房间对象
 *  3.加入子房间
 *  4.离开子房间
 *  5.主房间属性
 *  6.新增房间
 *  7.删除房间
 *  8.删除所有子房间
 *  9.添加用户到房间
 *  10.邀请用户到房间
 *  11.用户接收邀请进入房间
 *  12.用户移动至指定房间
 */
export class GroupStore extends EduStoreBase {
  static readonly MAX_GROUP_COUNT = 20; // 最大分组数量
  static readonly MIN_GROUP_COUNT = 2;
  static readonly MAX_PER_GROUP_PERSON = 15; // 单组最大人数
  static readonly CMD_PROCESS_PREFIX = 'groups-';

  private _currentGroupUuid?: string;

  @observable
  state: GroupState = GroupState.CLOSE;

  @observable
  groupDetails: Map<string, GroupDetail> = new Map();

  @observable
  operationQueue: OperationQueue = [];

  /** Methods */
  @action.bound
  private _handleRoomPropertiesChange(
    changedRoomProperties: string[],
    roomProperties: any,
    operator: any,
    cause: any,
  ) {
    changedRoomProperties.forEach((key) => {
      if (key === 'groups') {
        const processes = get(roomProperties, 'processes', {});
        const groups = get(roomProperties, 'groups', {});
        this.state = groups.state;
        const progress = Object.keys(processes).reduce((prev, k) => {
          if (k.startsWith(GroupStore.CMD_PROCESS_PREFIX)) {
            const groupUuid = k.substring(GroupStore.CMD_PROCESS_PREFIX.length);
            const users = processes[k].progress.map(
              ({ userUuid }: { userUuid: string }) => userUuid,
            );
            prev.set(groupUuid, users);
          }
          return prev;
        }, new Map<string, string[]>());
        this._setDetails(groups.details, progress);
        this._checkSubRoom();
      }
    });

    if (cause) {
      const { cmd, data } = cause;
      // Emit event when local user is invited by teacher
      if (cmd === 501 && startsWith(data.processUuid, GroupStore.CMD_PROCESS_PREFIX)) {
        const groupUuid = data.processUuid.substring(GroupStore.CMD_PROCESS_PREFIX.length);
        const progress = (data.addProgress as { userUuid: string; ts: number }[]) || [];
        const accepted = (data.addAccepted as { userUuid: string }[]) || [];
        const actionType = data.actionType as number;
        const { userUuid: localUuid } = EduClassroomConfig.shared.sessionInfo;

        const invitedLocal = progress.some(({ userUuid }) => userUuid === localUuid);

        if (invitedLocal) {
          EduEventCenter.shared.emitClasroomEvents(AgoraEduClassroomEvent.InvitedToGroup, {
            groupUuid,
          });
        }

        if (actionType === 2 && accepted?.length) {
          EduEventCenter.shared.emitClasroomEvents(AgoraEduClassroomEvent.AcceptedToGroup, {
            groupUuid,
            accepted,
          });
        }
      }
    }
  }

  @action.bound
  private _setDetails(details: GroupDetails, progress: Map<string, string[]>) {
    const newGroupDetails = new Map<string, GroupDetail>();
    Object.entries(details).forEach(([groupUuid, groupDetail]) => {
      if (progress.has(groupUuid)) {
        const notJoinedUsers =
          progress
            .get(groupUuid)
            ?.map((userUuid) => ({ userUuid, notJoined: true } as GroupUser)) || [];

        groupDetail.users.unshift(...notJoinedUsers);
      }
      newGroupDetails.set(groupUuid, groupDetail);
    });
    this.groupDetails = newGroupDetails;
  }

  private _checkSubRoom() {
    const { userUuid: localUuid } = EduClassroomConfig.shared.sessionInfo;

    let lastGroupUuid = '';
    for (const [groupUuid, group] of this.groupDetails.entries()) {
      const local = group.users.find(
        ({ userUuid, notJoined }) => userUuid === localUuid && !notJoined,
      );
      if (local) {
        lastGroupUuid = groupUuid;
        break;
      }
    }

    if (lastGroupUuid) {
      if (this._currentGroupUuid && lastGroupUuid !== this._currentGroupUuid) {
        this.operationQueue.push({
          fromGroupUuid: this._currentGroupUuid,
          toGroupUuid: lastGroupUuid,
          type: OperationType.Move,
        });
      } else if (!this._currentGroupUuid) {
        this.operationQueue.push({
          toGroupUuid: lastGroupUuid,
          type: OperationType.Join,
        });
      }
    } else {
      if (this._currentGroupUuid) {
        this.operationQueue.push({
          fromGroupUuid: this._currentGroupUuid,
          type: OperationType.Leave,
        });
      }
    }

    setTimeout(this._run);
  }

  /**
   * 添加分组
   * @param groupDetail 创建分组信息
   * @param inProgress 是否邀请
   */
  async addGroups(groupDetails: GroupDetail[]) {
    const roomUuid = EduClassroomConfig.shared.sessionInfo.roomUuid;

    await this.api.addGroup(roomUuid, { groups: groupDetails, inProgress: false });
  }

  /**
   * 移除分组
   * @param groups 子房间 Id 列表
   */
  async removeGroups(groups: string[]) {
    const roomUuid = EduClassroomConfig.shared.sessionInfo.roomUuid;
    await this.api.removeGroup(roomUuid, { removeGroupUuids: groups });
  }

  /**
   * 更新分组信息
   * @param groups
   */
  async updateGroupInfo(groups: PatchGroup[]) {
    const roomUuid = EduClassroomConfig.shared.sessionInfo.roomUuid;
    await this.api.updateGroupInfo(roomUuid, {
      groups,
    });
  }

  /**
   * 开启分组
   * @param groupDetails
   */
  async startGroup(groupDetails: GroupDetail[]) {
    const roomUuid = EduClassroomConfig.shared.sessionInfo.roomUuid;
    await this.api.updateGroupState(
      roomUuid,
      {
        groups: groupDetails,
        inProgress: true,
      },
      GroupState.OPEN,
    );
  }

  /**
   * 关闭分组
   */
  async stopGroup() {
    const roomUuid = EduClassroomConfig.shared.sessionInfo.roomUuid;
    await this.api.updateGroupState(roomUuid, { groups: [] }, GroupState.CLOSE);
  }

  /**
   * 更新分组成员列表
   * @param groupUuid
   * @param addUsers
   * @param removeUsers
   */
  async updateGroupUsers(patches: PatchGroup[]) {
    const roomUuid = EduClassroomConfig.shared.sessionInfo.roomUuid;
    await this.api.updateGroupUsers(roomUuid, { groups: patches, inProgress: false });
  }

  /**
   * 从分组移除用户
   * @param fromGroupUuid
   * @param users
   */
  async removeGroupUsers(fromGroupUuid: string, users: string[]) {
    const roomUuid = EduClassroomConfig.shared.sessionInfo.roomUuid;
    let fromGroup = { groupUuid: fromGroupUuid, removeUsers: users };
    await this.api.updateGroupUsers(roomUuid, { groups: [fromGroup], inProgress: false });
  }

  /**
   * 将用户移入子房间
   * @param fromGroupUuid
   * @param toGroupUuid
   * @param users
   */
  async moveUsersToGroup(fromGroupUuid: string, toGroupUuid: string, users: string[]) {
    const roomUuid = EduClassroomConfig.shared.sessionInfo.roomUuid;
    const fromGroup = { groupUuid: fromGroupUuid, removeUsers: users };
    const toGroup = { groupUuid: toGroupUuid, addUsers: users };
    const groups = [fromGroup, toGroup];
    await this.api.updateGroupUsers(roomUuid, { groups, inProgress: false });
  }

  /**
   * 接受邀请加入到小组
   * @param groupUuid
   */
  async acceptGroupInvited(groupUuid: string) {
    const roomUuid = EduClassroomConfig.shared.sessionInfo.roomUuid;
    await this.api.acceptGroupInvited(roomUuid, groupUuid);
  }

  /**
   * 进入房间
   * @param groupUuid
   */
  joinSubRoom(groupUuid: string) {
    this._currentGroupUuid = groupUuid;

    EduEventCenter.shared.emitClasroomEvents(AgoraEduClassroomEvent.JoinSubRoom);
  }

  /**
   *
   * 用户移动入房间
   * @param fromGroupUuid
   * @param toGroupUuid
   */
  moveIntoSubRoom(fromGroupUuid: string, toGroupUuid: string) {
    this._currentGroupUuid = toGroupUuid;

    EduEventCenter.shared.emitClasroomEvents(AgoraEduClassroomEvent.MoveToOtherGroup, {
      fromGroupUuid,
      toGroupUuid,
    });
  }

  leaveSubRoom() {
    if (this._currentGroupUuid) {
      this._currentGroupUuid = undefined;

      EduEventCenter.shared.emitClasroomEvents(AgoraEduClassroomEvent.LeaveSubRoom);
    }
  }

  /**
   * 执行队列任务
   * @returns
   */
  @action.bound
  private async _run() {
    const operation = this.operationQueue.pop();

    if (!operation) {
      return;
    }

    switch (operation.type) {
      case OperationType.Join:
        this.joinSubRoom(operation.toGroupUuid!);
        break;
      case OperationType.Leave:
        this.leaveSubRoom();
        break;
      case OperationType.Move:
        this.moveIntoSubRoom(operation.fromGroupUuid!, operation.toGroupUuid!);
        break;
    }
  }

  /**
   * 当前所在子房间
   */
  get currentSubRoom() {
    return this._currentGroupUuid;
  }

  //others
  private _addEventHandlers(scene: AgoraRteScene) {
    scene.on(AgoraRteEventType.RoomPropertyUpdated, this._handleRoomPropertiesChange);
  }

  private _removeEventHandlers(scene: AgoraRteScene) {
    scene.off(AgoraRteEventType.RoomPropertyUpdated, this._handleRoomPropertiesChange);
  }

  /** Hooks */
  onInstall() {
    computed(() => this.classroomStore.connectionStore.mainRoomScene).observe(
      ({ newValue, oldValue }) => {
        if (oldValue) {
          this._removeEventHandlers(oldValue);
        }
        if (newValue) {
          //bind events
          this._addEventHandlers(newValue);
        }
      },
    );
  }

  onDestroy() {}
}
