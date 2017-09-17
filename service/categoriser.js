const r = require('ramda');

module.exports = r.cond([
    [ r.test(/PARKING/ig)
    , r.always('Parking')
    ],
    [ r.test(/COLES|BAKERSDELIGHT|CELLARBRATIONS|SULU 33|GROCER|LIQUORLAND|V\/CELLARS|The Junction Coffee/ig)
    , r.always('Food and drinks')
    ],
    [ r.test(/THE MORRISON BAR|SYDNEY TOWER EYE|ICE CREAM|Mecca Espresso|BAR|PATISS|PATISSERIES|CAFFE|Cafe|Scenic World Katoomba|ROYAL COPENHAGEN/ig)
    , r.always('Having fun')
    ],
    [ r.test(/H AND M|TK MAXX/ig)
    , r.always('Clothings')
    ],
    [ r.test(/Burns Bay Medical|iHerb|LAVERTY|NATIONAL HOME DOCTOR|RNS HOSP EMERGENCY|Pharm/ig)
    , r.always('Medical/Pharmacy')
    ],
    [ r.test(/CHEMIST|TARGET|IKEA|JB HI FI|KARCHER|Kidstuff|GOODGUYS|HOT DOLLAR/ig)
    , r.always('Chemist/Home stuff')
    ],
    [ r.test(/KATHMANDU|99 BIKES/ig)
    , r.always('Sports')
    ],
    [ r.test(/TPG Internet|AMAYSIM|OPTUS/ig)
    , r.always('Internet/Mobile')
    ],
    [ r.test(/OPAL|ETOLL|WHARF|CABS|NEWS EXPRESS PARRAMATTA/ig)
    , r.always('Transport')
    ],
    [ r.test(/atlassian/ig)
    , r.always('Income')
    ],
    [ r.test(/TFR Westpac eSa/ig)
    , r.always('Savings')
    ],
    [ r.test(/PYMT RAINE AND|LOCKSMITHS/ig)
    , r.always('Rent')
    ],
    [ r.T
    , r.always('Unknown')
    ]
]);