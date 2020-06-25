module.exports = {
    mathDist3D(t1, t2) {
        try {
            const dX = t1.x - t2.x;
            const dY = t1.y - t2.y;
            const dZ = t1.z - t2.z;
            return Math.sqrt(dX * dX + dY * dY + dZ * dZ);
        } catch (e) {
            console.log('mathDist3D:', e);
        }
    },
    mathDist2D(t1, t2) {
        try {
            const dX = t1.x - t2.x;
            const dZ = t1.z - t2.z;
            return Math.sqrt(dX * dX + dZ * dZ);
        } catch (e) {
            console.log('mathDist3D:', e);
        }
    },
    // коррдинаты в сторону точки с отступом
    nextPosition({ from, to, dist, metr }) {
        metr = metr || this.mathDist2D(from, to);
        const L = dist / (metr - dist);
        const x = (from.x + L * to.x) / (1 + L);
        const z = (from.z + L * to.z) / (1 + L);
        return { x, y: from.y, z};
    }
};
