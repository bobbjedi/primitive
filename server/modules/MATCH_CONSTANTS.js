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
        },
        rb: {
            basePrizeExp: 200,
            health: 100,
            def: 25,
            damage: 80
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
                // {x: 66, y: 1, z: -80 }, // респ рб
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
            id: 'rb-1', // зеленая зона со стороны красных
            color: 'green',
            position: { x: 66, y: 1.3, z: -88 },
            zone: { maxX: 75, minX: 57, maxZ: -65, minZ: -100 },
            nextPoint: {x: 66, y: 1.2, z: 80}, // поворот по дефолту
            respTime: 3 // время одживания в min
        },
        {
            id: 'rb-2', // зеленая зона со стороны красных
            color: 'green',
            position: { x: 66, y: 1.3, z: 88 },
            zone: { maxX: 75, minX: 60, maxZ: 100, minZ: 60 },
            nextPoint: {x: 66, y: 1.2, z: -80}, // поворот по дефолту
            respTime: 3 // время одживания в min
        },
        {
            id: 'rb-3', // зеленая зона со стороны красных
            color: 'yellow',
            position: { x: -63, y: 1.3, z: 80 },
            zone: { maxX: -59, minX: -75, maxZ: 100, minZ: 60 },
            nextPoint: {x: 66, y: 1.2, z: -80}, // поворот по дефолту
            respTime: 3 // время одживания в min
        },
        {
            id: 'rb-4', // зеленая зона со стороны красных
            color: 'yellow',
            position: { x: -67, y: 1.3, z: -85 },
            zone: { maxX: -55, minX: -75, maxZ: -60, minZ: -100 },
            nextPoint: {x: 66, y: 1.2, z: -80}, // поворот по дефолту
            respTime: 3 // время одживания в min
        },
        {
            id: 'rb-5', // зеленая зона со стороны красных
            color: 'orange',
            position: { x: 62, y: 1.4, z: 8 },
            zone: { maxX: 61, minX: 45, maxZ: 12, minZ: -22 },
            nextPoint: {x: 66, y: 1.2, z: -80}, // поворот по дефолту
            respTime: 5 // время одживания в min
        },
        {
            id: 'rb-6', // зеленая зона со стороны красных
            color: 'orange',
            position: { x: -68, y: 1.4, z: 0 },
            zone: { maxX: -45, minX: -71, maxZ: 15, minZ: -15 },
            nextPoint: {x: 66, y: 1.2, z: -80}, // поворот по дефолту
            respTime: 5 // время одживания в min
        },
        {
            id: 'rb-7', // зеленая зона со стороны красных
            color: 'orange',
            position: { x: -70, y: 1.4, z: 3 },
            zone: { maxX: -45, minX: -71, maxZ: 15, minZ: -15 },
            nextPoint: {x: 66, y: 1.2, z: -80}, // поворот по дефолту
            respTime: 5 // время одживания в min
        },
        {
            id: 'rb-8', // зеленая зона со стороны красных
            color: 'orange',
            position: { x: -70, y: 1.4, z: -3 },
            zone: { maxX: -45, minX: -71, maxZ: 15, minZ: -15 },
            nextPoint: {x: 66, y: 1.2, z: -80}, // поворот по дефолту
            respTime: 5 // время одживания в min
        }
    ]
};
