module.exports = {
    redPalyersSpawn: '0 1.6 -10',
    bluePalyersSpawn: '0 1.6 10',
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
            }
        ]
    }
};
