const r = require('ramda');

module.exports = r.cond([
    [ r.test(/PARKING/ig)
    , r.always('Parking')
    ],
    [ r.test(/COLES|BAKERSDELIGHT|CELLARBRATIONS|LIQUORLAND|V\/CELLARS|The Junction Coffee/ig)
    , r.always('Food and drinks')
    ],
    [ r.test(/THE MORRISON BAR|SYDNEY TOWER EYE|CAFFE|Cafe|Scenic World Katoomba|ROYAL COPENHAGEN/ig)
    , r.always('Having fun')
    ],
    [ r.test(/H AND M/ig)
    , r.always('Clothings')
    ],
    [ r.test(/Burns Bay Medical|NATIONAL HOME DOCTOR|RNS HOSP EMERGENCY|Pharm/ig)
    , r.always('Medical/Pharmacy')
    ],
    [ r.test(/CHEMIST|TARGET|IKEA|Kidstuff|GOODGUYS/ig)
    , r.always('Chemist/Home stuff')
    ],
    [ r.test(/KATHMANDU|99 BIKES/ig)
    , r.always('Sports')
    ],
    [ r.test(/TPG Internet/ig)
    , r.always('Internet/Mobile')
    ],
    [ r.test(/OPAL|ETOLL|CABS/ig)
    , r.always('Transport')
    ],
    [ r.test(/atlassian/ig)
    , r.always('Income')
    ],
    [ r.test(/PYMT RAINE AND|LOCKSMITHS/ig)
    , r.always('Rent')
    ],
    [ r.T
    , r.always('Unknown')
    ]
]);