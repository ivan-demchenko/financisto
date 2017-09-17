import * as React from 'react';
import { connect } from 'react-redux';
import r from 'ramda';
import "./GroupedData.styl";

const receivedGroupedData = (data) => ({
    type: 'POST_CSV_SUCCESS',
    data
});

const initial = {
    data: {}
};

export const reducer = (state = initial, action) => {
    switch(action.type) {
        case 'POST_CSV_SUCCESS':
            return { data: action.data };

        default:
            return state;

    }
};

const view = (state) =>
    <div className="grouped-data">
        <pre>{JSON.stringify(state.data.grouped, null, 2)}</pre>
    </div>;

export default connect(
    (state) => state.groupedData,
    { receivedGroupedData }
)(view);
