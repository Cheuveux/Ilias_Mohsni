const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduce) {
	//Création du conteneur
	const container = document.createElement("div");
	container.className = "ascii-bg";
	const canvas = document.createElement("canvas");
	container.appendChild(canvas);
	document.body.appendChild(container);
	const ctx = canvas.getContext("2d");

	//Options à personnaliser
	const opts = {
		charSize: 14,
		font:'14px "Courier New", monospace',
		density: 0.08,
		speedMin: 300,
		speedMax: 900,
		spawnInterval: 450,
		trailLength:35,
		color: '#E8F0FF',
		bgColor: 'rgba(0, 0, 0, 0)'
	};

	function resize() {
		const dpr = Math.max(1, window.devicePixelRatio || 1);
		canvas.width = Math.floor(window.innerWidth * dpr);
		canvas.height = Math.floor(window.innerHeight * dpr);
		canvas.style.width = window.innerWidth + 'px';
		canvas.style.height = window.innerHeight + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.font = opts.font;
		ctx.textBaseline = 'top';
	}
	window.addEventListener('resize', resize);
	resize();

	const random = (a, b) => a + Math.random() * (b - a);

	class ShootingStar {
		constructor () {
			const startFromTop = Math.random() < 0.6;
			if(startFromTop) {
				this.x = random(0, window.innerWidth * 0.6);
				this.y = random(-50, -10);
			}
			else {
				this.x = random(-50, -10);
				this.y = random(0, window.innerWidth * 0.6);
			}
			//Direction : vers bas-droite avec variation
			const angle = random(Math.PI / 6, Math.PI / 4); //entre 30° et 45°
			const speed = random(opts.speedMin, opts.speedMax) /1000; //px par millisecondes
			this.vx = Math.cos(angle) * speed;
			this.vy = Math.sin(angle) * speed;
			this.life = random(800,1600);
			this.age = 0;
			this.trail = Math.floor(random(opts.trailLength - 2, opts.trailLength + 2));
			this.chars = Array.from ({length: this.trail}, (_,i) => (Math.random() < 0.7 ? '*' : '.'));
			this.brightness = random(0.6, 1);
		}
		update(dt) {
			this.x += this.vx *dt;
			this.y += this.vy * dt;
			this.age += dt;
			return  this.age < this.life &&
							this.x < window.innerWidth + 50 &&
							this.y < window.innerHeight + 50;
		}
		draw(ctx) {
			const px = opts.charSize;
			let i = 0;
			while(i < this.trail) {
				const t = i / this.trail;
				//position par rapport à la tête
				const tx = this.x - this.vx * (i * px * 0.8);
				const ty = this.y - this.vy * (i * px * 0.8);
				const alpha = (1 - t) * (1 - this.age / this.life) * this.brightness;
				ctx.fillStyle = hexToRgba(opts.color, alpha * 0.95);
				ctx.fillText(this.chars[i] || '*', tx, ty);
				i++;
			}
		}
	}

	function hexToRgba(hex, a = 1) {
		let r = 255;
		let g = 255;
		let b = 255;
		if(!hex) return `rgba(255, 255, 255, ${a})`;
		const c = hex.replace('#', '');
		if(c.length === 3) {
			r = parseInt(c[0] + c[0], 16);
			g = parseInt(c[1] + c[1], 16);
			b = parseInt(c[2] + c[2], 16);
		} else {
			r = parseInt(c.substring(0, 2), 16);
			g = parseInt(c.substring(2, 4), 16);
			b = parseInt(c.substring(4, 6), 16);
		}
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}

	const stars = [];
	let lastSpawn = 0;

	//Animation loop
	let prev = performance.now();
	function loop(now) {
		const dt = now - prev;
		prev = now;
		spawnIfNeeded(now);
		//update and draw stars
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		let i = stars.length - 1;
		while (i >= 0)
		{
			const s = stars[i];
			const alive = s.update(dt);
			if(!alive) {
				stars.splice(i, 1);
				i--;
				continue;
			}
			s.draw(ctx);
			i--;
		}
		const staticCount = Math.floor((window.innerWidth * window.innerHeight) / 30000);
		ctx.fillStyle = hexToRgba('#ffffff', 0.03);
		let j = 0;
		while (j < staticCount) {
			if(Math.random() < 0.002) {
				const x = Math.random() *window.innerWidth;
				const y = Math.random() *window.innerHeight;
				ctx.fillText('.', x, y);
			}
			j++;
		}
		requestAnimationFrame(loop);
	}

	function spawnIfNeeded(now) {
		if (now - lastSpawn < opts.spawnInterval)
			return;
		lastSpawn = now
		const area = window.innerWidth * window.innerHeight;
		const expected = area * opts.density;
		const count = Math.random() < 0.35 ? 0 : Math.round(random(0, Math.min (3, expected / 10000)));
		let i = 0;
		while(i < count) {
			stars.push(new ShootingStar());
			i++;
		}
		if (Math.random() < 0.25)
			stars.push(new ShootingStar());
	}

	requestAnimationFrame(loop);

	window.__ASCII_STARS = {
		options: opts,
		stop: () => {
			if(container.parentNode)
				container.parentNode.removeChild(container);
		}
	};
}