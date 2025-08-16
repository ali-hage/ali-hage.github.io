import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

type Obstacle = {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  type: 'rock' | 'whale';
};

@Component({
  selector: 'app-ship-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ship-game.component.html',
  styleUrls: ['./ship-game.component.css']
})
export class ShipGameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  // Low-res internal size for pixel look; CSS scales it up.
  private readonly W = 256;
  private readonly H = 144;
  private rafId = 0;
  private running = false;
  private started = false;
  private gameOver = false;
  private hovered = false;
  private time = 0;
  private spawnTimer = 0;
  private score = 0;
  private best = 0;

  private ship = { x: 28, y: 66, w: 44, h: 18 };
  private targetX = 28; // desired x based on mouse
  private targetY = 66; // desired y based on mouse
  private obstacles: Obstacle[] = [];
  private canvasEl!: HTMLCanvasElement;
  private shipImg?: HTMLImageElement;
  private shipImgReady = false;
  private rockImg?: HTMLImageElement;
  private rockImgReady = false;
  private whaleImg?: HTMLImageElement;
  private whaleImgReady = false;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.canvasEl = canvas;
    canvas.width = this.W;
    canvas.height = this.H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;

    // Controls: mouse/pointer to steer horizontally
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    // Fallback: Space/Enter to retry
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);

    // Initialize positions without starting
    this.running = false;
    this.started = false;
    this.gameOver = false;
    this.hovered = false;
    this.time = 0;
    this.spawnTimer = 0;
    this.score = 0;
    this.obstacles = [];
    this.ship.x = 28;
    this.ship.y = this.H / 2 - this.ship.h / 2;

    // Try to load external sprite (optional)
    const img = new Image();
    img.src = 'assets/ship.png';
    img.decoding = 'async';
    img.onload = () => {
      this.shipImg = img;
      this.shipImgReady = true;
    };
    img.onerror = () => {
      this.shipImg = undefined;
      this.shipImgReady = false;
    };
    const rimg = new Image();
    rimg.src = 'assets/rock.png';
    rimg.decoding = 'async';
    rimg.onload = () => {
      this.rockImg = rimg;
      this.rockImgReady = true;
    };
    rimg.onerror = () => {
      this.rockImg = undefined;
      this.rockImgReady = false;
    };
    const wimg = new Image();
    wimg.src = 'assets/whale.png';
    wimg.decoding = 'async';
    wimg.onload = () => {
      this.whaleImg = wimg;
      this.whaleImgReady = true;
    };
    wimg.onerror = () => {
      this.whaleImg = undefined;
      this.whaleImgReady = false;
    };
    // Hover pause listeners
    this.handlePointerEnter = this.handlePointerEnter.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    canvas.addEventListener('pointerenter', this.handlePointerEnter);
    canvas.addEventListener('pointerleave', this.handlePointerLeave);

    this.loop = this.loop.bind(this);
    this.rafId = requestAnimationFrame(this.loop);
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.canvasEl) {
      this.canvasEl.removeEventListener('pointermove', this.handlePointerMove);
      this.canvasEl.removeEventListener('pointerdown', this.handlePointerDown);
      this.canvasEl.removeEventListener('pointerenter', this.handlePointerEnter);
      this.canvasEl.removeEventListener('pointerleave', this.handlePointerLeave);
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    const k = e.key;
    if ((k === ' ' || k === 'Enter')) {
      if (!this.started) {
        this.started = true; this.running = true; this.gameOver = false;
        this.time = 0; this.spawnTimer = 0; this.score = 0; this.obstacles = [];
      } else if (this.gameOver) {
        this.reset();
      } else if (!this.running && this.hovered) {
        this.running = true; // resume
      }
    }
  }

  private handlePointerDown(_: PointerEvent) {
    if (!this.started) {
      this.started = true; this.running = true; this.gameOver = false;
      this.time = 0; this.spawnTimer = 0; this.score = 0; this.obstacles = [];
      return;
    }
    if (this.gameOver) { this.reset(); return; }
    if (!this.running && this.hovered) { this.running = true; return; }
  }

  private handlePointerMove(e: PointerEvent) {
    const rect = this.canvasEl.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width * this.W;
    const my = (e.clientY - rect.top) / rect.height * this.H;
    this.targetX = Math.max(2, Math.min(this.W - 2 - this.ship.w, mx - this.ship.w / 2));
    this.targetY = Math.max(8, Math.min(this.H - 2 - this.ship.h, my - this.ship.h / 2));
  }

  private reset() {
    this.running = true;
    this.started = true;
    this.gameOver = false;
    this.time = 0;
    this.spawnTimer = 0;
    this.score = 0;
    this.obstacles = [];
    this.ship.x = 28;
    this.ship.y = this.H / 2 - this.ship.h / 2;
    this.targetX = this.ship.x;
    this.targetY = this.ship.y;
  }

  private loop(ts: number) {
    const dt = 1 / 60; // fixed timestep for consistency
    this.update(dt);
    this.render();
    this.rafId = requestAnimationFrame(this.loop);
  }

  private update(dt: number) {
    if (!this.running) return;
    this.time += dt;
    this.spawnTimer += dt;
    this.score += dt;

    // Difficulty scales with time (slower overall)
    const baseSpeed = 12 + Math.min(24, this.time * 2.4);
    const spawnEvery = Math.max(0.6, 1.6 - this.time * 0.03);

    // Ship controls: follow mouse with smoothing (both axes)
    const lerp = 0.22; // smoothing factor (0..1)
    this.ship.x += (this.targetX - this.ship.x) * lerp;
    this.ship.y += (this.targetY - this.ship.y) * lerp;
    // bounds
    if (this.ship.x < 2) this.ship.x = 2;
    if (this.ship.x + this.ship.w > this.W - 2) this.ship.x = this.W - 2 - this.ship.w;
    if (this.ship.y < 8) this.ship.y = 8;
    if (this.ship.y + this.ship.h > this.H - 2) this.ship.y = this.H - 2 - this.ship.h;

    // Spawn obstacles from right moving left
    if (this.spawnTimer >= spawnEvery) {
      this.spawnTimer = 0;
      const isWhale = Math.random() < 0.25;
      const w = isWhale ? 26 : 10 + Math.floor(Math.random() * 10);
      const h = isWhale ? 10 : 8 + Math.floor(Math.random() * 6);
      const y = 6 + Math.floor(Math.random() * (this.H - 12 - h));
      const x = this.W + w;
      const speed = baseSpeed + Math.random() * 18;
      this.obstacles.push({ x, y, w, h, speed, type: isWhale ? 'whale' : 'rock' });
      // Occasionally spawn a staggered pair
      if (Math.random() < 0.15) {
        const w2 = 8 + Math.floor(Math.random() * 14);
        const h2 = 6 + Math.floor(Math.random() * 8);
        const y2 = 6 + Math.floor(Math.random() * (this.H - 12 - h2));
        const s2 = baseSpeed * 0.8 + Math.random() * 14;
        this.obstacles.push({ x: this.W + w2 + 10, y: y2, w: w2, h: h2, speed: s2, type: 'rock' });
      }
    }

    // Move obstacles
    for (const o of this.obstacles) {
      o.x -= (o.speed * dt);
    }
    // Remove off-screen
    this.obstacles = this.obstacles.filter(o => o.x > -o.w - 10);

    // Collisions (use visual draw rects for accuracy)
    const shipBox = this.getShipHitbox();
    for (const o of this.obstacles) {
      const ob = this.getObstacleHitbox(o);
      if (this.aabb(shipBox.x, shipBox.y, shipBox.w, shipBox.h, ob.x, ob.y, ob.w, ob.h)) {
        this.running = false;
        this.gameOver = true;
        this.best = Math.max(this.best, Math.floor(this.score));
        break;
      }
    }
  }

  private render() {
    const c = this.ctx;
    // Background gradient (sky to deep sea)
    const g = c.createLinearGradient(0, 0, 0, this.H);
    g.addColorStop(0, '#072235');
    g.addColorStop(0.35, '#083C59');
    g.addColorStop(1, '#052032');
    c.fillStyle = g;
    c.fillRect(0, 0, this.W, this.H);
    // Sine-based wave ripples for a wavier ocean (slower drift)
    const t = this.time;
    for (let band = 0; band < 4; band++) {
      const baseY = 16 + band * 16;
      const color = band % 2 === 0 ? '#0F5D8F' : '#0B4970';
      c.fillStyle = color;
      for (let x = 0; x < this.W; x += 3) {
        const off = Math.sin(x * 0.10 + t * 1.0 + band) * 2 + Math.sin(x * 0.05 + t * 0.6) * 1;
        c.fillRect(x, Math.floor(baseY + off), 2, 1);
      }
    }

    // Draw ship (simple pixel art)
    this.drawShip();

    // Draw obstacles
    for (const o of this.obstacles) {
      const ox = Math.floor(o.x), oy = Math.floor(o.y);
      if (o.type === 'whale') {
        // Whale: external sprite if available, else pixel fallback
        if (this.whaleImgReady && this.whaleImg) {
          c.imageSmoothingEnabled = false;
          const img = this.whaleImg;
          const scale = Math.min(o.w / img.width, o.h / img.height);
          const dw = Math.max(1, Math.floor(img.width * scale));
          const dh = Math.max(1, Math.floor(img.height * scale));
          const dx = ox + Math.floor((o.w - dw) / 2);
          const dy = oy + Math.floor((o.h - dh) / 2);
          c.drawImage(img, dx, dy, dw, dh);
        } else {
          // Body
          c.fillStyle = '#4AC0FF';
          c.fillRect(ox, oy, o.w, o.h);
          // Fin
          c.fillStyle = '#2E88B8';
          c.fillRect(ox + Math.floor(o.w * 0.3), oy - 2, 4, 2);
          // Eye
          c.fillStyle = '#07344E';
          c.fillRect(ox + o.w - 4, oy + 2, 2, 2);
        }
      } else {
        // Rock: draw external sprite if available, else pixel block
        if (this.rockImgReady && this.rockImg) {
          c.imageSmoothingEnabled = false;
          const img = this.rockImg;
          const scale = Math.min(o.w / img.width, o.h / img.height);
          const dw = Math.max(1, Math.floor(img.width * scale));
          const dh = Math.max(1, Math.floor(img.height * scale));
          const dx = ox + Math.floor((o.w - dw) / 2);
          const dy = oy + Math.floor((o.h - dh) / 2);
          c.drawImage(img, dx, dy, dw, dh);
        } else {
          // Pixel rock with outline
          c.fillStyle = '#AAB2BA';
          c.fillRect(ox, oy, o.w, o.h);
          c.fillStyle = '#6B757E';
          c.fillRect(ox, oy + o.h - 2, o.w, 2);
        }
      }
    }

    // HUD
    c.fillStyle = '#E6F7FF';
    c.fillRect(0, 0, this.W, 10);
    c.fillStyle = '#063A4E';
    c.font = '8px monospace';
    c.fillText(
      `INCOMING →  MOUSE TO STEER  •  SCORE ${Math.floor(this.score).toString().padStart(3, '0')}  BEST ${this.best.toString().padStart(3, '0')}`,
      4, 8
    );

    if (!this.started) {
      c.fillStyle = 'rgba(0,0,0,0.55)';
      c.fillRect(0, 0, this.W, this.H);
      c.fillStyle = '#E6F7FF';
      c.font = '10px monospace';
      c.fillText('CLICK TO START', 76, Math.floor(this.H / 2));
    } else if (this.gameOver) {
      c.fillStyle = 'rgba(0,0,0,0.55)';
      c.fillRect(0, 0, this.W, this.H);
      c.fillStyle = '#E6F7FF';
      c.font = '10px monospace';
      c.fillText('COLLISION! CLICK OR SPACE TO RETRY', 10, Math.floor(this.H / 2));
    } else if (!this.running) {
      c.fillStyle = 'rgba(0,0,0,0.45)';
      c.fillRect(0, 0, this.W, this.H);
      c.fillStyle = '#E6F7FF';
      c.font = '10px monospace';
      c.fillText('PAUSED • HOVER + CLICK TO RESUME', 16, Math.floor(this.H / 2));
    }
  }

  private drawShip() {
    const c = this.ctx;
    const x = Math.floor(this.ship.x);
    const y = Math.floor(this.ship.y);
    const w = this.ship.w, h = this.ship.h;
    // If an external sprite exists, draw it scaled to w×h (pixelated)
    if (this.shipImgReady && this.shipImg) {
      c.imageSmoothingEnabled = false;
      const img = this.shipImg;
      const scale = Math.min(w / img.width, h / img.height);
      const dw = Math.max(1, Math.floor(img.width * scale));
      const dh = Math.max(1, Math.floor(img.height * scale));
      const dx = x + Math.floor((w - dw) / 2);
      const dy = y + Math.floor((h - dh) / 2);
      c.drawImage(img, dx, dy, dw, dh);
      return;
    }
    // Original pixel ship (side view), not a copy
    // 1) HULL
    c.fillStyle = '#163044';
    c.fillRect(x, y + 7, w - 6, h - 7); // main hull
    c.fillRect(x + 1, y + h - 4, 3, 3); // stern rounding
    // Bow taper (stepped nose)
    c.fillStyle = '#1F4A63';
    c.fillRect(x + w - 10, y + 8, 4, h - 9);
    c.fillRect(x + w - 6, y + 9, 3, h - 11);
    c.fillRect(x + w - 3, y + 10, 2, h - 13);
    // White stripe along hull
    c.fillStyle = '#DDE8F0';
    c.fillRect(x + 2, y + 9, w - 14, 1);
    // Red waterline
    c.fillStyle = '#B92B2B';
    c.fillRect(x + 2, y + h - 3, w - 14, 2);
    c.fillStyle = '#7E1C1C';
    c.fillRect(x + 2, y + h - 1, w - 18, 1);
    // 2) SUPERSTRUCTURE
    c.fillStyle = '#F7FAFC';
    c.fillRect(x + 10, y + 2, 18, 5); // lower deck
    c.fillRect(x + 16, y, 12, 3);     // bridge level
    // Windows band + visor
    c.fillStyle = '#7AC4E0';
    c.fillRect(x + 11, y + 3, 16, 2);
    c.fillStyle = '#C9D6DF';
    c.fillRect(x + 16, y + 1, 12, 1);
    // 3) FUNNEL + MAST
    c.fillStyle = '#E17D2F';
    c.fillRect(x + 28, y + 1, 3, 6);  // funnel
    c.fillStyle = '#1A1A1A';
    c.fillRect(x + 28, y, 3, 1);      // funnel cap
    c.fillStyle = '#E6EDF2';
    c.fillRect(x + 33, y - 3, 1, 4);  // slim mast
    // 4) LIFEBOATS
    c.fillStyle = '#E98B3A';
    c.fillRect(x + 12, y + 7, 3, 1);
    c.fillRect(x + 17, y + 7, 3, 1);
    // 5) WAKE (left of stern)
    const t = (this.time * 60) | 0;
    c.fillStyle = 'rgba(255,255,255,0.45)';
    c.fillRect(x - 7 - (t % 5), y + h - 3, 9, 2);
    c.fillRect(x - 12 - (t % 7), y + h - 4, 6, 1);
  }

  private handlePointerEnter() {
    this.hovered = true;
  }

  private handlePointerLeave() {
    this.hovered = false;
    if (this.running) this.running = false;
  }

  // Get the rect used for obstacle collisions (matches visual draw rects)
  private getObstacleHitbox(o: Obstacle) {
    const base = { x: Math.floor(o.x), y: Math.floor(o.y), w: o.w, h: o.h };
    if (o.type === 'rock' && this.rockImgReady && this.rockImg) {
      const img = this.rockImg;
      const scale = Math.min(o.w / img.width, o.h / img.height);
      const w = Math.max(1, Math.floor(img.width * scale));
      const h = Math.max(1, Math.floor(img.height * scale));
      const x = base.x + Math.floor((o.w - w) / 2);
      const y = base.y + Math.floor((o.h - h) / 2);
      return { x, y, w, h };
    }
    if (o.type === 'whale' && this.whaleImgReady && this.whaleImg) {
      const img = this.whaleImg;
      const scale = Math.min(o.w / img.width, o.h / img.height);
      const w = Math.max(1, Math.floor(img.width * scale));
      const h = Math.max(1, Math.floor(img.height * scale));
      const x = base.x + Math.floor((o.w - w) / 2);
      const y = base.y + Math.floor((o.h - h) / 2);
      return { x, y, w, h };
    }
    return base;
  }

  // Compute the ship's collision rectangle to match what is drawn on screen
  private getShipHitbox() {
    // Default to the ship's bounding box
    const box = { x: Math.floor(this.ship.x), y: Math.floor(this.ship.y), w: this.ship.w, h: this.ship.h };
    // If using an external sprite, replicate the draw scaling to tighten the hitbox
    if (this.shipImgReady && this.shipImg) {
      const img = this.shipImg;
      const scale = Math.min(this.ship.w / img.width, this.ship.h / img.height);
      const w = Math.max(1, Math.floor(img.width * scale));
      const h = Math.max(1, Math.floor(img.height * scale));
      const x = box.x + Math.floor((this.ship.w - w) / 2);
      const y = box.y + Math.floor((this.ship.h - h) / 2);
      return { x, y, w, h };
    }
    return box;
  }

  private aabb(ax: number, ay: number, aw: number, ah: number,
               bx: number, by: number, bw: number, bh: number) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }
}
