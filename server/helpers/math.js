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
    }
};
