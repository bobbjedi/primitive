import _ from 'underscore';

/* global AFRAME, THREE */

/**
 * Implement AABB collision detection for entities with a mesh.
 * (https://en.wikipedia.org/wiki/Minimum_bounding_box#Axis-aligned_minimum_bounding_box)
 * It sets the specified state on the intersected entities.
 *
 * @property {string} objects - Selector of the entities to test for collision.
 * @property {string} state - State to set on collided entities.
 *
 */

AFRAME.registerComponent('aabb-collider', {
    schema: {
        objects: { default: '.collide-body' },
        state: { default: 'collided' }
    },

    init: function () {
        this.els = [];
        this.collisions = [];
        this.elMax = new THREE.Vector3();
        this.elMin = new THREE.Vector3();
        this.lastValidPosition = null;
        document.addEventListener('updateCollideElements', ()=> this.update());
    },

    /**
     * Update list of entities to test for collision.
     */
    update: function () {
        var data = this.data;
        var objectEls;

        // Push entities into list of els to intersect.
        if (data.objects) {
            objectEls = this.el.sceneEl.querySelectorAll(data.objects);
        } else {
            // If objects not defined, intersect with everything.
            objectEls = this.el.sceneEl.children;
        }
        // Convert from NodeList to Array
        this.els = Array.prototype.slice.call(objectEls);
        // console.log('Update collide');
    },

    tick: (_.throttle(function () {
        var boundingBox = new THREE.Box3();
        return function () {
            var collisions = [];
            var el = this.el;
            var mesh = el.getObject3D('mesh');
            var self = this;
            // No mesh, no collisions
            if (!mesh) { return; }
            // Update the bounding box to account for rotations and
            // position changes.
            updateBoundingBox();
            // Update collisions.
            this.els.forEach(intersect);
            // Emit events.
            collisions.forEach(handleHit);
            // No collisions.
            if (collisions.length === 0) {
                // self.el.lastValidPosition = $u.getElPosition(self.el);
                self.el.emit('notcollide', { el: null });
            }
            // Updated the state of the elements that are not intersected anymore.
            this.collisions.filter(function (el) {
                return collisions.indexOf(el) === -1;
            }).forEach(function removeState(el) {
                el.removeState(self.data.state);
            });
            // Store new collisions
            this.collisions = collisions;

            // AABB collision detection
            function intersect(el) {
                var intersected;
                var mesh = el.getObject3D('mesh');
                var elMin;
                var elMax;
                if (!mesh) { return; }
                boundingBox.setFromObject(mesh);
                elMin = boundingBox.min;
                elMax = boundingBox.max;
                // Bounding boxes are always aligned with the world coordinate system.
                // The collision test checks for the conditions where cubes intersect.
                // It's an extension to 3 dimensions of this approach (with the condition negated)
                // https://www.youtube.com/watch?v=ghqD3e37R7E
                intersected = (self.elMin.x <= elMax.x && self.elMax.x >= elMin.x) &&
                    (self.elMin.y <= elMax.y && self.elMax.y >= elMin.y) &&
                    (self.elMin.z <= elMax.z && self.elMax.z >= elMin.z);
                if (!intersected) { return; }
                collisions.push(el);
            }

            function handleHit(hitEl) {
                // playerCollide(hitEl, self.lastValidPosition);
                self.el.emit('collide', { el: hitEl });
            }

            function updateBoundingBox() {
                boundingBox.setFromObject(mesh);
                self.elMin.copy(boundingBox.min);
                self.elMax.copy(boundingBox.max);
            }
        };
    }, 330))()
});
