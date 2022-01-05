import {useHistory, useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import room from "../../model/room";
import classNames from "classnames";

const Room = (props) => {
    const id = useParams().id;

    const history = useHistory();
    const location = useLocation();

    const urlSearchParams = new URLSearchParams(location.search)

    const guest = urlSearchParams.get("guest")

    const [useID, setID] = useState(id);

    const [useRoomDetail, setRoomDetail] = useState({
        id: null,
        name: null,
        owner: null,
        question: [],
    });

    const [useAskQuestionField, setAskQuestionField] = useState()

    useEffect(() => {
        const roomScreen = async () => {
            try {
                const result = await room.screen(useID);
                setRoomDetail(result);
            } catch (e) {
                history.push('/');
            }
        }
        roomScreen();
    }, [useID])

    useEffect(() => {
        document.title = useRoomDetail.name + ' / ' + useRoomDetail.owner + ' - Dyhac';
    }, [useRoomDetail])

    const questionAsk = async () => {
        if (!useAskQuestionField) {
            return alert('Input question!');
        }
        try {
            await room.questionAsk(useID, guest, useAskQuestionField);
            setAskQuestionField('');
            alert('Send question success!');
        } catch (e) {
            alert(e.message)
        }
    }

    const moderator = async () => {
        let password = prompt("Please enter room password:");

        if (!password) {
            return;
        }

        alert(password);
    }
    return (
        <div className={classNames('mx-auto', 'mb-5')} style={{width: '690px'}}>
            <div className={classNames('d-flex', 'mt-5 mb-4')}>
                <div>
                    <h2>{useRoomDetail.name + ' / ' + useRoomDetail.owner}  </h2>
                    <h6>{useRoomDetail.id}</h6>
                </div>
                <div style={{
                    marginLeft: 'auto',
                    order: '2',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <button type="button" className="btn btn-primary" onClick={moderator}>I'm moderator</button>
                </div>
            </div>

            <div className="list-group">
                {useRoomDetail.question.map(item => {
                    return (
                        <a href="javascript:;"
                           className={classNames('list-group-item list-group-item-action', item.answer ? 'active' : null)}
                           aria-current="true">
                            {'owner' in item && (
                                <p className="mb-0">{item.owner}</p>
                            )}
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1 lh-base" style={{fontSize: '18px'}}>{item.content}</h5>
                            </div>
                        </a>
                    );
                })}
            </div>

            <div className="row mt-4">
                <div className="col-9">
                    <textarea className="form-control" aria-label="With textarea"
                              placeholder={'Ask question'} style={{height: '120px', fontSize: '18px'}}
                              onChange={(e) => {
                                  setAskQuestionField(e.target.value);
                              }} value={useAskQuestionField}></textarea>
                </div>
                <div className={'col-3'}>
                    <button type="button" className="btn btn-primary w-100 h-100" onClick={questionAsk}><i
                        className="fas fa-paper-plane" style={{paddingRight: '10px'}}></i>Send
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Room;
