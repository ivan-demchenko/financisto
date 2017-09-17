import * as React from 'react';
import { connect } from 'react-redux';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { merge } from 'ramda';

const editCSV = (code) => ({
    type: 'EDIT_CSV',
    code
});

const postCSV = (code) => ({
    type: 'POST_CSV',
    code
});

const receivedFeedback = (data) => ({
    type: 'POST_CSV_SUCCESS',
    data
});

const initial = {
    code: ''
};

export const sendDataEpic = (action$) =>
    action$.ofType('POST_CSV')
        .flatMap(action => 
            fromPromise(fetch('/api/csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    csv: action.code
                })
            }))
        )
        .do(resp => console.log(resp))
        .map(receivedFeedback)

export const reducer = (state = initial, action) => {
    switch(action.type) {
        case 'EDIT_CSV':
            return merge(state, {code: action.code});

        case 'POST_CSV':
            return state;

        case 'POST_CSV_SUCCESS':
            return state;

        default:
            return state;

    }
};

const view = (state) =>
    <div>
        <textarea onChange={(e) => state.editCSV(e.target.value)} value={state.code}></textarea>
        <button onClick={() => state.postCSV(state.code)}>Do it!</button>
    </div>;

export default connect(
    (state) => state.csvInput,
    { editCSV, postCSV, receivedFeedback }
)(view);
