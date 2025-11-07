export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }
  preload() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    this.add.text(w/2, h/2 - 30, 'Loading assets...', { font: '18px monospace', fill: '#ddd' }).setOrigin(0.5);

    // progress
    const progressBox = this.add.rectangle(w/2, h/2 + 10, 300, 18, 0x222222).setOrigin(0.5);
    const progressBar = this.add.rectangle(w/2 - 150, h/2 + 10, 0, 18, 0x66ff66).setOrigin(0,0.5);

    // Load game assets
    this.load.image('tiles', 'assets/tiles/dungeon.png');
    
    // Character spritesheet (16x16 frames)
    this.load.spritesheet('chars', 'assets/sprites/characters.png', { 
      frameWidth: 16, 
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });
    
    // UI elements from Kenney UI Pack
    this.load.image('button', 'assets/ui/PNG/blue_button00.png');
    this.load.image('button_hover', 'assets/ui/PNG/blue_button01.png');
    this.load.image('panel', 'assets/ui/PNG/grey_panel.png');
    this.load.image('box', 'assets/ui/PNG/grey_box.png');
    
    // Load icons (use a consumables sheet from the icons folder - adjust if you prefer another file)
    this.load.spritesheet('icons', 'assets/icons/consumables.png', { 
      frameWidth: 16, 
      frameHeight: 16 
    });

    // Load UI / SFX from Kenney UI Sounds folder (fallbacks if you add more audio)
    this.load.audio('sfx_click', ['assets/ui/Sounds/click-a.ogg']);
    this.load.audio('sfx_click2', ['assets/ui/Sounds/click-b.ogg']);
    this.load.audio('sfx_tap', ['assets/ui/Sounds/tap-a.ogg']);
    this.load.audio('sfx_tap2', ['assets/ui/Sounds/tap-b.ogg']);
    this.load.audio('sfx_switch', ['assets/ui/Sounds/switch-a.ogg']);
    this.load.audio('sfx_switch2', ['assets/ui/Sounds/switch-b.ogg']);

  // Optional: load selected Owlish Media SFX (you copied them into assets/audio)
  // Footsteps
  this.load.audio('owlish_step1', ['assets/audio/Owlish Media Sound Effects/Footsteps/step1.wav']);
  this.load.audio('owlish_step2', ['assets/audio/Owlish Media Sound Effects/Footsteps/step2.wav']);
  // Impact / hit
  this.load.audio('owlish_hit', ['assets/audio/Owlish Media Sound Effects/Impacts/hit.wav']);
  // UI / tap
  this.load.audio('owlish_tap', ['assets/audio/Owlish Media Sound Effects/UI/UI_005.wav']);

    // Handle progress and errors gracefully
    this.load.on('progress', (value) => {
      progressBar.width = 300 * value;
    });

    this.load.on('filecomplete', (key, type, data) => {
      // console.log('loaded', key);
    });

    // If an asset fails to load, we won't block the game; fall back to generated graphics
    this.load.on('loaderror', (file) => {
      console.warn('Failed to load', file.key, file.src);
    });
  }
  create() {
    // Create basic animations if spritesheets are available. Use try/catch like flow:
    try {
      // For the Antifarea character set:
      // Down walking animation
      this.anims.create({ 
        key: 'player_walk_down',
        frames: this.anims.generateFrameNumbers('chars', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });
      
      // Left walking animation
      this.anims.create({
        key: 'player_walk_left',
        frames: this.anims.generateFrameNumbers('chars', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
      });
      
      // Right walking animation
      this.anims.create({
        key: 'player_walk_right',
        frames: this.anims.generateFrameNumbers('chars', { start: 8, end: 11 }),
        frameRate: 8,
        repeat: -1
      });
      
      // Up walking animation
      this.anims.create({
        key: 'player_walk_up',
        frames: this.anims.generateFrameNumbers('chars', { start: 12, end: 15 }),
        frameRate: 8,
        repeat: -1
      });
      
      // Idle animations for each direction
      this.anims.create({ key: 'player_idle_down', frames: [{ key: 'chars', frame: 0 }], frameRate: 1 });
      this.anims.create({ key: 'player_idle_left', frames: [{ key: 'chars', frame: 4 }], frameRate: 1 });
      this.anims.create({ key: 'player_idle_right', frames: [{ key: 'chars', frame: 8 }], frameRate: 1 });
      this.anims.create({ key: 'player_idle_up', frames: [{ key: 'chars', frame: 12 }], frameRate: 1 });
    } catch (e) {
      // If animations fail because spritesheet missing, ignore — game will use simple shapes
      // console.warn('Could not create animations (missing spritesheet)', e);
    }

    // proceed to home scene after a short delay so the progress bar is visible
    this.time.delayedCall(300, () => this.scene.start('HomeScene'));
  }
}
