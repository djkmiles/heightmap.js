function Terrain(detail) {
	this.minZ = 9999;
	this.maxZ = null;
	this.size = Math.pow(2, detail) + 1;
	this.max = this.size - 1;
	this.map = new Float32Array(this.size * this.size);
}

Terrain.prototype.get = function(x, y) {
	if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
	return this.map[x + this.size * y];
};

Terrain.prototype.set = function(x, y, val) {
	this.map[x + this.size * y] = val;
	if (val > this.maxZ) this.maxZ = val;
	if (val < this.minZ) this.minZ = val;
};

Terrain.prototype.generate = function(roughness) {
	var self = this;

	this.set(0, 0, self.max);
	this.set(this.max, 0, self.max / 2);
	this.set(this.max, this.max, 0);
	this.set(0, this.max, self.max / 2);

	divide(this.max);

	function divide(size) {
		var x, y, half = size / 2;
		var scale = roughness * size;
		if (half < 1) return;

		for (y = half; y < self.max; y += size) {
			for (x = half; x < self.max; x += size) {
				square(x, y, half, Math.random() * scale * 2 - scale);
			}
		}
		for (y = 0; y <= self.max; y += half) {
			for (x = (y + half) % size; x <= self.max; x += size) {
				diamond(x, y, half, Math.random() * scale * 2 - scale);
			}
		}
		divide(size / 2);
	}

	function average(values) {
		var valid = values.filter(function(val) { return val !== -1; });
		var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
		return total / valid.length;
	}

	function square(x, y, size, offset) {
		var ave = average([
self.get(x - size, y - size),   // upper left
self.get(x + size, y - size),   // upper right
self.get(x + size, y + size),   // lower right
self.get(x - size, y + size)    // lower left
]);
		self.set(x, y, ave + offset);
	}

	function diamond(x, y, size, offset) {
		var ave = average([
self.get(x, y - size),      // top
self.get(x + size, y),      // right
self.get(x, y + size),      // bottom
self.get(x - size, y)       // left
]);
		self.set(x, y, ave + offset);
	}

	this.rangeZ = Math.abs(this.maxZ - this.minZ)
};

Terrain.prototype.draw = function(ctx, width, height) {
	var self = this;

	for (var y = 0; y < this.size; y++) {
		for (var x = 0; x < this.size; x++) {
			var val = this.get(x, y);
			ctx.fillStyle = brightness(val);
			ctx.fillRect(x, y, x + 1, y + 1);
		}
	}

	function rect(a, b, style) {
		if (b.y < a.y) return;
		ctx.fillStyle = style;
		ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
	}

	function brightness(z) {
		var b = Math.round(Math.abs(z - self.minZ) / self.rangeZ * 255);
		return ['rgba(', b, ',', b, ',', b, ',1)'].join('');
	}
};
