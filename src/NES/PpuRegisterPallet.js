// PpuRegisterPallet.js
import { Register8bit } from './Register.js';

// PPU Registers

/**
 *
 */
class PpuControlRegister extends Register8bit {
  constructor() {
    super();
    this.isPpuControlRegister = true;
    this.NMI_VBLANK_BIT = 7;
    this.MASTER_SLAVE_BIT = 6;
    this.SPRITES_SIZE_BIT = 5;
    this.BACKGROUND_PATTERN_TABLE_BIT = 4;
    this.SPRITES_PATTERN_TABLE_BIT = 3;
    this.INCREMENT_ADDRESS_BIT = 2;
    this.NAME_TABLE_ADDRESS_BIT = 0;
    this.NAME_TABLE_ADDRESS_BITS_WIDTH = 2;
  }
  /**
   *
   */
  isIncrementAddressSet() {
    return this.isBitSet(this.INCREMENT_ADDRESS_BIT);
  }

  /**
   *
   */
  enabledNmi() {
    return this.isBitSet(this.NMI_VBLANK_BIT);
  }

  /**
   *
   */
  isSpriteSize16() {
    return this.isBitSet(this.SPRITES_SIZE_BIT);
  }

  /**
   *
   */
  getBackgroundPatternTableNum() {
    return this.loadBit(this.BACKGROUND_PATTERN_TABLE_BIT);
  }

  /**
   *
   */
  getSpritesPatternTableNum() {
    return this.loadBit(this.SPRITES_PATTERN_TABLE_BIT);
  }

  /**
   *
   */
  getNameTableAddress() {
    return this.loadBits(this.NAME_TABLE_ADDRESS_BIT, this.NAME_TABLE_ADDRESS_BITS_WIDTH);
  }
}
/**
 *
 */
class PpuMaskRegister extends Register8bit {
  constructor() {
    super();
    this.isPpuMaskRegister = true;
    this.GREYSCALE_BIT = 0;
    this.LEFTMOST_BACKGROUND_VISIBLE_BIT = 1;
    this.LEFTMOST_SPRITES_VISIBLE_BIT = 2;
    this.BACKGROUND_VISIBLE_BIT = 3;
    this.SPRITES_VISIBLE_BIT = 4;
    this.EMPHASIZE_RED_BIT = 5;
    this.EMPHASIZE_GREEN_BIT = 6;
    this.EMPHASIZE_BLUE_BIT = 7;
  }
  /**
   *
   */
  isGreyscale() {
    return this.isBitSet(this.GREYSCALE_BIT);
  }

  /**
   *
   */
  isLeftMostBackgroundVisible() {
    return this.isBitSet(this.LEFTMOST_BACKGROUND_VISIBLE_BIT);
  }

  /**
   *
   */
  isLeftMostSpritesVisible() {
    return this.isBitSet(this.LEFTMOST_SPRITES_VISIBLE_BIT);
  }

  /**
   *
   */
  isBackgroundVisible() {
    return this.isBitSet(this.BACKGROUND_VISIBLE_BIT);
  }

  /**
   *
   */
  isSpritesVisible() {
    return this.isBitSet(this.SPRITES_VISIBLE_BIT);
  }

  /**
   *
   */
  emphasisRed() {
    return this.isBitSet(this.EMPHASIZE_RED_BIT);
  }

  /**
   *
   */
  emphasisGreen() {
    return this.isBitSet(this.EMPHASIZE_GREEN_BIT);
  }

  /**
   *
   */
  emphasisBlue() {
    return this.isBitSet(this.EMPHASIZE_BLUE_BIT);
  }
}
/**
 *
 */
class PpuStatusRegister extends Register8bit {
  constructor() {
    super();
    this.isPpuStatusRegister = true;
    this.VBLANK_BIT = 7;
    this.SPRITE_ZERO_HIT_BIT = 6;
    this.SPRITE_OVERFLOW_BIT = 5;
    this.VRAM_SHOULD_BE_IGNORE = 4;
  }
  /**
   *
   */
  setVBlank() {
    this.setBit(this.VBLANK_BIT);
  }

  /**
   *
   */
  clearVBlank() {
    this.clearBit(this.VBLANK_BIT);
  }

  /**
   *
   */
  setZeroHit() {
    this.setBit(this.SPRITE_ZERO_HIT_BIT);
  }

  /**
   *
   */
  clearZeroHit() {
    this.clearBit(this.SPRITE_ZERO_HIT_BIT);
  }

  /**
   *
   */
  setOverflow() {
    this.setBit(this.SPRITE_OVERFLOW_BIT);
  }

  /**
   *
   */
  clearOverflow() {
    this.clearBit(this.SPRITE_OVERFLOW_BIT);
  }
}

export {PpuControlRegister, PpuMaskRegister, PpuStatusRegister};