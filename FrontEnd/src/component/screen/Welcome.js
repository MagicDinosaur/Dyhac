import {useEffect, useState} from "react";
import classNames from "classnames";
import md5 from 'md5'
import room from "../../model/room";
import {useHistory} from "react-router-dom";

const Welcome = (props) => {

    const history = useHistory();

    const [useView, setView] = useState('guest')

    const [useSpeakerField, setSpeakerField] = useState({
        room: null,
        speaker: null,
        password: null
    });

    const [useGuestField, setGuestField] = useState({
        room: null,
        name: null,
    });

    const roomCreate = async () => {
        if (useSpeakerField.room == null) {
            return alert('Input room name!');
        }
        try {
            const result = await room.create(useSpeakerField.room, useSpeakerField.speaker, md5(useSpeakerField.password));
            history.push('/' + result.id);
        } catch (e) {
            alert(e.message);
        }
    }

    const roomGo = async () => {
        if (useGuestField.room == null) {
            return alert('Input room ID!');
        }
        try {
            const result = await room.screen(useGuestField.room);
            history.push('/' + useGuestField.room + (useGuestField.name ? '?guest=' + useGuestField.name : ''));
        } catch (e) {
            switch (e.message) {
                case 'ROOM_EXIST':
                    alert('Room not exist!')
                    break;
            }
        }
    }

    return (
        <div className={classNames('mx-auto')} style={{width: '690px'}}>
            <h1 className="mt-5 mb-4">Dyhac</h1>
            <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className={classNames('btn btn-secondary', useView == 'guest' ? 'active' : null)}
                        onClick={() => {
                            setView('guest')
                        }}>Guest
                </button>
                <button type="button"
                        className={classNames('btn btn-secondary', useView == 'speaker' ? 'active' : null)}
                        onClick={() => {
                            setView('speaker')
                        }}>Speaker
                </button>
            </div>
            <div className={'mt-4'}>
                {useView == 'guest' && (
                    <div>
                        <div className="row">
                            <div className="col-6">
                                <label htmlFor="inputEmail4" className={'mb-1'}>Room</label>
                                <input className="form-control" onChange={(e) => {
                                    setGuestField({
                                        ...useGuestField,
                                        room: e.target.value
                                    })
                                }}/>
                            </div>
                            <div className="col-6">
                                <label htmlFor="inputPassword4" className={'mb-1'}>Name</label>
                                <input className="form-control" id="inputPassword4"
                                 onChange={(e) => {
                                    setGuestField({
                                        ...useGuestField,
                                        name: e.target.value
                                    })
                                }}/>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary mt-3" onClick={roomGo}>Go</button>
                    </div>
                )}
                {useView == 'speaker' && (
                    <div>
                        <div className="row">
                            <div className="col-4">
                                <label htmlFor="inputEmail4" className={'mb-1'}>Room</label>
                                <input className="form-control" onChange={(e) => {
                                    setSpeakerField({
                                        ...useSpeakerField,
                                        room: e.target.value
                                    })
                                }}/>
                            </div>
                            <div className="col-4">
                                <label htmlFor="inputPassword4" className={'mb-1'}>Speaker</label>
                                <input className="form-control" onChange={(e) => {
                                    setSpeakerField({
                                        ...useSpeakerField,
                                        speaker: e.target.value
                                    })
                                }}/>
                            </div>
                            <div className="col-4">
                                <label htmlFor="inputPassword4" className={'mb-1'}>Password</label>
                                <input type="password" className="form-control" onChange={(e) => {
                                    setSpeakerField({
                                        ...useSpeakerField,
                                        password: e.target.value
                                    })
                                }}/>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary mt-3" onClick={roomCreate}>Create</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Welcome;
