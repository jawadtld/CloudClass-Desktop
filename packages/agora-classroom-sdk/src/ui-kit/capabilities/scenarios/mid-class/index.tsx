import { Aside, Layout } from '~components/layout';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { NavigationBarContainer } from '~containers/nav';
import { DialogContainer } from '~containers/dialog';
import { LoadingContainer } from '~containers/loading';
import Room from '../room';
import { RoomMidStreamsContainer, TeacherStream } from '~containers/stream/room-mid-player';
import { CollectorContainer } from '~containers/board';
import { WhiteboardContainer } from '~containers/board';
import { FixedAspectRatioRootBox } from '~containers/root-box';
import { ChatWidgetPC } from '~containers/widget/chat-widget';
import { ExtensionAppContainer } from '~containers/extension-app-container';
import { ToastContainer } from '~containers/toast';
import { HandsUpContainer } from '~containers/hand-up';
import { SceneSwitch } from '~containers/scene-switch';
import { Award } from '../../containers/award';
import { BigWidgetWindowContainer } from '../../containers/big-widget-window';
import { useInteractiveUIStores, useStore } from '@/infra/hooks/use-edu-stores';
import { ScenesController } from '../../containers/scenes-controller';
import './index.css';


import micoff from './assets/image/Frame 989 (1).png';
import speakerOff from './assets/image/speaker-off.png';
import speakerOn from './assets/image/speaker-on.svg';
import videoOff from './assets/image/video-off.png';
import videoOn from './assets/image/video-on.svg';
import shareImg from './assets/image/share-img.png';
import moreIcon from './assets/image/more.svg';
import recordIcon from './assets/image/Frame 994.png';
import messageWithDot from './assets/image/Group 985405.png';
import arrowLeft from './assets/image/arrow-wht.png';
import micOn from './assets/image/Frame 989.png';
import whiteBoard from './assets/image/Group 985357.png';
import screenShare from './assets/image/Vector (4).png';
import shareImage from './assets/image/chat-more-optin.png';
import sharePdf from './assets/image/Group 985404.png';
import closeIcon from './assets/image/Group 985403.png';
import handRaiseIcon from './assets/image/hand-raise.svg';


import { StreamWindowUIStore } from '@/infra/stores/common/stream-window';
import React, { useMemo, useState } from 'react';
import { Room1v1StreamsContainer } from '../../containers/stream/room-1v1-player';
import { RoomBigStudentStreamsContainer } from '../../containers/stream/room-big-player';
import { StreamUIStore } from '@/infra/stores/common/stream';
import { EduInteractiveUIClassStore } from '@/infra/stores/interactive';
import { EduStreamUI } from '@/infra/stores/common/stream/struct';
import { StreamPlayer } from '../../containers/stream';
import { Modal } from '~ui-kit';
import { ClassState, EduRoleTypeEnum, LeaveReason } from 'agora-edu-core';

export const UserSection = observer(() => {

    const {
        streamUIStore,
        streamWindowUIStore: { visibleStream, streamDragable, handleDBClickStreamWindow },
    } = useInteractiveUIStores() as EduInteractiveUIClassStore;
    const {
        carouselStreams,
    } = streamUIStore;
    const videoStreamStyle = useMemo(
        () => ({
            width: 94,
            height: 94,
        }),
        [94, 94],
    );

    return <div className="student-right-wrap">
        <div className="livecls-input-search">
            <input type="text" className="form-control" placeholder="Search Students" />
            <div className="search-img">
                <img src="../image\Vector (31).png" alt="" />
            </div>
        </div>
        <div className="live-witimg-right">
            {carouselStreams.map((stream: EduStreamUI, index: number) => {
                return <div key={stream.stream.streamUuid} className="live-stud-card">
                    <div className="name-card-wrap">
                        {stream.stream.videoState?(
                            <StreamPlayer
                            key={`carouse-${stream.stream.streamUuid}`}
                            stream={stream}
                            style={videoStreamStyle}></StreamPlayer>
                        ):(
                            <div className="name-round rounded-circle">
                                <p>{stream.fromUser.userName.slice(0, 2).toUpperCase()}</p>
                            </div>
                        )}
                    </div>
                    <div className="more-btn-img">
                        <a href="">
                            <img src="../image/Group 985339.png" alt="" />
                        </a>
                    </div>
                </div>
            })}
            {carouselStreams.length>9?(<div className="live-stud-card8">
                <p className="more-count-p">{carouselStreams.length-9}+</p>
            </div>):null}
        </div>
    </div>
});

