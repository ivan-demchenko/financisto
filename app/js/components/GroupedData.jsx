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

const renderCategories = (month, cats) => r.compose(
    r.map(([cat, val]) =>
    <div className="gd-category" key={'c' + cat}>
        <a href="#" className="gd-category__name">{cat}</a>
        <div className="gd-category__val">{val}</div>
    </div>),
    r.toPairs
)(cats);

const renderMonths = r.compose(
    r.map(([month, cats]) =>
    <div className='gd-month' key={'m' + month}>
        <strong className='gd-month__label'>{month}</strong>,
        <div className="gd-categories">{renderCategories(month, cats)}</div>
    </div>),
    r.toPairs
);

const view = (state) =>
    <div className="grouped-data">
        {renderMonths(state.data.grouped)}
    </div>;

export default connect(
    (state) => state.groupedData,
    { receivedGroupedData }
)(view);
