module.exports = {
    redPalyersSpawn: '0 1.6 -90',
    bluePalyersSpawn: '0 1.6 90',
    stat: {
        tower: {
            basePrizeExp: 200,
            health: 300,
            def: 25,
            damage: 80,
        },
        cript: {
            basePrizeExp: 100,
            health: 100,
            def: 10,
            damage: 30,
            speedPerSecond: 1
        },
        player: {
            basePrizeExp: 200,
            health: 100,
            def: 15,
            damage: 100,
            speedPerSecond: 2.5,
            exp_1lvl: 300,
            respawnTime: 30,
            expCoef: 1
        }

    },
    towers: {
        red: [{
            id: 'tower-red-1',
            position: { x: 0, y: 1, z: -30 }
        },
        {
            id: 'tower-red-2',
            position: { x: -12, y: 1, z: -73 }
        }, {
            id: 'tower-red-3',
            position: { x: 12, y: 1, z: -73 }
        }, {
            id: 'tower-red-4',
            position: { x: 0, y: 1, z: -95 },
            isBase: true
        }
        ],
        blue: [
            {
                id: 'tower-blue-1',
                position: { x: 0, y: 1, z: 30 }
            }, {
                id: 'tower-blue-2',
                position: { x: -12, y: 1, z: 73 }
            }, {
                id: 'tower-blue-3',
                position: { x: 12, y: 1, z: 73 }
            },
            {
                id: 'tower-blue-4',
                position: { x: 0, y: 1, z: 95 },
                isBase: true
            }
        ]
    },
    cripts: {
        red: {
            points: [
                {x: -4, y: 1.2, z: -80 }, // респ
                {x: -9, y: 1.2, z: -71}, // выход через бок
                {x: -3, y: 1.2, z: -65}, // к центральной дороге
                { x: -3, y: 1.2, z: 40 }, // к центральной дороге на стороне противника
                { x: 0, y: 1.2, z: 60 }, // к центру базы
                { x: -9, y: 1.2, z: 71 }, // вход через бок
                { x: -4, y: 1.2, z: 80 }, // база противника

                {x: -4, y: 1.2, z: -80 }, // респ - обратно чтоб не глючило
                { x: -4, y: 1.2, z: 80 } // база противника
            ]
        },
        blue: {
            points: [
                {x: -4, y: 1.2, z: 80 }, // респ
                {x: -9, y: 1.2, z: 71}, // выход через бок
                {x: -3, y: 1.2, z: 65}, // к центральной дороге
                { x: -3, y: 1.2, z: -40 }, // к центральной дороге на стороне противника
                { x: 0, y: 1.2, z: -60 }, // к центру базы
                { x: -9, y: 1.2, z: -71 }, // вход через бок
                { x: -4, y: 1.2, z: -80 }, // база противника

                {x: -4, y: 1.2, z: -80 }, // респ - обратно чтоб не глючило
                { x: -4, y: 1.2, z: -80 }, // база противника - обратно чтоб не глючило
            ]
        }

    },
    respawnTimeRB: 180,
    RBs: [
        {
            id: 'rb-1',
            position: { x: 0, y: 1, z: -95 },
            zone: { maxX: 0, minX: 0, maxZ: 0, minZ: 0 }
        }
    ]
};
