import { AbstractErrorCenter, AGErrorWrapper, Logger } from 'agora-rte-sdk';
import { v4 as uuidv4 } from 'uuid';

export class EduErrorCenter extends AbstractErrorCenter {
  static shared = new EduErrorCenter();

  private _handleError(code: AGEduErrorCode, error: Error) {
    let details = error?.stack || error?.message;
    Logger.error(`[EduErrorCenter] error ${code}: ${details}`);
    this.emit('error', code, error);
  }

  handleThrowableError(code: AGEduErrorCode, error: Error): never {
    let wrap = AGErrorWrapper(code, error);
    this._handleError(code, wrap);
    throw wrap;
  }
  handleNonThrowableError(code: AGEduErrorCode, error: Error) {
    let wrap = AGErrorWrapper(code, error);
    this._handleError(code, wrap);
  }
}

export enum AGEduErrorCode {
  EDU_ERR_SESSION_INFO_NOT_READY = '600000',
  EDU_ERR_JOIN_CLASSROOM_FAIL = '600001',
  EDU_ERR_UPLOAD_FAILED_NO_FILE_EXT = '600002',
  EDU_ERR_UPLOAD_FAILED_UNSUPPORTED_VENDOR = '600003',
  EDU_ERR_UPLOAD_ALI_FAIL = '600004',
  EDU_ERR_UPLOAD_FAIL = '600005',
  EDU_ERR_BOARD_INFO_NOT_READY = '600006',
  EDU_ERR_BOARD_ROOM_NOT_AVAILABLE = '600007',
  EDU_ERR_BOARD_JOIN_FAILED = '600008',
  EDU_ERR_BOARD_LEAVE_FAILED = '600009',
  EDU_ERR_BOARD_JOIN_JOIN_API_FAILED = '600010',
  EDU_ERR_BOARD_WINDOW_MANAGER_NOT_AVAILABLE = '600011',
  EDU_ERR_INVALID_CLOUD_RESOURCE = '600012',
  EDU_ERR_SCENE_NOT_READY = '600013',
  EDU_ERR_KICK_OUT_FAIL = '600014',
  EDU_ERR_LOCAL_USER_INFO_NOT_READY = '600015',
  EDU_ERR_HAND_UP_OFF_PODIUM_FAIL = '600016',
  EDU_ERR_HAND_UP_REJECT_FAIL = '600017',
  EDU_ERR_HAND_UP_CANCEL_FAIL = '600018',
  EDU_ERR_CAROUSEL_START_FAIL = '600019',
  EDU_ERR_CAROUSEL_STOP_FAIL = '600020',
  EDU_ERR_CHAT_MUTE_FAIL = '600021',
  EDU_ERR_WIDGET_LEAVE_FAIL = '600022',
  EDU_ERR_HAND_UP_ACCEPT_FAIL = '600023',
  EDU_ERR_HAND_UP_HAND_UP_FAIL = '600024',
  EDU_ERR_EXAPP_SHUTDOWN_FAIL = '600025',
  EDU_ERR_UNEXPECTED_TEACHER_STREAM_LENGTH = '600026',
  EDU_ERR_SEND_STAR_FAIL = '600027',
  EDU_ERR_ENABLE_VIDEO_FAIL = '600028',
  EDU_ERR_DISABLE_VIDEO_FAIL = '600029',
  EDU_ERR_TOGGLE_VIDEO_FAIL = '600030',
  EDU_ERR_ENABLE_AUDIO_FAIL = '600031',
  EDU_ERR_DISABLE_AUDIO_FAIL = '600032',
  EDU_ERR_TOGGLE_AUDIO_FAIL = '600033',
  EDU_ERR_BOARD_WINDOW_MANAGER_MOUNT_FAIL = '600034',
  EDU_ERR_START_RECORDING_FAIL = '600035',
  EDU_ERR_STOP_RECORDING_FAIL = '600036',
  EDU_ERR_JOIN_RTC_FAIL = '600037',
  EDU_ERR_LEAVE_RTC_FAIL = '600038',
  EDU_ERR_CONN_JOIN_WHITEBOARD_FAIL = '600039',
  EDU_ERR_CONN_LEAVE_WHITEBOARD_FAIL = '600040',
  EDU_ERR_INVALID_JOIN_CLASSROOM_STATE = '600041',
  EDU_ERR_INVALID_JOIN_RTC_STATE = '600042',
  EDU_ERR_INVALID_JOIN_WHITEBOARD_STATE = '600043',
  EDU_ERR_LEAVE_CLASSROOM_FAIL = '600044',
  EDU_ERR_RTE_ENGINE_NOT_READY = '600045',
  EDU_ERR_HAND_UP_WAVE_FAIL = '600046',
  EDU_ERR_BOARD_ROOM_NOT_WRITABLE = '600047',
  EDU_ERR_GET_HISTORY_CHAT_MESSAGE_FAIL = '600048',
  EDU_ERR_GET_COVERSATION_HISTORY_CAHT_MESSAGE_FAIL = '600049',
  EDU_ERR_GET_CONVERSATION_LIST_FAIL = '600050',
  EDU_ERR_SEND_MESSAGE_CONVERSATION_FAIL = '600051',
  EDU_ERR_SEND_MESSAGE_FAIL = '600052',
  EDU_ERR_MUTE_CHAT_FAIL = '600053',
  EDU_ERR_UN_MUTE_CAHT_FAIL = '600054',
  EDU_ERR_MEDIA_CONTROL_NOT_READY = '600055',
  EDU_ERR_UNEXPECTED_STUDENT_STREAM_LENGTH = '600056',
  EDU_ERR_CLOUD_REMOVE_PERSONAL_RESOURCE_FAIL = '600057',
  EDU_ERR_CLOUD_FETCH_PERSONAL_RESOURCE_FAIL = '600058',
  EDU_ERR_UPDATE_CLASS_STATE_FAIL = '600059',
  EDU_ERR_MEDIA_START_SCREENSHARE_FAIL = '600060',
  EDU_ERR_MEDIA_STOP_SCREENSHARE_FAIL = '600061',
  EDU_ERR_MEDIA_LOCAL_PUBLISH_STATE_UPDATE_FAIL = '600062',
  EDU_ERR_MEDIA_REMOTE_PUBLISH_STATE_UPDATE_FAIL = '600063',
  EDU_ERR_UPLOAD_AWS_FAIL = '600064',
  EDU_ERR_EXTAPP_UPDATE_PROPERTIES_FAIL = '600065',
  EDU_ERR_EXTAPP_DELETE_PROPERTIES_FAIL = '600066',
  EDU_ERR_CLOUD_RESOURCE_CONVERSION_FAIL = '600067',
  EDU_ERR_CLOUD_RESOURCE_CONVERSION_CONVERTING = '600068',
  EDU_ERR_HAND_UP_OFF_PODIUM_ALL_FAIL = '600069',
  EDU_ERR_BOARD_SET_WRITABLE_FAILED = '600070',
  EDU_ERR_CLASSROOM_CONFIG_NOT_READY = '600071',
  EDU_ERR_BOARD_CONFIG_TIMEOUT = '600072',
}