export const MidClassScenario = observer(() => {
    // layout
    const layoutCls = classnames('golive-body-wrap');
    const {
        classroomStore,
        streamWindowUIStore: { containedStreamWindowCoverOpacity },
        shareUIStore,
        handUpUIStore
    } = useStore();
    const {
        streamUIStore,
        streamWindowUIStore: { visibleStream, streamDragable, handleDBClickStreamWindow },
    } = useInteractiveUIStores() as EduInteractiveUIClassStore;
    const {
        carouselStreams,
    } = streamUIStore;
    const { boardStore, mediaStore, roomStore } = classroomStore;
    const { whiteboardWidgetActive } = boardStore;
    const { navigationBarUIStore } = useStore();
    const { navigationTitle, currScreenShareTitle, actions, isBeforeClass, startClass, localMicOff } = navigationBarUIStore;
    const { teacherUuid, waveArm } = handUpUIStore;

    // For show messaging status
    const [showMessages, setShowMessages] = React.useState(false);
    const messageClicked = (e: any) => {
        e.preventDefault();
        setShowMessages(!showMessages);
    }

    // For mute all button
    const [speakerStatus, setSpeakerStatus] = React.useState(true);
    const toggleMuteAll = (e: any) => {
        e.preventDefault();
        setSpeakerStatus(!speakerStatus);
        carouselStreams.forEach(element => {
            if (speakerStatus) {
                element.stream.enableAudio();
            } else {
                element.stream.disableAudio();
            }
        });
    }

    // For mute self button
    const [micStatus, setMicStatus] = React.useState(true);
    const toggleMuteSelf = (e: any) => {
        e.preventDefault();
        mediaStore.enableLocalAudio(!micStatus);
        setMicStatus(!micStatus);
    }

    // For mute self button
    const [videoStatus, setVideoStatus] = React.useState(true);
    const toggleSelfVideo = (e: any) => {
        e.preventDefault();
        mediaStore.enableLocalVideo(!videoStatus);
        setVideoStatus(!videoStatus);
    }

    const [showShare,setShowShare] = React.useState(false);
    const toggleShareModal = (e: any) => {
        e.preventDefault();
        setShowShare(!showShare);
    }

    const [showMoreStudent,setShowMoreStudent] = React.useState(false);
    const toggleMoreModalStudent = (e: any) => {
        e.preventDefault();
        setShowMoreStudent(!showMoreStudent);
    }

    const [showMoreTeacher,setShowMoreTeacher] = React.useState(false);
    const toggleMoreModalTeacher = (e: any) => {
        e.preventDefault();
        setShowMoreTeacher(!showMoreTeacher);
    }

    const [showExitConfirm,setShowExitConfirm] = React.useState(false);
    const toggleExitConfirm = (e: any) => {
        e.preventDefault();
        setShowExitConfirm(!showExitConfirm);
    }

    const [showWhiteboard,setShowWhiteboard] = React.useState(false);
    const toggleWhiteboard = (e: any) => {
        e.preventDefault();
        setShowWhiteboard(!showWhiteboard);
        setShowShare(false);
        setShowMoreStudent(false);
        setShowMoreTeacher(false);
    }

    const endClass = (e: any) => {
        e.preventDefault();
        classroomStore.connectionStore.leaveClassroom(LeaveReason.leave);
    }

    const handWave = (e: any) => {
        e.preventDefault();
        waveArm(teacherUuid,3);
    }

    return (
        <Room>
            {classroomStore.userStore.localUser&&<SceneSwitch>
                <Layout className={layoutCls} direction="col" >
                <div className="golive-head">
                            <div className="live-clsimg">
                                <a onClick={toggleExitConfirm} href="">
                                    <img src={arrowLeft} alt="" className="arrow-img" />
                                </a>
                                <p>{navigationTitle}</p>
                            </div>
                            {!isBeforeClass&&<div onClick={toggleExitConfirm} className="end-btn-wrap">
                                <button className="live-end-btn" >End class</button>
                            </div>}
                        </div>

                        <div className="live-body-wrap">
                            <div className={isBeforeClass?'live-teacher-wrap-not-started':'live-teacher-wrap'}>
                            {!isBeforeClass&&<div className="live-top-right">
                                {classroomStore.userStore.localUser?.userRole==EduRoleTypeEnum.teacher&&<HandsUpContainer />}
                                <a onClick={messageClicked} href="">
                                    <img src={messageWithDot} alt="" />
                                </a>
                            </div>}
                                <div className="live-teach-imgwrap">
                                    {!showWhiteboard&&<TeacherStream></TeacherStream>}
                                    {showWhiteboard && <div className='whiteboard-div' >
                                        <img onClick={toggleWhiteboard} className='whiteboard-close' src={closeIcon} />
                                        <BigWidgetWindowContainer>
                                            {whiteboardWidgetActive && <WhiteboardContainer></WhiteboardContainer>}
                                        </BigWidgetWindowContainer>
                                    </div>}
                                </div>

                                <div className="live-studimg-wrap">
                                    <div className="sub-btn-wrap">
                                        {classroomStore.userStore.localUser?.userRole==EduRoleTypeEnum.teacher&&<div onClick={toggleMuteAll} className="share-btn">
                                            <a href="">
                                                <img src={speakerStatus?speakerOff:speakerOn} alt="" />
                                            </a>
                                            <p className="share-p text-center">Mute all <br/>students</p>
                                        </div>}
                                        <div onClick={toggleMuteSelf} className="share-btn">
                                            <a href="">
                                                <img src={micStatus?micoff:micOn} alt="" />
                                            </a>
                                            <p>{micStatus?'Off Mic':'On Mic'}</p>
                                        </div>
                                        <div onClick={toggleSelfVideo} className="share-btn">
                                            <a href="">
                                                <img src={videoStatus?videoOff:videoOn} alt="" />
                                            </a>
                                            <p> {videoStatus?'Off Video':'On Video'}
                                            </p>
                                        </div>
                                        {classroomStore.userStore.localUser?.userRole==EduRoleTypeEnum.teacher&&!isBeforeClass&&<div onClick={toggleShareModal} className="share-btn">
                                            <div className="live-share-img rounded-circle">
                                                <a href="" data-bs-toggle="modal" data-bs-target="#shareModal">
                                                    <img src={shareImg} alt="" className="live-img-share" />
                                                </a>
                                            </div>
                                            <p className="share-p">Share</p>
                                        </div>}
                                        {classroomStore.userStore.localUser?.userRole==EduRoleTypeEnum.student&&<HandsUpContainer />}
                                        {/* Student more */}
                                        {classroomStore.userStore.localUser?.userRole==EduRoleTypeEnum.student&&!isBeforeClass&&<div onClick={toggleMoreModalStudent} className="share-btn">
                                            <div className="live-share-img">
                                                <a href="" data-bs-toggle="modal" data-bs-target="#moreModal">
                                                    <img src={moreIcon} alt="" className="live-img-share" />
                                                </a>
                                            </div>
                                            <p className="share-p">More</p>
                                        </div>}
                                        {/* Teacher more */}
                                        {classroomStore.userStore.localUser?.userRole==EduRoleTypeEnum.teacher&&!isBeforeClass&&<div onClick={toggleMoreModalTeacher} className="share-btn">
                                            <div className="live-share-img">
                                                <a href="" data-bs-toggle="modal" data-bs-target="#moreModal">
                                                    <img src={moreIcon} alt="" className="live-img-share" />
                                                </a>
                                            </div>
                                            <p className="share-p">More</p>
                                        </div>}
                                        {classroomStore.userStore.localUser?.userRole==EduRoleTypeEnum.teacher&&isBeforeClass&&<div onClick={startClass} className="share-btn">
                                            <a href="">
                                                <img src={recordIcon} alt="" className="recd-img" />
                                            </a>
                                            <p> Turn on recording </p>
                                        </div>}
                                    </div>
                                    {isBeforeClass&&<div className="right-btn-wrap">
                                        <button onClick={startClass} type="button" className="live-btn">
                                            <img src="../image\bi_camera-video.png" alt="" /> Go Live</button>
                                    </div>}
                                </div>
                            </div>
                            {!isBeforeClass && !showMessages && <UserSection></UserSection>}
                            {!isBeforeClass && showMessages && <div className="chatrm-right-wrap">
                                <div className='chat-room-right'>
                                <div className="chat-room-wrap">
                                    <div className="heading d-flex">
                                    <p>Chat room</p>
                                    </div>
                                    <div className="chat-popup-icon">
                                    <a href="">
                                        <img src="../image/ant-design_close-circle-outlined.png" alt="" />
                                    </a>
                                    </div>
                                    <ChatWidgetPC />
                                </div>
                                </div>
                            </div>}
                        </div>
                </Layout>
            </SceneSwitch>}
            {showShare?(
                <Modal
                title={<p>Share</p>}
                style={{ width: 518 }}
                closable={true}
                onCancel={toggleShareModal}>
                <div className="share-modal-content">
                    <div className="share-modal-body">
                        <div onClick={toggleWhiteboard} className="share-modl-item1">
                            <img src={whiteBoard} alt="" />
                            <p>Whiteboard</p>
                        </div>
                        <div className="share-modl-item1">
                            <img src={screenShare} alt="" />
                            <p>Screen share </p>
                        </div>
                        <div className="share-modl-item1">
                            <img src={shareImage} alt="" />
                            <p>Share Image</p>
                        </div>
                        <div className="share-modl-item1">
                            <img src={sharePdf} alt="" />
                            <p>Share PDF</p>
                        </div>
                    </div>
                </div>
            </Modal>
            ):null}
            {showMoreStudent?(
                <Modal
                title={<p>More</p>}
                style={{ width: 518 }}
                closable={true}
                onCancel={toggleMoreModalStudent}>
                <div className="share-modal-content">
                    <div className="share-modal-body">
                        <div onClick={toggleWhiteboard} className="share-modl-item1">
                            <img src={whiteBoard} alt="" />
                            <p>Whiteboard</p>
                        </div>
                    </div>
                </div>
            </Modal>
            ):null}
            {showMoreTeacher?(
                <Modal
                title={<p>More</p>}
                style={{ width: 518 }}
                closable={true}
                onCancel={toggleMoreModalTeacher}>
                <div className="share-modal-content">
                    <div className="share-modal-body">
                    </div>
                </div>
            </Modal>
            ):null}
            {showExitConfirm&&<Modal
                title={<p>Leave class</p>}
                style={{ width: 518 }}
                closable={true}
                onCancel={toggleExitConfirm}>
                <div className="exit-modal-content">
                    <div className="exit-modal-body">
                        <p>Do you want to leave the class now</p>
                        <div className="exit-modal-footer" >
                            <button className="exit-modal-btn" onClick={toggleExitConfirm} >No</button>
                            <button className="exit-modal-btn" onClick={endClass} >Yes</button>
                        </div>
                    </div>
                </div>
            </Modal>}
            <CollectorContainer/>
            <DialogContainer/>
        </Room>
    );
});
