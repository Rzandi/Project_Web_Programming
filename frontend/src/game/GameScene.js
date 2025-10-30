import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.level = 1;
    this.coins = 0;
    this.lives = 3;
    this.gameSpeed = 300;
    this.distanceTraveled = 0;
  }

  preload() {
    // Create simple pixel art sprites using graphics
    this.createPlayerSprite();
    this.createObstacleSprite();
    this.createCoinSprite();
    this.createGroundTexture();
    this.createCloudTexture();
  }

  createPlayerSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xFF6B6B);
    graphics.fillRect(0, 0, 32, 32);
    graphics.fillStyle(0x000000);
    graphics.fillRect(8, 8, 4, 4);
    graphics.fillRect(20, 8, 4, 4);
    graphics.fillRect(10, 20, 12, 4);
    graphics.generateTexture('player', 32, 32);
    graphics.destroy();
  }

  createObstacleSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x8B4513);
    graphics.fillRect(0, 0, 32, 48);
    graphics.fillStyle(0x228B22);
    graphics.fillCircle(16, 0, 20);
    graphics.generateTexture('obstacle', 32, 48);
    graphics.destroy();
  }

  createCoinSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xFFD700);
    graphics.fillCircle(12, 12, 12);
    graphics.fillStyle(0xFFA500);
    graphics.fillCircle(12, 12, 8);
    graphics.generateTexture('coin', 24, 24);
    graphics.destroy();
  }

  createGroundTexture() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x8B7355);
    graphics.fillRect(0, 0, 800, 100);
    graphics.fillStyle(0x654321);
    for (let i = 0; i < 10; i++) {
      graphics.fillRect(i * 80, 0, 40, 100);
    }
    graphics.generateTexture('ground', 800, 100);
    graphics.destroy();
  }

  createCloudTexture() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xFFFFFF, 0.7);
    graphics.fillCircle(15, 15, 15);
    graphics.fillCircle(30, 15, 20);
    graphics.fillCircle(45, 15, 15);
    graphics.generateTexture('cloud', 60, 30);
    graphics.destroy();
  }

  create() {
    // Create scrolling background
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Add clouds
    this.clouds = this.add.group();
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.image(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(50, 200),
        'cloud'
      );
      this.clouds.add(cloud);
    }

    // Ground
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 570, 'ground');

    // Player
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(false);
    this.player.body.setGravityY(300);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Obstacles group
    this.obstacles = this.physics.add.group();

    // Coins group
    this.coinsGroup = this.physics.add.group();

    // Collisions
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
    this.physics.add.overlap(this.player, this.coinsGroup, this.collectCoin, null, this);

    // Spawn timers
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 1500,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    // Distance timer
    this.time.addEvent({
      delay: 100,
      callback: this.updateDistance,
      callbackScope: this,
      loop: true
    });

    // Level up timer
    this.time.addEvent({
      delay: 15000,
      callback: this.levelUp,
      callbackScope: this,
      loop: true
    });

    // Emit initial score
    this.emitScore();
  }

  update() {
    // Player jump
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }

    // Move clouds
    this.clouds.getChildren().forEach((cloud) => {
      cloud.x -= 0.5;
      if (cloud.x < -60) {
        cloud.x = 860;
        cloud.y = Phaser.Math.Between(50, 200);
      }
    });

    // Move obstacles
    this.obstacles.getChildren().forEach((obstacle) => {
      obstacle.x -= this.gameSpeed / 60;
      if (obstacle.x < -50) {
        obstacle.destroy();
      }
    });

    // Move coins
    this.coinsGroup.getChildren().forEach((coin) => {
      coin.x -= this.gameSpeed / 60;
      coin.angle += 3;
      if (coin.x < -30) {
        coin.destroy();
      }
    });
  }

  spawnObstacle() {
    const obstacle = this.obstacles.create(850, 500, 'obstacle');
    obstacle.setImmovable(true);
    obstacle.body.allowGravity = false;
  }

  spawnCoin() {
    const y = Phaser.Math.Between(300, 450);
    const coin = this.coinsGroup.create(850, y, 'coin');
    coin.body.allowGravity = false;
  }

  hitObstacle(player, obstacle) {
    obstacle.destroy();
    this.lives -= 1;
    
    // Flash effect
    this.cameras.main.shake(200, 0.01);
    
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.emitScore();
    }
  }

  collectCoin(player, coin) {
    coin.destroy();
    this.coins += 1;
    this.score += 10;
    this.emitScore();
  }

  updateDistance() {
    this.distanceTraveled += 1;
    this.score += 1;
    this.emitScore();
  }

  levelUp() {
    this.level += 1;
    this.gameSpeed += 50;
    this.cameras.main.flash(500, 255, 215, 0);
    this.emitScore();
  }

  emitScore() {
    window.dispatchEvent(new CustomEvent('scoreUpdate', {
      detail: {
        score: this.score,
        level: this.level,
        lives: this.lives,
        coins: this.coins
      }
    }));
  }

  gameOver() {
    this.physics.pause();
    this.player.setTint(0xff0000);
    
    window.dispatchEvent(new CustomEvent('gameOver', {
      detail: {
        score: this.score,
        level: this.level,
        coins: this.coins
      }
    }));
  }
}