export default class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene');
  }
  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

  // Background: use dungeon tiles tiled to create a sanctum-like backdrop and dark overlay
  const bg = this.add.tileSprite(0, 0, w, h, 'tiles').setOrigin(0).setScale(4);
  const dark = this.add.rectangle(w/2, h/2, w, h, 0x000000, 0.6);

  // Title
  this.add.text(w/2, 80, 'Echo of Light', { font: '40px monospace', fill: '#fff' }).setOrigin(0.5);
  this.add.text(w/2, 130, 'Sanctum — spend fragments to upgrade before each run', { font: '14px monospace', fill: '#ddd' }).setOrigin(0.5);

    // Load fragments and upgrades from localStorage
    this.fragments = parseInt(localStorage.getItem(window.EOL.storageKey) || '0', 10);
    this.upgrades = JSON.parse(localStorage.getItem(window.EOL.upgradeKey) || '{}');
    // default upgrades
    this.upgrades.health = this.upgrades.health || 0;
    this.upgrades.speed = this.upgrades.speed || 0;
    this.upgrades.damage = this.upgrades.damage || 0;

    this.fragText = this.add.text(w/2, 180, `Light Fragments: ${this.fragments}`, { font: '18px monospace', fill: '#ffd' }).setOrigin(0.5);

    // Center panel for menu
    const panel = this.add.image(w/2, h/2 + 20, 'panel').setScale(2.2).setAlpha(0.95);

    // Upgrade options: HP (+10 HP per level, cost 100), ATK (+1 per level, cost 200)
    const opts = [
      { key: 'health', label: 'HP +10', cost: 100, iconFrame: 0 },
      { key: 'damage', label: 'ATK +1', cost: 200, iconFrame: 2 }
    ];

    opts.forEach((o, i) => {
      const y = 220 + i * 70;

      // icon
      this.add.sprite(w/2 - 200, y, 'icons', o.iconFrame).setScale(2).setDepth(2);

      // label
      this.add.text(w/2 - 160, y, o.label, { font: '18px monospace', fill: '#fff', stroke: '#000', strokeThickness: 2 }).setOrigin(0,0.5).setDepth(2);

      // current level and effect
      const level = this.upgrades[o.key] || 0;
      const effectText = o.key === 'health' ? `+${level * 10} HP` : `+${level} ATK`;
      const lvlTxt = this.add.text(w/2 + 10, y, `Level: ${level} (${effectText})`, { font: '16px monospace', fill: '#ddd' }).setOrigin(0,0.5).setDepth(2);

      // buy button
      const btn = this.add.image(w/2 + 200, y, 'button').setScale(0.8).setInteractive({ useHandCursor: true }).setDepth(2);
      const btnTxt = this.add.text(w/2 + 200, y, `Buy (${o.cost})`, { font: '16px monospace', fill: '#fff', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5).setDepth(3);

      btn.on('pointerover', () => btn.setTexture('button_hover'));
      btn.on('pointerout', () => btn.setTexture('button'));

      btn.on('pointerdown', () => {
        const currentFrags = this.fragments;
        if (currentFrags >= o.cost) {
          this.fragments -= o.cost;
          this.upgrades[o.key] = (this.upgrades[o.key] || 0) + 1;
          this.save();
          // update texts
          this.fragText.setText(`Light Fragments: ${this.fragments}`);
          lvlTxt.setText(`Level: ${this.upgrades[o.key]} (${o.key==='health'? '+' + (this.upgrades[o.key]*10) + ' HP' : '+' + this.upgrades[o.key] + ' ATK'})`);
          btnTxt.setText('Bought');
          this.time.delayedCall(600, () => btnTxt.setText(`Buy (${o.cost})`));
        } else {
          btnTxt.setStyle({ fill: '#ff8080' });
          this.time.delayedCall(400, () => btnTxt.setStyle({ fill: '#fff' }));
        }
      });
    });

    // Start Game button with Kenney UI
    const startBtn = this.add.image(w/2, h - 120, 'button')
      .setScale(1.5)
      .setInteractive({ useHandCursor: true });
    
    const startTxt = this.add.text(w/2, h - 120, 'Start Run', { 
      font: '20px monospace', 
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    // Add hover effect
    startBtn.on('pointerover', () => {
      startBtn.setTexture('button_hover');
    });
    
    startBtn.on('pointerout', () => {
      startBtn.setTexture('button');
    });
    
    startBtn.on('pointerdown', () => {
      // ensure we save current fragments and upgrades
      this.save();
      // start GameScene and launch UI
      this.scene.start('GameScene', { upgrades: this.upgrades });
      this.scene.launch('UIScene');
    });

    // Reset progress with styled button
    const resetBox = this.add.image(90, 30, 'box')
      .setScale(0.8)
      .setInteractive({ useHandCursor: true });
    
    const resetBtn = this.add.text(90, 30, 'Reset Progress', { 
      font: '12px monospace', 
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 1
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    
    resetBox.on('pointerover', () => {
      resetBox.setTint(0xff9999);
    });
    
    resetBox.on('pointerout', () => {
      resetBox.clearTint();
    });
    
    resetBox.on('pointerdown', () => {
      localStorage.removeItem(window.EOL.storageKey);
      localStorage.removeItem(window.EOL.upgradeKey);
      this.fragments = 0;
      this.upgrades = { health:0, speed:0, damage:0 };
      this.fragText.setText(`Light Fragments: ${this.fragments}`);
    });
  }

  save() {
    localStorage.setItem(window.EOL.storageKey, String(this.fragments));
    localStorage.setItem(window.EOL.upgradeKey, JSON.stringify(this.upgrades));
  }
}
