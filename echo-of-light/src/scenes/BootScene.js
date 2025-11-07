export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }
  preload() {
    // nothing to preload here; keep it for extensibility
  }
  create() {
    this.scene.start('PreloadScene');
  }
}
