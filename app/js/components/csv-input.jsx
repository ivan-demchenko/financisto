import * as React from 'react';
import { connect } from 'react-redux';

const editCSV = (code) => ({
    type: 'EDIT_CSV',
    code
});

const initial = {
    code: ''
};

const reducer = (state, action) => {
    switch(action.type) {
        case 'EDIT_CSV':
            return {...state, ...{code: action.code}}
    }
};

const view = (state) =>
    <div>
        <textarea onChange={(e) => state.editCSV(e.target.value)} value={state.code}></textarea>
        <button onClick={state}>Do it!</button>
    </div>;

export default connect(
    (state) =>
    { editCSV }
)(view);
