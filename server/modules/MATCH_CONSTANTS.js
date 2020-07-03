module.exports = {
    redPalyersSpawn: '0 1.6 -50',
    bluePalyersSpawn: '0 1.6 50',
    stat: {
        tower: {
            health: 500,
            def: 25,
            damage: 120
        },
        cript: {
            health: 100,
            def: 10,
            damage: 50,
            speedPerSecond: 1
        },
        player: {
            health: 100,
            def: 15,
            damage: 100,
            speedPerSecond: 2.5
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

    }
};


// function nextPosition({from, to, dist}){
//     console.log('IN:', {from, to, dist});
//     const dX = from.x - to.x;
//     const dZ = from.z - to.z;
//     const deg = Math.atan(dX / dZ) * 57.29;
//     console.log(deg);

//      const dXn = Math.cos(deg) * dist;
//     const dYn = Math.sin(deg) * dist;
//     console.log({dXn, dYn});
//     }

//     const from =  {x: -2, y: 1.2, z: -80 }; // респ
//     const to ={x: -12, y: 1.2, z: -71}; // выход через бок
//     const dist = 1;

//     nextPosition({from, to, dist});
