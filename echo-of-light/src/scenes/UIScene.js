export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }
  create() {
    // Create UI panel background
    const panel = this.add.image(80, 40, 'box')
      .setScale(2)
      .setScrollFactor(0)
      .setAlpha(0.8);
    
    // Add icons
    const healthIcon = this.add.sprite(20, 30, 'icons', 0) // Health icon
      .setScale(1.5)
      .setScrollFactor(0);
    
    const fragIcon = this.add.sprite(20, 60, 'icons', 4) // Fragment icon
      .setScale(1.5)
      .setScrollFactor(0);
    
    // Create HUD text with improved styling
    this.fragText = this.add.text(40, 52, '', { 
      font: '16px monospace', 
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 2
    }).setScrollFactor(0);
    
    this.healthText = this.add.text(40, 22, '', { 
      font: '16px monospace', 
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 2 
    }).setScrollFactor(0);

    // Health bar graphics (background + fill) - fixed on screen
    this.healthBar = this.add.graphics().setScrollFactor(0);
    this.healthBarBg = { x: 40, y: 14, w: 100, h: 10 };
    // small minimap graphics (top-right)
    this.minimap = this.add.graphics().setScrollFactor(0);
    this.minimapConfig = { tileSize: 6, padding: 8 };

    // listen to GameScene events
    const game = this.scene.get('GameScene');
    if (game) {
      game.events.on('updateHUD', (data) => {
        this.fragText.setText(`Fragments: ${data.fragments}`);
        this.healthText.setText(`Health: ${data.health}/${data.maxHealth}`);
        this.updateHealthBar(data.health, data.maxHealth);
      });
      game.events.on('playerHit', (data) => {
        this.healthText.setText(`Health: ${data.health}/${data.maxHealth}`);
        this.updateHealthBar(data.health, data.maxHealth);
      });
    }

    // update initial fragments from storage
    const frags = parseInt(localStorage.getItem(window.EOL.storageKey) || '0', 10);
    this.fragText.setText(`Fragments: ${frags}`);

    // draw initial empty health bar (full by default)
    const storedUpgrades = (this.scene.get('HomeScene') && this.scene.get('HomeScene').upgrades) || {};
    const defaultMax = 10 + ((storedUpgrades.health||0) * 10);
    this.updateHealthBar(defaultMax, defaultMax);
  }

  updateHealthBar(current, max) {
    if (!this.healthBar) return;
    const cfg = this.healthBarBg;
    const pct = Phaser.Math.Clamp((current || 0) / (max || 1), 0, 1);
    this.healthBar.clear();
    // background
    this.healthBar.fillStyle(0x222222, 0.9);
    this.healthBar.fillRect(cfg.x - 2, cfg.y - 2, cfg.w + 4, cfg.h + 4);
    // empty bar
    this.healthBar.fillStyle(0x444444, 1);
    this.healthBar.fillRect(cfg.x, cfg.y, cfg.w, cfg.h);
    // fill
    this.healthBar.fillStyle(0xff4444, 1);
    this.healthBar.fillRect(cfg.x, cfg.y, Math.ceil(cfg.w * pct), cfg.h);
  }

  update() {
    // draw minimap by polling GameScene map/player
    const game = this.scene.get('GameScene');
    if (!game || !game.map) return;
    const map = game.map;
    const rs = map.length;
    const ts = this.minimapConfig.tileSize;
    const pad = this.minimapConfig.padding;
    const mmW = rs * ts;
    const mmH = rs * ts;
    const mmX = Math.max(8, this.cameras.main.width - mmW - pad);
    const mmY = pad;

    this.minimap.clear();
    // background box
    this.minimap.fillStyle(0x000000, 0.6);
    this.minimap.fillRect(mmX - 4, mmY - 4, mmW + 8, mmH + 8);

    // draw map tiles
    for (let y = 0; y < rs; y++) {
      for (let x = 0; x < rs; x++) {
        const v = map[y][x];
        if (v === 1) {
          this.minimap.fillStyle(0x333333, 1); // wall
        } else {
          this.minimap.fillStyle(0x999999, 1); // floor
        }
        this.minimap.fillRect(mmX + x * ts, mmY + y * ts, ts - 1, ts - 1);
      }
    }

    // draw player dot
    if (game.player && game.displayTile) {
      const px = Math.floor(game.player.x / game.displayTile);
      const py = Math.floor(game.player.y / game.displayTile);
      this.minimap.fillStyle(0x00ffcc, 1);
      this.minimap.fillCircle(mmX + px * ts + ts/2, mmY + py * ts + ts/2, Math.max(1, ts/2));
    }
  }
}
